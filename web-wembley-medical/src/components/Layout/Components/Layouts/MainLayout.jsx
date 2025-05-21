import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { ToastContainer } from "react-toastify"
import Loading from "../Loading"
import "react-toastify/dist/ReactToastify.css"
import Sidebar from "../Sidebar"
import UserInfor from "@/components/UserInfor"

function MainLayout({ children, title }) {
    const param = useParams()
    const { pageTitle, loading, notifications, unRead } = useSelector((state) => state.common)
    const [showNotifications, setShowNotifications] = useState(false)

    useEffect(() => {
        const documentTitle = (title ?? pageTitle) + " | Ứng dụng giám sát sản xuất"
        document.title = documentTitle
        document.addEventListener("click", () => {
            setShowNotifications(false)
        })
    }, [title, pageTitle])
    return (
        <div data-component="MainLayout" className="container flex h-screen  ">
            <aside className="h-full">
                <Sidebar id={param} />
            </aside>
            <div className=" grow relative bg-neutron-3">
                <div className=" h-[9%] w-full flex items-center px-2 ">
                    <h1 className="">{title ? title : pageTitle}</h1>
                    <div className="relative ml-auto flex">
                        <UserInfor />
                    </div>
                </div>
                <div className="  w-full border-[0.15px] border-primary-1"></div>
                <main className="scroll-y h-[90%] w-full p-3 ">{children}</main>
            </div>
            {loading && <Loading />}
            <ToastContainer pauseOnFocusLoss={false} autoClose={5000} />
        </div>
    )
}

export default MainLayout
