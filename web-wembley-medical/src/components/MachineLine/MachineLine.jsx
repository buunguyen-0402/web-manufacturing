import cl from "classnames"
import { ColorStatus } from "@/utils/constants"
import Radialbar from "../Radialbar"
import { machineApi } from "@/services/api"
import { useState, useEffect } from "react"
import { convertToSecond, convertToHour, convertDateFormat } from "@/utils/functions"
import { useCallApi } from "@/hooks"
import Card from "../Card"
import { ColumnChart } from "../Chart"

function MachineLine({
    statusInfor = false,
    children,
    CLassname,
    stationId,
    lineName,
    stationName,
    lineData,
    data,
    keyTag,
    ...prop
}) {
    const callApi = useCallApi()
    const [currStatus, setCurrStatus] = useState()
    const [timeRun, setTimeRun] = useState(0)
    const [expectedStartTime, setExpectedStartTime] = useState(() => {
        const now = new Date()
        now.setDate(now.getDate())
        return now.toISOString().slice(0, 10)
    })
    const [expectedEndTime, setExpectedEndTime] = useState(() => {
        const now = new Date()
        now.setDate(now.getDate() + 1)
        return now.toISOString().slice(0, 10)
    })
    useEffect(() => {
        callApi(
            [
                machineApi.currentStatus.getCurrentStatus(lineName),
                machineApi.currentStatus.getAllStatusTime(lineName, expectedStartTime, expectedEndTime),
            ],
            (res) => {
                setCurrStatus(() => {
                    const result = res[0].data.reduce((acc, obj) => {
                        if (obj.status === 0) {
                            acc.ON = obj
                        } else if (obj.status === 5) {
                            acc.OFF = obj
                        }
                        return acc
                    }, {})
                    return result
                })
                setTimeRun(convertToSecond(res[1].data.runTime))
            },
        )
    }, [])

    useEffect(() => {
        if (Number(data?.machineStatus?.TagValue) === 1) {
            const interval = setInterval(() => setTimeRun((prev) => prev + 1), 1000)
            return () => clearInterval(interval)
        }
    }, [data?.machineStatus?.TagValue])

    return (
        <Card className={cl(" flex flex-col p-1 w-full bg-neutron-4", CLassname)} {...prop}>
            <h4>
                {lineName} - {stationName}
            </h4>

            <div className=" flex justify-between h-[8%] w-full">
                {ColorStatus.map((res, index) => (
                    <div
                        key={res.name}
                        className={cl(
                            ` flex justify-center items-center h-full w-[15%] font-semibold rounded-2xl ${
                                (data && data["machineStatus"] ? Number(data["machineStatus"].TagValue) : 5) === index
                                    ? `${res.color} + text-[white] + shadow-level1`
                                    : " shadow-inner1"
                            }`,
                        )}
                    >
                        <span key={res.name}>{res.name}</span>
                    </div>
                ))}
            </div>
            <div className=" h-[92%] w-full flex items-center overflow-y-scroll">
                <div className=" h-full w-[38%]">
                    <ColumnChart
                        height={"90%"}
                        width={"100%"}
                        name={"Sản lượng"}
                        zoom={false}
                        dataChartX={["Cỡ lô", "Sản xuất", "Đạt", "Lỗi"]}
                        dataChartValue={[
                            lineData && lineData["size"] ? Number(lineData.size) : 0,
                            data && data["productCount"] ? Number(data["productCount"].TagValue) : 0,
                            data && data["goodProduct"] ? Number(data["goodProduct"].TagValue) : 0,
                            data && data["errorProduct"] ? Number(data["errorProduct"].TagValue) : 0,
                        ]}
                        fontSize={"1rem"}
                        nameY={false}
                        unit={""}
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
                <div className=" flex flex-col justify-center items-center h-full w-[24%] ">
                    <div className=" w-full h-[60%]">
                        <Radialbar
                            value={data && data["EFF"] ? Number(data["EFF"].TagValue) : 0}
                            labelName={"Chất lượng"}
                            height={"100%"}
                            width={"100%"}
                            fontSize={"1rem"}
                        />
                    </div>
                    <span className=" h-[39%] w-full  flex flex-col items-center justify-center p-2">
                        <h6>Năng suất</h6>
                        <h7 className="">
                            {data && data["productivity"] ? Number(data["productivity"].TagValue).toFixed(0) : 0}{" "}
                            Sp/phút
                        </h7>
                    </span>
                </div>

                <div className=" h-full w-[39%] p-1 flex flex-col flex-1">
                    <div className=" w-full h-fit flex  gap-1">
                        <p className=" ">Bật máy lúc:</p>
                        <h7>{currStatus && currStatus["ON"] ? convertDateFormat(currStatus["ON"].timestamp) : ""}</h7>
                    </div>
                    <div className=" w-full h-fit flex  gap-1">
                        <p className=" ">Thời gian RUN trong ngày:</p>
                        <h7>{timeRun ? convertToHour(timeRun) : 0}</h7>
                    </div>
                    <div
                        className={cl(
                            " w-full h-fit flex  gap-1",
                            data && data["isConnectPLC"] && Number(data["isConnectPLC"].TagValue)
                                ? "text-primary-2 "
                                : "text-warning-1",
                        )}
                    >
                        <p className=" text-neutron-1">Trạng thái PLC:</p>
                        <p className=" font-bold">
                            {data && data["isConnectPLC"] && Number(data["isConnectPLC"].TagValue)
                                ? "Đã kết nối"
                                : "Mất kết nối"}
                        </p>
                    </div>
                    {statusInfor && (
                        <>
                            <div className=" w-full h-fit flex  gap-1">
                                <p className=" ">Trưởng line:</p>
                                <h7>{lineData?.lineManager}</h7>
                            </div>
                            <div className=" w-full h-fit flex  gap-1">
                                <p className=" ">Lệnh sản xuất:</p>
                                <h7>{lineData?.workOrderCode}</h7>
                            </div>
                            <div className=" w-full h-fit flex  gap-1">
                                <p className=" ">Mã Ref:</p>
                                <h7>{lineData?.referenceCode}</h7>
                            </div>
                            <div className=" w-full h-fit flex  gap-1">
                                <p className=" ">Mã lô:</p>
                                <h7>{lineData?.lotCode}</h7>
                            </div>
                            <div className=" w-full h-fit flex gap-1">
                                <p className=" ">Cỡ lô:</p>
                                <h7>{lineData?.size}</h7>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Card>
    )
}
export default MachineLine
