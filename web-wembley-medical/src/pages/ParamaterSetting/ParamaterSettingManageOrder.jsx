import Button from "@/components/Button"
import Card from "@/components/Card"
import TextInput from "@/components/TextInput"
import SelectInput from "@/components/SelectInput"
import Table from "@/components/Table"
import cl from "classnames"
import Confirm from "@/components/Confirm"
import { dateFormatRenderVi, handleDataParamter } from "@/utils/functions"
import { orders_headers } from "@/utils/tableColumns"
import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useCallApi } from "@/hooks"
import DateInput from "@/components/DateInput"
import { FaSearch } from "react-icons/fa"
import { authorizationApi, machineApi } from "@/services/api"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"

function ParamaterSettingManageOrder() {
    const navigate = useNavigate()
    const callApi = useCallApi()
    const user = useSelector((state) => state.auth)

    const [searchStartTime, setSearchStartTime] = useState(() => {
        const now = new Date()
        now.setDate(now.getDate() - 7)
        return now.toISOString().slice(0, 10)
    })
    const [searchEndTime, setSearchEndTime] = useState(() => {
        const now = new Date()
        now.setDate(now.getDate() + 7)
        return now.toISOString().slice(0, 10)
    })

    const [initValue, setInitValue] = useState()
    const [activedItem, setActivedItem] = useState()

    const [filterLineOrder, setFilterLineOrder] = useState([])

    const [filteredOrderlist, setFilteredOrderList] = useState([])

    const [lineOrder, setLineOrder] = useState([])

    // const [activedItem, setActivedItem] = useState(null)
    const [deleteConfirm, setDeleteConfirm] = useState({})

    const [lineInfor, setLineInfor] = useState([])
    const [activeLineAndRefPopup, setActiveLineAndRefPopup] = useState(false)
    const [activeOrderPopup, setActiveOrderPopup] = useState(false)
    const [refOrder, setRefOrder] = useState([])
    const [filterRefOrder, setFilterRefOrder] = useState([])
    const [LSXOrder, setLSXOrder] = useState()

    const [acceptRole, setAcceptRole] = useState()

    const fetchLineData = useCallback(() => {
        callApi(
            [
                machineApi.product.getAllProducts(),
                machineApi.line.getAllLine(),
                machineApi.workOrders.getWorkOrdersByStartTimeAndEndTime(searchStartTime, searchEndTime),
            ],
            (res) => {
                setRefOrder(res[0].data.map((res) => ({ key: res.referenceCode, value: res.referenceCode })))
                setLineInfor(res[1].data)
                setLineOrder(res[1].data.map((res) => ({ key: res.lineName, value: res.lineId })))
                setFilteredOrderList(
                    res[2].data.workOrders.sort((a, b) => b.workOrderCode.localeCompare(a.workOrderCode)),
                )
            },
            "Truy xuất thành công",
        )
    }, [callApi])
    useEffect(() => {
        fetchLineData()
    }, [fetchLineData])

    const handleSearchWorkOrderByLineAndRef = () => {
        callApi(
            () =>
                machineApi.workOrders.getWorkOrdersByLineIdAndStartTimeAndEndTime(
                    filterLineOrder.length > 0 ? filterLineOrder[0] : "",
                    searchStartTime,
                    searchEndTime,
                ),
            (res) => {
                const filterRef =
                    filterRefOrder.length > 0
                        ? res.data.workOrders.filter((workOrder) => workOrder.referenceCode === filterRefOrder[0])
                        : res.data.workOrders

                setFilteredOrderList(filterRef.sort((a, b) => b.workOrderCode.localeCompare(a.workOrderCode)))
                setLSXOrder("")
                setActiveLineAndRefPopup(false)
            },
            "Truy xuất thành công",
            (res) => toast.error(res.response),
        )
    }
    const handleSearchWorkOrderByLSXOrder = () => {
        callApi(
            () => machineApi.workOrders.getWorkOrdersByStartTimeAndEndTime(searchStartTime, searchEndTime),
            (res) => {
                const filterLSX =
                    String(LSXOrder) !== ""
                        ? res.data.workOrders.filter((workOrder) => workOrder.workOrderCode === LSXOrder)
                        : res.data.workOrders

                setFilteredOrderList(filterLSX.sort((a, b) => b.workOrderCode.localeCompare(a.workOrderCode)))
                setFilterLineOrder([])
                setFilterRefOrder([])
                setActiveOrderPopup(false)
            },
            "Truy xuất thành công",
            (res) => toast.error(res.response),
        )
    }

    const handleTableRowClickOrder = (row, index) => {
        const activedRow = filteredOrderlist[index]
        setActivedItem(activedRow)
    }

    const handleDeleteOrder = (row) => {
        const workOrderId = row.workOrderId
        const workOrderCode = row.workOrderCode
        setDeleteConfirm({
            actived: true,
            title: "Xác nhận xóa lệnh sản xuất " + workOrderCode,
            content: `Lệnh sản xuất ${workOrderCode} cùng với các thông tin của lệnh sẽ bị xóa vĩnh viễn`,
            onConfirm() {
                callApi(
                    () => machineApi.workOrders.deleteWorkOrders(workOrderId),
                    () => {
                        filteredOrderlist.forEach((item, index) => {
                            if (item.workOrderId === workOrderId) {
                                const updatedList = [...filteredOrderlist]
                                updatedList.splice(index, 1)
                                setFilteredOrderList(
                                    updatedList.sort((a, b) => b.workOrderCode.localeCompare(a.workOrderCode)),
                                )
                            }
                        })
                    },
                    `Lệnh sản xuất ${workOrderCode} được xóa thành công`,
                    (res) => toast.error(`Thao tác thất bại: ${res.response.data.detail}`),
                )
            },
        })
    }

    const handleEditWorkOrder = (e) => {
        setInitValue(activedItem)
        navigate("/orderDetails" + `/${activedItem.workOrderId}`)
    }

    return (
        <>
            <Card className={cl(" h-[6%] w-full flex justify-around items-center bg-neutron-4")}>
                <h3>Chọn chế độ truy xuất:</h3>
                <Button
                    onClick={() => {
                        setActiveLineAndRefPopup(true)
                    }}
                >
                    Truy xuất theo dây chuyền và mã Ref
                </Button>
                <Button className={cl("")} bg={"green"} onClick={() => setActiveOrderPopup(true)}>
                    Truy xuất theo lệnh sản xuất
                </Button>
            </Card>
            {activeLineAndRefPopup && (
                <div className="absolute h-full w-full flex justify-center z-100">
                    <Card className="h-[60%] w-[50%] flex flex-col justify-around bg-neutron-4 p-2 z-20">
                        <Card
                            className={cl(
                                " h-[7%] w-[5%] flex items-center justify-center cursor-pointer hover:bg-primary-4",
                            )}
                            onCLick={() => setActiveLineAndRefPopup(false)}
                        >
                            <h5>X</h5>
                        </Card>
                        <SelectInput
                            label="Line sản xuất"
                            list={lineOrder}
                            id={1}
                            value={filterLineOrder}
                            setValue={setFilterLineOrder}
                            canSearch={true}
                            mutilChoises={false}
                            className={" h-[10%] w-full"}
                        />
                        <SelectInput
                            label="Mã Ref"
                            list={refOrder}
                            id={2}
                            value={filterRefOrder}
                            setValue={setFilterRefOrder}
                            canSearch={true}
                            mutilChoises={false}
                            className={" h-[10%] w-full"}
                        />
                        <DateInput
                            id="startDate"
                            label="Ngày bắt đầu"
                            value={searchStartTime}
                            setValue={setSearchStartTime}
                            type="dayStart"
                            dayCompare={searchEndTime}
                            inputType="date"
                            className={" h-[10%] w-full"}
                        />
                        <DateInput
                            id="endDate"
                            label="Ngày kết thúc"
                            value={searchEndTime}
                            setValue={setSearchEndTime}
                            type="dayEnd"
                            dayCompare={searchStartTime}
                            inputType="date"
                            className={" h-[10%] w-full"}
                        />
                        <Button onClick={handleSearchWorkOrderByLineAndRef}>
                            <FaSearch />
                        </Button>
                    </Card>
                </div>
            )}
            {activeOrderPopup && (
                <div className="absolute h-full w-full flex justify-center z-100">
                    <Card className="h-[60%] w-[50%] flex flex-col justify-around bg-neutron-4 p-2 z-20">
                        <Card
                            className={cl(
                                " h-[7%] w-[5%] flex items-center justify-center cursor-pointer hover:bg-primary-4",
                            )}
                            onCLick={() => setActiveOrderPopup(false)}
                        >
                            <h5>X</h5>
                        </Card>
                        <TextInput
                            id="Lệnh sản xuất"
                            label="Lệnh sản xuất"
                            value={LSXOrder}
                            setValue={setLSXOrder}
                            // isError={validateUsername}
                            // setValidateRows={setValidate}
                        />
                        <DateInput
                            id="startDate"
                            label="Ngày bắt đầu"
                            value={searchStartTime}
                            setValue={setSearchStartTime}
                            type="dayStart"
                            dayCompare={searchEndTime}
                            inputType="date"
                            className={" h-[10%] w-full"}
                        />
                        <DateInput
                            id="endDate"
                            label="Ngày kết thúc"
                            value={searchEndTime}
                            setValue={setSearchEndTime}
                            type="dayEnd"
                            dayCompare={searchStartTime}
                            inputType="date"
                            className={" h-[10%] w-full"}
                        />
                        <Button onClick={handleSearchWorkOrderByLSXOrder}>
                            <FaSearch />
                        </Button>
                    </Card>
                </div>
            )}
            <Card className=" h-[6%] w-full flex justify-around items-center bg-neutron-4">
                <h5>Line:</h5>
                <h7>
                    {lineInfor.length > 0 && filterLineOrder.length > 0
                        ? lineInfor.find((line) => filterLineOrder[0] === line.lineId).lineName
                        : ""}
                </h7>
                <h5>Mã Ref</h5>
                <h7>{filterRefOrder} </h7>
                <h5>Lệnh sản xuất</h5>
                <h7>{LSXOrder} </h7>
                <h5>Khoảng thời gian từ:</h5>
                <h7>
                    {dateFormatRenderVi(searchStartTime)} đến {dateFormatRenderVi(searchEndTime)}
                </h7>
            </Card>
            <Card className={" h-[80%] w-full overflow-y-scroll"}>
                <Table
                    activable
                    primary
                    sticky
                    headers={orders_headers}
                    body={handleDataParamter(filteredOrderlist)} //mảng dữ liệu
                    className=" bg-neutron-4"
                    onEdit={handleEditWorkOrder}
                    onRowClick={handleTableRowClickOrder}
                    onDeleteRow={handleDeleteOrder}
                    hightlight
                    colors={{
                        status: {
                            "Hoàn thành": "bg-[rgba(60,179,113,0.85)] rounded-lg",
                            "Chờ xử lý": "bg-[rgba(233,34,34,0.85)] rounded-lg",
                            "Đang tiến hành": "bg-[rgba(0,155,250,0.85)] rounded-lg",
                            "Tạm dừng": "bg-[rgba(250,175,36,0.85)] rounded-lg",
                        },
                    }}
                />
                {deleteConfirm.actived && (
                    <Confirm
                        title={deleteConfirm.title}
                        content={deleteConfirm.content}
                        onConfirm={deleteConfirm.onConfirm}
                        onClose={() => setDeleteConfirm({ actived: false })}
                    />
                )}
            </Card>
        </>
    )
}

export default ParamaterSettingManageOrder
