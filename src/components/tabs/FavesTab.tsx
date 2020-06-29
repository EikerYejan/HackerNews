import React, { useState, useEffect } from "react"
import _ from "lodash"
import Post from "../posts/Post"
import Notice from "../Notice"
import { getStorageItem } from "../../utils"
import { PostObject } from "@types"

const FavesTab: React.FC = () => {
  /* State */
  const [posts, setPosts] = useState<PostObject[]>([])
  const [isLoading, setLoading] = useState(true)

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

  console.table(posts)

  return (
    <div className="columns is-multiline posts-grid">
      {isLoading ? (
        <span className="loader" />
      ) : posts.length !== 0 ? (
        posts.map((post, i) => (
          <Post
            key={i}
            data={post}
            isFav={post.isLiked}
            favsCallback={favsCallback}
          />
        ))
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
