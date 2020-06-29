import React from "react"
import _ from "lodash"
import "../../assets/styles/components/posts/Pagination.scss"

type Props = {
  current: number
  callback: (value: number) => void
}

const Pagination: React.FC<Props> = ({ current, callback }) => {
  /**
   * Print pagination buttons
   */
  const printButtons = (): JSX.Element[] => {
    const buttons: JSX.Element[] = []

    _.times(10, (i) => {
      const indexText = i + 1
      const isActive = i === current

      buttons.push(
        <button
          key={i}
          onClick={() => callback(i)}
          title={`Go to page ${indexText}`}
          className={`pagination__button ${isActive ? "is-active" : ""}`}
        >
          {indexText}
        </button>
      )
    })

    return buttons
  }

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
        {printButtons()}
        <button
          onClick={() => callback(current + 1)}
          title="Previous page"
          className={`pagination__button next ${
            current === 9 ? "is-disabled" : ""
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
