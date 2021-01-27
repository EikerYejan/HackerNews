import { useState } from "react"
import { Dispatch, PostObject } from "@types"

type UseTab = () => {
  posts: PostObject[]
  setPosts: Dispatch<PostObject[]>
  isLoading: boolean
  setLoading: Dispatch<boolean>
  error: boolean
  setError: Dispatch<boolean>
  currentPage: number
  setCurrentPage: Dispatch<number>
}

const useTab: UseTab = () => {
  const [posts, setPosts] = useState<PostObject[]>([])
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)

  return {
    posts,
    setPosts,
    isLoading,
    setLoading,
    error,
    setError,
    currentPage,
    setCurrentPage,
  }
}

export default useTab
