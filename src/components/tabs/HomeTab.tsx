import React, { useState, useEffect } from "react"
import { PostObject } from "@types"
import Post from "../posts/Post"
import Filter from "../posts/Filter"
import Pagination from "../posts/Pagination"
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
  const [currentPage, setCurrentPage] = useState(0)

  /**
   * Get API data
   */
  useEffect(() => {
    const getPosts = async () => {
      try {
        // Request
        const posts = await http(category, currentPage)

        // Update state
        setPosts(posts)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    getPosts()
  }, [category, currentPage])

  /**
   * Callback fired when new category is selected
   * @param value
   */
  const filterCallback = (value: string): void => {
    // Add loader
    setLoading(true)

    // Update current category
    setCurrentPage(0)
    setCategory(value)
  }

  /**
   * Callback fired when a callback button is pressed
   * @param value - Page to go next
   */
  const pageCallback = (value: number) => setCurrentPage(value)

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
          <Pagination current={currentPage} callback={pageCallback} />
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
