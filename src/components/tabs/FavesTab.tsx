import React, { useState, useEffect, useRef } from "react"
import _ from "lodash"
import Post from "../posts/Post"
import Pagination from "../posts/Pagination"
import Notice from "../Notice"
import { getPagedFaves } from "../../utils"
import { PostObject } from "@types"

const FavesTab: React.FC = () => {
  /* State */
  const [posts, setPosts] = useState<PostObject[]>([])
  const [isLoading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)

  /* Posts amountref */
  const pageLimit = useRef(0)

  /* Get posts */
  useEffect(() => {
    // Get from LocalStorage
    const [faves, limit] = getPagedFaves(currentPage)

    // Update state
    setPosts(faves)
    pageLimit.current = limit
    setTimeout(() => setLoading(false), 500)
  }, [currentPage])

  /**
   * Delete post from state
   * @param id
   */
  const favsCallback = (id: string): void => {
    setPosts((prev) => _.pullAllBy([...prev], [{ id }], "id"))
  }

  /**
   * Update page callback
   * @param value
   */
  const pageCallback = (value: number): void => setCurrentPage(value)

  return (
    <div className="columns is-multiline posts-grid">
      {isLoading ? (
        <span className="loader" />
      ) : posts.length !== 0 ? (
        <>
          {posts.map((post, i) => (
            <Post
              key={i}
              data={post}
              isFav={post.isLiked}
              favsCallback={favsCallback}
            />
          ))}
          <Pagination
            current={currentPage}
            callback={pageCallback}
            limit={pageLimit.current / 8}
          />
        </>
      ) : (
        <Notice
          heading="There's nothing here"
          subheading="Go to All posts and like something"
          text="Oops!"
        />
      )}
    </div>
  )
}

export default FavesTab
