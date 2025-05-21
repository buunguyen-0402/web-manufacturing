import Button from "@/components/Button"
import Confirm from "@/components/Confirm"
import PoperMenuNew from "@/components/PoperMenuNew"
import Table from "@/components/Table"
import { useCallApi, usePoperMenuNew } from "@/hooks"
import { authorizationApi } from "@/services/api"
import { editSETTINGRole, getSETTINGRoleMenuNav } from "@/utils/menuNavigation"
import { SETTING_ROLE_TABLE_COLUMNS } from "@/utils/tableColumns"
import { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { IoReturnDownBackSharp } from "react-icons/io5"
import { useNavigate } from "react-router-dom"
import { handleSETTINGRoleData, poperListMapper } from "@/utils/functions"
import Card from "@/components/Card"
import SelectInput from "@/components/SelectInput"

function SETTINGRole() {
    const callApi = useCallApi()
    const navigate = useNavigate()
    const userData = useSelector((state) => state.auth)

    const { active, position, handleClose, handleOpen } = usePoperMenuNew(400)
    const [deleteConfirm, setDeleteConfirm] = useState({}) //State này chứa thông tin về xác nhận xóa vật tư. Khi người dùng chọn xóa một vật tư, thông tin xác nhận xóa sẽ được lưu trữ trong deleteConfirm, bao gồm tiêu đề, nội dung và hàm xác nhận.

    const [role, setRole] = useState([])
    const [initValue, setInitValue] = useState() // dùng để chứa data đang chỉnh sửa, nếu = null thì đang tạo mục mới; undefined là bình thường
    const [activedItem, setActivedItem] = useState(null)

    const [selectPage, setSelectPage] = useState()
    const [deleteSelectPage, setDeleteSelectPage] = useState()
    const [page, setPage] = useState()

    const [openPopup, setOpenPopup] = useState(false)
    const [openPopupDelete, setOpenPopupDelete] = useState(false)

    const fetchData = useCallback(() => {
        callApi([authorizationApi.role.getRole(), authorizationApi.pages.getPage()], (res) => {
            setRole(handleSETTINGRoleData(res[0].data))
            setPage(poperListMapper(res[1].data, "id", "name"))
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
        let callApiFunction
        let successMessage

        if (!initValue) {
            data = value.info
            console.log(data)
            callApiFunction = authorizationApi.role.createRole(data)
            successMessage = "Tạo quyền truy cập thành công"
        } else {
            data = { roleId: activedItem.info.id, ...value.info }
            callApiFunction = authorizationApi.role.updateRole(data)
            successMessage = "Chỉnh sửa quyền truy cập thành công"
        }
        callApi(() => callApiFunction, fetchData, successMessage)
    }
    const handleEdit = (e) => {
        setInitValue({
            info: activedItem,
        })
        handleOpen(e)
    }
    const handleDelete = (row) => {
        const id = row.id
        const name = row.displayName
        setDeleteConfirm({
            actived: true,
            title: "Xác nhận xóa quyền truy cập " + name,
            content: `Quyền truy cập ${name} sẽ bị xóa vĩnh viễn và không được hiển thị tại trang này nữa`,
            onConfirm() {
                callApi(
                    () => authorizationApi.role.deleteRole(id),
                    fetchData,
                    `Quyền truy cập ${name} được xóa thành công`,
                )
            },
        })
    }
    const handleTableRowClick = (row, index) => {
        const activedRow = role[index]
        setActivedItem({ info: activedRow })
    }

    const handleAddButtonToPage = (e) => {
        setInitValue({ info: activedItem })
        setOpenPopup(true)
    }

    const handleDeleteButtonToPage = () => {
        setInitValue({ info: activedItem })
        console.log(activedItem)
        setOpenPopupDelete(true)
    }
    const handleAddPage = () => {
        if (selectPage && selectPage.length > 0) {
            // console.log({ roleId: activedItem.id, pageIds: selectPage })
            callApi(
                () => authorizationApi.pages.addPageToRole({ roleId: activedItem.info.id, pageIds: selectPage }),
                () => {
                    fetchData()
                    setOpenPopup(false)
                },
                "Xóa thành công",
            )
        }
    }
    const handleDeletePage = () => {
        if (deleteSelectPage && deleteSelectPage.length > 0) {
            console.log({ roleId: activedItem.id, pageIds: deleteSelectPage })
            callApi(
                () => authorizationApi.pages.deletePageToRole({ roleId: activedItem.id, pageIds: deleteSelectPage }),
                () => {
                    fetchData()
                    setOpenPopupDelete(false)
                },
                "Xóa thành công",
            )
        }
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
                            <Button onClick={handleAdd}>Thêm chức vụ mới</Button>
                        ) : (
                            <h2>Chỉ có Admin mới có quyền tạo chức vụ mới!</h2>
                        )}
                        {userData.role.includes("Admin") && activedItem && (
                            <>
                                <Button onClick={userData.role.includes("Admin") && handleAddButtonToPage}>
                                    Thêm nút thao tác vào trang
                                </Button>
                                <Button
                                    bg={"rgba(233,34,34,0.8)"}
                                    onClick={userData.role.includes("Admin") && handleDeleteButtonToPage}
                                >
                                    Xóa nút thao tác
                                </Button>
                            </>
                        )}
                    </div>
                    <div className="h-[93%] w-full overflow-y-scroll">
                        <Table
                            activable
                            primary
                            sticky
                            headers={SETTING_ROLE_TABLE_COLUMNS}
                            body={role}
                            className=""
                            onEdit={handleEdit}
                            onRowClick={handleTableRowClick}
                            onDeleteRow={userData.role.includes("Admin") && handleDelete}
                        />
                    </div>
                    {openPopup && (
                        <>
                            <div className="h-full w-full absolute z-10 bg-neutron-1 opacity-50"></div>
                            <Card className="h-[50%] w-[40%] absolute flex flex-col items-center gap-[8%] top-[15%] left-[30%] z-10 bg-neutron-4">
                                <h1>Thêm trang thao tác</h1>
                                <SelectInput
                                    label="Chọn trang thao tác"
                                    list={page}
                                    id={2}
                                    value={selectPage}
                                    setValue={setSelectPage}
                                    canSearch={true}
                                    mutilChoises={true}
                                    className={" h-[10%] w-[90%]"}
                                />
                                <Button className={" h-[10%] w-[70%]"} onClick={handleAddPage}>
                                    Xác nhận
                                </Button>
                                <Button
                                    bg={"rgba(233,34,34,0.8)"}
                                    className={" h-[10%] w-[70%]"}
                                    onClick={() => setOpenPopup(false)}
                                >
                                    Đóng lại
                                </Button>
                            </Card>
                        </>
                    )}
                    {openPopupDelete && (
                        <>
                            <div className="h-full w-full absolute z-10 bg-neutron-1 opacity-50"></div>
                            <Card className="h-[50%] w-[40%] absolute flex flex-col items-center gap-[8%] top-[15%] left-[30%] z-10 bg-neutron-4">
                                <h1>Xóa trang thao tác</h1>
                                <h9>Yêu cầu chọn đúng trang cần xóa</h9>
                                <SelectInput
                                    label="Xóa trang thao tác"
                                    list={page}
                                    id={2}
                                    value={deleteSelectPage}
                                    setValue={setDeleteSelectPage}
                                    canSearch={true}
                                    mutilChoises={true}
                                    className={" h-[10%] w-[90%]"}
                                />
                                <Button className={" h-[10%] w-[70%]"} onClick={handleDeletePage}>
                                    Xác nhận
                                </Button>
                                <Button
                                    bg={"rgba(233,34,34,0.8)"}
                                    className={" h-[10%] w-[70%]"}
                                    onClick={() => setOpenPopupDelete(false)}
                                >
                                    Đóng lại
                                </Button>
                            </Card>
                        </>
                    )}
                </div>
            </div>
            {active && (
                <PoperMenuNew
                    position={position}
                    onClose={handleClose}
                    menuNavigaton={initValue ? editSETTINGRole() : getSETTINGRoleMenuNav()}
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

export default SETTINGRole
