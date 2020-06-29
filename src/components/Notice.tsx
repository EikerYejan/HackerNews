import React from "react"
import "../assets/styles/components/Notice.scss"

type Props = {
  heading: string
  subheading: string
  text?: string
}

const Notice: React.FC<Props> = ({ heading, subheading, text }) => (
  <div className="column is-12 notice">
    <div className="notice__inner">
      <p>{text}</p>
      <h2>{heading}</h2>
      <h3>{subheading}</h3>
    </div>
  </div>
)

export default Notice
