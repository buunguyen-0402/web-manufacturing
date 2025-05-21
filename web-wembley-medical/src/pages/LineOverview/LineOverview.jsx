import { useState, useEffect, useCallback, useContext } from "react"
import { ThemeContext } from "@/hooks"
import { useCallApi } from "@/hooks"
import { useParams } from "react-router-dom"
import { machineApi } from "@/services/api"
import Card from "@/components/Card"
import { ColumnChart } from "@/components/Chart"
import cl from "classnames"
import { ColorStatus, toggleErrorLineMachine } from "@/utils/constants"
import { ListTagIdSignalRLineMachine } from "@/utils/listTagName"
import { LineChart } from "@/components/Chart"
import { convertDateFormatRenderName, convertDateFormat, convertDateFormatRenderNameWithDay } from "@/utils/functions"
import Radialbar from "@/components/Radialbar"
import { useNavigate } from "react-router-dom"
import Button from "@/components/Button"
import TextInput from "@/components/TextInput"
import Table from "@/components/Table"
import ToggleButtons from "@/components/ToggleButtons"
import { FaSearch } from "react-icons/fa"
import { IoMdCloseCircleOutline } from "react-icons/io"
import { errorWorkOrder_headers } from "@/utils/tableColumns"
import { handleDataError } from "@/utils/functions"

function LineOverview() {
    const param = useParams()
    const callApi = useCallApi()
    const navigate = useNavigate()

    const { connection } = useContext(ThemeContext)

    const [totalData, setTotalData] = useState()
    const [shotsData, setShotsData] = useState([])
    const [lineInfor, setLineInfor] = useState([])
    const [stationList, setStationList] = useState([])
    const [arrayData, setArrayData] = useState([])
    const [arrayBuffer, setArrayBuffer] = useState([])
    const [timeStatus, setTimeStatus] = useState()
    const [minute, setMinute] = useState(20)
    const [detail, setDetail] = useState(20)
    const [arrayProductivity, setArrayProductivity] = useState([])
    const [arrayOEE, setArrayOEE] = useState([])

    const [data, setData] = useState()
    const [errorData, setErrorData] = useState([])
    const [mode, setMode] = useState(0)

    const [errorPopup, setErrorPopup] = useState(false)
    const [errorTable, setErrorTable] = useState([])
    const [errorNameList, setErrorNameList] = useState([])
    const [errorDataList, setErrorDataList] = useState([])
    const [errorTimeList, setErrorTimeList] = useState([])
    const [productErrorList, setProductErrorList] = useState([])

    useEffect(() => {
        callApi(
            () => machineApi.line.getLineByLineId(param.lineId),
            (res) => {
                setLineInfor(res.data[0])
                setStationList(res.data[0].stations)
                // setArrayData(
                //     ListTagIdSignalRLineMachine(
                //         param.lineId,
                //         res.data[0].stations.map((res) => res.stationId),
                //     ),
                // )
                // setArrayBuffer(res.data[0].stations.map((res) => res.stationId))
            },
        )
    }, [])

    const fetchData = useCallback(() => {
        callApi(
            [
                machineApi.workOrders.getWorkOrdersByStatus(1),
                // machineApi.shots.getWorkOrderShotAndInterval(totalData.workOrderId, minute),
            ],
            (res) => {
                setTotalData(res[0].data.workOrders.find((res) => String(res.lineId) === String(param.lineId)))
                // setShotsData(res[1].data)
            },
        )
    }, [callApi])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchData()
        }, 60000)

        return () => clearInterval(intervalId)
    }, [fetchData])

    useEffect(() => {
        if (totalData) {
            callApi(
                [
                    // machineApi.currentStatus.getTimeStatusWorkOrder(totalData.workOrderId),
                    machineApi.shots.getWorkOrderShotAndInterval(totalData.workOrderId, minute),
                    // machineApi.shots.getWorkOrderShotAndInterval(totalData.workOrderId, minute),
                ],
                (res) => {
                    // setTimeStatus(res[0].data)
                    setArrayProductivity(
                        res[0].data.map((res) => ({ y: res.productivity, x: String(res.timeStamp).slice(11, 19) })),
                    )
                    setArrayOEE(
                        res[0].data.map((res) => ({ y: res.oee.toFixed(1), x: String(res.timeStamp).slice(11, 19) })),
                    )
                    setShotsData(res[0].data)
                },
            )
        }
    }, [totalData, callApi, minute])

    // const fetchDataByKeyTag = useCallback(() => {
    //     if (connection && connection.state === "Connected" && arrayBuffer.length > 0) {
    //         try {
    //             connection.invoke("SendLineTagsAsync", param.lineId, ["machineStatus"]).then((res) => {
    //                 const test = JSON.parse(res)
    //                 test.forEach((res, index) => {
    //                     setData((prev) => {
    //                         const update = { ...prev, [res.TagId]: res }
    //                         return update
    //                     })
    //                 })
    //             })
    //         } catch (error) {
    //             console.log(error)
    //         }
    //     }
    // }, [connection, arrayBuffer])

    // const fetchDataSignalR = useCallback(async () => {
    //     if (connection && connection.state === "Connected" && arrayData.length > 0) {
    //         try {
    //             await connection.invoke("UpdateTopics", [`${param.lineId}/machineStatus`])
    //             connection.on("OnTagChanged", (res) => {
    //                 const obj = JSON.parse(res)
    //                 obj.forEach((res) => {
    //                     setData((prevData) => {
    //                         const updateData = { ...prevData, [res.TagId]: res }
    //                         return updateData
    //                     })
    //                 })
    //             })
    //             return () => {
    //                 connection.off("OnTagChanged")
    //             }
    //         } catch (error) {
    //             console.error("Error sending data via SignalR connection:", error)
    //         }
    //     }
    //     return null
    // }, [connection, param.lineId, arrayData])

    // const fetchDataError = useCallback(async () => {
    //     if (connection && connection.state === "Connected" && arrayBuffer.length > 0) {
    //         try {
    //             await connection.on(`OnLineErrorTagChanged/${param.lineId}`, (res) => {
    //                 const test = JSON.parse(res)
    //                 setErrorData(test)
    //             })
    //         } catch (error) {
    //             console.log(error)
    //         }
    //     }
    // }, [connection, param.stationId, arrayBuffer])

    // useEffect(() => {
    //     fetchDataByKeyTag()
    //     fetchDataSignalR()
    //     fetchDataError()
    // }, [fetchDataByKeyTag, fetchDataSignalR, fetchDataError])

    // useEffect(() => {
    //     const intervalIdEror = setInterval(() => {
    //         fetchDataError()
    //     }, 5000)

    //     return () => clearInterval(intervalIdEror)
    // }, [fetchDataError])

    const handleErrorPopup = () => {
        setErrorPopup(true)
        if (totalData) {
            callApi(
                () => machineApi.workOrders.getErrorByWorkOrderId(totalData.workOrderId),
                (res) => {
                    const formatData = handleDataError(res.data)
                    setErrorTable(formatData)
                    setErrorNameList(formatData.map((res) => res.stationId))
                    setErrorDataList(formatData.map((res) => res.totalError))
                    setProductErrorList(formatData.map((res) => res.totalProductErrors))
                    setErrorTimeList(formatData.map((res) => Number(res.totalErrorTimeStation).toFixed(0)))
                },
            )
        }
    }
    // console.log(arrayProductivity)
    return (
        <div className=" h-full w-full flex flex-col items-center justify-between ">
            <div className=" h-[49%] w-full flex items-center justify-between ">
                <div
                    className={cl(
                        " h-full w-[50%] flex justify-center items-center   ",
                        // ColorStatus[data && data["machineStatus"] ? Number(data["machineStatus"].TagValue) : 5].color,
                    )}
                >
                    <Card className={cl(" h-full w-full flex bg-neutron-4")}>
                        <div className=" h-full w-[63%] overflow-scroll">
                            <ColumnChart
                                height={"92%"}
                                width={"97%"}
                                name={"Sản lượng"}
                                unit={lineInfor.productUnit}
                                dataChartX={["Cỡ lô", "Sản xuất", "Đạt", "Lỗi"]}
                                dataChartValue={[
                                    totalData && totalData["size"] ? totalData.size : 0,
                                    totalData && totalData["productCount"] ? totalData.productCount : 0,
                                    totalData && totalData["goodProduct"] ? totalData.goodProduct : 0,
                                    totalData && totalData["defectCount"] ? totalData.defectCount : 0,
                                ]}
                                fontSize={"1.2rem"}
                                nameY={false}
                                colors={[
                                    "rgba(1, 0, 140, 0.8)",
                                    "rgba(0,155,250,0.85)",
                                    "rgba(60,179,113,0.85)",
                                    "rgba(233,34,34,0.85)",
                                    "rgba(139,114,200,0.85)",
                                    "rgba(101,101,101,0.85)",
                                ]}
                            />
                        </div>
                        <div className=" h-full w-[37%] flex flex-col items-center justify-center ">
                            <div className=" h-[35%] w-full flex flex-grow flex-col p-1">
                                {/* <Card
                                    className={cl(
                                        " h-[20%] w-full flex items-center justify-center text-[3rem] font-bold",
                                        ColorStatus[
                                            data && data["machineStatus"] ? Number(data["machineStatus"].TagValue) : 5
                                        ].color,
                                    )}
                                >
                                    {" "}
                                    {
                                        ColorStatus[
                                            data && data["machineStatus"] ? Number(data["machineStatus"].TagValue) : 5
                                        ].name
                                    }
                                </Card> */}
                                <div className=" h-[95%] w-full flex items-center justify-center">
                                    <Radialbar
                                        value={totalData && totalData["q"] ? totalData.q * 100 : 0}
                                        labelName={"Chất lượng"}
                                        height={"120%"}
                                        width={"120%"}
                                        fontSize={"1.5rem"}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
                <Card
                    className={
                        " h-full w-[49%] bg-neutron-4 p-1 flex flex-col items-left overflow-y-scroll text-[1.1rem]"
                    }
                >
                    <h3>{lineInfor ? lineInfor.lineName : ""}</h3>
                    {/* <Button className={" h-[8%]"} onClick={() => navigate(`/machineOverview/${param.lineId}`)}>
                        Thông tin từng máy
                    </Button> */}
                    <div className="flex flex-col ">
                        <div className=" w-full h-full flex items-center">
                            <p className=" w-[30%]">Trưởng line:</p>
                            <h7 className=" w-[70%]">
                                {totalData && totalData["lineManager"] ? totalData.lineManager : ""}
                            </h7>
                        </div>
                        <div className=" w-full h-full flex items-center">
                            <p className=" w-[30%]">Lệnh sản xuất:</p>
                            <h7 className=" w-[70%]">
                                {totalData && totalData["workOrderCode"] ? totalData.workOrderCode : ""}
                            </h7>
                        </div>
                        <div className=" w-full h-full flex items-center ">
                            <p className=" w-[30%]">Tên sản phẩm:</p>
                            <h7 className=" w-[70%]">
                                {totalData && totalData["productName"] ? totalData.productName : ""}
                            </h7>
                        </div>
                        <div className=" w-full h-full flex items-center ">
                            <p className=" w-[30%]">Mã Ref:</p>
                            <h7 className=" w-[70%]">
                                {totalData && totalData["referenceCode"] ? totalData.referenceCode : ""}
                            </h7>
                        </div>
                        <div className=" w-full h-full flex items-center ">
                            <p className=" w-[30%]">Mã lô:</p>
                            <h7 className=" w-[70%]">{totalData && totalData["lotCode"] ? totalData.lotCode : ""}</h7>
                        </div>
                        <div className=" w-full h-[10%] flex items-center ">
                            <p className=" w-[30%]">Thời điểm bắt đầu:</p>
                            <h8 className=" w-[70%]">
                                {totalData && totalData["startTime"]
                                    ? convertDateFormat(totalData.startTime)
                                    : "Chưa bắt đầu"}
                            </h8>
                        </div>
                        <div className=" w-full h-[10%] flex items-center ">
                            <p className=" w-[30%]">Thời điểm kết thúc:</p>
                            <h9 className=" w-[70%]">
                                {totalData && totalData["endTime"]
                                    ? convertDateFormat(totalData.endTime)
                                    : "Chưa kết thúc"}
                            </h9>
                        </div>
                        <div className=" w-full h-[10%] flex items-center ">
                            <p className=" w-[30%]">Tổng thời gian:</p>
                            <h7 className=" w-[70%]">
                                {shotsData && shotsData.length > 0 && shotsData[shotsData.length - 1].totalOnTime}
                            </h7>
                        </div>
                        <div className=" w-full h-[10%] flex items-cente ">
                            <p className=" w-[30%]">Thời gian sản xuất:</p>
                            <h7 className=" w-[70%]">
                                {shotsData && shotsData.length > 0 && shotsData[shotsData.length - 1].totalRunTime}
                            </h7>
                        </div>
                    </div>
                </Card>
            </div>
            <div className=" h-[49%] w-full flex items-center justify-between ">
                <Card className={" h-full w-[50%] flex flex-col justify-left p-1 overflow-y-scroll bg-neutron-4"}>
                    <div className=" h-[10%] w-full flex justify-around">
                        <div className=" w-[50%] h-full flex items-center text-[1.25rem] border-2 border-primary-2 rounded-xl">
                            <p className=" w-[49%]">Năng suất hiện tại:</p>
                            <p className=" w-[51%] text-primary-2 font-bold">
                                {totalData && totalData["productivity"] ? totalData.productivity : ""}{" "}
                                {lineInfor && lineInfor["productUnit"] ? `${lineInfor.productUnit}/phút` : ""}
                            </p>
                        </div>
                        <div className=" h-full w-[40%] flex items-center">
                            <TextInput
                                id="Mức chi tiết"
                                label="Thời gian lấy mẫu"
                                value={detail}
                                setValue={setDetail}
                                // isError={validateUsername}
                                // setValidateRows={setValidate}
                                className={" h-full w-full"}
                            />
                            <p>phút</p>
                        </div>

                        <Button onClick={() => setMinute(detail)}>
                            <FaSearch />
                        </Button>
                    </div>
                    <div className=" h-[90%] w-[98%]">
                        <LineChart
                            height={"94%"}
                            width={"97%"}
                            name={"Giá trị"}
                            unit={`${lineInfor.productUnit}/phút`}
                            fontSize={"1.1rem"}
                            dataChartValue={arrayProductivity}
                        />
                    </div>
                </Card>
                <Card className={" h-full w-[49%] flex flex-col items-center p-1 bg-neutron-4"}>
                    {/* <h4>Biểu đồ OEE</h4> */}
                    {/* <div className=" h-[80%] w-full flex flex-col overflow-y-scroll">
                        {errorData.length > 0 ? (
                            errorData.map((res, index) => (
                                <h9 key={index} className="text-[red]">
                                    {res.StationId + " " + String(res.Timestamp).slice(11, 19) + " " + res.TagValue}
                                </h9>
                            ))
                        ) : (
                            <h9 className="">Không có lỗi</h9>
                        )}
                    </div>
                    <div className=" h-[10%] w-full">
                        <Button className={"h-full"} bg={"rgba(233,34,34,0.85)"} onClick={handleErrorPopup}>
                            Các lỗi xảy ra trong lúc lệnh đang sản xuất
                        </Button>
                    </div> */}
                    <div className=" h-[10%] w-full flex justify-around">
                        <div className=" w-[50%] h-full flex justify-around items-center text-[1.25rem] border-2 border-primary-2 rounded-xl">
                            <p className=" ">Giá trị OEE hiện tại:</p>
                            <p className="  text-primary-2 font-bold">
                                {totalData && totalData["productivity"] ? totalData.oee.toFixed(2) : ""}{" "}
                            </p>
                        </div>
                        <div className=" h-full w-[40%] flex items-center">
                            <TextInput
                                id="Mức chi tiết"
                                label="Thời gian lấy mẫu"
                                value={detail}
                                setValue={setDetail}
                                // isError={validateUsername}
                                // setValidateRows={setValidate}
                                className={" h-full w-full"}
                            />
                            <p>phút</p>
                        </div>

                        <Button onClick={() => setMinute(detail)}>
                            <FaSearch />
                        </Button>
                    </div>
                    <div className=" h-[90%] w-[98%]">
                        <LineChart
                            height={"94%"}
                            width={"97%"}
                            name={"Giá trị"}
                            unit={`${lineInfor.productUnit}/phút`}
                            fontSize={"1.1rem"}
                            dataChartValue={arrayOEE}
                        />
                    </div>
                </Card>
                {errorPopup && (
                    <Card
                        className={
                            " absolute left-[10%] top-[10%] h-[80%] w-[80%] flex flex-col justify-between bg-neutron-4 z-30"
                        }
                    >
                        <Button
                            bg={"rgba(233,34,34,0.85)"}
                            className={" h-[5%] w-[5%]"}
                            onClick={() => setErrorPopup(false)}
                        >
                            <IoMdCloseCircleOutline />
                        </Button>
                        <h2 className=" text-center">Các lỗi xảy ra khi sản xuất</h2>
                        <ToggleButtons
                            active={mode}
                            onClick={setMode}
                            titles={toggleErrorLineMachine}
                            CLassName={" h-[6%] w-full"}
                        />
                        <div className=" h-[80%] w-full overflow-y-scroll">
                            {mode === 0 && (
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
                            )}
                            {mode === 1 && (
                                <ColumnChart
                                    height={"90%"}
                                    width={"99%"}
                                    name={"Số lần lỗi"}
                                    dataChartX={[...errorNameList, "Lỗi sản phẩm"]}
                                    fontSize={"0.9rem"}
                                    unit={"Lần"}
                                    dataChartValue={[...errorDataList]}
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
                            )}
                            {mode === 2 && (
                                <ColumnChart
                                    height={"90%"}
                                    width={"99%"}
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
                            )}
                            {mode === 3 && (
                                <ColumnChart
                                    height={"90%"}
                                    width={"99%"}
                                    name={"Số lỗi"}
                                    dataChartX={errorNameList}
                                    fontSize={"0.9rem"}
                                    unit={"Lỗi"}
                                    dataChartValue={productErrorList}
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
                            )}
                        </div>
                    </Card>
                )}
            </div>
        </div>
    )
}
export default LineOverview
