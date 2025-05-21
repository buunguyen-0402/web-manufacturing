import { useSelector } from "react-redux"
import { FaUser } from "react-icons/fa"
import UserInforModal from "./UserInforModal"
import useUserInforModal from "./useUserInforModal"

function UserInfor() {
    const userData = useSelector((state) => state.auth)
    const { active, position, handleClose, handleOpen } = useUserInforModal()

    const handleOpenModal = (e) => {
        handleOpen(e)
    }
    return (
        <>
            <div className="cursor-pointer text-3xl text-primary-1" onClick={handleOpenModal}>
                <FaUser />
            </div>
            {active && <UserInforModal position={position} width={"w-[50%]"} onClose={handleClose} data={userData} />}
        </>
    )
}

export default UserInfor
