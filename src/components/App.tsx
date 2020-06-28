import React from "react"
import HomeTab from "./tabs/HomeTab"
import "../assets/styles/App.scss"

const App: React.FC = () => (
  <div className="app">
    <header className="app__header column is-12">
      <h1>Hacker News</h1>
    </header>
    <div className="app__posts">
      <HomeTab />
    </div>
  </div>
)

export default App
