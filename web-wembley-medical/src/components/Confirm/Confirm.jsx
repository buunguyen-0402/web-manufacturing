import { createPortal } from "react-dom"
import { IoWarningOutline } from "react-icons/io5"
import Card from "@/components/Card"
import Button from "@/components/Button"

function Confirm({ title, content, onConfirm, onClose }) {
    const handleConfirm = () => {
        onConfirm()
        onClose()
    }

    return createPortal(
        <div data-component="Confirm" className="container fixed top-0 left-0 right-0 bottom-0 z-50 h-full bg-hoverBg">
            <Card className="absolute top-1/2 left-1/2 w-[40%] h-[40%] flex flex-col justify-around items-center p-[1%] translate-x-[-50%] translate-y-[-50%] bg-neutron-4">
                <div className=" h-[30%] w-full">
                    <IoWarningOutline className=" h-full w-full text-warning-1" />
                </div>
                <div className="heading-20-b">{title}</div>
                <p>{content}</p>
                <div className=" flex items-center gap-5 h-[15%] w-full">
                    <Button className="ml-auto" bg={"rgba(233,34,34,0.85)"} onClick={handleConfirm}>
                        Xác nhận
                    </Button>
                    <Button transparent onClick={onClose}>
                        Hủy
                    </Button>
                </div>
            </Card>
        </div>,
        document.querySelector("#root"),
    )
}

export default Confirm
