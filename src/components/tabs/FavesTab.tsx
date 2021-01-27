import React, { useEffect, useRef } from "react"
import Post from "../posts/Post"
import Pagination from "../posts/Pagination"
import useTab from "./useTab"
import Notice from "../Notice"
import { getPagedFaves } from "../../utils"

const FavesTab: React.FC = () => {
  const {
    posts,
    setPosts,
    isLoading,
    setLoading,
    currentPage,
    setCurrentPage,
  } = useTab()

  const pageLimit = useRef(0)

  useEffect(() => {
    const [faves, limit] = getPagedFaves(currentPage)

    // Update state
    setPosts(faves)
    pageLimit.current = limit
    setTimeout(() => setLoading(false), 500)
  }, [currentPage]) //eslint-disable-line

  const favsCallback = (id: string): void => {
    setPosts((prev) => prev.filter((post) => post.id !== id))
  }

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
