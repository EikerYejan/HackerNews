import React, { useState, useEffect } from "react"
import { PostObject } from "@types"
import Post from "../posts/Post"
import Filter from "../posts/Filter"
import Notice from "../Notice"
import { http, getStorageItem } from "../../utils"

const HomeTab: React.FC = () => {
  /* Get current filter */
  const filter = getStorageItem("get_filter")

  /**
   * State
   */
  const [posts, setPosts] = useState<PostObject[]>([])
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [category, setCategory] = useState<string>(filter ?? "reactjs")

  /**
   * Get API data
   */
  useEffect(() => {
    const getPosts = async () => {
      try {
        // Request
        const posts = await http(category)

        // Update state
        setPosts(posts)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    getPosts()
  }, [category])

  /**
   * Callback when new category is selected
   * @param value
   */
  const filterCallback = (value: string): void => {
    // Add loader
    setLoading(true)

    // Update current category
    setCategory(value)
  }

  return (
    <div className="columns is-multiline posts-grid">
      <Filter callback={filterCallback} category={category} />
      {isLoading ? (
        <span className="loader" />
      ) : error ? (
        <Notice
          heading="Oops!"
          subheading="There's been an error, please try again"
          text="Error 500"
        />
      ) : posts.length !== 0 ? (
        <>
          {posts.map((post, i) => (
            <Post key={i} data={post} isFav={post.isLiked} />
          ))}
        </>
      ) : (
        <Notice
          heading="Oops!"
          subheading="There are no histories availables"
        />
      )}
    </div>
  )
}

export default HomeTab
