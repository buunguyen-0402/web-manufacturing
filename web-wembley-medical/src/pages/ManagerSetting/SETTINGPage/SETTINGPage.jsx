import Button from "@/components/Button"
import Confirm from "@/components/Confirm"
import PoperMenuNew from "@/components/PoperMenuNew"
import Table from "@/components/Table"
import { useCallApi, usePoperMenuNew } from "@/hooks"
import { authorizationApi } from "@/services/api"
import { SETTINGUserMapper, poperListMapper, poperListMapperUniqueArray } from "@/utils/functions"
import Card from "@/components/Card"
import { editSETTINGPageMenuNav, getSETTINGPageMenuNav } from "@/utils/menuNavigation"
import { SETTING_PAGE_TABLE_COLUMNS } from "@/utils/tableColumns"
import { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { IoReturnDownBackSharp } from "react-icons/io5"
import TextInput from "@/components/TextInput"
import SelectInput from "@/components/SelectInput"

function SETTINGPage() {
    const callApi = useCallApi()
    const navigate = useNavigate()
    const userData = useSelector((state) => state.auth)

    const { active, position, handleClose, handleOpen } = usePoperMenuNew(400)
    const [deleteConfirm, setDeleteConfirm] = useState({}) //State này chứa thông tin về xác nhận xóa vật tư. Khi người dùng chọn xóa một vật tư, thông tin xác nhận xóa sẽ được lưu trữ trong deleteConfirm, bao gồm tiêu đề, nội dung và hàm xác nhận.

    const [page, setPage] = useState([])
    const [userShowData, setUserShowData] = useState([])
    const [initValue, setInitValue] = useState() // dùng để chứa data đang chỉnh sửa, nếu = null thì đang tạo mục mới; undefined là bình thường
    const [activedItem, setActivedItem] = useState(null)

    const [openPopup, setOpenPopup] = useState(false)
    const [deleteButton, setDeleteButton] = useState()

    const fetchData = useCallback(() => {
        callApi([authorizationApi.pages.getPage()], (res) => {
            setPage(res[0].data)
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
        // console.log(value)
        if (!initValue) {
            data = { name: value.info.name, buttons: value.info.buttons.split(",") }
            callApiFunction = () => authorizationApi.pages.createPage(data)
            successMessage = "Tạo trang thành công"
        } else {
            data = { pageId: value.activedItem.id, buttons: value.info.buttons.split(",") }
            callApiFunction = () => authorizationApi.pages.addButtonToPage(data, activedItem.id)
            successMessage = "Chỉnh sửa nút thao tác thành công"
        }
        callApi(callApiFunction, fetchData, successMessage)
    }
    // const handleEdit = (e) => {
    //     setInitValue({
    //         info: activedItem,
    //     })
    //     handleOpen(e)
    // }
    const handleDelete = (row) => {
        const id = row.id
        const name = row.name
        setDeleteConfirm({
            actived: true,
            title: "Xác nhận xóa trang " + name,
            content: `Trang ${name} sẽ bị xóa vĩnh viễn`,
            onConfirm() {
                callApi(
                    () => authorizationApi.pages.deletePage({ data: { pageIds: [id] } }),
                    fetchData,
                    `Trang ${name} được xóa thành công`,
                )
            },
        })
    }
    const handleTableRowClick = (row, index) => {
        const activedRow = page[index]
        setActivedItem(activedRow)
    }

    const handleAddButtonToPage = (e) => {
        setInitValue({ activedItem })
        handleOpen(e)
    }

    const handleDeleteButtonToPage = () => {
        setInitValue({ info: activedItem })
        setOpenPopup(true)
    }
    const handleDeleteData = () => {
        if (deleteButton && deleteButton.length > 0) {
            callApi(
                () => authorizationApi.pages.deleteButtonToPage({ pageId: activedItem.id, buttons: deleteButton }),
                () => {
                    fetchData()
                    setOpenPopup(false)
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
                            <Button onClick={handleAdd}>Thêm trang mới</Button>
                        ) : (
                            <h2>Chỉ có Admin mới có quyền tạo trang mới!</h2>
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
                    <div className=" h-[93%] w-full overflow-y-scroll">
                        <Table
                            activable
                            primary
                            sticky
                            headers={SETTING_PAGE_TABLE_COLUMNS}
                            body={page}
                            className=""
                            // onEdit={userData.auth.role.includes("Admin") && handleAddButtonToPage}
                            onRowClick={handleTableRowClick}
                            onDeleteRow={userData.role.includes("Admin") && handleDelete}
                        />
                    </div>
                    {openPopup && (
                        <>
                            <div className="h-full w-full absolute z-10 bg-neutron-1 opacity-50"></div>
                            <Card className="h-[50%] w-[40%] absolute flex flex-col items-center gap-[8%] top-[15%] left-[30%] z-10 bg-neutron-4">
                                <h1>Xóa nút thao tác trong trang</h1>
                                <h9>Yêu cầu chọn các tên nút thao tác cần xóa</h9>
                                <SelectInput
                                    label="Xóa nút thao tác"
                                    list={poperListMapperUniqueArray(activedItem?.buttons)}
                                    id={2}
                                    value={deleteButton}
                                    setValue={setDeleteButton}
                                    canSearch={true}
                                    mutilChoises={true}
                                    className={" h-[10%] w-[90%]"}
                                />
                                <Button className={" h-[10%] w-[70%]"} onClick={handleDeleteData}>
                                    Xác nhận xóa
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
                </div>
            </div>
            {active && (
                <PoperMenuNew
                    position={position}
                    onClose={handleClose}
                    menuNavigaton={initValue ? editSETTINGPageMenuNav() : getSETTINGPageMenuNav()}
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

export default SETTINGPage
