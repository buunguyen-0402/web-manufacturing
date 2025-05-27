import Card from "@/components/Card"
import SelectInput from "@/components/SelectInput"
import TextInput from "@/components/TextInput"
import Button from "@/components/Button"
import { useCallback, useState, useEffect } from "react"
import { useCallApi } from "@/hooks"
import DateInput from "@/components/DateInput"
import { timeStringToSeconds, secondsToTimeString } from "@/utils/functions"
import { authorizationApi, machineApi } from "@/services/api"
import { toast } from "react-toastify"
import { IoMdCloseCircleOutline } from "react-icons/io"
import Table from "@/components/Table"
import { manuHistoryShot_headers } from "@/utils/tableColumns"
import usePoperMenuNew from "@/hooks/usePoperMenuNew"
import PoperMenuNew from "@/components/PoperMenuNew"
import { editShots } from "@/utils/menuNavigation/updated"

function UpdatedData() {
    const callApi = useCallApi()
    const [line, setLine] = useState()
    const [lineName, setLineName] = useState("")
    const [allWorkOrder, setAllWorkOrder] = useState()
    const [workOrderList, setWorkOrderList] = useState([])
    const [workOrderName, setWorkOrderName] = useState("")
    const [curWorkOrder, setCurWorkOrder] = useState()
    const [expectedStartTime, setExpectedStartTime] = useState(() => {
        const now = new Date()
        now.setDate(now.getDate() - 7)
        return now.toISOString().slice(0, 16)
    })
    const [expectedEndTime, setExpectedEndTime] = useState(() => {
        const now = new Date()
        now.setDate(now.getDate() + 7)
        return now.toISOString().slice(0, 16)
    })
    const [productCount, setProductCount] = useState("")
    const [goodProduct, setGoodProduct] = useState("")
    const [totalOntime, setTotalOntime] = useState("")
    const [totalStoppingTime, setTotalStoppingTime] = useState("")
    const [timeStamp, setTimeStamp] = useState(() => {
        const now = new Date()
        now.setDate(now.getDate())
        return now.toISOString().slice(0, 16)
    })
    const [latestShot, setLatestShot] = useState()
    const [isOpenPopup, setIsOpenPopup] = useState(false)
    const [tableData, setTableData] = useState([])
    const [activedItem, setActivedItem] = useState(null)
    const { active, position, handleClose, handleOpen } = usePoperMenuNew(400)
    const [initValue, setInitValue] = useState() // dùng để chứa data đang chỉnh sửa, nếu = null thì đang tạo mục mới; undefined là bình thường
    const [control, setControl] = useState(false)
    const fectchData = useCallback(() => {
        callApi(
            [
                machineApi.line.getAllLine(),
                machineApi.workOrders.getWorkOrdersByStartTimeAndEndTime(expectedStartTime, expectedEndTime),
            ],
            (res) => {
                setAllWorkOrder(res[1].data)
                setWorkOrderList(
                    res[1].data.workOrders.map((item) => ({ key: item.workOrderCode, value: item.workOrderCode })),
                )
                setLine(res[0].data.map((item) => ({ key: item.lineName, value: item.lineId })))
            },
            "Truy xuất thành công",
            (res) => {
                toast.error(res.response)
            },
        )
    }, [callApi])
    useEffect(() => {
        fectchData()
    }, [fectchData])
    useEffect(() => {
        if (curWorkOrder) {
            callApi(
                () => machineApi.shots.getWorkOrderShotById(curWorkOrder.workOrderId),
                (res) => {
                    // cach lay du lieu cuoi cung cua mang
                    setLatestShot(res.data[res.data.length - 1])
                },
                "Truy xuất thành công",
                (res) => {
                    toast.error(res.response)
                },
            )
        }
    }, [curWorkOrder, control])
    useEffect(() => {
        if (isOpenPopup && curWorkOrder) {
            callApi(
                () => machineApi.shots.getWorkOrderShotAndInterval(curWorkOrder.workOrderId),
                (res) => {
                    setTableData(
                        res.data.map((item) => {
                            return {
                                ...item,
                                workOrderCode: curWorkOrder.workOrderCode,
                                goodProduct: item.productCount - item.defectCount,
                                totalStoppingTime: secondsToTimeString(
                                    timeStringToSeconds(item.totalOnTime) - timeStringToSeconds(item.totalRunTime),
                                ),
                                // timeStamp: convertOverDayDateFormatRender(item.timeStamp),
                            }
                        }),
                    )
                },
                "Truy xuất thành công",
                (res) => {
                    toast.error(res.response)
                },
            )
        }
    }, [isOpenPopup, control])
    const handleAddShot = () => {
        callApi(
            () =>
                machineApi.workOrders.postWorkOrderShot({
                    workOrderId: curWorkOrder.workOrderId,
                    productCount: Number(productCount),
                    goodProduct: Number(goodProduct),
                    totalOntime: totalOntime,
                    totalStoppingTime: totalStoppingTime,
                    timeStamp: timeStamp,
                }),
            (res) => {
                setControl(!control)
            },
            "Cập nhật thông tin thành công",
            (res) => toast.error(res.response),
        )
    }
    const handleChangeWorkOrderName = (value) => {
        setWorkOrderName(value)
        setCurWorkOrder(allWorkOrder.workOrders.find((item) => item.workOrderCode === value[0]))
    }
    const handleSearch = () => {
        console.log(lineName[0])
        callApi(
            () =>
                machineApi.workOrders.getWorkOrdersByLineIdAndStartTimeAndEndTime(
                    lineName[0] ? lineName[0] : "",
                    expectedStartTime,
                    expectedEndTime,
                ),
            (res) => {
                setAllWorkOrder(res.data)
                setWorkOrderList(
                    res.data.workOrders.map((item) => ({ key: item.workOrderCode, value: item.workOrderCode })),
                )
            },
            "Truy xuất thành công",
            (res) => {
                toast.error(res.response)
            },
        )
    }
    const handleTableRowClick = (row, index) => {
        const activedRow = tableData[index]
        setActivedItem(activedRow)
    }
    const handleEdit = (e) => {
        setInitValue({ info: activedItem })
        handleOpen(e)
    }
    const handleSubmit = (value) => {
        let data
        let callApiFunction
        let successMessage

        data = value.info
        console.log(data)
        callApiFunction = machineApi.shots.patchShots({
            shotId: activedItem.shotId,
            productCount: Number(data.productCount),
            defectCount: Number(data.productCount) - Number(data.goodProduct),
            totalOntime: data.totalOnTime,
            totalStoppingTime: data.totalStoppingTime,
            timeStamp: data.timeStamp,
        })
        successMessage = "Chỉnh sửa line máy thành công"
        callApi(
            () => callApiFunction,
            () => {
                setControl(!control)
            },
            successMessage,
        )
    }
    return (
        <div className="flex flex-col gap[3%] justify-around h-full w-full ">
            <Card className="flex flex-col gap-[3%] w-full h-[14%] justify-between items-center p-2">
                <div className="flex w-full h-[48%] justify-between items-center">
                    <SelectInput
                        label="Chọn line sản xuất"
                        list={line}
                        id={2}
                        value={lineName}
                        setValue={setLineName}
                        canSearch={true}
                        mutilChoises={false}
                        className={" h-[80%] w-[35%]"}
                    />
                    <DateInput
                        id="startDate"
                        label="Ngày bắt đầu"
                        value={expectedStartTime}
                        setValue={setExpectedStartTime}
                        type="dayStart"
                        dayCompare={expectedEndTime}
                        className={" h-[80%] w-[25%]"}
                    />
                    <DateInput
                        id="endDate"
                        label="Ngày kết thúc"
                        value={expectedEndTime}
                        setValue={setExpectedEndTime}
                        type="dayEnd"
                        dayCompare={expectedStartTime}
                        className={" h-[80%] w-[25%]"}
                    />
                    <Button onClick={handleSearch}>Truy xuất</Button>
                </div>
                <div className="flex w-full h-[48%] justify-between items-center">
                    <SelectInput
                        label="Chọn lệnh sản xuất"
                        list={workOrderList}
                        id={2}
                        value={workOrderName}
                        setValue={handleChangeWorkOrderName}
                        canSearch={true}
                        mutilChoises={false}
                        className={" h-[80%] w-[35%]"}
                    />
                    <div className=" w-[20%] h-[80%] flex justify-around items-center">
                        <h6>Mã Ref: </h6>
                        <h7>{curWorkOrder ? curWorkOrder.referenceCode : ""}</h7>
                    </div>
                    <div className=" w-[20%] h-[80%] flex justify-around items-center">
                        <h6>Trạng thái: </h6>
                        <h7>{curWorkOrder ? curWorkOrder.status : ""}</h7>
                    </div>
                    <div className=" w-[20%] h-[80%] flex justify-around items-center">
                        <h6>Sản lượng dự kiến: </h6>
                        <h7>{curWorkOrder ? curWorkOrder.size : ""}</h7>
                    </div>
                </div>
            </Card>
            <div className="flex gap-[1%] w-full h-[80%] justify-between items-center">
                <Card className="w-[49%] h-full flex flex-col justify-between items-center p-2">
                    <h2 className=" text-center">Nhập thông tin sản xuất</h2>
                    <TextInput
                        id="Tổng sản lượng"
                        label="Tổng sản lượng"
                        value={productCount}
                        setValue={setProductCount}
                        // isError={validateUsername}
                        // setValidateRows={setValidate}
                    />
                    <TextInput
                        id="Sản phẩm đạt"
                        label="Sản phẩm đạt"
                        value={goodProduct}
                        setValue={setGoodProduct}
                        // isError={validateUsername}
                        // setValidateRows={setValidate}
                    />
                    <TextInput
                        id="Thời gian máy ON"
                        label="Thời gian máy ON"
                        value={totalOntime}
                        setValue={setTotalOntime}
                        // isError={validateUsername}
                        // setValidateRows={setValidate}
                    />
                    <TextInput
                        id="Thời gian máy OFF"
                        label="Thời gian máy OFF"
                        value={totalStoppingTime}
                        setValue={setTotalStoppingTime}
                        // isError={validateUsername}
                        // setValidateRows={setValidate}
                    />
                    <DateInput
                        id="updateTime"
                        type="updateTime"
                        label="Thời gian cập nhật"
                        value={timeStamp}
                        setValue={setTimeStamp}
                        className={" w-full"}
                    />
                    <Button onClick={handleAddShot}>Cập nhật thông tin</Button>
                </Card>
                <Card className="w-[49%] h-full justify-between items-center p-2">
                    <div className=" h-full w-full flex flex-col justify-between  items-center">
                        <h2 className=" text-center">Thông số gần đây</h2>
                        <div className=" w-full   flex items-center border-b-2 border-primary-3">
                            <p className=" w-[30%]">Tổng sản lượng</p>
                            <h7 className=" w-[70%]">{latestShot ? latestShot.productCount : ""}</h7>
                        </div>
                        <div className=" w-full  flex items-center border-b-2 border-primary-3">
                            <p className=" w-[30%]">Sản phẩm đạt</p>
                            <h7 className=" w-[70%]">
                                {latestShot ? latestShot.productCount - latestShot.defectCount : ""}
                            </h7>
                        </div>
                        <div className=" w-full  flex items-center border-b-2 border-primary-3">
                            <p className=" w-[30%]">Thời gian máy ON</p>
                            <h7 className=" w-[70%]">{latestShot ? latestShot.totalRunTime : ""}</h7>
                        </div>
                        <div className=" w-full  flex items-center border-b-2 border-primary-3">
                            <p className=" w-[30%]">Thời gian máy OFF</p>
                            <h7 className=" w-[70%]">
                                {latestShot
                                    ? secondsToTimeString(
                                          timeStringToSeconds(latestShot.totalOnTime) -
                                              timeStringToSeconds(latestShot.totalRunTime),
                                      )
                                    : ""}
                            </h7>
                        </div>
                        <div className=" w-full  flex items-center border-b-2 border-primary-3">
                            <p className=" w-[30%]">Thời gian cập nhật gần nhất</p>
                            <h7 className=" w-[70%]">{latestShot ? latestShot.timeStamp : ""}</h7>
                        </div>
                        <Button onClick={() => setIsOpenPopup(true)}>Lịch sử cập nhật dữ liệu</Button>
                    </div>
                </Card>
            </div>
            {isOpenPopup && (
                <Card className={"w-[98%] h-[85%] absolute top-[10%] bg-neutron-4 z-20 p-[1%] "}>
                    <div className="w-full h-[10%] flex ">
                        <Button
                            bg={"rgba(233,34,34,0.85)"}
                            className={"  h-[55%] w-[5%]"}
                            onClick={() => setIsOpenPopup(false)}
                        >
                            <IoMdCloseCircleOutline />
                        </Button>
                        <h2 className="block w-full text-center ">Lịch sử cập nhật dữ liệu</h2>
                    </div>
                    <Table
                        activable
                        primary
                        sticky
                        headers={manuHistoryShot_headers} //mảng tiêu đề
                        body={tableData} //mảng dữ liệu
                        className=" w-full"
                        onEdit={handleEdit}
                        onRowClick={handleTableRowClick}
                        // onDeleteRow={handleDelete}
                        enableIdClick
                        // idClickFunction={(e, row, index) => {
                        //     console.log(row)
                        //     navigate(`/setting/Test`, { state: row })
                        // }}
                    />
                </Card>
            )}
            {active && (
                <PoperMenuNew
                    position={position}
                    onClose={handleClose}
                    menuNavigaton={editShots()}
                    onClick={handleSubmit}
                    initValue={initValue ? initValue : undefined}
                    activateValidation={false}
                />
            )}
        </div>
    )
}
export default UpdatedData
