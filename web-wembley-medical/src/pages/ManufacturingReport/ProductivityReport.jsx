import { useNavigate } from "react-router-dom"
import Card from "@/components/Card"
import SelectInput from "@/components/SelectInput"
import DateInput from "@/components/DateInput"
import { useState, useEffect, useCallback } from "react"
import cl from "classnames"
import Button from "@/components/Button"
import { PiBackspaceBold } from "react-icons/pi"
import Table from "@/components/Table"
import Confirm from "@/components/Confirm"
import { dailyReport_headers } from "@/utils/tableColumns"
import { useCallApi } from "@/hooks"
import { authorizationApi, machineApi } from "@/services/api"
import { convertDateFormatHistoryAndReport, handleManufacturingData, dateFormatRenderVi } from "@/utils/functions"
import { FaSearch } from "react-icons/fa"
import { useSelector } from "react-redux"

function ProductivityReport() {
    const navigate = useNavigate()
    const callApi = useCallApi()
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

    const [line, setLine] = useState([])
    const [allLine, setAllLine] = useState([])
    const [lineRender, setLineRender] = useState()
    const [lineList, setLineList] = useState([])

    const [listWorkOrders, setListWorkOrders] = useState([])
    const [acceptRole, setAcceptRole] = useState()

    const fetchLineData = useCallback(() => {
        callApi(
            [machineApi.line.getAllLine(), authorizationApi.role.getRole()],
            (res) => {
                setAllLine(res[0].data)
                setLineList(res[0].data.map((res) => ({ key: res.lineName, value: res.lineId })))
                const filter = res[1].data.find((res) => String(res.roleName) === user.role).pages
                setAcceptRole(
                    filter.find(
                        (res) =>
                            String(res.name) === "Báo cáo lệnh sản xuất theo ngày" ||
                            String(res.name) === "Tất cả các trang",
                    ),
                )
            },
            "Truy xuất thành công",
        )
    }, [callApi])
    useEffect(() => {
        fetchLineData()
    }, [fetchLineData])

    const handleSearch = () => {
        callApi(
            () =>
                machineApi.workOrders.getWorkOrderDailyByLineIdAndStartAndEndTime(
                    line,
                    expectedStartTime,
                    expectedEndTime,
                ),
            (res) => {
                setListWorkOrders(res.data.workOrders.sort((a, b) => b.workOrderCode.localeCompare(a.workOrderCode)))
            },
            "Truy xuất thành công",
        )
        setLineRender(allLine.filter((res) => String(res.lineId) === String(line))[0])
        setMode(false)
    }

    // console.log(listWorkOrders)
    return (
        <div className=" h-full w-full flex flex-col justify-between">
            <div className=" h-[7%] w-full flex items-center justify-between">
                <Button bg={"white"} onClick={() => navigate("/manufacturing-report")}>
                    <PiBackspaceBold color="black" />
                </Button>
                <Button onClick={() => setMode(true)}>Truy xuất dữ liệu</Button>
                <Card className={"h-full w-[82%] flex justify-around items-center p-1 bg-neutron-4"}>
                    <h6>Dây chuyền sản xuất: </h6>
                    <h7>{lineRender && lineRender["lineName"] ? lineRender.lineName : ""}</h7>
                    <h6>Khoảng thời gian: </h6>
                    <h7>
                        Từ {dateFormatRenderVi(expectedStartTime)} đến {dateFormatRenderVi(expectedEndTime)}
                    </h7>
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
                            label="Tên máy"
                            list={lineList}
                            id={1}
                            value={line}
                            setValue={setLine}
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
            <Card className={cl(" h-[92%] w-full justify-center items-center bg-neutron-4")}>
                <h1 className=" text-center">Danh sách các lệnh sản xuất theo ngày</h1>
                <div className={" h-[93%] w-full overflow-scroll"}>
                    <Table
                        activable
                        primary
                        sticky
                        headers={dailyReport_headers}
                        body={handleManufacturingData(listWorkOrders)} //mảng dữ liệu
                        className=" w-[350%]"
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
                        // onRowClick={handleTableRowClick}
                        // onDeleteRow={handleDelete}
                        // enableIdClick
                        // idClickFunction={(e, row, index) => {
                        //     console.log(row)
                        //     navigate(`/setting/Test`, { state: row })
                        // }}
                    />
                </div>
            </Card>
        </div>
    )
}
export default ProductivityReport
