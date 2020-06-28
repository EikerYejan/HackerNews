import React from "react"
import PostsGrid from "./posts/PostsGrid"
import logo from "../assets/images/hacker-news.svg"
import "../assets/styles/App.scss"

const App: React.FC = () => (
  <div className="app">
    <header className="app__header column is-12">
      <h1>Hacker News</h1>
    </header>
    <div className="app__posts">
      <PostsGrid />
    </div>
  </div>
)

export default App
