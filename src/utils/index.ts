import axios from "axios"
import _ from "lodash"
import moment from "moment"
import { Obj, PostObject } from "@types"

/** Localstorage utils **/
type StorageSaveAction = "save_filter" | "save_faves"
type StorageGetAction = "get_filter" | "get_faves"
const FILTER_REF = "hacker-news-filter"
const FAVES_REF = "hacker-news-faves"

/**
 * Filter api results to remove unnecesary data
 * @param hits
 */
const processPosts = (hits: Obj<string>[]): PostObject[] => {
  const posts: PostObject[] = []

  for (let i = 0; i < hits.length; i++) {
    const hit = hits[i]
    const { created_at, author, story_url, story_title } = hit

    // Use only if has all fields
    if (created_at && author && story_url && story_title) {
      const post: PostObject = {
        author,
        date: moment(created_at).fromNow(),
        link: story_url,
        title: story_title,
      }

      posts.push(post)
    }
  }

  // Filter duplicated posts
  const filtered = _.uniqBy(posts, "title")

  return filtered
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
      const url = `https://hn.algolia.com/api/v1/search_by_date?query=${category}&page=${page}`

      // Send request
      const { data } = await axios.get(url)

      // Process
      const posts = processPosts(data.hits)

      // Resolve
      resolve(posts)
    } catch (e) {
      console.log(e)
      reject()
    }
  })

/**
 * Save item in LocalStorage
 * @param action
 * @param value
 */
const setStorageItem = (action: StorageSaveAction, value: string): void => {
  const key = action === "save_filter" ? FILTER_REF : FAVES_REF

  if (action === "save_faves") {
    const currentFaves = getStorageItem("get_faves")
    console.log(currentFaves)

    return
  }

  window.localStorage.setItem(key, value)
}

/**
 * Get item from LocalStorage
 * @param action
 */
const getStorageItem = (action: StorageGetAction): string | undefined => {
  const key = action === "get_filter" ? FILTER_REF : FAVES_REF
  const item = window.localStorage.getItem(key)

  if (item) return item
}

/**
 * Update favorites posts
 * @param isFavorite
 * @param data
 */
const updateFavs = (isFav: boolean, data?: PostObject): void => {
  const favs = JSON.parse(getStorageItem("get_faves") ?? "[]")

  if (isFav) {
    console.log(favs)
  } else {
    // Update favs
    favs.push(data)
  }

  // Save in storage
  setStorageItem("save_faves", JSON.stringify(favs))
}

export { http, setStorageItem, getStorageItem, updateFavs }
