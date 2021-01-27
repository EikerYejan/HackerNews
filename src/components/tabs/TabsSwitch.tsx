import React, { useState, useRef, lazy, Suspense } from "react"
import "../../assets/styles/components/TabsSwitch.scss"

const HomeTab = lazy(() => import("./HomeTab"))
const FavesTab = lazy(() => import("./FavesTab"))

const TabsSwitch: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all")

  const wrapper = useRef<HTMLDivElement>(null)

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
        <Suspense fallback={<span className="loader" />}>
          {activeTab === "all" ? <HomeTab /> : <FavesTab />}
        </Suspense>
      </div>
    </>
  )
}

export default TabsSwitch
