import { useState, useContext } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import cl from "classnames"
// import { BsArrowBarLeft, BsArrowBarRight } from "react-icons/bs"
import { SIDEBAR_ITEMS_DASHBOARD } from "@/utils/menuNavigation"
import SidebarItem from "./SidebarItem"
import logo from "@/assets/WembleyLogo.png"

function Sidebar({ id }) {
    const [isExpand, setIsExpand] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
    const [currentPath, setCurrentPath] = useState(location.pathname)

    const handleClick = (route) => {
        navigate(route)
        setCurrentPath(route)
    }

    const handleCloseSidebar = () => {
        setTimeout(() => setIsExpand(false), 500)
    }

    return (
        <div
            data-component="Sidebar"
            className={cl(
                "transition-width relative h-full from-primary-1 to-primary-2 bg-gradient-to-b py-5 text-neutron-4 duration-200",
                "scroll-y h-full",
                {
                    "visible w-[25rem] px-5 sm:w-screen": isExpand,
                    "w-[5rem] px-2 sm:invisible sm:w-0": !isExpand,
                },
            )}
            onMouseEnter={() => setIsExpand(true)}
            onMouseLeave={handleCloseSidebar}
        >
            <div
                className="mx-auto aspect-square w-full cursor-pointer flex justify-center items-center rounded-xl bg-neutron-4 sm:w-1/2"
                onClick={() => handleClick("/")}
            >
                {/* <img src={logo} alt="" /> */}
            </div>
            <div className={cl("sticky top-1/3 xxl:top-0")}>
                {SIDEBAR_ITEMS_DASHBOARD.map((item, index) => (
                    <SidebarItem
                        key={index}
                        Icon={item.icon}
                        label={item.label}
                        actived={currentPath.includes(item.route)}
                        isExpand={isExpand}
                        onClick={() => handleClick(item.route)}
                    />
                ))}
            </div>

            {/* <i
                className={cl(
                    "absolute top-[21.7rem] right-4 flex h-11 w-11 cursor-pointer bg-warning-1",
                    "items-center justify-center rounded-full text-xl hover:bg-hoverBg",
                    {
                        "sm:visible sm:fixed sm:left-0 sm:text-accent-1": !isExpand,
                        "xl:static xl:float-right": isExpand,
                    },
                )}
            >
                Error
            </i> */}
        </div>
    )
}

export default Sidebar
