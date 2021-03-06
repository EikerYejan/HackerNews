import React, { useState } from "react"
import { setStorageItem } from "../../utils"
import angular from "../../assets/images/angular.png"
import react from "../../assets/images/react.png"
import vue from "../../assets/images/vue.png"
import "../../assets/styles/components/posts/Filter.scss"

type Props = {
  category?: string
  callback: (value: string) => void
}

const categories = [
  {
    title: "Angular",
    icon: angular,
    query: "angular",
  },
  {
    title: "React",
    icon: react,
    query: "reactjs",
  },
  {
    title: "VueJs",
    icon: vue,
    query: "vuejs",
  },
]

const Filter: React.FC<Props> = ({ category, callback }) => {
  const [isActive, setActive] = useState(false)
  const [current, setCurrent] = useState(category ?? "reactjs")

  const optionClick = (e: React.SyntheticEvent<HTMLParagraphElement>): void => {
    const { category } = e.currentTarget.dataset

    if (category) {
      setCurrent(category)
      setActive(false)

      if (category !== current) {
        setStorageItem("save_filter", category)
        callback(category)
      }
    }
  }

  return (
    <div className="column is-12">
      <div className={`filter ${isActive ? "is-active" : "is-unactive"}`}>
        <div
          title="Select category"
          role="button"
          onClick={() => setActive((prev) => !prev)}
          className="filter__top"
        >
          <p>{current ?? "Select your news"}</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="512"
            height="512"
            viewBox="0 0 512 512"
          >
            <polyline
              points="184 112 328 256 184 400"
              style={{
                fill: "none",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: "48px",
              }}
            />
          </svg>
        </div>
        <div className="filter__options">
          {categories.map((cat, i) => (
            <p
              key={i}
              data-category={cat.query}
              data-title={cat.title}
              onClick={optionClick}
              className={`filter__option ${
                cat.query === current ? "is-current" : ""
              }`}
            >
              <img src={cat.icon} alt={cat.title} />
              <span>{cat.title}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Filter
