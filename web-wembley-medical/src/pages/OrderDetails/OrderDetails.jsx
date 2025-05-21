import Card from "@/components/Card"
import Button from "@/components/Button"
import { useEffect, useState, useCallback } from "react"
import { useCallApi } from "@/hooks"
import TextInput from "@/components/TextInput"
import DateInput from "@/components/DateInput"
import { useNavigate, useParams } from "react-router-dom"
import { authorizationApi, machineApi } from "@/services/api"
import { toast } from "react-toastify"
import cl from "classnames"
import { FaSearch } from "react-icons/fa"
import Table from "@/components/Table"
import { ColumnChart, LineChart } from "@/components/Chart"
import { IoMdCloseCircleOutline } from "react-icons/io"
import ToggleButtons from "@/components/ToggleButtons"
import { handleManufacturingFilterData, handleDataError, convertDateFormatForReport } from "@/utils/functions"
import { errorWorkOrderDetail_headers, errorWorkOrder_headers, manuEachOrderReport_headers } from "@/utils/tableColumns"
import { toggleManufacturing } from "@/utils/constants"
import { useSelector } from "react-redux"

function OrderDetails() {
    const callApi = useCallApi()
    const param = useParams()
    const navigate = useNavigate()
    const user = useSelector((state) => state.auth)

    const [modeUpdate, setModeUpdate] = useState(false)
    const [allLine, setAllLine] = useState()
    const [workOrderProperties, setWorkOrderProperties] = useState([])
    const [productsList, setProductsList] = useState([])
    const [expectedStartTime, setExpectedStartTime] = useState()
    const [expectedEndTime, setExpectedEndTime] = useState()

    const [lotSize, setLotSize] = useState()
    const [productivity, setProductivity] = useState()
    const [detail, setDetail] = useState(15)
    const [minute, setMinute] = useState(15)
    const [errorPopup, setErrorPopup] = useState(false)
    const [modeInfor, setModeInfor] = useState(0)

    const [eachData, setEachData] = useState([])
    const [errorTable, setErrorTable] = useState([])
    const [errorNameList, setErrorNameList] = useState([])
    const [errorDataList, setErrorDataList] = useState([])
    const [errorTimeList, setErrorTimeList] = useState([])

    const [totalProductCount, setTotalProductCount] = useState()
    const [totalDefectCount, setTotalDefectCount] = useState()
    const [acceptRole, setAcceptRole] = useState()

    const fetchData = useCallback(() => {
        callApi(
            [
                machineApi.workOrders.getWorkOrdersByWorkOrderId(param.workOrderId),
                machineApi.product.getAllProducts(),
                machineApi.line.getAllLine(),
            ],
            (res) => {
                setWorkOrderProperties(res[0].data.workOrders[0])
                setProductsList(
                    res[1].data.find((item) => String(item.referenceCode) === res[0].data.workOrders[0].referenceCode),
                )
                setExpectedStartTime(res[0].data.workOrders[0].expectedStartTime)
                setExpectedEndTime(res[0].data.workOrders[0].expectedEndTime)
                setLotSize(res[0].data.workOrders[0].size)
                setProductivity(res[0].data.workOrders[0].expectProductivity)
                setAllLine(res[2].data)
            },
        )
    }, [callApi])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    useEffect(() => {
        if (param.workOrderId) {
            callApi(
                [
                    machineApi.shots.getWorkOrderShotAndInterval(param.workOrderId, minute),
                    machineApi.workOrders.getErrorByWorkOrderId(param.workOrderId),
                ],

                (res) => {
                    setEachData(handleManufacturingFilterData(res[0].data))
                    const formatData = handleDataError(res[1].data)
                    setErrorTable(formatData)
                    setErrorNameList(formatData.map((res) => res.stationId))
                    setErrorDataList(formatData.map((res) => res.totalError))
                    setErrorTimeList(formatData.map((res) => Number(res.totalErrorTimeStation).toFixed(0)))
                },
            )
        }
    }, [minute])

    const handleDetails = (row, index) => {
        // console.log(index)
        navigate("/paramater-setting")
    }
    const handleStart = () => {
        callApi(
            () =>
                machineApi.workOrders.patchStatusWorkOrders(workOrderProperties.workOrderId, {
                    workOrderId: workOrderProperties.workOrderId,
                    status: 1,
                }),
            fetchData,
            "Bắt đầu sản xuất",
            (res) => toast.error(res.response.data.message),
        )
    }
    const handlePause = () => {
        callApi(
            () =>
                machineApi.workOrders.patchStatusWorkOrders(workOrderProperties.workOrderId, {
                    workOrderId: workOrderProperties.workOrderId,
                    status: 2,
                }),
            fetchData,
            "Tạm dừng sản xuất",
            (res) => toast.error(res.response.data.message),
        )
    }
    const handleCountinue = () => {
        callApi(
            () =>
                machineApi.workOrders.patchStatusWorkOrders(workOrderProperties.workOrderId, {
                    workOrderId: workOrderProperties.workOrderId,
                    status: 1,
                }),
            fetchData,
            "Tiếp tục sản xuất",
            (res) => toast.error(res.response.data.message),
        )
    }

    const handleEnd = () => {
        callApi(
            () =>
                machineApi.workOrders.patchStatusWorkOrders(workOrderProperties.workOrderId, {
                    workOrderId: workOrderProperties.workOrderId,
                    status: 3,
                }),
            fetchData,
            "Kết thúc sản xuất",
            (res) => toast.error(res.response.data.message),
        )
    }

    const handleUpdateWorkOrder = () => {
        callApi(
            () =>
                machineApi.workOrders.patchWorkOrders({
                    workOrderId: workOrderProperties.workOrderId,
                    size: lotSize,
                    // expectProductivity: productivity,
                    expectStartDate: expectedStartTime,
                    expectEndDate: expectedEndTime,
                }),
            () => {
                fetchData()
                setModeUpdate(false)
            },
            "Cập nhật đơn hàng",
            (res) => toast.error(res.response.data.message),
        )
    }

    const handleDeleteLot = () => {
        navigate("/paramater-setting")
        callApi(
            () => machineApi.workOrders.deleteWorkOrders(workOrderProperties.workOrderId),
            fetchData,
            "Xóa đơn hàng",
        )
    }

    const handleChangeData = () => {
        if (totalDefectCount && totalProductCount) {
            callApi(
                () =>
                    machineApi.workOrders.postWorkOrderLastShot({
                        workOrderId: param.workOrderId,
                        productCount: totalProductCount,
                        defectCount: totalDefectCount,
                        // totalOnTime: totalOnTime,
                        // totalRunTime: totalRunTime,
                    }),
                () => {},
                "Cập nhật dữ liệu thành công",
            )
        } else toast.error("Cập nhật thất bại")
    }

    return (
        <>
            <div className=" h-full w-full flex flex-col justify-around text-[1.2rem] font-medium">
                <div className=" h-[8%] w-full flex justify-between p-2 z-20">
                    <Card
                        className={cl(
                            " h-full w-[6%] flex items-center justify-center cursor-pointer hover:bg-accent-1 bg-neutron-4",
                        )}
                        onCLick={handleDetails}
                    >
                        <h5>X</h5>
                    </Card>
                    <Card className=" h-full w-[92%] flex justify-around items-center bg-neutron-4">
                        <Button bg={"rgba(60,179,113,0.85)"} onClick={handleStart}>
                            Bắt đầu
                        </Button>
                        <Button bg={" rgba(233,34,34,0.85)"} onClick={handleEnd}>
                            Kết thúc
                        </Button>

                        <Button bg={"rgba(60,179,113,0.85)"} onClick={handleCountinue}>
                            Tiếp tục
                        </Button>

                        <Button bg={" rgba(250,175,36,0.85)"} onClick={handlePause}>
                            Tạm dừng
                        </Button>

                        <Button bg={""} onClick={() => setModeUpdate(!modeUpdate)}>
                            Chỉnh sửa thông tin
                        </Button>

                        <Button bg={"rgba(0,205,172,0.85)"} onClick={() => setErrorPopup(true)}>
                            Thông tin lệnh sản xuất
                        </Button>
                        {/* <Button bg={" rgba(233,34,34,0.85)"} onClick={handleDeleteLot}>
                            Xóa đơn sản xuất
                        </Button> */}
                    </Card>
                </div>

                <div className=" h-[90%] w-full flex justify-between p-2 overflow-y-scroll no-scrollbar">
                    <Card className=" h-full w-[49%] p-2 flex flex-col justify-around bg-neutron-4 overflow-y-scroll">
                        <h1 className=" text-center">Thông tin đơn sản xuất</h1>
                        <div className=" h-full w-full flex flex-col justify-around">
                            <div className=" w-full h-fit flex border-b-2 border-primary-3">
                                <p className=" w-[24%]">Mã Ref</p>
                                <h7>{workOrderProperties.referenceCode}</h7>
                            </div>
                            <div className=" w-full h-fit flex border-b-2 border-primary-3">
                                <p className=" w-[24%]">Line sản xuất</p>
                                <h7 className=" w-[76%]">
                                    {allLine
                                        ? allLine.find((line) => line.lineId === productsList.lineId).lineName
                                        : ""}
                                </h7>
                            </div>
                            <div className=" w-full h-fit flex border-b-2 border-primary-3">
                                <p className=" w-[24%]">Tên sản phẩm</p>
                                <h7 className=" w-[76%]">{productsList.name}</h7>
                            </div>
                            <div className=" w-full h-fit flex border-b-2 border-primary-3">
                                <p className=" w-[24%]">Ngày bắt đầu</p>
                                <h7 className=" w-[76%]">
                                    {convertDateFormatForReport(workOrderProperties.expectedStartTime)}
                                </h7>
                            </div>
                            <div className=" w-full h-fit flex border-b-2 border-primary-3">
                                <p className=" w-[24%]">Ngày kết thúc</p>
                                <h7 className=" w-[76%]">
                                    {convertDateFormatForReport(workOrderProperties.expectedEndTime)}
                                </h7>
                            </div>
                            <div className=" w-full h-fit flex border-b-2 border-primary-3">
                                <p className=" w-[24%]">Trưởng line</p>
                                <h7>{workOrderProperties.lineManager}</h7>
                            </div>
                            <div className=" w-full h-fit flex border-b-2 border-primary-3">
                                <p className=" w-[24%]">Lệnh sản xuất</p>
                                <h7>{workOrderProperties.workOrderCode}</h7>
                            </div>
                            <div className=" w-full h-fit flex border-b-2 border-primary-3">
                                <p className=" w-[24%]">Mã lô</p>
                                <h7>{workOrderProperties.lotCode}</h7>
                            </div>
                            <div className=" w-full h-fit flex border-b-2 border-primary-3">
                                <p className=" w-[24%]">Cỡ lô</p>
                                <h7>{workOrderProperties.size}</h7>
                            </div>
                            <div className=" w-full h-fit flex border-b-2 border-primary-3">
                                <p className=" w-[24%]">Năng suất dự kiến</p>
                                <h7>
                                    {workOrderProperties.expectProductivity}{" "}
                                    {allLine && workOrderProperties
                                        ? `${allLine.find((res) => res.lineId === workOrderProperties.lineId).productUnit}/phút`
                                        : ""}
                                </h7>
                            </div>
                            <div className=" w-full h-fit flex border-b-2 border-primary-3">
                                <p className=" w-[24%]">Người tạo đơn</p>
                                <h7>{workOrderProperties.createdBy}</h7>
                            </div>
                        </div>
                    </Card>
                    <div className=" h-full w-[49%] flex flex-col justify-between ">
                        <Card className=" h-full w-full p-2 flex flex-col justify-around bg-neutron-4 overflow-y-scroll">
                            <h1 className=" text-center">Thông số gần đây</h1>
                            <div className=" h-[92%] w-full flex flex-col justify-around">
                                <div className=" w-full h-fit flex border-b-2 border-primary-3">
                                    <p className=" w-[45%]">Thời điểm bắt đầu</p>
                                    <h7>
                                        {workOrderProperties && workOrderProperties.startTime
                                            ? convertDateFormatForReport(workOrderProperties.startTime)
                                            : "Chưa bắt đầu"}
                                    </h7>
                                </div>
                                <div className=" w-full h-fit flex border-b-2 border-primary-3">
                                    <p className=" w-[45%]">Thời điểm kết thúc</p>
                                    <h7>
                                        {workOrderProperties && workOrderProperties.endTime
                                            ? convertDateFormatForReport(workOrderProperties.endTime)
                                            : "Chưa kết thúc"}
                                    </h7>
                                </div>
                                <div className=" w-full h-fit flex border-b-2 border-primary-3">
                                    <p className=" w-[45%]">Tình trạng</p>
                                    <h7>{workOrderProperties.status}</h7>
                                </div>

                                <div className=" w-full h-fit flex border-b-2 border-primary-3">
                                    <p className=" w-[45%]">Sản lượng thực tế</p>
                                    <h7>
                                        {Number(workOrderProperties.goodProduct) +
                                            Number(workOrderProperties.defectCount)}
                                    </h7>
                                </div>
                                <div className=" w-full h-fit flex border-b-2 border-primary-3">
                                    <p className=" w-[45%]">Sản lượng đạt thực tế</p>
                                    <h7>{workOrderProperties.goodProduct}</h7>
                                </div>
                                <div className=" w-full h-fit flex border-b-2 border-primary-3">
                                    <p className=" w-[45%]">Sản lượng lỗi thực tế</p>
                                    <h7>{workOrderProperties.defectCount}</h7>
                                </div>
                                <div className=" w-full h-fit flex border-b-2 border-primary-3">
                                    <p className=" w-[45%]">Năng suất thực tế</p>
                                    <h7>
                                        {workOrderProperties.productivity}{" "}
                                        {allLine && workOrderProperties
                                            ? `${allLine.find((res) => res.lineId === workOrderProperties.lineId).productUnit}/phút`
                                            : ""}
                                    </h7>
                                </div>
                                <div className=" w-full h-fit flex border-b-2 border-primary-3">
                                    <p className=" w-[45%]">Hiệu suất thực tế (P)</p>
                                    <h7>{Number(workOrderProperties.p * 100).toFixed(2)}%</h7>
                                </div>
                                <div className=" w-full h-fit flex border-b-2 border-primary-3">
                                    <p className=" w-[45%]">Độ hữu dụng (A)</p>
                                    <h7>{Number(workOrderProperties.a * 100).toFixed(2)}%</h7>
                                </div>
                                <div className=" w-full h-fit flex border-b-2 border-primary-3">
                                    <p className=" w-[45%]">Chất lượng (Q)</p>
                                    <h7>{Number(workOrderProperties.q * 100).toFixed(2)}%</h7>
                                </div>
                                <div className=" w-full h-fit flex border-b-2 border-primary-3">
                                    <p className=" w-[45%]">OEE</p>
                                    <h7>{Number(workOrderProperties.oee * 100).toFixed(2)}%</h7>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
            {modeUpdate && (
                <>
                    <Card className="h-[77%] w-[40%] z-10 bg-neutron-3 absolute top-[18%] left-[30%] flex flex-col gap-[2%] p-2">
                        <h1 className="text-center">Cập nhật thông tin</h1>
                        {/* <TextInput
                            id="Lệnh sản xuất"
                            label="Lệnh sản xuất"
                            value={LSX}
                            setValue={setLSX}
                            // isError={validateUsername}
                            // setValidateRows={setValidate}
                        />

                        <TextInput
                            id="Mã lô"
                            label="Mã lô"
                            value={lotCode}
                            setValue={setLotCode}
                            // isError={validateUsername}
                            // setValidateRows={setValidate}
                        /> */}

                        <TextInput
                            id="Cỡ lô"
                            label="Cỡ lô"
                            value={lotSize}
                            setValue={setLotSize}
                            // isError={validateUsername}
                            // setValidateRows={setValidate}
                        />

                        {/* <TextInput
                            id="Năng suất định kiến"
                            label="Năng suất định kiến"
                            value={productivity}
                            setValue={setProductivity}
                            // isError={validateUsername}
                            // setValidateRows={setValidate}
                        /> */}
                        <DateInput
                            id="startDate"
                            label="Ngày bắt đầu"
                            value={expectedStartTime}
                            setValue={setExpectedStartTime}
                            type="dayStart"
                            dayCompare={expectedEndTime}
                            className={"text-primary-2"}
                        />
                        <DateInput
                            id="endDate"
                            label="Ngày kết thúc"
                            value={expectedEndTime}
                            setValue={setExpectedEndTime}
                            type="dayEnd"
                            dayCompare={expectedStartTime}
                            className={"text-primary-2"}
                        />
                        <Button onClick={handleUpdateWorkOrder}>Xác nhận</Button>
                        <Button bg={"red"} onClick={() => setModeUpdate(!modeUpdate)}>
                            Đóng
                        </Button>
                    </Card>
                </>
            )}
            {errorPopup && (
                <Card className=" absolute top-[10%] left-[1%] h-[85%] w-[98%] flex flex-col justify-between bg-neutron-4 z-20 p-1">
                    <Button
                        bg={"rgba(233,34,34,0.85)"}
                        className={"  h-[5%] w-[5%]"}
                        onClick={() => setErrorPopup(false)}
                    >
                        <IoMdCloseCircleOutline />
                    </Button>
                    <div className=" h-full w-full flex justify-between">
                        <div className=" h-full w-[74%] flex flex-col">
                            <div className=" h-[8%] w-full flex justify-around items-center">
                                <h3>Thông số trong quá trình sản xuất của lệnh:</h3>
                                <h4>{workOrderProperties ? workOrderProperties.workOrderCode : ""}</h4>
                                <div className=" h-full w-[30%]">
                                    <TextInput
                                        id="Mức chi tiết"
                                        label="Thời gian lấy mẫu"
                                        value={detail}
                                        setValue={setDetail}
                                        // isError={validateUsername}
                                        // setValidateRows={setValidate}
                                        className={" h-[90%] w-[40%]"}
                                    />
                                </div>
                                <h3>phút</h3>
                                <Button onClick={() => setMinute(detail)}>
                                    <FaSearch />
                                </Button>
                            </div>
                            <div className=" h-[87%] w-full flex flex-col justify-around items-center p-1">
                                <ToggleButtons
                                    active={modeInfor}
                                    onClick={setModeInfor}
                                    titles={toggleManufacturing}
                                    CLassName={" h-[7%] w-full"}
                                />
                                <div className=" h-[92%] w-full overflow-y-scroll">
                                    {modeInfor === 0 && (
                                        <Table
                                            activable
                                            primary
                                            sticky
                                            headers={manuEachOrderReport_headers}
                                            body={eachData[0]} //mảng dữ liệu
                                            className=" w-full"
                                            // onEdit={handleEdit}
                                            // onRowClick={handleTableRowClick}
                                            // onDeleteRow={handleDelete}
                                            // enableIdClick
                                            // idClickFunction={(e, row, index) => {
                                            //     console.log(row)
                                            //     navigate(`/setting/Test`, { state: row })
                                            // }}
                                        />
                                    )}
                                    {modeInfor > 0 && modeInfor < 6 && (
                                        <LineChart
                                            height={"94%"}
                                            width={"97%"}
                                            name={"Giá trị"}
                                            unit={``}
                                            fontSize={"1rem"}
                                            dataChartValue={eachData[1 + Number(modeInfor)]}
                                            dataChartTime={eachData[0]}
                                        />
                                    )}
                                    {modeInfor === 6 && (
                                        <div>
                                            <Table
                                                activable
                                                primary
                                                sticky
                                                headers={errorWorkOrder_headers}
                                                body={errorTable} //mảng dữ liệu
                                                className=" w-full"
                                                // onEdit={handleEdit}
                                                // onRowClick={handleTableRowClick}
                                                // onDeleteRow={handleDelete}
                                                // enableIdClick
                                                // idClickFunction={(e, row, index) => {
                                                //     console.log(row)
                                                //     navigate(`/setting/Test`, { state: row })
                                                // }}
                                            />
                                            <h3>Biểu đồ số lần lỗi</h3>
                                            <ColumnChart
                                                height={"20%"}
                                                width={"100%"}
                                                name={"Số lần lỗi"}
                                                dataChartX={errorNameList}
                                                fontSize={"0.9rem"}
                                                unit={"Lần"}
                                                dataChartValue={errorDataList}
                                                colors={[
                                                    // "rgba(1, 0, 140, 0.8)",
                                                    // "rgba(0,205,172,0.85)",
                                                    // "rgba(60,179,113,0.85)",
                                                    // "rgba(250,175,36,0.85)",
                                                    "rgba(233,34,34,0.85)",
                                                    // "rgba(139,114,200,0.85)",
                                                    // "rgba(101,101,101,0.85)",
                                                ]}
                                            />
                                            <h3>Biểu đồ thời gian lỗi</h3>
                                            <ColumnChart
                                                height={"20%"}
                                                width={"100%"}
                                                name={"Thời gian"}
                                                dataChartX={errorNameList}
                                                fontSize={"0.9rem"}
                                                unit={"Giây"}
                                                dataChartValue={errorTimeList}
                                                colors={[
                                                    // "rgba(1, 0, 140, 0.8)",
                                                    // "rgba(0,205,172,0.85)",
                                                    // "rgba(60,179,113,0.85)",
                                                    // "rgba(250,175,36,0.85)",
                                                    "rgba(233,34,34,0.85)",
                                                    // "rgba(139,114,200,0.85)",
                                                    // "rgba(101,101,101,0.85)",
                                                ]}
                                            />
                                            <h3>Lỗi chi tiết</h3>
                                            <Table
                                                activable
                                                primary
                                                sticky
                                                headers={errorWorkOrderDetail_headers}
                                                body={errorTable.flatMap((res) => res.eachError)} //mảng dữ liệu
                                                className=" w-full"
                                                // onEdit={handleEdit}
                                                // onRowClick={handleTableRowClick}
                                                // onDeleteRow={handleDelete}
                                                // enableIdClick
                                                // idClickFunction={(e, row, index) => {
                                                //     console.log(row)
                                                //     navigate(`/setting/Test`, { state: row })
                                                // }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className=" h-[90%] w-[0.2%] bg-primary-1"></div>
                        <div className=" h-full w-[25%] flex flex-col items-center">
                            <h2>Chỉnh sửa thông tin cuối cùng</h2>
                            <TextInput
                                id="Tổng sản lượng sản xuất"
                                label="Tổng sản lượng sản xuất"
                                value={totalProductCount}
                                setValue={setTotalProductCount}
                                // isError={validateUsername}
                                // setValidateRows={setValidate}
                                className={" h-[8%]"}
                            />
                            <TextInput
                                id="Sản lượng lỗi"
                                label="Sản lượng lỗi"
                                value={totalDefectCount}
                                setValue={setTotalDefectCount}
                                // isError={validateUsername}
                                // setValidateRows={setValidate}
                                className={" h-[8%]"}
                            />

                            <Button onClick={handleChangeData}> Xác nhận</Button>
                        </div>
                    </div>
                </Card>
            )}
        </>
    )
}
export default OrderDetails
