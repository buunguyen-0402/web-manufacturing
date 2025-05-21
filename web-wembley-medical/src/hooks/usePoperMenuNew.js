import { useState } from "react"

const usePoperMenuNew = (heigh) => {
    const [active, setActive] = useState(false)
    const [position, setPosition] = useState({})

    const handleOpen = (e) => {
        const x = window.innerWidth / 2
        const y = window.innerHeight / 2
        const menuWidth = 500
        const menuHeight = heigh

        const left = x - menuWidth / 2
        const top = y - menuHeight / 2

        setPosition({
            top: top + "px",
            left: left + "px",
        })

        setActive(true)
    }

    const handleClose = () => {
        setActive(false)
    }

    return { active, position, handleOpen, handleClose }
}

export default usePoperMenuNew
