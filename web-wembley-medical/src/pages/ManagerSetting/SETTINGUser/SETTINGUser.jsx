import Button from "@/components/Button"
import Confirm from "@/components/Confirm"
import PoperMenuNew from "@/components/PoperMenuNew"
import Table from "@/components/Table"
import { useCallApi, usePoperMenuNew } from "@/hooks"
import { authorizationApi } from "@/services/api"
import { SETTINGUserMapper, poperListMapper } from "@/utils/functions"
import { getSETTINGUserEditMenuNav, getSETTINGUserMenuNav } from "@/utils/menuNavigation"
import { SETTING_USER_TABLE_COLUMNS } from "@/utils/tableColumns"
import { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { IoReturnDownBackSharp } from "react-icons/io5"

function SETTINGUser() {
    const callApi = useCallApi()
    const navigate = useNavigate()
    const userData = useSelector((state) => state.auth)

    const { active, position, handleClose, handleOpen } = usePoperMenuNew(400)
    const [deleteConfirm, setDeleteConfirm] = useState({}) //State này chứa thông tin về xác nhận xóa vật tư. Khi người dùng chọn xóa một vật tư, thông tin xác nhận xóa sẽ được lưu trữ trong deleteConfirm, bao gồm tiêu đề, nội dung và hàm xác nhận.

    const [user, setUser] = useState([])
    const [userShowData, setUserShowData] = useState([])
    const [initValue, setInitValue] = useState() // dùng để chứa data đang chỉnh sửa, nếu = null thì đang tạo mục mới; undefined là bình thường
    const [activedItem, setActivedItem] = useState(null)

    const [roleList, setRoleList] = useState([])

    const fetchData = useCallback(() => {
        callApi([authorizationApi.user.getUser(), authorizationApi.role.getRole()], (res) => {
            setUser(res[0].data)
            setUserShowData(SETTINGUserMapper.apiToClient(res[0].data))
            setRoleList(poperListMapper(res[1].data, "roleName", "roleName"))
        })
    }, [callApi])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const handleAdd = (e) => {
        setInitValue(null)
        handleOpen(e)
    }
    const handleSubmit = (value) => {
        let data
        let roleData
        let inforData
        let callApiFunction
        let successMessage
        // console.log(value)
        if (!initValue) {
            data = value.info
            callApiFunction = () => authorizationApi.user.createUser(data)
            successMessage = "Tạo nhân viên thành công"
        } else {
            roleData = value.info
            callApiFunction = () => authorizationApi.user.updateUser(roleData, activedItem.id)
            successMessage = "Chỉnh sửa nhân viên thành công"
        }
        callApi(callApiFunction, fetchData, successMessage)
    }
    const handleEdit = (e) => {
        setInitValue({
            info: activedItem,
        })
        handleOpen(e)
    }
    const handleDelete = (row) => {
        const id = row.id
        const name = row.lastName + " " + row.firstName

        setDeleteConfirm({
            actived: true,
            title: "Xác nhận xóa nhân viên " + name,
            content: `Nhân viên ${name} sẽ bị xóa vĩnh viễn và không được hiển thị tại trang này nữa`,
            onConfirm() {
                callApi(() => authorizationApi.user.deleteUser(id), fetchData, `Nhân viên ${name} được xóa thành công`)
            },
        })
    }
    const handleTableRowClick = (row, index) => {
        const activedRow = user[index]
        setActivedItem(activedRow)
    }
    return (
        <>
            <div data-component="ResourceType" className="container flex h-full flex-wrap">
                <div className="relative h-full grow flex flex-col justify-between">
                    <div className="flex h-[6%] w-full items-center gap-5">
                        <Button bg={"white"} className={" h-full "} onClick={() => navigate("/setting/account")}>
                            <IoReturnDownBackSharp className=" text-neutron-1" />
                        </Button>
                        {userData.role.includes("Admin") ? (
                            <Button onClick={handleAdd}>Thêm nhân viên mới</Button>
                        ) : (
                            <h2>Chỉ có Admin mới có quyền tạo nhân viên mới!</h2>
                        )}
                    </div>
                    <div className=" h-[93%] w-full overflow-y-scroll">
                        <Table
                            activable
                            primary
                            sticky
                            headers={SETTING_USER_TABLE_COLUMNS}
                            body={userShowData}
                            className=""
                            onEdit={userData.role.includes("Admin") && handleEdit}
                            onRowClick={handleTableRowClick}
                            onDeleteRow={userData.role.includes("Admin") && handleDelete}
                        />
                    </div>
                </div>
            </div>
            {active && (
                <PoperMenuNew
                    position={position}
                    onClose={handleClose}
                    menuNavigaton={initValue ? getSETTINGUserEditMenuNav(roleList) : getSETTINGUserMenuNav()}
                    onClick={handleSubmit}
                    initValue={initValue ? initValue : undefined}
                    activateValidation={false}
                />
            )}
            {deleteConfirm.actived && (
                <Confirm
                    title={deleteConfirm.title}
                    content={deleteConfirm.content}
                    onConfirm={deleteConfirm.onConfirm}
                    onClose={() => setDeleteConfirm({ actived: false })}
                />
            )}
        </>
    )
}

export default SETTINGUser
