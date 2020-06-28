import axios from "axios"
import _ from "lodash"
import moment from "moment"
import { Obj, PostObject } from "@types"

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

export { http }
