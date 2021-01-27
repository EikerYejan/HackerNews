import React, { useState, useEffect } from "react"
import Post from "../posts/Post"
import Filter from "../posts/Filter"
import Pagination from "../posts/Pagination"
import Notice from "../Notice"
import useTab from "./useTab"
import { http, getStorageItem } from "../../utils"

const HomeTab: React.FC = () => {
  const filter = getStorageItem("get_filter")

  const [category, setCategory] = useState(filter ?? "reactjs")
  const {
    posts,
    isLoading,
    error,
    currentPage,
    setPosts,
    setLoading,
    setError,
    setCurrentPage,
  } = useTab()

  useEffect(() => {
    const getPosts = async () => {
      try {
        const posts = await http(category, currentPage)

        setPosts(posts)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    getPosts()
  }, [category, currentPage, setError, setLoading, setPosts])

  const filterCallback = (value: string): void => {
    setLoading(true)
    setCurrentPage(0)
    setCategory(value)
  }

  const pageCallback = (value: number) => {
    setCurrentPage(value)
    setLoading(true)
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
