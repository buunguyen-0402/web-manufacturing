import Card from "@/components/Card"
import { useState, useEffect, useCallback, useRef } from "react"
import { useReactToPrint } from "react-to-print"
import SelectInput from "@/components/SelectInput"
import DateInput from "@/components/DateInput"
import Button from "@/components/Button"
import cl from "classnames"
import { useNavigate } from "react-router-dom"
import { useCallApi } from "@/hooks"
import { authorizationApi, machineApi } from "@/services/api"
import { ColumnChart, GroupChart, PieDonutChart, ColumnExpectChart, LineChart } from "@/components/Chart"
import { FaSearch } from "react-icons/fa"
import Table from "@/components/Table"
import {
    manuReport_headers,
    manuEachOrderReport_headers,
    errorWorkOrder_headers,
    errorWorkOrderDetail_headers,
} from "@/utils/tableColumns"
import {
    handleManufacturingData,
    handleManufacturingDataProductivity,
    handleManufacturingOeeData,
    handleManufacturingFilterData,
    handleDataError,
    handleRefInfor,
    dateFormatRenderVi,
} from "@/utils/functions"
import ToggleButtons from "@/components/ToggleButtons"
import TextInput from "@/components/TextInput"
import { toggleManufacturing } from "@/utils/constants"
import { IoMdCloseCircleOutline } from "react-icons/io"
import logo from "@/assets/WembleyLogo.png"
import { useSelector } from "react-redux"

function ManufacturingReport() {
    const navigate = useNavigate()
    const callApi = useCallApi()
    const contentRef = useRef()
    const reactToPrintFn = useReactToPrint({ contentRef })
    const user = useSelector((state) => state.auth)

    const [allLine, setAllLine] = useState([])
    const [line, setLine] = useState([])
    const [lineName, setLineName] = useState("Line sản xuất")
    const [lineNameRender, setLineNameRender] = useState()
    const [expectedStartTime, setExpectedStartTime] = useState(() => {
        const now = new Date()
        now.setDate(now.getDate() - 7)
        return now.toISOString().slice(0, 10)
    })
    const [expectedEndTime, setExpectedEndTime] = useState(() => {
        const now = new Date()
        now.setDate(now.getDate() + 7)
        return now.toISOString().slice(0, 10)
    })
    const [productsList, setProductsList] = useState([])
    const [workOrderList, setWorkOrderList] = useState([])
    const [oeeOrderList, setOeeOrderList] = useState([])
    const [nameList, setNameList] = useState([])
    const [numberWorkOrder, setNumberWorkOrder] = useState([])
    const [productivityData, setProductivityData] = useState([])
    const [mode, setMode] = useState(0)
    const [modeInfor, setModeInfor] = useState(0)
    const [errorPopup, setErrorPopup] = useState(false)
    const [eachOrderInfor, setEachOrderInfor] = useState()
    const [unit, setUnit] = useState("")
    const [detail, setDetail] = useState(15)
    const [minute, setMinute] = useState(15)
    const [eachData, setEachData] = useState([])

    const [refInforData, setRefInforData] = useState()

    const [errorTable, setErrorTable] = useState([])
    const [errorNameList, setErrorNameList] = useState([])
    const [errorDataList, setErrorDataList] = useState([])
    const [errorTimeList, setErrorTimeList] = useState([])

    const [acceptRole, setAcceptRole] = useState()

    const fetchLineData = useCallback(() => {
        callApi(
            [machineApi.line.getAllLine()],
            (res) => {
                setAllLine(res[0].data)
                setLine(res[0].data.map((res) => ({ key: res.lineName, value: res.lineId })))
                // const filter = res[1].data.find((res) => String(res.roleName) === user.role).pages
                // setAcceptRole(
                //     filter.find(
                //         (res) => String(res.name) === "Báo cáo sản xuất" || String(res.name) === "Tất cả các trang",
                //     ),
                // )
            },
            "Truy xuất thành công",
        )
    }, [callApi])
    useEffect(() => {
        fetchLineData()
    }, [fetchLineData])
    useEffect(() => {
        if (eachOrderInfor) {
            callApi(
                [
                    machineApi.shots.getWorkOrderShotAndInterval(eachOrderInfor.workOrderId, minute),
                    machineApi.workOrders.getErrorByWorkOrderId(eachOrderInfor.workOrderId),
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
    }, [eachOrderInfor, minute])

    const handleLineChange = (selectedLine) => {
        setLineName(selectedLine)
        setLineNameRender(line.filter((res) => String(res.value) === String(selectedLine))[0])
        setUnit(allLine.filter((res) => String(res.lineId) === String(selectedLine))[0].productUnit)
    }
    const handleSearch = () => {
        callApi(
            () =>
                machineApi.workOrders.getWorkOrdersByLineIdAndStartTimeAndEndTime(
                    lineName,
                    expectedStartTime,
                    expectedEndTime,
                ),
            (res) => {
                const sortData = handleManufacturingData(
                    res.data.workOrders.sort((a, b) => b.workOrderCode.localeCompare(a.workOrderCode)),
                )
                const nameData = sortData.map((res) => res.workOrderCode)
                setProductsList(res.data)
                setProductivityData(handleManufacturingDataProductivity(sortData))
                setNumberWorkOrder([
                    sortData.filter((res) => String(res.result) === "Đạt").length,
                    sortData.filter((res) => String(res.result) === "Không đạt").length,
                    sortData.filter((res) => String(res.result) === "Lệnh chưa hoàn thành").length,
                ])
                setWorkOrderList([
                    { name: "Sản lượng đạt", data: sortData.map((res) => res.goodProduct) },
                    {
                        name: "Sản lượng lỗi",
                        data: sortData.map((res) => res.defectCount),
                    },
                ])
                setOeeOrderList(handleManufacturingOeeData(sortData))
                setNameList(nameData)
                setRefInforData(handleRefInfor(sortData))
            },
            "Truy xuất thành công",
        )
        setMode(0)
    }

    const handleTableRowClick = (e) => {
        setErrorPopup(true)
        setEachOrderInfor(e)
    }

    return (
        <div className=" h-[400%] w-full flex flex-col justify-between items-center">
            <Card className=" h-[1.5%] w-full flex justify-around items-center bg-neutron-4">
                <h3>Chọn chế độ truy xuất:</h3>
                <Button onClick={() => setMode(1)}>Truy xuất theo dây chuyền</Button>
                {/* <Button className={cl("")} bg={"green"} onClick={() => navigate("/manufacturing-report/productivity")}>
                    Truy xuất lệnh sản xuất từng ngày
                </Button> */}
                <Button
                    className={cl("")}
                    bg={"blue"}
                    onClick={() => navigate("/manufacturing-report/head-of-machineLine")}
                >
                    Truy xuất theo trưởng line
                </Button>
            </Card>
            {mode === 1 && (
                <div className="absolute h-full w-full flex justify-center z-100">
                    <Card className="h-[60%] w-[50%] flex flex-col justify-around bg-neutron-4 p-2 z-20">
                        <Card
                            className={cl(
                                " h-[7%] w-[5%] flex items-center justify-center cursor-pointer hover:bg-primary-4",
                            )}
                            onCLick={() => setMode(0)}
                        >
                            <h5>X</h5>
                        </Card>
                        <SelectInput
                            label="Line sản xuất"
                            list={line}
                            id={2}
                            value={lineName}
                            setValue={handleLineChange}
                            canSearch={true}
                            mutilChoises={false}
                            className={" h-[10%] w-full"}
                        />
                        <DateInput
                            id="startDate"
                            label="Ngày bắt đầu"
                            value={expectedStartTime}
                            setValue={setExpectedStartTime}
                            type="dayStart"
                            dayCompare={expectedEndTime}
                            inputType="date"
                            className={" h-[10%] w-full"}
                        />
                        <DateInput
                            id="endDate"
                            label="Ngày kết thúc"
                            value={expectedEndTime}
                            setValue={setExpectedEndTime}
                            type="dayEnd"
                            dayCompare={expectedStartTime}
                            inputType="date"
                            className={" h-[10%] w-full"}
                        />
                        <Button onClick={handleSearch}>
                            <FaSearch />
                        </Button>
                    </Card>
                </div>
            )}
            <Card className=" h-[1.5%] w-full flex justify-around items-center bg-neutron-4">
                <h5>Dây chuyền:</h5>
                <h7>{lineNameRender ? lineNameRender.key : ""}</h7>
                <h5>Tổng lệnh sản xuất:</h5>
                <h7>{productsList["workOrders"] ? productsList.workOrders.length : 0} </h7>
                <h5>Khoảng thời gian từ:</h5>
                <h7>
                    {dateFormatRenderVi(expectedStartTime)} đến {dateFormatRenderVi(expectedEndTime)}
                </h7>

                <Button onClick={() => reactToPrintFn()}>Xuất báo cáo</Button>
            </Card>
            <Card className={" h-[21.5%] w-full justify-center items-center bg-neutron-4"}>
                <h1 className=" text-center h-[9%]">Tổng quan thông tin các lệnh sản xuất</h1>
                <div className=" h-[91%] w-full overflow-scroll">
                    <Table
                        activable
                        primary
                        sticky
                        headers={manuReport_headers}
                        body={
                            productsList && productsList["workOrders"]
                                ? handleManufacturingData(productsList.workOrders)
                                : []
                        } //mảng dữ liệu
                        className=" w-[200%]"
                        columnSticky={0}
                        hightlight
                        colors={{
                            status: {
                                "Hoàn thành": "bg-[rgba(60,179,113,0.85)] rounded-lg",
                                "Chờ xử lý": "bg-[rgba(233,34,34,0.85)] rounded-lg",
                                "Đang tiến hành": "bg-[rgba(0,155,250,0.85)] rounded-lg",
                                "Tạm dừng": "bg-[rgba(250,175,36,0.85)] rounded-lg",
                            },
                            result: {
                                Đạt: "bg-[rgba(60,179,113,0.85)] rounded-lg",
                                "Không đạt": "bg-[rgba(233,34,34,0.85)] rounded-lg",
                                "Lệnh chưa hoàn thành": "bg-[rgba(250,175,36,0.85)] rounded-lg ",
                            },
                            productivityPrepare: {
                                Đạt: "bg-[rgba(60,179,113,0.85)] rounded-lg",
                                "Không đạt": "bg-[rgba(233,34,34,0.85)] rounded-lg",
                            },
                        }}
                        // onEdit={handleEdit}
                        onRowClick={handleTableRowClick}
                        // onDeleteRow={handleDelete}
                        // enableIdClick
                        // idClickFunction={(e, row, index) => {
                        //     console.log(row)
                        //     navigate(`/setting/Test`, { state: row })
                        // }}
                    />
                </div>
            </Card>

            <div
                className=" h-[74.5%] w-full flex flex-col justify-between print:border-2 print:flex-col print:gap-2"
                ref={contentRef}
            >
                <div className=" h-[20%] w-full hidden print:block">
                    <div className=" flex ">
                        <div className=" w-[40%] flex justify-center items-center border-b-2 p-1">
                            <img src={logo} alt="Logo" className="" />
                        </div>
                        <div className=" w-[0.2%] flex justify-center items-center border-b-2 bg-neutron-1"></div>

                        <div className=" w-[59%] flex flex-col justify-center items-center border-b-2 bg-neutron-4">
                            <h1>BÁO CÁO SẢN XUẤT THEO DÂY CHUYỀN</h1>
                            <div className=" flex justify-center w-full">
                                <h5 className=" w-[20%]">Dây chuyền:</h5>
                                <h7 className="w-[48%]">{lineNameRender ? lineNameRender.key : ""}</h7>
                            </div>
                            <div className=" flex justify-center w-full">
                                <h5 className=" w-[20%]">Ngày bắt đầu:</h5>
                                <h7 className=" w-[48%]">{dateFormatRenderVi(expectedStartTime)}</h7>
                            </div>
                            <div className=" flex justify-center w-full">
                                <h5 className=" w-[20%]">Ngày kết thúc:</h5>
                                <h7 className=" w-[48%]">{dateFormatRenderVi(expectedEndTime)}</h7>
                            </div>
                            <div className=" flex justify-center w-full">
                                <h5 className=" w-[20%]">Tổng lệnh sản xuất:</h5>
                                <h7 className=" w-[48%]">
                                    {productsList["workOrders"] ? productsList.workOrders.length : 0}{" "}
                                </h7>
                            </div>
                        </div>
                    </div>
                </div>
                <div className=" h-[16.3%] w-full flex justify-between print:mt-[1%] break-after">
                    <Card className=" h-full w-[25%] flex flex-col justify-around items-center p-1 bg-neutron-4">
                        <h5>Các lệnh sản xuất</h5>
                        <div className=" h-[70%] w-full">
                            <PieDonutChart
                                height={"100%"}
                                width={"100%"}
                                name={" "}
                                label={"Tổng lệnh"}
                                fontSize={"1rem"}
                                unit={"Lệnh sản xuất"}
                                dataChartLabels={["Đạt tiến độ", "Chậm tiến độ", "Lệnh chưa hoàn thành"]}
                                dataChartValue={numberWorkOrder}
                                arrayColors={["rgba(60,179,113,0.85)", "rgba(233,34,34,0.85)", "rgba(250,175,36,0.85)"]}
                            />
                        </div>
                        <div className=" h-[25%] w-full flex flex-col justify-around items-center">
                            <div className=" w-full h-fit flex border-b border-primary-2">
                                <h5 className=" w-[80%]">Các lệnh đạt tiến độ:</h5>
                                <h8>{numberWorkOrder[0]}</h8>
                            </div>
                            <div className=" w-full h-fit flex border-b border-primary-2">
                                <h5 className=" w-[80%]">Các lệnh không đạt tiến độ:</h5>
                                <h9 className=" ">{numberWorkOrder[1]}</h9>
                            </div>
                            <div className=" w-full h-fit flex border-b border-primary-2">
                                <h5 className=" w-[80%]">Các lệnh chưa hoàn thành tiến độ:</h5>
                                <h6 className=" ">{numberWorkOrder[2]}</h6>
                            </div>
                        </div>
                    </Card>
                    <Card className=" h-full w-[22%] flex flex-col justify-around items-center p-1 overflow-y-scroll bg-neutron-4">
                        <div className=" w-full h-fit flex border-b border-primary-2">
                            <h5 className=" w-[55%]">Đơn vị:</h5>
                            <h5>{unit}</h5>
                        </div>
                        <div className=" w-full h-fit flex border-b border-primary-2">
                            <h5 className=" w-[55%]">Sản lượng kế hoạch:</h5>
                            <h6>{productsList.totalProductSize}</h6>
                        </div>
                        <div className=" w-full h-fit flex border-b border-primary-2">
                            <h5 className=" w-[55%]">Sản lượng sản xuất:</h5>
                            <h7>{productsList.totalProductCount}</h7>
                        </div>
                        <div className=" w-full h-fit flex border-b border-primary-2">
                            <h5 className=" w-[55%]">Sản lượng đạt:</h5>
                            <h8 className=" ">{productsList.totalGoodProduct}</h8>
                        </div>
                        <div className=" w-full h-fit flex border-b border-primary-2">
                            <h5 className=" w-[55%]">Sản lượng lỗi:</h5>
                            <h9 className=" ">{productsList.totalDefectProduct}</h9>
                        </div>
                    </Card>

                    <Card className=" h-full w-[25%] flex flex-col justify-around items-center bg-neutron-4">
                        <h5>Tỉ lệ sản lượng sản xuất</h5>
                        <div className={cl(" h-full w-full")}>
                            <PieDonutChart
                                height={"100%"}
                                width={"100%"}
                                name={""}
                                label={"Tổng sản lượng"}
                                fontSize={"1rem"}
                                unit={unit}
                                dataChartLabels={["Sản lượng đạt", "Sản lượng lỗi"]}
                                dataChartValue={[
                                    productsList && productsList["totalGoodProduct"]
                                        ? Number(productsList.totalGoodProduct)
                                        : 0,
                                    productsList && productsList["totalDefectProduct"]
                                        ? Number(productsList.totalDefectProduct)
                                        : 0,
                                ]}
                                arrayColors={["rgba(60,179,113,0.85)", "rgba(233,34,34,0.85)"]}
                            />
                        </div>
                    </Card>
                    <Card className=" h-full w-[25%] flex flex-col justify-around items-center bg-neutron-4">
                        <h5>Biểu đồ sản lượng sản xuất ({unit})</h5>
                        <div className=" h-full w-full">
                            <ColumnChart
                                height={"99%"}
                                width={"99%"}
                                name={"Sản lượng"}
                                fontSize={"1rem"}
                                nameY={false}
                                unit={unit}
                                dataChartX={["Kế hoạch", "Sản xuất", "Đạt", "Lỗi"]}
                                dataChartValue={[
                                    Number(
                                        productsList && productsList["totalProductSize"]
                                            ? productsList.totalProductSize
                                            : 0,
                                    ),
                                    Number(
                                        productsList && productsList["totalProductCount"]
                                            ? productsList.totalProductCount
                                            : 0,
                                    ),
                                    Number(
                                        productsList && productsList["totalGoodProduct"]
                                            ? productsList.totalGoodProduct
                                            : 0,
                                    ),
                                    Number(
                                        productsList && productsList["totalDefectProduct"]
                                            ? productsList.totalDefectProduct
                                            : 0,
                                    ),
                                ]}
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
                    </Card>
                </div>

                <Card
                    className={
                        "h-[16.3%] w-full flex flex-col justify-around items-center bg-neutron-4 overflow-x-scroll "
                    }
                >
                    <h5>Biểu đồ sản lượng đạt và lỗi từng lệnh sản xuất ({unit})</h5>
                    <div className=" h-full w-full overflow-scroll">
                        <GroupChart
                            height={"94%"}
                            width={"99%"}
                            unit={unit}
                            fontSize={"1rem"}
                            nameY={false}
                            dataChartX={nameList}
                            dataChartValue={workOrderList}
                            colors={["rgba(60,179,113,0.85)", "rgba(233,34,34,0.85)"]}
                        />
                    </div>
                </Card>
                <Card className=" h-[16.3%] w-full flex flex-col justify-around items-center bg-neutron-4 overflow-x-scroll ">
                    <h5>Biểu đồ năng suất sản xuất ({unit} / phút)</h5>
                    <div className=" h-full w-full rounded-xl ">
                        {/* <StackedColumnChart
                                height={"94%"}
                                width={"100%"}
                                name={"Sản lượng"}
                                fontSize={"0.9rem"}
                                unit={unit}
                                dataChartX={nameList}
                                dataChartValue={workOrderList}
                                colors={["rgba(60,179,113,0.85)", "rgba(233,34,34,0.85)"]}
                            /> */}

                        <ColumnExpectChart
                            height={"94%"}
                            width={"99%"}
                            unit={""}
                            fontSize={"1rem"}
                            nameY={false}
                            dataChartX={["Năng suất sản xuất", "Năng suất yêu cầu"]}
                            dataChartValue={productivityData}
                            colors={["rgba(60,179,113,0.85)", "rgba(233,34,34,0.85)"]}
                        />
                    </div>
                </Card>

                <Card
                    className={
                        "h-[16.3%] w-full flex flex-col justify-around items-center bg-neutron-4 overflow-x-scroll break-after-page"
                    }
                >
                    <h5>Biểu đồ thông số OEE từng lệnh sản xuất (%)</h5>
                    <div className=" h-full w-full cursor-pointer">
                        <GroupChart
                            height={"94%"}
                            width={"99%"}
                            unit={"%"}
                            fontSize={"1rem"}
                            nameY={false}
                            dataChartX={nameList}
                            dataChartValue={oeeOrderList}
                            colors={[
                                "rgba(1, 0, 140, 0.8)",
                                "rgba(60,179,113,0.85)",
                                "rgba(250,175,36,0.85)",
                                "rgba(0,155,250,0.85)",
                            ]}
                        />
                    </div>
                </Card>
                <Card
                    className={
                        " h-[16.3%] w-full flex flex-col justify-around items-center bg-neutron-4 overflow-x-scroll "
                    }
                >
                    <h5>Biểu đồ tổng lệnh sản xuất ứng với mỗi mã sản phẩm</h5>
                    <div className=" h-full w-full cursor-pointer">
                        <ColumnChart
                            height={"90%"}
                            width={"99%"}
                            name={"Lệnh sản xuất"}
                            fontSize={"1rem"}
                            unit={"Lệnh"}
                            nameY={false}
                            dataChartX={refInforData ? refInforData.ref : []}
                            dataChartValue={refInforData ? refInforData.columnData : []}
                            colors={[
                                "rgba(1, 0, 140, 0.8)",
                                // "rgba(0,155,250,0.85)",
                                // "rgba(100,100,100,0.7)",
                                // "rgba(233,34,34,0.85)",
                                // "rgba(139,114,200,0.85)",
                                // "rgba(101,101,101,0.85)",
                            ]}
                        />
                    </div>
                </Card>
                <Card
                    className={
                        "h-[16.3%] w-full flex flex-col justify-around items-center bg-neutron-4 overflow-x-scroll break-after-page"
                    }
                >
                    <h5>Biểu đồ tổng sản lượng ứng với từng mã sản phẩm ({unit})</h5>
                    <div className=" h-full w-full cursor-pointer">
                        <GroupChart
                            height={"94%"}
                            width={"99%"}
                            unit={unit}
                            fontSize={"1rem"}
                            nameY={false}
                            dataChartX={refInforData ? refInforData.ref : []}
                            dataChartValue={refInforData ? refInforData.total : []}
                            colors={["rgba(0,155,250,0.85)", "rgba(60,179,113,0.85)", "rgba(233,34,34,0.85)"]}
                        />
                    </div>
                </Card>
            </div>
            {errorPopup && (
                <Card className=" absolute top-[10%] left-[5%] h-[89%] w-[90%] flex flex-col bg-neutron-4 z-50 p-1">
                    <Button
                        bg={"rgba(233,34,34,0.85)"}
                        className={"  h-[5%] w-[5%]"}
                        onClick={() => {
                            setErrorPopup(false)
                            setEachData([])
                        }}
                    >
                        <IoMdCloseCircleOutline />
                    </Button>
                    <div className=" h-[8%] w-full flex justify-around items-center">
                        <h3>Thông số trong quá trình sản xuất của lệnh:</h3>
                        <h4>{eachOrderInfor ? eachOrderInfor.workOrderCode : ""}</h4>
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
                            {/* {modeInfor === 6 && (
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
                            )} */}
                        </div>
                    </div>
                </Card>
            )}
        </div>
    )
}
export default ManufacturingReport
