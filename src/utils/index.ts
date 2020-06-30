import axios from "axios"
import _ from "lodash"
import moment from "moment"
import { Obj, PostObject } from "@types"

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

/**
 * Save item in LocalStorage
 * @param action
 * @param value
 */
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

/**
 * Get item from LocalStorage
 * @param action
 */
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

/**
 * Check if user has liked some post
 * @param id - Story ID
 */
const isFavorite = (id: string): boolean => {
  /* Favorite stories */
  const faves = JSON.parse(getStorageItem("get_faves_ids") ?? "[]")
  const isLiked = _.includes(faves, id)

  return isLiked
}

/**
 * Filter api results to remove unnecesary data
 * @param hits
 */
const processPosts = (hits: Obj<string>[]): PostObject[] => {
  const posts: PostObject[] = []
  let _hits = [...hits]

  // Filter posts
  _hits = _.filter(
    _hits,
    (object) =>
      object.created_at !== null &&
      object.author !== null &&
      object.story_url !== null &&
      object.story_title !== null &&
      object.story_link !== null &&
      object.story_id !== null
  )
  _hits = _.uniqBy(hits, "story_title")
  const withID = _.pullAllBy(_hits, [{ story_id: null }], "story_id")
  const withUrl = _.pullAllBy(withID, [{ story_url: null }], "story_url")

  // Get only 8 posts
  const finalPosts = withUrl.splice(0, 8)

  for (let i = 0; i < finalPosts.length; i++) {
    const hit = finalPosts[i]
    const { created_at, author, story_url, story_title, story_id } = hit

    const isLiked = isFavorite(story_id)
    const post: PostObject = {
      author,
      isLiked,
      date: moment(created_at).fromNow(),
      link: story_url,
      title: story_title,
      id: story_id,
    }

    posts.push(post)
  }

  return posts
}

/**
 * Send HTTP request
 * @param category
 * @param page
 */
const http = (category: string, page = 0): Promise<PostObject[]> =>
  new Promise(async (resolve, reject) => {
    try {
      // Generate URL
      const url = `https://hn.algolia.com/api/v1/search_by_date?query=${category}&page=${page}&hitsPerPage=100`

      // Send request
      const { data } = await axios.get(url)

      // Process
      const posts = processPosts(data.hits)

      // Resolve
      resolve(posts)
    } catch {
      reject()
    }
  })

/**
 * Update favorites posts
 * @param isFavorite
 * @param data
 */
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

/**
 * Get favorite posts in a paginated way
 * @param page
 */
const getPagedFaves = (page = 0): [PostObject[], number] => {
  const spliceStart = page * 8

  const posts: PostObject[] = JSON.parse(getStorageItem("get_faves") ?? "[]")
  const length = posts.length

  // Splice posts
  const spliced = posts.splice(spliceStart, 8)

  return [spliced, length]
}

export { http, setStorageItem, getStorageItem, updateFavs, getPagedFaves }
