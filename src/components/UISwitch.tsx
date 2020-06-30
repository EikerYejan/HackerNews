import React from "react"
import dark from "../assets/images/dark.webp"
import light from "../assets/images/light.webp"
import "../assets/styles/components/UISwitch.scss"

type Props = {
  theme: string
  changeTheme: () => void
}

const UISwitch: React.FC<Props> = ({ theme, changeTheme }) => (
  <button
    onClick={changeTheme}
    className={`theme-${theme}`}
    id="theme-switch"
    title="Change theme"
  >
    <span className="switch__handle" />
    <img src={light} alt="light-theme" className="light-icon" />
    <img src={dark} alt="dark-theme" className="dark-icon" />
  </button>
)

export default UISwitch
