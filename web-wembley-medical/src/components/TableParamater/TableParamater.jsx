import Card from "../Card"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { machineApi, workerApi } from "@/services/api"

function TableParamater() {
    const navigate = useNavigate()
    const clnametb =
        " min-h-11 relative border-t-[1px] border-b-[1px] border-primary-2 p-2 first:rounded-bl-lg first:rounded-tl-lg first:border-l-[1px] last:rounded-br-lg last:rounded-tr-lg last:border-r-[1px]"
    const figTable = ["Line", "Tên sản phẩm", "Mã Ref", "Mã lô", "Cỡ lô", "", ""]
    const [statusChange, setStatusChange] = useState(false)

    const [currentRefNameAndLine, setCurrentRefNameAndLine] = useState([])
    const [allParamaters, setAllParamaters] = useState([])
    const [allMembers, setAllMembers] = useState([])
    const [memberAtMachine, setMemberAtMachine] = useState()

    const [changeLine, setChangeLine] = useState()
    const [changeId, setChangeId] = useState()

    useEffect(() => {
        machineApi.reference.getAllParamaters().then((res) => setAllParamaters(res.data))
        workerApi.getAllWoker().then((res) => setAllMembers(res.data))
    }, [])
    useEffect(() => {
        machineApi.reference.getParamaterByLineId(currentRefNameAndLine[1]).then((res) => {
            const now = res.data[0].stations[0]
            return setMemberAtMachine({ stationId: now.stationId, employees: now.employees })
        })
    }, [currentRefNameAndLine])

    const handleDeleteLot = async (res) => {
        await machineApi.reference.deleteLot(res)
        machineApi.reference.getAllParamaters().then((res) => setAllParamaters(res.data))
    }

    const handleUpdateLot = async (res) => {
        const new1 = document.getElementById("newMaLo").value
        const new2 = document.getElementById("newSoLuongLo").value
        await machineApi.reference.putParamaters(res, {
            lotCode: String(new1),
            lotSize: new2,
        })
        machineApi.reference.getAllParamaters().then((res) => setAllParamaters(res.data))
    }

    const handleAddMemberMachine = async () => {
        await workerApi.createWorkerAtMachine(changeLine, {
            employeeIds: [String(changeId)],
        })
        // console.log(changeLine, {
        //     employeeIds: [String(changeId)],
        // })
        await machineApi.reference.getParamaterByLineId(currentRefNameAndLine[1]).then((res) => {
            const now = res.data[0].stations[0]
            return setMemberAtMachine({ stationId: now.stationId, employees: now.employees })
        })
    }

    const handleDeleteMemberAtMachine = async (id) => {
        await workerApi.deleteWorkerAtMachine(changeLine, {
            data: {
                employeeIds: [String(id)],
            },
        })
        await machineApi.reference.getParamaterByLineId(currentRefNameAndLine[1]).then((res) => {
            const now = res.data[0].stations[0]
            return setMemberAtMachine({ stationId: now.stationId, employees: now.employees })
        })
    }

    const handleChangeId = (e) => {
        setChangeId(e.target.value)
    }
    const handleChangeLine = (e) => {
        setChangeLine(e.target.value)
    }
    const handleChangeInfor = (res) => {
        setStatusChange(!statusChange)
        setCurrentRefNameAndLine([res.referenceName, res.line.lineId])
    }

    return (
        <>
            <Card
                className=" h-[70%] w-full mt-5 p-5 flex justify-around text-xl font-semibold text-center text-[black]"
                onCLick={() => navigate()}
            >
                <table className=" h-fit w-full table-auto border-separate border-spacing-y-2">
                    <thead className="sticky bg-primary-1">
                        <tr className=" text-neutron-4">
                            {figTable ? (
                                figTable.map((res, index) => (
                                    <th key={index} className=" first:rounded-tl-lg last:rounded-tr-lg h-11">
                                        <span>{res}</span>
                                    </th>
                                ))
                            ) : (
                                <></>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {allParamaters.length > 0 ? (
                            allParamaters.map((res) => (
                                <tr key={Math.random()} className=" group rounded-md bg-neutron-4">
                                    <td className={clnametb}>{res.line.lineId}</td>
                                    <td className={clnametb}>{res.productName}</td>
                                    <td className={clnametb}>{res.referenceName}</td>
                                    <td className={clnametb}>{res.lotCode}</td>
                                    <td className={clnametb}>{res.lotSize}</td>
                                    <td className={clnametb}>
                                        <button
                                            className=" bg-primary-2 text-neutron-4 rounded-xl h-[2.5rem] w-[12rem] hover:bg-primary-4"
                                            onClick={() => handleChangeInfor(res)}
                                        >
                                            Thay đổi thông tin
                                        </button>
                                    </td>
                                    <td className={clnametb}>
                                        <button
                                            className=" bg-warning-1 text-neutron-4 rounded-xl h-[2.5rem] w-[7rem] hover:bg-warning-2"
                                            onClick={() => handleDeleteLot(res.referenceName)}
                                        >
                                            Kết thúc
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td>Loading...</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </Card>
            {statusChange ? (
                <Card className=" w-[40rem] h-full text-xl font-medium text-center overflow-y-scroll no-scrollbar">
                    <div className=" flex justify-around">
                        <div className=" mt-2">
                            <span>Mã lô:</span>
                            <input
                                id="newMaLo"
                                type="text"
                                className="w-[8rem] h-[2.3rem] rounded-xl ml-2 mt-2 bg-[rgba(217,217,217,1)]"
                            />
                            <br />
                            <span>Cỡ lô:</span>
                            <input
                                id="newSoLuongLo"
                                type="text"
                                className="w-[8rem] h-[2.3rem] rounded-xl ml-3 mt-2 bg-[rgba(217,217,217,1)]"
                            />
                            <br />
                            <button
                                className="cursor-pointer h-[2.5rem] w-[6rem] rounded-2xl bg-primary-1 text-neutron-4 hover:bg-primary-3 mt-2"
                                onClick={() => handleUpdateLot(currentRefNameAndLine[0])}
                            >
                                Sửa lô
                            </button>
                        </div>
                        <div className=" flex flex-col justify-center items-center mt-2">
                            <select
                                id="MaMay"
                                className="w-[10rem] h-[2.3rem] rounded-xl bg-[rgba(217,217,217,1)] mt-2"
                                onChange={handleChangeLine}
                            >
                                <option>Mã máy</option>
                                {memberAtMachine && memberAtMachine.stationId ? (
                                    <option>{memberAtMachine.stationId}</option>
                                ) : (
                                    <></>
                                )}
                            </select>
                            <select
                                id="AddMaNV"
                                className="w-[10rem] h-[2.3rem] rounded-xl bg-[rgba(217,217,217,1)] mt-2"
                                onChange={handleChangeId}
                            >
                                <option>Mã NV</option>
                                {allMembers.length > 0 ? (
                                    allMembers.map((res) => (
                                        <option key={res.employeeId} value={res.employeeId}>
                                            {res.employeeId}
                                        </option>
                                    ))
                                ) : (
                                    <option>Loading...</option>
                                )}
                            </select>
                            <select
                                id="AddTenNV"
                                className="w-[10rem] h-[2.3rem] rounded-xl bg-[rgba(217,217,217,1)] mt-2"
                                // onChange={handleChangeName}
                            >
                                <option>Tên NV</option>
                                {allMembers.length > 0 ? (
                                    allMembers.map((res) => (
                                        <option key={res.employeeName} value={res.employeeName}>
                                            {res.employeeName}
                                        </option>
                                    ))
                                ) : (
                                    <option>Loading...</option>
                                )}
                            </select>
                            <button
                                className="cursor-pointer h-[2.5rem] w-[8rem] rounded-2xl bg-primary-1 text-neutron-4 hover:bg-primary-3 mt-2"
                                onClick={handleAddMemberMachine}
                            >
                                Thêm NV
                            </button>
                        </div>
                    </div>
                    <div className=" mt-2 border-t-2  ">
                        <h2 className="mt-2">Nhân viên đứng tại máy</h2>
                        <table className=" h-fit w-[82%] ml-10 table-auto border-separate border-spacing-y-2 text-center">
                            <thead className="sticky bg-primary-1">
                                <tr className=" text-neutron-4">
                                    <th className=" first:rounded-tl-lg last:rounded-tr-lg h-11">
                                        <span>Mã máy</span>
                                    </th>
                                    <th className=" first:rounded-tl-lg last:rounded-tr-lg h-11">
                                        <span>Mã NV</span>
                                    </th>
                                    <th className=" first:rounded-tl-lg last:rounded-tr-lg h-11">
                                        <span>Tên NV</span>
                                    </th>
                                    <th className=" first:rounded-tl-lg last:rounded-tr-lg h-11">
                                        <span></span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {memberAtMachine && memberAtMachine.employees ? (
                                    memberAtMachine.employees.map((res) => (
                                        <tr key={Math.random()} className=" group rounded-md bg-neutron-4">
                                            <td className={clnametb}>{changeLine}</td>
                                            <td className={clnametb}>{res.employeeId}</td>
                                            <td className={clnametb}>{res.employeeName}</td>
                                            <td className={clnametb}>
                                                <button
                                                    className=" bg-warning-1 text-neutron-4 rounded-xl h-[2rem] w-[5rem] hover:bg-warning-2"
                                                    onClick={() => handleDeleteMemberAtMachine(res.employeeId)}
                                                >
                                                    Xóa NV
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <td>Loading...</td>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            ) : (
                <></>
            )}
        </>
    )
}

export default TableParamater
