import React, { useState, useRef } from "react"
import HomeTab from "./HomeTab"
import FavesTab from "./FavesTab"
import "../../assets/styles/components/TabsSwitch.scss"

const TabsSwitch: React.FC = () => {
  /* State */
  const [activeTab, setActiveTab] = useState("all")

  /* Transition wrapper ref */
  const wrapper = useRef<HTMLDivElement>(null)

  /**
   * Handle switch click
   * @param e
   */
  const handleSwitch = (e: React.SyntheticEvent<HTMLButtonElement>): void => {
    const button = e.currentTarget
    const { tab } = button.dataset

    // Add classes
    document
      .querySelector(".switch__button.is-active")
      ?.classList.remove("is-active")
    button.classList.add("is-active")

    if (tab) {
      // Hide container
      wrapper.current?.classList.add("is-changing")

      setTimeout(() => {
        // Update state
        setActiveTab(tab)

        // Show container
        wrapper.current?.classList.remove("is-changing")
      }, 500)
    }
  }

  return (
    <>
      <div className="column is-12 switch">
        <div className="switch__inner">
          <button
            className="switch__button is-active"
            onClick={handleSwitch}
            data-tab="all"
          >
            All
          </button>
          <button
            className="switch__button"
            onClick={handleSwitch}
            data-tab="faves"
          >
            My faves
          </button>
        </div>
      </div>
      <div ref={wrapper} className="transition-wrapper">
        {activeTab === "all" ? <HomeTab /> : <FavesTab />}
      </div>
    </>
  )
}

export default TabsSwitch
