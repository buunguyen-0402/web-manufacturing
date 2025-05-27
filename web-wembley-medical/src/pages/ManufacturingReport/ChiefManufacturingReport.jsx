import { useNavigate } from "react-router-dom"
import Card from "@/components/Card"
import SelectInput from "@/components/SelectInput"
import DateInput from "@/components/DateInput"
import { useState, useEffect, useCallback, useRef } from "react"
import { useReactToPrint } from "react-to-print"
import cl from "classnames"
import Button from "@/components/Button"
import { PiBackspaceBold } from "react-icons/pi"
import Table from "@/components/Table"
import TextInput from "@/components/TextInput"
import { manuReport_headers } from "@/utils/tableColumns"
import { useCallApi } from "@/hooks"
import { authorizationApi, machineApi } from "@/services/api"
import { IoMdCloseCircleOutline } from "react-icons/io"
import ToggleButtons from "@/components/ToggleButtons"
import { toggleManufacturing } from "@/utils/constants"
import { manuEachOrderReport_headers, errorWorkOrder_headers, errorWorkOrderDetail_headers } from "@/utils/tableColumns"
import { FaSearch } from "react-icons/fa"
import {
    handleManufacturingData,
    handleManufacturingDataProductivity,
    handleManufacturingOeeData,
    handleRefInfor,
    handleDataError,
    handleManufacturingFilterData,
    dateFormatRenderVi,
} from "@/utils/functions"
import { ColumnChart, LineChart, GroupChart, PieDonutChart, ColumnExpectChart } from "@/components/Chart"
import logo from "@/assets/WembleyLogo.png"
import { useSelector } from "react-redux"

function ChiefManufacturingReport() {
    const navigate = useNavigate()
    const callApi = useCallApi()
    const contentRef = useRef()
    const reactToPrintFn = useReactToPrint({ contentRef })
    const user = useSelector((state) => state.auth)

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
    const [mode, setMode] = useState(false)

    const [allLine, setAllLine] = useState([])
    const [unit, setUnit] = useState("")
    const [lineManager, setLineManager] = useState([])
    const [listManager, setListManager] = useState([])
    const [listWorkOrders, setListWorkOrders] = useState([])
    const [numberWorkOrder, setNumberWorkOrder] = useState([])
    const [workOrderList, setWorkOrderList] = useState([])
    const [nameList, setNameList] = useState([])
    const [productivityData, setProductivityData] = useState([])
    const [oeeOrderList, setOeeOrderList] = useState([])
    const [refInforData, setRefInforData] = useState()
    const [modeInfor, setModeInfor] = useState(0)
    const [errorPopup, setErrorPopup] = useState(false)
    const [detail, setDetail] = useState(15)
    const [minute, setMinute] = useState(15)
    const [eachData, setEachData] = useState([])
    const [eachOrderInfor, setEachOrderInfor] = useState()
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
                setListManager(res[0].data.map((res) => ({ key: res.lineManager, value: res.lineManager })))
                // const filter = res[1].data.find((res) => String(res.roleName) === user.role).pages
                // setAcceptRole(
                //     filter.find(
                //         (res) =>
                //             String(res.name) === "Báo cáo sản xuất - Trưởng line" ||
                //             String(res.name) === "Tất cả các trang",
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

    const handleSearch = () => {
        callApi(
            () =>
                machineApi.workOrders.getWorkOrdersByLineIdAndStartTimeAndEndTime(
                    lineManager,
                    expectedStartTime,
                    expectedEndTime,
                ),
            (res) => {
                // const lineWorkOrdersData = res.data.workOrders.filter((res) => res.lineManager === lineManager[0])
                // console.log(res.data)
                const sortData = handleManufacturingData(
                    res.data.workOrders.sort((a, b) => b.workOrderCode.localeCompare(a.workOrderCode)),
                )
                const nameData = sortData.map((res) => res.workOrderCode)
                setUnit(allLine.filter((res) => String(res.lineManager) === String(lineManager))[0].productUnit)
                setListWorkOrders(res.data)
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
                setNameList(nameData)
                setOeeOrderList(handleManufacturingOeeData(sortData))
                setRefInforData(handleRefInfor(sortData))
            },
            "Truy xuất thành công",
        )
        setMode(false)
    }

    const handleTableRowClick = (e) => {
        setErrorPopup(true)
        setEachOrderInfor(e)
    }
    // console.log(listWorkOrders)
    return (
        <div className=" h-[400%] w-full flex flex-col gap-[0.5%]">
            <div className=" h-[1.5%] w-full flex items-center gap-[2%] ">
                <Button bg={"white"} onClick={() => navigate("/manufacturing-report")}>
                    <PiBackspaceBold color="black" />
                </Button>

                <Button onClick={() => setMode(true)}>Truy xuất dữ liệu</Button>

                <Card className={"h-full w-[60%] flex flex-grow justify-around items-center bg-neutron-4"}>
                    <h6>Trưởng line: </h6>
                    <h7>{lineManager}</h7>
                    <h6>Khoảng thời gian: </h6>
                    <h7>
                        Từ {dateFormatRenderVi(expectedStartTime)} đến {dateFormatRenderVi(expectedEndTime)}
                    </h7>

                    <Button onClick={() => reactToPrintFn()}>Xuất báo cáo</Button>
                </Card>
            </div>
            {mode && (
                <Card className=" absolute left-[30%] h-[60%] w-[50%] flex flex-col justify-around bg-neutron-4 p-2 z-20">
                    <Card
                        className={cl(
                            " h-[8%] w-[6%] flex items-center justify-center cursor-pointer hover:bg-primary-4",
                        )}
                        onCLick={() => setMode(false)}
                    >
                        <h5>X</h5>
                    </Card>
                    <div className=" h-full w-full flex flex-col justify-around">
                        <SelectInput
                            label="Trưởng line"
                            list={listManager}
                            id={1}
                            value={lineManager}
                            setValue={setLineManager}
                            canSearch={true}
                            mutilChoises={false}
                            className={" h-[8%] w-full"}
                        />
                        <DateInput
                            id="Ngày bắt đầu"
                            label="Ngày bắt đầu"
                            value={expectedStartTime}
                            setValue={setExpectedStartTime}
                            type="dayStart"
                            dayCompare={expectedEndTime}
                            inputType="date"
                            className={" h-[8%] w-full"}
                        />
                        <DateInput
                            id="Ngày kết thúc"
                            label="Ngày kết thúc"
                            value={expectedEndTime}
                            setValue={setExpectedEndTime}
                            type="dayEnd"
                            dayCompare={expectedStartTime}
                            inputType="date"
                            className={" h-[8%] w-full"}
                        />
                        <Button className={cl("")} onClick={handleSearch}>
                            <FaSearch />
                        </Button>
                    </div>
                </Card>
            )}

            <Card
                ref={contentRef}
                className={cl(" h-[23%] flex flex-col justify-center items-center gap-[2%] bg-neutron-4")}
            >
                <h1 className=" ">Danh sách các lệnh sản xuất của trưởng line</h1>
                <Card className={cl("h-full w-full overflow-y-scroll")}>
                    <Table
                        activable
                        primary
                        sticky
                        headers={manuReport_headers}
                        body={
                            listWorkOrders && listWorkOrders.workOrders
                                ? handleManufacturingData(listWorkOrders.workOrders)
                                : []
                        } //mảng dữ liệu
                        className="w-[200%]"
                        columnSticky={0}
                        hightlight
                        colors={{
                            status: {
                                "Hoàn thành": "bg-[rgba(60,179,113,0.85)] rounded-lg",
                                "Chờ xác nhận": "bg-[rgba(233,34,34,0.85)] rounded-lg",
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
                    {/* {active && (
                                    <PoperMenuNew
                                        position={position}
                                        onClose={handleClose}
                                        menuNavigaton={initValue ? editWorkerMenu() : getWorkerMenu()}
                                        onClick={handleSubmit}
                                        initValue={initValue ? initValue : undefined}
                                        activateValidation={false}
                                    />
                                )} */}
                    {/* {deleteConfirm.actived && (
                        <Confirm
                            title={deleteConfirm.title}
                            content={deleteConfirm.content}
                            onConfirm={deleteConfirm.onConfirm}
                            onClose={() => setDeleteConfirm({ actived: false })}
                        />
                    )} */}
                </Card>
            </Card>
            <div
                className=" h-[77%] w-full flex flex-col justify-between print:border-2 print:gap-2 print:flex-col"
                ref={contentRef}
            >
                <div className=" h-[20%] w-full hidden print:block">
                    <div className=" flex ">
                        <div className=" w-[40%] flex justify-center items-center border-b-2 p-1">
                            <img src={logo} alt="Logo" className="" />
                        </div>
                        <div className=" w-[0.2%] flex justify-center items-center border-b-2 bg-neutron-1"></div>

                        <div className=" w-[59%] flex flex-col justify-center items-center border-b-2 bg-neutron-4">
                            <h1>BÁO CÁO SẢN XUẤT THEO TRƯỞNG LINE</h1>

                            <div className=" flex justify-center w-full">
                                <h5 className=" w-[20%]">Trưởng line:</h5>
                                <h7 className="w-[48%]">{lineManager}</h7>
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
                                    {listWorkOrders["workOrders"] ? listWorkOrders.workOrders.length : 0}{" "}
                                </h7>
                            </div>
                        </div>
                    </div>
                </div>
                <div className=" h-[15%] w-full flex justify-between print:mt-[1%]">
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
                            <h5 className=" w-[60%]">Đơn vị:</h5>
                            <h5>{unit}</h5>
                        </div>
                        <div className=" w-full h-fit flex border-b border-primary-2">
                            <h5 className=" w-[60%]">Sản lượng kế hoạch:</h5>
                            <h6>{listWorkOrders.totalProductSize}</h6>
                        </div>
                        <div className=" w-full h-fit flex border-b border-primary-2">
                            <h5 className=" w-[60%]">Sản lượng sản xuất:</h5>
                            <h7>{listWorkOrders.totalProductCount}</h7>
                        </div>
                        <div className=" w-full h-fit flex border-b border-primary-2">
                            <h5 className=" w-[60%]">Sản lượng đạt:</h5>
                            <h8 className=" ">{listWorkOrders.totalGoodProduct}</h8>
                        </div>
                        <div className=" w-full h-fit flex border-b border-primary-2">
                            <h5 className=" w-[60%]">Sản lượng lỗi:</h5>
                            <h9 className=" ">{listWorkOrders.totalDefectProduct}</h9>
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
                                    listWorkOrders ? Number(listWorkOrders.totalGoodProduct) : 0,
                                    listWorkOrders ? Number(listWorkOrders.totalDefectProduct) : 0,
                                ]}
                                arrayColors={["rgba(60,179,113,0.85)", "rgba(233,34,34,0.85)"]}
                            />
                        </div>
                    </Card>
                    <Card className=" h-full w-[25%] flex flex-col justify-around items-center bg-neutron-4">
                        <h5>Biểu đồ sản lượng sản xuất ({unit})</h5>
                        <div className=" h-full w-full">
                            <ColumnChart
                                height={"90%"}
                                width={"100%"}
                                name={"Sản lượng"}
                                fontSize={"1rem"}
                                unit={unit}
                                nameY={false}
                                dataChartX={["Kế hoạch", "Thực tế", "SL đạt", "SL lỗi"]}
                                dataChartValue={[
                                    listWorkOrders ? Number(listWorkOrders.totalProductSize) : 0,
                                    listWorkOrders ? Number(listWorkOrders.totalProductCount) : 0,
                                    listWorkOrders ? Number(listWorkOrders.totalGoodProduct) : 0,
                                    listWorkOrders ? Number(listWorkOrders.totalDefectProduct) : 0,
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
                        "h-[16.5%] w-full flex flex-col justify-around items-center bg-neutron-4 overflow-x-scroll "
                    }
                >
                    <h5>Biểu đồ sản lượng đạt và lỗi từng lệnh sản xuất ({unit})</h5>
                    <div className=" h-full w-full">
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
                <Card className=" h-[16.5%] w-full flex flex-col justify-around items-center bg-neutron-4 overflow-x-scroll">
                    <h5>Biểu đồ năng suất sản xuất ({unit} / phút)</h5>
                    <div className=" h-full w-full rounded-xl overflow-scroll">
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
                            unit={`${unit}/phút`}
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
                        "h-[16.5%] w-full flex flex-col justify-around items-center bg-neutron-4 overflow-x-scroll break-after-page"
                    }
                >
                    <h5>Biểu đồ thông số OEE từng lệnh sản xuất</h5>
                    <div className=" h-full w-full">
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
                        "h-[16%] w-full flex flex-col justify-around items-center bg-neutron-4 overflow-x-scroll"
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
                        "h-[16%] w-full flex flex-col justify-around items-center bg-neutron-4 overflow-x-scroll "
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
                    </Card>
                )}
            </div>
        </div>
    )
}
export default ChiefManufacturingReport
