import React, { useState, useEffect } from "react"
import _ from "lodash"
import Post from "../posts/Post"
import Pagination from "../posts/Pagination"
import Notice from "../Notice"
import { getStorageItem } from "../../utils"
import { PostObject } from "@types"

const FavesTab: React.FC = () => {
  /* State */
  const [posts, setPosts] = useState<PostObject[]>([])
  const [shownPosts, setShownPosts] = useState(posts.splice(0, 8))
  const [isLoading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)

  /* Get posts */
  useEffect(() => {
    // Get from LocalStorage
    const faves: PostObject[] = JSON.parse(getStorageItem("get_faves") ?? "[]")

    // Update state
    setPosts(faves)
    setTimeout(() => setLoading(false), 500)
  }, [])

  /**
   * Delete post from state
   * @param id
   */
  const favsCallback = (id: string): void =>
    setPosts((prev) => _.pullAllBy([...prev], [{ id }], "id"))

  /**
   * Update page callback
   * @param value
   */
  const pageCallback = (value: number): void => {
    setCurrentPage(value)
  }

  console.log(posts)

  return (
    <div className="columns is-multiline posts-grid">
      {isLoading ? (
        <span className="loader" />
      ) : shownPosts.length !== 0 ? (
        <>
          {shownPosts.map((post, i) => (
            <Post
              key={i}
              data={post}
              isFav={post.isLiked}
              favsCallback={favsCallback}
            />
          ))}
          <Pagination current={currentPage} callback={pageCallback} />
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
