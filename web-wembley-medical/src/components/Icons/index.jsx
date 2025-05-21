import { FcDataConfiguration } from "react-icons/fc"
import { IoSettingsOutline } from "react-icons/io5"
import { TbReport } from "react-icons/tb"
import { MdHistory } from "react-icons/md"
import { IoBugOutline } from "react-icons/io5"
import { MdOutlineAccountCircle } from "react-icons/md"
import { MdOutlinePostAdd } from "react-icons/md"
import { GrUserWorker } from "react-icons/gr"
import { MdOutlineAddchart } from "react-icons/md"

export const Configuration = () => {
    return <FcDataConfiguration />
}
export const MFC = () => {
    return <IoSettingsOutline />
}
export const Report = () => {
    return <TbReport />
}
export const StatusHistory = () => {
    return <MdHistory />
}
export const BugHistory = () => {
    return <IoBugOutline />
}
export const Account = () => {
    return <MdOutlineAccountCircle />
}
export const AddLot = () => {
    return <MdOutlinePostAdd />
}
export const WorkerList = () => {
    return <GrUserWorker />
}
export const AddChart = () => {
    return <MdOutlineAddchart />
}
