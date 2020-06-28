import React, { useState, useEffect } from "react"
import { PostObject } from "@types"
import Post from "../posts/Post"
import Filter from "../posts/Filter"
import { http, getStorageItem } from "../../utils"

const HomeTab: React.FC = () => {
  /* Get current filter */
  const filter = getStorageItem("get_filter")

  /**
   * State
   */
  const [posts, setPosts] = useState<PostObject[]>([])
  const [isLoading, setLoading] = useState(true)
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
        setLoading(false)
      } catch (error) {
        console.log(error)
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
      ) : (
        <>
          {posts.map((post, i) => (
            <Post key={i} data={post} />
          ))}
        </>
      )}
    </div>
  )
}

export default HomeTab