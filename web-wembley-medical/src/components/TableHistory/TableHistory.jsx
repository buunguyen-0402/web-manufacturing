import Card from "../Card"
import Button from "../Button"
import { useState } from "react"
import { machineApi } from "@/services/api"

function TableHistory({ param }) {
    const clnametb =
        " min-h-11 relative border-t-[1px] border-b-[1px] border-primary-2 p-2 first:rounded-bl-lg first:rounded-tl-lg first:border-l-[1px] last:rounded-br-lg last:rounded-tr-lg last:border-r-[1px]"

    const [historyData, setHistoryData] = useState([])

    const handleHistory = () => {
        const startDay = document.getElementById("startDay").value
        const endDay = document.getElementById("endDay").value
        const getHistory = machineApi.errorInformation.getErrorInformation(param.stationId, startDay, endDay)
        getHistory.then((res) => setHistoryData(res.data))
    }
    return (
        <>
            <Card className="h-[5rem] w-full flex justify-around items-center text-xl font-semibold">
                <span>Mã máy: {param.stationId}</span>
                <span>Từ ngày:</span>
                <input type="date" id="startDay" />
                <span>Đến ngày:</span>
                <input type="date" id="endDay" />
                <Button onClick={handleHistory} disabled={false}>
                    Truy xuất
                </Button>
            </Card>
            <div className="h-[38rem] w-full text-center text-xl font-normal rounded-2xl shadow-main mt-5 overflow-y-scroll no-scrollbar">
                <table className=" h-fit w-[97%] ml-5 table-auto border-separate border-spacing-y-2 text-center">
                    <thead className="sticky top-0 z-10 bg-primary-1 text-center">
                        <tr className=" text-neutron-4">
                            <th className=" first:rounded-tl-lg last:rounded-tr-lg h-11">
                                <span>Ngày/Tháng/Năm</span>
                            </th>
                            <th className=" first:rounded-tl-lg last:rounded-tr-lg h-11">
                                <span>Thời gian</span>
                            </th>
                            <th className=" first:rounded-tl-lg last:rounded-tr-lg h-11">
                                <span>Ca</span>
                            </th>
                            <th className=" first:rounded-tl-lg last:rounded-tr-lg h-11">
                                <span>Mã lỗi</span>
                            </th>
                            <th className=" first:rounded-tl-lg last:rounded-tr-lg h-11">
                                <span>Tên lỗi</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {historyData.length > 0 ? (
                            historyData.map((res) => (
                                <tr className=" group rounded-md even:bg-neutron-3">
                                    <td className={clnametb}>
                                        {res.timestamp ? String(res.timestamp).slice(0, 10) : ""}
                                    </td>
                                    <td className={clnametb}>{String(res.timestamp).slice(11, 19)}</td>
                                    <td className={clnametb}>{res.shiftNumber}</td>
                                    <td className={clnametb}>{res.errorId}</td>
                                    <td className={clnametb}>{res.errorName}</td>
                                </tr>
                            ))
                        ) : (
                            <td>Loading...</td>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}
export default TableHistory
