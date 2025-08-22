import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons"

// This is just a test component to verify the icons
const IconTest = () => {
  return (
    <div className="flex gap-4">
      <FontAwesomeIcon icon={faGoogle} size="2x" />
      <FontAwesomeIcon icon={faGithub} size="2x" />
    </div>
  )
}

export default IconTest
