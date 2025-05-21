import { useCallApi } from "@/hooks"
import { useEffect, useState, useCallback } from "react"
import Table from "@/components/Table"
import { workerApi } from "@/services/api"
import { worker_headers } from "@/utils/tableColumns"
import usePoperMenuNew from "@/hooks/usePoperMenuNew"
import PoperMenuNew from "@/components/PoperMenuNew"
import Confirm from "@/components/Confirm"
import Button from "@/components/Button"
import { editWorkerMenu, getWorkerMenu } from "@/utils/menuNavigation/woker"

function WorkerManager() {
    const callApi = useCallApi()
    const [allMembers, setAllMembers] = useState([])
    const [activedItem, setActivedItem] = useState(null)
    const { active, position, handleClose, handleOpen } = usePoperMenuNew(400)
    const [deleteConfirm, setDeleteConfirm] = useState({}) //State này chứa thông tin về xác nhận xóa vật tư. Khi người dùng chọn xóa một vật tư, thông tin xác nhận xóa sẽ được lưu trữ trong deleteConfirm, bao gồm tiêu đề, nội dung và hàm xác nhận.
    const [initValue, setInitValue] = useState() // dùng để chứa data đang chỉnh sửa, nếu = null thì đang tạo mục mới; undefined là bình thường

    const fetchData = useCallback(() => {
        callApi(
            () => workerApi.getAllWoker(),
            (res) => {
                setAllMembers(res.data)
            },
        )
    }, [callApi])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    // const handleAddMembers = () => {
    //     let MaNV = String(document.getElementById("MaNV").value)
    //     let TenNV = String(document.getElementById("TenNV").value)
    //     setAllMembers([
    //         ...allMembers,
    //         {
    //             employeeId: MaNV,
    //             employeeName: TenNV,
    //         },
    //     ])
    //     workerApi.createWorker({
    //         employeeId: MaNV,
    //         employeeName: TenNV,
    //     })
    // }
    // const handleEdit = (e) => {
    //     setInitValue({
    //         info: activedItem,
    //     })
    //     handleOpen(e)
    // }
    const handleTableRowClick = (row, index) => {
        const activedRow = allMembers[index]
        // setActivedItem(activedRow)
    }
    const handleDelete = (row) => {
        const personId = row.employeeId
        const personName = row.employeeName
        setDeleteConfirm({
            actived: true,
            title: "Xác nhận xóa nhân viên " + personName,
            content: `Nhân viên ${personName} sẽ bị xóa vĩnh viễn và không được hiển thị tại trang này nữa`,
            onConfirm() {
                callApi(
                    () => workerApi.deleteWorker(personId),
                    fetchData,
                    `Nhân viên ${personName} được xóa thành công`,
                )
            },
        })
    }
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
            callApiFunction = workerApi.createWorker(data)
            successMessage = "Tạo nhân viên thành công"
        } else {
            data = value.info
            // callApiFunction = testApi.updateMemberName(data, activedItem.id)
            successMessage = "Chỉnh sửa nhân viên thành công"
        }
        callApi(() => callApiFunction, fetchData, successMessage)
    }
    return (
        <>
            <div className="flex">
                <Button onClick={handleAdd}>Thêm nhân viên</Button>
            </div>

            <div className=" h-[90%] w-full p-2 mt-2 text-center text-[1.15rem] font-normal overflow-y-scroll no-scrollbar">
                <Table
                    activable
                    primary
                    sticky
                    headers={worker_headers}
                    body={allMembers} //mảng dữ liệu
                    className="mt-4"
                    // onEdit={handleEdit}
                    onRowClick={handleTableRowClick}
                    onDeleteRow={handleDelete}
                    // enableIdClick
                    // idClickFunction={(e, row, index) => {
                    //     console.log(row)
                    //     navigate(`/setting/Test`, { state: row })
                    // }}
                />
                {active && (
                    <PoperMenuNew
                        position={position}
                        onClose={handleClose}
                        menuNavigaton={initValue ? editWorkerMenu() : getWorkerMenu()}
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
            </div>
        </>
    )
}
export default WorkerManager
