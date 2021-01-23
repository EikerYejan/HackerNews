import axios from "axios"
import _ from "lodash"
import moment from "moment"
import { PostObject, AlgoliaHit } from "@types"

/** Localstorage utils **/
type StorageSaveAction =
  | "save_filter"
  | "save_faves"
  | "save_faves_ids"
  | "save_theme"
type StorageGetAction =
  | "get_filter"
  | "get_faves"
  | "get_faves_ids"
  | "get_theme"
const FILTER_REF = "hacker-news-filter"
const FAVES_REF = "hacker-news-faves"
const FAVES_IDS_REF = "hacker-news-faves-id"
const THEME_REF = "hacker-news-theme"

const setStorageItem = (action: StorageSaveAction, value: string): void => {
  const key =
    action === "save_filter"
      ? FILTER_REF
      : action === "save_faves_ids"
      ? FAVES_IDS_REF
      : action === "save_theme"
      ? THEME_REF
      : FAVES_REF

  window.localStorage.setItem(key, value)
}

const getStorageItem = (action: StorageGetAction): string | undefined => {
  const key =
    action === "get_filter"
      ? FILTER_REF
      : action === "get_faves_ids"
      ? FAVES_IDS_REF
      : action === "get_theme"
      ? THEME_REF
      : FAVES_REF

  const item = window.localStorage.getItem(key)

  if (item) return item
}

const isFavorite = (id: string): boolean => {
  const faves = JSON.parse(getStorageItem("get_faves_ids") ?? "[]") as string[]

  return faves.includes(id)
}

const processPosts = (_hits: AlgoliaHit[]) => {
  let hits = _hits.filter(
    (hit) =>
      hit.created_at !== null &&
      hit.author !== null &&
      hit.story_url !== null &&
      hit.story_title !== null &&
      hit.story_id !== null
  )

  const titles = [...new Set(hits.map((hit) => hit.story_title))]

  hits = titles
    .map((title) => _hits.filter((h) => h.story_title === title)[0])
    .filter((hit) => hit)

  const finalPosts = hits.splice(0, 8).map((hit) => {
    const { author, created_at, story_url, story_title, story_id } = hit
    const isLiked = isFavorite(`${hit.story_id}`)

    return {
      author,
      isLiked,
      date: moment(created_at).fromNow(),
      link: `${story_url}`,
      title: `${story_title}`,
      id: `${story_id}`,
    }
  })

  return finalPosts
}

const http = (category: string, page = 0): Promise<PostObject[]> =>
  new Promise(async (resolve, reject) => {
    try {
      const url = `https://hn.algolia.com/api/v1/search_by_date?query=${category}&page=${page}&hitsPerPage=100`
      const { data } = await axios.get(url)
      const posts = processPosts(data.hits)

      resolve(posts)
    } catch {
      reject()
    }
  })

const updateFavs = (isFav: boolean, data: PostObject): void => {
  let favs: PostObject[] = JSON.parse(getStorageItem("get_faves") ?? "[]")
  let ids: string[] = JSON.parse(getStorageItem("get_faves_ids") ?? "[]")

  if (isFav) {
    data.isLiked = false
    favs = _.pullAllBy(favs, [{ id: data.id }], "id")
    ids = _.pull(ids, data.id)
  } else {
    // Update favs
    data.isLiked = true
    favs.unshift(data)
    ids.push(data.id)
  }

  // Save in storage
  setStorageItem("save_faves", JSON.stringify(favs))
  setStorageItem("save_faves_ids", JSON.stringify(ids))
}

const getPagedFaves = (page = 0): [PostObject[], number] => {
  const spliceStart = page * 8

  const posts: PostObject[] = JSON.parse(getStorageItem("get_faves") ?? "[]")
  const length = posts.length

  // Splice posts
  const spliced = posts.splice(spliceStart, 8)

  return [spliced, length]
}

export { http, setStorageItem, getStorageItem, updateFavs, getPagedFaves }
