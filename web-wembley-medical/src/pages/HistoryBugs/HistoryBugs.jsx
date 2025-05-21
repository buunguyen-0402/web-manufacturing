import Button from "@/components/Button"
import Card from "@/components/Card"
import { useState, useRef, useEffect } from "react"
import { useParams } from "react-router-dom"
import React from "react"
import { FixedSizeList as List } from "react-window"
import { useCallApi } from "@/hooks"
import { convertDateFormat, convertDateFormatHistoryAndReport } from "@/utils/functions/dateTime"
import { authorizationApi, machineApi } from "@/services/api"
import { toast } from "react-toastify"
import { FaSearch } from "react-icons/fa"
import DateInput from "@/components/DateInput"
import { useSelector } from "react-redux"

function HistoryBugs() {
    const param = useParams()
    const callApi = useCallApi()
    const container = useRef()
    const user = useSelector((state) => state.auth)

    const [historyData, setHistoryData] = useState([])
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
    const [acceptRole, setAcceptRole] = useState()

    useEffect(() => {
        callApi(
            [
                machineApi.errorInformation.getErrorInformation(param.stationId, expectedStartTime, expectedEndTime),
                authorizationApi.role.getRole(),
            ],
            (res) => {
                setHistoryData(res[0].data)
                const filter = res[1].data.find((res) => String(res.roleName) === user.role).pages
                setAcceptRole(
                    filter.find((res) => String(res.name) === "Lịch sử lỗi" || String(res.name) === "Tất cả các trang"),
                )
            },
            `Truy xuất thành công`,
            (res) => toast.error(res.response.data.detail),
        )
    }, [])

    const handleHistory = () => {
        callApi(
            () => machineApi.errorInformation.getErrorInformation(param.stationId, expectedStartTime, expectedEndTime),
            (res) => {
                setHistoryData(res.data)
                toast.success("Truy xuất thành công")
            },
            "Truy xuất thành công",
            (res) => {
                toast.error(res.response.data.detail)
                toast.info("Kiểm tra lại ngày bắt đầu/ ngày kết thúc")
            },
        )
    }
    const Row = ({ index, style }) => (
        <div style={style} className=" w-full flex justify-center items-center text-left ">
            <span className=" w-[30%] p-2">
                {convertDateFormat(historyData[index].timestamp) ?? convertDateFormat(historyData[index].timestamp)}
            </span>
            <span className=" w-[10%] p-2">{historyData[index].errorCode}</span>
            <span className=" w-[60%] p-2">{historyData[index].errorName}</span>
        </div>
    )
    return (
        <div className=" flex flex-col items-center gap-[2%] h-full w-full">
            <Card className="h-[10%] w-full flex justify-around items-center bg-neutron-4">
                <div className=" flex items-center justify-center ">
                    <h6 className="">Mã trạm:</h6>
                    <h7>{param.stationId}</h7>
                </div>
                <DateInput
                    id="startDate"
                    label="Ngày bắt đầu"
                    value={expectedStartTime}
                    setValue={setExpectedStartTime}
                    type="dayStart"
                    dayCompare={expectedEndTime}
                    inputType="date"
                    className={" h-[80%] w-[30%]"}
                />
                <DateInput
                    id="endDate"
                    label="Ngày kết thúc"
                    value={expectedEndTime}
                    setValue={setExpectedEndTime}
                    type="dayEnd"
                    dayCompare={expectedStartTime}
                    inputType="date"
                    className={" h-[80%] w-[30%]"}
                />
                {acceptRole &&
                    ["Tất cả các thao tác", "Truy xuất thông tin"].some((role) =>
                        acceptRole.buttons.includes(role),
                    ) && (
                        <Button onClick={handleHistory}>
                            <FaSearch />
                        </Button>
                    )}
            </Card>
            <div
                ref={container}
                className="h-[85%] w-full text-center font-normal rounded-2xl shadow-type1 mt-4  bg-[#FEFEFE]"
            >
                <div className=" flex flex-col w-full">
                    <div className=" w-full flex justify-center items-center text-left text-[white] font-semibold">
                        <span className=" w-[30%] bg-primary-1 rounded-tl-lg p-2">Thời gian</span>
                        <span className=" w-[10%] bg-primary-1 p-2">Mã lỗi</span>
                        <span className=" w-[60%] bg-primary-1 rounded-tr-lg p-2">Tên lỗi</span>
                    </div>
                    {container.current && historyData && (
                        <List
                            height={container.current.getBoundingClientRect().height * 0.9}
                            itemCount={historyData.length}
                            itemSize={Number(container.current.getBoundingClientRect().height * 0.09)}
                            width={"100%"}
                        >
                            {Row}
                        </List>
                    )}
                </div>
            </div>
        </div>
    )
}

export default HistoryBugs
