import React, { useState } from "react"
import { PostObject } from "@types"
import { updateFavs } from "../../utils"
import time from "../../assets/images/time.svg"
import "../../assets/styles/components/posts/Post.scss"

type Props = {
  data: PostObject
  isFav: boolean
  favsCallback?: (id: string, isFav: boolean) => void
}

const Post: React.FC<Props> = ({ data, isFav, favsCallback }) => {
  /* State */
  const [isFavorite, setFavorite] = useState(isFav)

  const handleFavorite = (): void => {
    // Save or delete
    updateFavs(isFavorite, data)

    // Return given callback
    if (favsCallback) favsCallback(data.id, isFav)
    // Update state
    else setFavorite((prev) => !prev)
  }

  return (
    <div className={`column is-6 post ${isFavorite ? "is-fav" : ""}`}>
      <a
        href={data.link}
        className="post__inner"
        target="_blank"
        rel="noopener noreferrer"
      >
        <p className="post__date">
          <img src={time} alt="post-date" />
          <span>
            {data.date} by {data.author}
          </span>
        </p>
        <h3 className="post__title">{data.title}</h3>
      </a>
      <button
        onClick={handleFavorite}
        title="Add to favorites"
        className="post__like-button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="22"
          viewBox="0 0 24 22"
        >
          <path d="M12 3.248C8.852-2.154 0-.577 0 6.192 0 10.853 5.571 15.619 12 22c6.43-6.381 12-11.147 12-15.808C24-.6 15.125-2.114 12 3.248z" />
        </svg>
      </button>
    </div>
  )
}

export default Post
