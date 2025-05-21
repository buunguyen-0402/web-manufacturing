import Card from "@/components/Card"
import SelectInput from "@/components/SelectInput"
import TextInput from "@/components/TextInput"
import Button from "@/components/Button"
import { useCallback, useState, useEffect } from "react"
import { useCallApi } from "@/hooks"
import DateInput from "@/components/DateInput"
import {
    convertDateFormatForReport,
    convertOverDayDateFormatRender,
    timeStringToSeconds,
    secondsToTimeString,
} from "@/utils/functions"
import { authorizationApi, machineApi } from "@/services/api"
import { toast } from "react-toastify"
import { set } from "date-fns"

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
    }, [curWorkOrder])
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
            (res) => {},
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
                        <h6>Sản lượng: </h6>
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
                    <h2 className=" text-center">Thông số gần đây</h2>
                    <div className=" h-[90%] w-full flex flex-col justify-around">
                        <div className=" w-full h-full flex items-center border-b-2 border-primary-3">
                            <p className=" w-[25%]">Tổng sản lượng</p>
                            <h7 className=" w-[75%]">{latestShot ? latestShot.productCount : ""}</h7>
                        </div>
                        <div className=" w-full h-full flex items-center border-b-2 border-primary-3">
                            <p className=" w-[25%]">Sản phẩm đạt</p>
                            <h7 className=" w-[75%]">
                                {latestShot ? latestShot.productCount - latestShot.defectCount : ""}
                            </h7>
                        </div>
                        <div className=" w-full h-full flex items-center border-b-2 border-primary-3">
                            <p className=" w-[25%]">Thời gian máy ON</p>
                            <h7 className=" w-[75%]">{latestShot ? latestShot.totalRunTime : ""}</h7>
                        </div>
                        <div className=" w-full h-full flex items-center border-b-2 border-primary-3">
                            <p className=" w-[25%]">Thời gian máy OFF</p>
                            <h7 className=" w-[75%]">
                                {latestShot
                                    ? secondsToTimeString(
                                          timeStringToSeconds(latestShot.totalOnTime) -
                                              timeStringToSeconds(latestShot.totalRunTime),
                                      )
                                    : ""}
                            </h7>
                        </div>
                        <div className=" w-full h-full flex items-center border-b-2 border-primary-3">
                            <p className=" w-[25%]">Thời gian cập nhật</p>
                            <h7 className=" w-[75%]">{latestShot ? latestShot.timeStamp : ""}</h7>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
export default UpdatedData
