import React, { useEffect, useState } from "react"
import Post from "./Post"
import { PostObject } from "@types"
import { http } from "../../utils"

const PostsGrid: React.FC = () => {
  /**
   * State
   */
  const [posts, setPosts] = useState<PostObject[]>([])
  const [isLoading, setLoading] = useState(true)

  /**
   * Get API data
   */
  useEffect(() => {
    const getPosts = async () => {
      try {
        // Request
        const posts = await http("reactjs")

        // Update state
        setPosts(posts)
        setLoading(false)
      } catch (error) {
        console.log(error)
      }
    }

    getPosts()
  }, [])

  return (
    <div className="columns is-multiline posts-grid">
      {isLoading ? (
        <span className="loader" />
      ) : (
        posts.map((post, i) => <Post key={i} data={post} />)
      )}
    </div>
  )
}

export default PostsGrid
