import { useParams } from "react-router-dom"
import { useState, useEffect, useCallback } from "react"
import { machineApi } from "@/services/api"
import Chart from "react-apexcharts"
import Table from "@/components/Table"
import OeeSearchBar from "./OeeSearchBar"
import {
    handleOeePageHeader,
    handleOeeMode,
    handleOeeModeEachShift,
    handleOeeData,
    handleOeePageHeaderEachShift,
    dateFormat,
    convertDateFormatHistoryAndReport,
} from "@/utils/functions"
import { useCallApi } from "@/hooks"
import Button from "@/components/Button"
import { MdOutlineSearch } from "react-icons/md"
import { toast } from "react-toastify"
import Card from "@/components/Card"

function PropertiesReport() {
    const param = useParams()
    const callApi = useCallApi()

    const [statusControl, setStatusControl] = useState(true)
    const [findData, setFindData] = useState([]) //data chung bao gom oee, p, a, q
    // const [filterData, setFilterData] = useState([]) //loc data theo oee, p, a, q
    const [idEachData, setIdEachData] = useState(0) //luu tru ID cua moi line data
    const [interval, setInterval] = useState(10) // thoi gian lay mau
    const [shiftData, setShiftData] = useState([]) // luu tru gia tri shift hien tai

    const [oeeModeIndex, setOeeModeIndex] = useState(0)
    const [displayState, setDisplayState] = useState(0)

    const [oeeModeIndexEachShift, setOeeModeIndexEachShift] = useState(0)
    const [displayStateEachShift, setDisplayStateEachShift] = useState(0)

    const [startDay, setStartDay] = useState(() => {
        const now = new Date()
        now.setDate(now.getDate() - 7)
        return now.toISOString().slice(0, 10)
    })
    const [endDay, setEndDay] = useState(() => {
        const now = new Date()
        now.setDate(now.getDate() + 7)
        return now.toISOString().slice(0, 10)
    })
    // console.log(shiftData)
    // const [activedItem, setActivedItem] = useState(null)

    // const [controlStatus, setControlStatus] = useState(0)
    const fetchData = useCallback(() => {
        callApi(
            () => machineApi.shiftReport.getDataReport(param.stationId, startDay, endDay, interval),
            (res) => {
                setFindData(() => handleOeeData(res.data))
                // console.log(res.data)
            },
            "Thao tác thành công",
            (res) => toast.error(res.response.data.detail),
        )
    }, [callApi])
    useEffect(() => {
        fetchData()
    }, [fetchData])
    const handleFind = () => {
        callApi(
            () => machineApi.shiftReport.getDataReport(param.stationId, startDay, endDay, interval),
            (res) => {
                setFindData(() => handleOeeData(res.data))
            },
            "Thao tác thành công",
            (res) => toast.error(res.response.data.detail),
        )
    }
    // useEffect(() => {
    //     if (idEachData && interval) {
    //         callApi(
    //             () => machineApi.shiftReport.getEachShift(idEachData, interval),
    //             (res) => setShiftData(() => handleOeeDataEachShift(res.data[0].shots)),
    //             "Thao tác thành công",
    //             (res) => toast.error(res.response.data.detail),
    //         )
    //     }
    // }, [interval, idEachData])
    const handleChangeInterval = () => {
        const newInterval = document.getElementById("intervalValue").value
        // setInterval(newInterval)
    }

    const handleDetails = (row, index) => {
        // console.log(index)
        setIdEachData(index.shiftReportId)
        setStatusControl(false)
    }
    const handleTableRowClick = (row, index) => {
        const activedRow = findData[index]
        // setActivedItem(activedRow)
    }
    // console.log(findData)
    const xaxis = findData.map((e) => e.date)
    const yaxis = findData.map((e) => e[handleOeeMode(oeeModeIndex).toLowerCase()]).reverse()
    const xaxisEachShift = shiftData.map((e) => e.timeStamp.slice(11, 19))
    const yaxisEachShift = shiftData
        .map((e) => e[handleOeeModeEachShift(oeeModeIndexEachShift).toLowerCase()])
        .reverse()

    const state = {
        options: {
            xaxis: {
                categories: xaxis,
            },
            yaxis:
                oeeModeIndex !== 5
                    ? {
                          min: 0,
                          max: 100,
                          tickAmount: 5,
                          decimalsInFloat: 1,
                      }
                    : { decimalsInFloat: 1 },
            noData: {
                text: "Loading...",
            },
        },
        series: [
            {
                name: `${handleOeeMode(oeeModeIndex)}`,
                data: yaxis,
            },
        ],
    }
    const stateEachShift = {
        options: {
            xaxis: {
                categories: xaxisEachShift,
                labels: {
                    show: false,
                },
            },
            yaxis:
                oeeModeIndex !== 5
                    ? {
                          min: 0,
                          max: 100,
                          tickAmount: 5,
                          decimalsInFloat: 1,
                      }
                    : { decimalsInFloat: 1 },
            noData: {
                text: "Loading...",
            },
        },
        series: [
            {
                name: `${handleOeeModeEachShift(oeeModeIndexEachShift)}`,
                data: yaxisEachShift,
            },
        ],
    }
    const handleExportExcel = () => {
        if (startDay && endDay) {
            window.open(
                `http://10.0.70.45:81/api/ShiftReports/DownloadReport?StationId=${
                    param.stationId
                }&StartTime=${dateFormat(startDay)}&EndTime=${dateFormat(endDay)}`,
            )
        } else toast.error("Nhập ngày bắt đầu/ ngày kết thúc")
    }

    const handleDeleteByKeyboard = (e) => {
        if (e.key === "Backspace" && e.target.value >= 0) {
            e.target.value = e.target.value.slice(0, -1)
        }
    }
    return (
        <>
            {statusControl ? (
                <>
                    <OeeSearchBar
                        // param={param.stationId}
                        filter={oeeModeIndex}
                        setFilter={setOeeModeIndex}
                        stateFilter={displayState}
                        setStateFilter={setDisplayState}
                        searchInput={handleFind}
                        dayStart={startDay}
                        setDayStart={setStartDay}
                        dayEnd={endDay}
                        interval={interval}
                        setInterval={setInterval}
                        setDayEnd={setEndDay}
                        handleExportExcel={() => handleExportExcel()}
                        CLassName={"h-[7%] w-full"}
                    />
                    {oeeModeIndex !== 0 && <h2>Giá trị {handleOeeMode(oeeModeIndex)}</h2>}

                    {oeeModeIndex !== 0 && displayState !== 2 && (
                        <Chart options={state.options} series={state.series} type="line" width="100%" height={500} />
                    )}
                    {displayState !== 1 && (
                        <Card className={" h-[90%] w-full overflow-y-scroll "}>
                            <Table
                                activable
                                primary
                                sticky
                                className={" bg-neutron-4"}
                                headers={handleOeePageHeader(oeeModeIndex)}
                                body={findData}
                                // enableIdClick
                                // onEdit={handleEdit}
                                // onDetails={handleDetails}
                                // onRowClick={handleTableRowClick}
                                // idClickFunction={(e, row, index) => {
                                //     console.log(row)
                                //     navigate(`/setting/Test`, { state: row })
                                // }}
                            />
                        </Card>
                    )}
                </>
            ) : (
                <>
                    <div className=" h-full w-full">
                        <div className=" h-[7%] flex justify-between items-center">
                            <div className="flex text-[1.25rem] ">
                                <span>
                                    Nhập thông số Interval:{" "}
                                    <input
                                        className="h-10 flex-1 rounded-l-lg border bg-neutron-4 p-4"
                                        placeholder="Giá trị Interval..."
                                        id="intervalValue"
                                        onKeyDown={(e) => handleDeleteByKeyboard(e)}
                                    ></input>
                                </span>
                                <div
                                    className="w-[6%] cursor-pointer flex justify-center items-center rounded-r-xl bg-primary-1 text-4xl text-neutron-4"
                                    onClick={handleChangeInterval}
                                >
                                    <MdOutlineSearch />
                                </div>
                            </div>
                            <Button onClick={() => setStatusControl(true)}>Quay về trang báo cáo tổng</Button>
                        </div>
                        {/* <Chart
                            options={stateEachShift.options}
                            series={stateEachShift.series}
                            type="line"
                            width="100%"
                            height={500}
                        /> */}
                        <OeeSearchBar
                            // param={param.stationId}
                            filter={oeeModeIndexEachShift}
                            setFilter={setOeeModeIndexEachShift}
                            stateFilter={displayStateEachShift}
                            setStateFilter={setDisplayStateEachShift}
                            modeEachShift={false}
                            type="null"
                        />
                        {oeeModeIndexEachShift !== 0 && <h2>Giá trị {handleOeeMode(oeeModeIndexEachShift)}</h2>}

                        {oeeModeIndexEachShift !== 0 && displayStateEachShift != 2 && (
                            <Chart
                                options={stateEachShift.options}
                                series={stateEachShift.series}
                                type="line"
                                width="100%"
                                height={500}
                            />
                        )}
                        {displayStateEachShift != 1 && (
                            <Table
                                activable
                                primary
                                sticky
                                className={" overflow-y-scroll h-[65%]"}
                                headers={handleOeePageHeaderEachShift(oeeModeIndexEachShift)}
                                body={shiftData.length > 0 ? shiftData : []}
                                // enableIdClick
                                // onEdit={handleEdit}
                                // onDetails={handleDetails}
                                onRowClick={handleTableRowClick}
                                // idClickFunction={(e, row, index) => {
                                //     console.log(row)
                                //     navigate(`/setting/Test`, { state: row })
                                // }}
                            />
                        )}
                        {/* <Table
                            activable
                            primary
                            sticky
                            className={" overflow-y-scroll no-scrollbar h-[75%] mt-3"}
                            headers={handleOeePageHeaderEachShift}
                            body={shiftData.length > 0 ? handleOeeData(shiftData) : []}
                            // enableIdClick
                            // onEdit={handleEdit}
                            // onDetails={handleDetails}
                            onRowClick={handleTableRowClick}
                            // idClickFunction={(e, row, index) => {
                            //     console.log(row)
                            //     navigate(`/setting/Test`, { state: row })
                            // }}
                        /> */}
                    </div>
                </>
            )}
        </>
    )
}

export default PropertiesReport
