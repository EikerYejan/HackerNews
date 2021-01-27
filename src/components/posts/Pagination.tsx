import React from "react"
import "../../assets/styles/components/posts/Pagination.scss"

type Props = {
  current: number
  callback: (value: number) => void
  limit?: number
}

const Pagination: React.FC<Props> = ({ current, callback, limit = 10 }) => {
  const pageLimit = limit ? Math.ceil(limit) : 10

  return (
    <div className="column is-12 pagination">
      <div className="pagination__inner">
        <button
          onClick={() => callback(current - 1)}
          title="Previous page"
          className={`pagination__button prev ${
            current === 0 ? "is-disabled" : ""
          }`}
        >
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
        </button>
        {Array(pageLimit)
          .fill(0)
          .map((_, i) => (
            <button
              key={i}
              onClick={() => callback(i)}
              title={`Go to page ${i + 1}`}
              className={`pagination__button ${
                i === current ? "is-active" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
        <button
          onClick={() => callback(current + 1)}
          title="Next page"
          className={`pagination__button next ${
            current === Math.ceil(limit - 1 ?? 9) ? "is-disabled" : ""
          }`}
        >
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
        </button>
      </div>
    </div>
  )
}

export default Pagination
