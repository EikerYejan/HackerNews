import axios from "axios"
import _ from "lodash"
import moment from "moment"
import { Obj, PostObject } from "@types"

/** Localstorage utils **/
type StorageSaveAction = "save_filter" | "save_faves" | "save_faves_ids"
type StorageGetAction = "get_filter" | "get_faves" | "get_faves_ids"
const FILTER_REF = "hacker-news-filter"
const FAVES_REF = "hacker-news-faves"
const FAVES_IDS_REF = "hacker-news-faves-id"

/**
 * Check if user has liked some post
 * @param id - Story ID
 */
const isFavorite = (id: string): boolean =>
  JSON.parse(getStorageItem("get_faves_ids") ?? "[]").includes(id)

/**
 * Filter api results to remove unnecesary data
 * @param hits
 */
const processPosts = (hits: Obj<string>[]): PostObject[] => {
  const posts: PostObject[] = []

  for (let i = 0; i < hits.length; i++) {
    const hit = hits[i]
    const {
      created_at,
      author,
      story_url,
      story_title,
      story_id,
      title,
      url,
    } = hit
    const shouldPass = created_at && author && story_id

    // Use only if has all fields
    if (shouldPass || (!shouldPass && title && url)) {
      const post: PostObject = {
        author,
        date: moment(created_at).fromNow(),
        link: story_url ?? url,
        title: story_title ?? title,
        id: story_id,
        isLiked: isFavorite(story_id),
      }

      posts.push(post)
    }
  }

  // Filter posts
  const filtered = _.uniqBy(posts, "title")
  const sanitized = _.pullAllBy(filtered, [{ link: null }], "link").splice(0, 8)

  return sanitized
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
      : FAVES_REF

  const item = window.localStorage.getItem(key)

  if (item) return item
}

/**
 * Update favorites posts
 * @param isFavorite
 * @param data
 */
const updateFavs = (isFav: boolean, data: PostObject): void => {
  const favs = JSON.parse(getStorageItem("get_faves") ?? "[]")
  const ids = JSON.parse(getStorageItem("get_faves_ids") ?? "[]")

  if (isFav) {
    data.isLiked = false
    _.pullAllBy(favs, [{ id: data?.id }], "id")
    _.pull(ids, data?.id)
  } else {
    // Update favs
    data.isLiked = true
    favs.push(data)
    ids.push(data?.id)
  }

  // Save in storage
  setStorageItem("save_faves", JSON.stringify(favs))
  setStorageItem("save_faves_ids", JSON.stringify(ids))
}

export { http, setStorageItem, getStorageItem, updateFavs }
