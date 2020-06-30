import React, { useState, useEffect } from "react"
import { Helmet } from "react-helmet"
import TabsSwitch from "./tabs/TabsSwitch"
import UISwitch from "./UISwitch"
import { getStorageItem, setStorageItem } from "../utils"
import "../assets/styles/App.scss"

const App: React.FC = () => {
  /* Get saved theme */
  const currentTheme = getStorageItem("get_theme") ?? "light"

  /* Current theme */
  const [theme, setTheme] = useState<string>(currentTheme)

  /* Update current theme */
  useEffect(() => {
    const classes = ["theme-dark", "theme-light"]
    document.body.classList.remove(...classes)
    document.body.classList.add(`theme-${theme}`)
  }, [theme])

  /**
   * Change current theme
   */
  const changeTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"

    // Save in storage
    setStorageItem("save_theme", newTheme)

    // Update state
    setTheme(newTheme)
  }

  return (
    <div className="app">
      <Helmet>
        <meta
          name="theme-color"
          content={theme === "light" ? "#1797ff" : "#2e2e2e"}
        />
      </Helmet>
      <header className="app__header column is-12">
        <h1>Hacker News</h1>
        <UISwitch theme={theme} changeTheme={changeTheme} />
      </header>
      <div className="app__posts">
        <TabsSwitch />
      </div>
    </div>
  )
}

export default App
