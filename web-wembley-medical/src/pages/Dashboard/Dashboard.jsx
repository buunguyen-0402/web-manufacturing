import Card from "@/components/Card"
import Button from "@/components/Button"
import { useNavigate } from "react-router-dom"
import { useCallback, useContext, useEffect, useState } from "react"
import { ThemeContext } from "@/hooks"
import { authorizationApi, machineApi } from "@/services/api"
import { useCallApi } from "@/hooks"
import { toast } from "react-toastify"
import cl from "classnames"
import Table from "@/components/Table"
import usePoperMenuNew from "@/hooks/usePoperMenuNew"
import PoperMenuNew from "@/components/PoperMenuNew"
import Confirm from "@/components/Confirm"
import { line_headers } from "@/utils/tableColumns"
import { getLineMenu, editLineMenu } from "@/utils/menuNavigation"
import { Scheduler } from "@bitnoi.se/react-scheduler"
import { PieDonutChart, ColumnChart } from "@/components/Chart"
import ProgressBar from "@/components/ProgressBar"
import DateInput from "@/components/DateInput"
import SelectInput from "@/components/SelectInput"
import { ListTagIdDashboardSignalR } from "@/utils/listTagName"
import { ColorStatus } from "@/utils/constants"
import viDayjsTranslations from "dayjs/locale/vi"
import { convertDateFormat, handleInProgressWorkOrder, handleAvaliability } from "@/utils/functions"
import MachineIcon from "@/assets/MachineIcon.png"
import { useSelector } from "react-redux"

function Dashboard() {
    const navigate = useNavigate()
    const callApi = useCallApi()
    const user = useSelector((state) => state.auth)

    const [line, setLine] = useState([])
    const [lineData, setLineData] = useState({})
    const [lineIdData, setLineIdData] = useState([])
    const [openMenu, setOpenMenu] = useState(false)

    const [startDate, setStartDate] = useState(() => {
        const now = new Date()
        now.setDate(now.getDate() - 14)
        return now.toISOString().slice(0, 10)
    })
    const [endDate, setEndDate] = useState(() => {
        const now = new Date()
        now.setDate(now.getDate() + 7)
        return now.toISOString().slice(0, 10)
    })

    const [expectedStartTime, setExpectedStartTime] = useState(() => {
        const now = new Date()
        now.setDate(now.getDate() - 7)
        return now.toISOString().slice(0, 10)
    })
    const [expectedEndTime, setExpectedEndTime] = useState(() => {
        const now = new Date()
        now.setDate(now.getDate())
        return now.toISOString().slice(0, 10)
    })

    const { active, position, handleClose, handleOpen } = usePoperMenuNew(400)
    const [deleteConfirm, setDeleteConfirm] = useState({}) //State này chứa thông tin về xác nhận xóa vật tư. Khi người dùng chọn xóa một vật tư, thông tin xác nhận xóa sẽ được lưu trữ trong deleteConfirm, bao gồm tiêu đề, nội dung và hàm xác nhận.
    const [initValue, setInitValue] = useState() // dùng để chứa data đang chỉnh sửa, nếu = null thì đang tạo mục mới; undefined là bình thường
    const [activedItem, setActivedItem] = useState()

    const [allWorkOrder, setAllWorkOrder] = useState()
    const [totalProductivity, setTotalProductivity] = useState()
    const [realProductivity, setRealProductivity] = useState()
    const [progressDonutData, setProgressDonutData] = useState([])
    const [mockedSchedulerData, setMockedSchedulerData] = useState([])
    const [isOpenDateFilter, setIsOpenDateFilter] = useState(false)
    const [inProgressWorkOrder, setInProgressWorkOrder] = useState()

    const [popupItemClick, setPopupItemClick] = useState(false)
    const [popupItemData, setPopupItemData] = useState()

    const [sizeWorkOrder, setSizeWorkOrder] = useState([])
    const [filterButtonState, setFilterButtonState] = useState(0)
    const [range, setRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
    })

    const [data, setData] = useState({})

    const [lineList, setLineList] = useState([])
    const [currLine, setCurrLine] = useState([])
    const [avaliability, setAvaliability] = useState([])
    const [avaliabilityResult, setAvaliabilityResult] = useState()

    const [acceptRole, setAcceptRole] = useState()

    const { connection } = useContext(ThemeContext)

    // useEffect(() => {
    //     callApi(
    //         () => authorizationApi.role.getRole(),
    //         (res) => {
    //             const filter = res.data.find((res) => String(res.roleName) === user.role).pages
    //             setAcceptRole(
    //                 filter.find(
    //                     (res) =>
    //                         String(res.name) === "Quản lý lệnh sản xuất" || String(res.name) === "Tất cả các trang",
    //                 ),
    //             )
    //         },
    //     )
    // }, [])

    const fetchData = useCallback(() => {
        callApi(
            [
                machineApi.workOrders.getWorkOrders(),
                machineApi.line.getAllLine(),
                machineApi.workOrders.getWorkOrdersByStartTimeAndEndTime(startDate, endDate),
                machineApi.workOrders.getWorkOrdersByStatus(1),
            ],
            (res) => {
                setLineData(res[1].data)
                setLineIdData(
                    res[1].data.map((res) => ({
                        lineId: res.lineId,
                        lineName: res.lineName,
                        lineManager: res.lineManager,
                        productUnit: res.productUnit,
                        idealCycleTime: res.idealCycleTime,
                        productsPerShot: res.productsPerShot,
                        idealRunningTime: res.idealRunningTime,
                    })),
                )
                setLine(res[1].data.map((res) => ({ lineId: res.lineId })))
                setAllWorkOrder(res[2].data)
                setInProgressWorkOrder(handleInProgressWorkOrder(res[3].data.workOrders))
            },

            (res) => toast.error(`Lỗi nhận dữ liệu từ server: ${res.response.data.detail}`),
        )
    }, [callApi, startDate, endDate])
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
        callApi([machineApi.workOrders.getWorkOrdersByStatus(1), machineApi.line.getAllLine()], (res) => {
            const data = res[0].data.workOrders.reduce((acc, workOrder) => {
                acc[workOrder.lineId] = workOrder.size
                return acc
            }, {})
            setSizeWorkOrder(data)
            setLineList(res[1].data.map((res) => ({ key: res.lineName, value: res.lineId })))
        })
    }, [])

    useEffect(() => {
        if (currLine.length > 0)
            callApi(
                () => machineApi.line.getAvailableLineId(currLine, expectedStartTime, expectedEndTime),
                (res) => {
                    setAvaliability(res.data)
                    setAvaliabilityResult(handleAvaliability(res.data))
                },
            )
    }, [currLine, expectedEndTime, expectedStartTime])

    const updateButtons = () => {
        const buttons = document.querySelectorAll("button.sc-cCzKKE")
        if (buttons && allWorkOrder) {
            allWorkOrder.workOrders.forEach((item) => {
                const tiendo = Number((item.goodProduct * 100) / item.size).toFixed(1)
                const color =
                    Number(item.productivity / item.expectProductivity).toFixed(2) >= 1
                        ? "rgba(60,220,120,0.85)"
                        : "rgba(230,35,35,0.85)"
                buttons.forEach((button) => {
                    const pTag = button.querySelector("div div p")
                    if (pTag && pTag.textContent.includes(item.workOrderCode)) {
                        button.style.background = `linear-gradient(to right, ${color} ${tiendo}%, rgba(210,210,210,0.95) ${tiendo}%)`
                    }
                })
            })
        }
    }
    useEffect(() => {
        requestAnimationFrame(() => updateButtons())
    }, [allWorkOrder, fetchData])

    useEffect(() => {
        const ganttContainer = document.querySelector("#reactSchedulerOutsideWrapper")
        if (ganttContainer) {
            const observer = new MutationObserver((mutations) => {
                requestAnimationFrame(() => {
                    updateButtons()
                })
            })
            observer.observe(ganttContainer, { childList: true, subtree: true, style: true })

            // Cleanup observer khi component unmount
            return () => observer.disconnect()
        }
    }, [allWorkOrder])

    useEffect(() => {
        if (lineData.length > 0) {
            setTotalProductivity(
                lineData.map((ref) =>
                    allWorkOrder.workOrders.reduce(
                        (acc, workOrder) => (workOrder.lineId === ref.lineId ? acc + workOrder.size : acc),
                        0,
                    ),
                ),
            )
            setRealProductivity(
                lineData.map((ref) =>
                    allWorkOrder.workOrders.reduce(
                        (acc, workOrder) => (workOrder.lineId === ref.lineId ? acc + workOrder.goodProduct : acc),
                        0,
                    ),
                ),
            )
            //tạo dữ liệu cho biểu đồ donut
            const value = [0, 0, 0, 0]
            allWorkOrder.workOrders.forEach((workOrder) => {
                if (workOrder.status === "Chờ xử lý") {
                    value[0]++
                } else if (workOrder.status === "Đang tiến hành") {
                    value[1]++
                } else if (workOrder.status === "Tạm dừng") {
                    value[2]++
                } else {
                    value[3]++
                }
            })
            setProgressDonutData(value)
            // tạo dữ liệu cho biểu đồ gantt
            //lọc dữ liệu để tạo thành một mảng chứa các object có key là lineId, value là một mảng chứa các workOrder của line đó
            const dataLine = lineData.map((lineData) =>
                allWorkOrder.workOrders.filter((workOrder) => workOrder.lineId === lineData.lineId),
            )
            setMockedSchedulerData(() => {
                return lineData.map((ref, index) => {
                    // const id = ref.lineId
                    return {
                        id: ref.lineId,
                        label: {
                            title: ref.lineName,
                            icon: MachineIcon,
                        },
                        data: dataLine[index].map((workOrder) => {
                            return {
                                id: workOrder.workOrderId,
                                p: workOrder.p,
                                startDate: workOrder.expectedStartTime,
                                endDate: workOrder.expectedEndTime,
                                realStartTime: workOrder.startTime,
                                realEndTime: workOrder.endTime,
                                occupancy: workOrder.expectProductivity,
                                title: workOrder.workOrderCode,
                                subtitle: workOrder.referenceCode,
                                description: `Tiến độ: ${Number((workOrder.goodProduct * 100) / workOrder.size).toFixed(1)}%`,
                                bgColor: "#00F500",
                            }
                        }),
                    }
                })
            })
        } else {
            setProgressDonutData([0, 0, 0])
            setMockedSchedulerData([])
            setTotalProductivity(0)
            setRealProductivity(0)
        }
    }, [lineData, allWorkOrder])

    const handleRangeChange = useCallback((range) => {
        setRange(range)
    }, [])

    const filteredMockedSchedulerData = mockedSchedulerData.map((person) => ({
        ...person,
        data: person.data.filter((project) => {
            const projectStartDate = new Date(project.startDate)
            const projectEndDate = new Date(project.endDate)
            const rangeStartDate = new Date(range.startDate)
            const rangeEndDate = new Date(range.endDate)
            return (
                // Kiểm tra nếu ngày bắt đầu của dự án nằm trong khoảng range
                (projectStartDate >= rangeStartDate && projectStartDate <= rangeEndDate) ||
                // Kiểm tra nếu ngày kết thúc của dự án nằm trong khoảng range
                (projectEndDate >= rangeStartDate && projectEndDate <= rangeEndDate) ||
                // Kiểm tra nếu dự án bao phủ toàn bộ khoảng thời gian range
                (projectStartDate <= rangeStartDate && projectEndDate >= rangeEndDate)
            )
        }),
    }))

    const langs = [
        {
            id: "vi", // Định danh ngôn ngữ (English)
            lang: {
                feelingEmpty: "I feel so empty...", // Nội dung hiển thị khi không có dữ liệu
                free: "Còn trống",
                loadNext: "Next", // Nút chuyển sang dữ liệu tiếp theo
                loadPrevious: "Previous", // Nút quay về dữ liệu trước đó
                over: "Kết thúc",
                taken: "Đã sử dụng",
                topbar: {
                    // Dịch các nút trên thanh công cụ (topbar)
                    filters: "Lọc",
                    next: "Tiếp theo",
                    prev: "Trước",
                    today: "Hôm nay",
                    view: "Thu - Phóng",
                },
                search: "Tìm kiếm",
                week: "Tuần",
            },
            translateCode: "vi-VN", // Mã ngôn ngữ
            dayjsTranslations: viDayjsTranslations, // Gán cấu hình ngày tháng cho `dayjs`
        },
    ]

    const onButtonReject = () => {
        setIsOpenDateFilter(false)
        setFilterButtonState(0)
    }

    const handleDelete = (row) => {
        const lineId = row.lineId
        const lineName = row.lineName
        setDeleteConfirm({
            actived: true,
            title: "Xác nhận xóa line " + lineName,
            content: `Tên máy ${lineName} sẽ bị xóa vĩnh viễn`,
            onConfirm() {
                callApi(() => machineApi.line.deleteLine(lineId), fetchData, `Line ${lineName} được xóa thành công`)
            },
        })
    }

    const handleTableRowClick = (row, index) => {
        const activedRow = lineIdData[index]
        setActivedItem(activedRow)
    }

    const handleAdd = (e) => {
        setInitValue(null)
        handleOpen(e)
    }

    const handleEdit = (e) => {
        setInitValue({ info: activedItem })
        handleOpen(e)
    }

    const handleSubmit = (value) => {
        let data
        let callApiFunction
        let successMessage
        if (!initValue) {
            data = value.info
            callApiFunction = machineApi.line.postLine(data)
            successMessage = "Tạo line máy thành công"
        } else {
            data = value.info

            callApiFunction = machineApi.line.patchLine(activedItem.lineId, {
                lineId: activedItem.lineId,
                lineName: activedItem.lineName,
                ...data,
            })
            successMessage = "Chỉnh sửa line máy thành công"
        }
        callApi(() => callApiFunction, fetchData, successMessage)
    }

    const onTitleClick = (e) => {
        setPopupItemClick(true)
        setPopupItemData(allWorkOrder.workOrders.filter((workOrder) => workOrder.workOrderId === e.id)[0])
    }

    useEffect(() => {
        setTimeout(() => {
            const filterButtons = document.querySelectorAll(".sc-bZHTEL")
            filterButtons.forEach((button) => {
                button.style.whiteSpace = "wrap"
            })
        }, 500)
    }, [lineData])
    return (
        <div className=" relative flex flex-col h-[200%] w-full justify-between">
            <Card className={cl(" relative h-[49.5%] w-full")}>
                <Card
                    className={
                        " absolute top-[1%] left-[0.6%] h-[5%] w-[11%] flex justify-center items-center cursor-pointer hover:border-4 hover:border-accent-1 bg-maintenanceStatus-4 text-neutron-4 text-[1.1rem] font-bold z-20"
                    }
                    onClick={() => setOpenMenu(!openMenu)}
                >
                    <p>Thêm dây chuyền</p>
                </Card>

                <div className=" absolute h-full w-full text-neutron-1 font-semibold text-lg">
                    <Scheduler
                        data={filteredMockedSchedulerData}
                        // isLoading={isLoading}
                        onRangeChange={handleRangeChange}
                        onTileClick={onTitleClick}
                        onItemClick={(item) => navigate(`lineOverview/${item.id}`)}
                        onFilterData={() => {
                            setFilterButtonState(1)
                            setIsOpenDateFilter(true)
                        }}
                        onClearFilterData={() => {
                            setFilterButtonState(0)
                            setIsOpenDateFilter(false)
                        }}
                        config={{
                            zoom: 2,
                            filterButtonState,
                            lang: "vi",
                            translations: langs,
                            showTooltip: false,
                        }}
                    />
                </div>
            </Card>
            <div className={cl(" h-[20%] w-full flex justify-between")}>
                <Card className={cl(" h-full w-[28%] flex flex-col items-center bg-neutron-4")}>
                    <h3>Biểu đồ tổng các lệnh sản xuất</h3>
                    <div className=" h-full w-full">
                        <PieDonutChart
                            height={"100%"}
                            width={"100%"}
                            name={""}
                            fontSize={"1rem"}
                            label={"Tổng lệnh"}
                            unit={"Lệnh sản xuất"}
                            dataChartLabels={["Chưa sản xuất", "Đang tiến hành", "Tạm dừng", "Đã hoàn thành"]}
                            dataChartValue={progressDonutData}
                            arrayColors={[
                                "rgba(233,34,34,0.85)",
                                "rgba(0,155,250,0.85)",
                                "rgba(250,175,36,0.85)",
                                "rgba(60,220,120,0.85)",
                            ]}
                        />
                    </div>
                </Card>
                <Card className={cl(" h-full w-[35%] bg-neutron-4")}>
                    <h3 className=" text-center">Tổng sản lượng các lệnh sản xuất</h3>
                    <div className=" h-[88%] w-full pl-1 overflow-y-scroll">
                        {lineIdData &&
                            lineIdData.map((res, index) => (
                                <div key={index} className="w-full">
                                    <h7>{res.lineName}</h7>
                                    <div className="flex gap-3">
                                        <div className="flex flex-col">
                                            <div className=" flex gap-3">
                                                <div className=" flex flex-col">
                                                    <h6>Sản lượng kế hoạch:</h6>
                                                    <h6>Sản lượng sản xuất:</h6>
                                                </div>
                                                <div>
                                                    <h6>
                                                        {totalProductivity[index]}{" "}
                                                        {` ${
                                                            lineIdData.find((item) => {
                                                                return res.lineId === item.lineId
                                                            }).productUnit
                                                        }`}
                                                    </h6>
                                                    <h7>
                                                        {realProductivity[index]}{" "}
                                                        {` ${
                                                            lineIdData.find((item) => {
                                                                return res.lineId === item.lineId
                                                            }).productUnit
                                                        }`}
                                                    </h7>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </Card>
                <Card className={cl(" h-full w-[35%] flex flex-col p-1 overflow-scroll bg-neutron-4")}>
                    <h3 className=" text-center">Mức độ hiệu quả sử dụng của từng dây chuyền</h3>
                    <SelectInput
                        label="Dây chuyền sản xuất"
                        list={lineList}
                        id={1}
                        value={currLine}
                        setValue={setCurrLine}
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
                        inputType="date"
                        dayCompare={expectedEndTime}
                        className={" h-[10%] w-full"}
                    />
                    <DateInput
                        id="endDate"
                        label="Ngày kết thúc"
                        value={expectedEndTime}
                        setValue={setExpectedEndTime}
                        inputType="date"
                        type="dayEnd"
                        dayCompare={expectedStartTime}
                        className={" h-[10%] w-full"}
                    />
                    {/* <div className=" h-[10%] w-full flex">
                        <h6 className=" w-[45%]">Từ ngày:</h6>
                        <h7>{startDate}</h7>
                    </div>
                    <div className=" h-[10%] w-full flex">
                        <h6 className=" w-[45%]">Đến ngày:</h6>
                        <h7>{endDate}</h7>
                    </div> */}
                    {avaliability.length > 0 && (
                        <>
                            <div className=" h-[10%] w-full flex">
                                <h6 className=" w-[45%]">Tổng:</h6>
                                <h7>{avaliability.length} ngày</h7>
                            </div>
                            <div className=" h-[10%] w-full flex">
                                <h6 className=" w-[45%]">Thời gian máy hoạt động:</h6>
                                <h7>{avaliabilityResult.running}</h7>
                            </div>
                            <div className=" h-[10%] w-full flex">
                                <h6 className=" w-[45%]">Thời gian kế hoạch:</h6>
                                <h7>{avaliabilityResult.ideal}</h7>
                            </div>
                            <h6>Hiệu quả sử dụng = Thời gian hoạt động / Thời gian kế hoạch</h6>
                            <div className="flex flex-col">
                                <ProgressBar
                                    height="80%"
                                    textLimit={10}
                                    value={avaliabilityResult.avaliability}
                                    className="grow"
                                    unit="%"
                                    color="#3468C0"
                                    fixed={2}
                                />
                            </div>
                        </>
                    )}
                </Card>
            </div>
            <Card className={cl(" relative h-[29.5%] w-full flex  overflow-y-scroll bg-neutron-3")}>
                <div className=" h-full w-full flex flex-wrap items-center gap-[1%]">
                    {lineIdData &&
                        lineIdData.map((res, index) => (
                            <div
                                className={cl(
                                    "h-[45%] w-[49%] flex items-center p-1 rounded-xl shadow-inner1 justify-center ",
                                    ColorStatus[
                                        data && data[res.lineId + "_machineStatus"]
                                            ? Number(data[res.lineId + "_machineStatus"].TagValue)
                                            : 5
                                    ].color,
                                )}
                            >
                                <Card
                                    className={cl(
                                        "h-[97%] w-[98.5%] flex flex-col items-center justify-center bg-neutron-4",
                                    )}
                                >
                                    <h7>
                                        {res.lineName}
                                        {inProgressWorkOrder && inProgressWorkOrder[res.lineId]
                                            ? `-${inProgressWorkOrder[res.lineId].workOrderCode}`
                                            : "-Không sản xuất"}
                                    </h7>
                                    <div className=" h-[85%] w-full flex">
                                        <div className=" h-full w-[50%]">
                                            <ColumnChart
                                                height={"99%"}
                                                width={"99%"}
                                                name={"Sản lượng"}
                                                fontSize={"1rem"}
                                                nameY={false}
                                                zoom={false}
                                                unit={
                                                    lineIdData.find((item) => {
                                                        return res.lineId === item.lineId
                                                    }).productUnit
                                                }
                                                dataChartX={["Cỡ lô", "Sản xuất", "Đạt", "Lỗi"]}
                                                dataChartValue={[
                                                    sizeWorkOrder[res.lineId] ? sizeWorkOrder[res.lineId] : 0,
                                                    data && data[res.lineId + "_productCount"]
                                                        ? data[res.lineId + "_productCount"].TagValue
                                                        : 0,
                                                    data && data[res.lineId + "_goodProduct"]
                                                        ? data[res.lineId + "_goodProduct"].TagValue
                                                        : 0,
                                                    data &&
                                                    data[res.lineId + "_productCount"] &&
                                                    data[res.lineId + "_goodProduct"]
                                                        ? data[res.lineId + "_productCount"].TagValue -
                                                          data[res.lineId + "_goodProduct"].TagValue
                                                        : 0,
                                                ]}
                                                colors={[
                                                    "rgba(1, 0, 140, 0.8)",
                                                    "rgba(0,155,250,0.85)",
                                                    "rgba(60,220,120,0.85)",
                                                    "rgba(233,34,34,0.85)",
                                                ]}
                                            />
                                        </div>
                                        <div className=" relative h-full w-[50%] flex flex-col gap-[5%] overflow-y-scroll">
                                            <Card
                                                className={cl(
                                                    " absolute right-0 top-0 w-[25%] h-[19%] flex justify-center items-center font-bold text-[1.2rem] cursor-pointer hover:border-4 hover:border-accent-1",
                                                    ColorStatus[
                                                        data && data[res.lineId + "_machineStatus"]
                                                            ? Number(data[res.lineId + "_machineStatus"].TagValue)
                                                            : 5
                                                    ].color,
                                                )}
                                                onCLick={() => navigate(`/lineOverview/${res.lineId}`)}
                                            >
                                                {
                                                    ColorStatus[
                                                        data && data[res.lineId + "_machineStatus"]
                                                            ? Number(data[res.lineId + "_machineStatus"].TagValue)
                                                            : 5
                                                    ].name
                                                }
                                            </Card>
                                            <div className=" h-[9%] w-full flex">
                                                <h6>Mã ref:</h6>
                                                <h7>
                                                    {inProgressWorkOrder && inProgressWorkOrder[res.lineId]
                                                        ? inProgressWorkOrder[res.lineId].referenceCode
                                                        : ""}
                                                </h7>
                                            </div>
                                            <div className=" h-[12%] w-full flex">
                                                <h6>Năng suất:</h6>
                                                <h7>
                                                    {inProgressWorkOrder && inProgressWorkOrder[res.lineId]
                                                        ? inProgressWorkOrder[res.lineId].productivity
                                                        : ""}{" "}
                                                    {
                                                        lineIdData.find((item) => {
                                                            return res.lineId === item.lineId
                                                        }).productUnit
                                                    }
                                                    /phút
                                                </h7>
                                            </div>
                                            <div className="flex h-[12%]">
                                                <span className="w-[10%]">A:</span>
                                                <ProgressBar
                                                    height="100%"
                                                    textLimit={10}
                                                    value={
                                                        inProgressWorkOrder && inProgressWorkOrder[res.lineId]
                                                            ? Number(inProgressWorkOrder[res.lineId].a * 100).toFixed(1)
                                                            : 0
                                                    }
                                                    className="grow"
                                                    unit="%"
                                                    color="#3468C0"
                                                    fixed={2}
                                                />
                                            </div>
                                            <div className="flex h-[12%]">
                                                <span className="w-[10%]">P:</span>
                                                <ProgressBar
                                                    height="70%"
                                                    textLimit={10}
                                                    value={
                                                        inProgressWorkOrder && inProgressWorkOrder[res.lineId]
                                                            ? Number(inProgressWorkOrder[res.lineId].p * 100).toFixed(1)
                                                            : 0
                                                    }
                                                    className="grow"
                                                    unit="%"
                                                    color="#3468C0"
                                                    fixed={2}
                                                />
                                            </div>
                                            <div className="flex h-[12%]">
                                                <span className="w-[10%]">Q:</span>
                                                <ProgressBar
                                                    height="70%"
                                                    textLimit={10}
                                                    value={
                                                        inProgressWorkOrder && inProgressWorkOrder[res.lineId]
                                                            ? Number(inProgressWorkOrder[res.lineId].q * 100).toFixed(1)
                                                            : 0
                                                    }
                                                    className="grow"
                                                    unit="%"
                                                    color="#3468C0"
                                                    fixed={2}
                                                />
                                            </div>
                                            <div className="flex h-[12%]">
                                                <span className="w-[10%]">OEE:</span>
                                                <ProgressBar
                                                    height="70%"
                                                    textLimit={10}
                                                    value={
                                                        inProgressWorkOrder && inProgressWorkOrder[res.lineId]
                                                            ? Number(inProgressWorkOrder[res.lineId].oee * 100).toFixed(
                                                                  1,
                                                              )
                                                            : 0
                                                    }
                                                    className="grow"
                                                    unit="%"
                                                    color="#3468C0"
                                                    fixed={2}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        ))}
                </div>
            </Card>
            {openMenu && (
                <Card
                    className={cl(" h-[50%] w-[80%] z-20 bg-neutron-3 absolute left-[10%] flex flex-col gap-[2%] p-2")}
                >
                    <h1 className=" text-center">Danh sách các dây chuyền sản xuất</h1>
                    <div className=" flex flex-col">
                        <Button onClick={handleAdd}>Thêm mới</Button>
                    </div>
                    <div className=" ml-5 w-[95%] border-[0.2px] border-primary-1"></div>
                    <Table
                        activable
                        primary
                        sticky
                        headers={line_headers}
                        body={lineIdData} //mảng dữ liệu
                        className="mt-4"
                        onEdit={handleEdit}
                        onRowClick={handleTableRowClick}
                        onDeleteRow={handleDelete}
                        // enableIdClick
                        // idClickFunction={(e, row, index) => {
                        //     console.log(row)
                        //     navigate(`/setting/Test`, { state: row })
                        // }}
                    />
                    <Button bg={"red"} onClick={() => setOpenMenu(false)}>
                        Đóng
                    </Button>
                    {active && (
                        <PoperMenuNew
                            position={position}
                            onClose={handleClose}
                            menuNavigaton={initValue ? editLineMenu() : getLineMenu()}
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
                </Card>
            )}
            {isOpenDateFilter && (
                <Card className={cl("h-[30%] w-[30%] z-100 bg-neutron-4 absolute left-[35%] flex flex-col gap-4 p-4")}>
                    <h1 className="text-center text-2xl font-semibold mb-4">Lọc dữ liệu theo ngày</h1>
                    <div className="flex flex-col gap-2 mt-2">
                        <DateInput
                            id="startDate"
                            label="Ngày bắt đầu"
                            value={startDate}
                            setValue={setStartDate}
                            type="dayStart"
                            dayCompare={endDate}
                            inputType="date"
                        />
                        <DateInput
                            id="endDate"
                            label="Ngày kết thúc"
                            value={endDate}
                            setValue={setEndDate}
                            type="dayEnd"
                            dayCompare={startDate}
                            inputType="date"
                        />
                    </div>
                    {/* <Button className="" onClick={onButtonSearch}>
                        <FaSearch />
                    </Button> */}
                    <Button bg={"red"} onClick={onButtonReject}>
                        Đóng lại
                    </Button>
                </Card>
            )}
            {popupItemClick && (
                <Card className={cl("h-[30%] w-[30%] z-100 bg-neutron-4 absolute left-[35%] flex flex-col gap-4 p-4")}>
                    <h2 className="text-center">Chi tiết lệnh sản xuất {popupItemData.workOrderCode}</h2>
                    <div className=" h-[90%] w-full flex flex-col justify-around mt-2">
                        <div className=" w-full h-full flex items-center ">
                            <p className=" w-[35%]">Trạng thái:</p>
                            <h7 className=" w-[65%]">{popupItemData.status}</h7>
                        </div>
                        <div className=" w-full h-full flex items-center ">
                            <p className=" w-[35%]">Mã Ref:</p>
                            <h7 className=" w-[65%]">{popupItemData.referenceCode}</h7>
                        </div>
                        <div className=" w-full h-full flex items-center ">
                            <p className=" w-[35%]">Tên sản phẩm:</p>
                            <h7 className=" w-[65%]">{popupItemData.productName}</h7>
                        </div>
                        <div className=" w-full h-full flex items-center ">
                            <p className=" w-[35%]">Tiến độ:</p>
                            <h7 className=" w-[65%]">
                                {Number((popupItemData.goodProduct * 100) / popupItemData.size).toFixed(0)} %
                            </h7>
                        </div>
                        <div className=" w-full h-full flex items-center ">
                            <p className=" w-[35%]">Sản lượng:</p>
                            <h7 className=" w-[65%]">
                                {popupItemData.goodProduct}/{popupItemData.size}
                            </h7>
                        </div>
                        <div className=" w-full h-full flex items-center ">
                            <p className=" w-[35%]">Hiệu suất:</p>
                            <h7 className=" w-[65%]">{Number(popupItemData.p * 100).toFixed(0)}%</h7>
                        </div>
                        <div className=" w-full h-full flex items-center ">
                            <p className=" w-[35%]">Năng suất:</p>
                            <h7 className=" w-[65%]">{popupItemData.productivity} SP/phút </h7>
                        </div>
                        <div className=" w-full h-full flex items-center ">
                            <p className=" w-[35%]">Thời điểm bắt đầu:</p>
                            <h7 className=" w-[65%]">
                                {popupItemData && popupItemData["startTime"]
                                    ? convertDateFormat(popupItemData.startTime)
                                    : "Chưa bắt đầu"}
                            </h7>
                        </div>
                        <div className=" w-full h-full flex items-center ">
                            <p className=" w-[35%]">Thời điểm kết thúc:</p>
                            <h7 className=" w-[65%]">
                                {popupItemData && popupItemData["endTime"]
                                    ? convertDateFormat(popupItemData.endTime)
                                    : "Chưa kết thúc"}
                            </h7>
                        </div>
                    </div>

                    <Button bg={"red"} onClick={() => setPopupItemClick(false)}>
                        Đóng lại
                    </Button>
                </Card>
            )}
        </div>
    )
}

export default Dashboard
