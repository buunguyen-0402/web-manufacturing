import Card from "../Card"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { machineApi } from "@/services/api"

function TabBarParamater({ allLines }) {
    const navigate = useNavigate()
    const clname = "w-[17rem] h-[2.5rem] rounded-xl bg-[rgba(217,217,217,1)]"
    // const clnametb = " min-h-11 relative border-t-[1px] border-b-[1px] border-primary-2 p-2 first:rounded-bl-lg first:rounded-tl-lg first:border-l-[1px] last:rounded-br-lg last:rounded-tr-lg last:border-r-[1px]"

    // const [statusMembers, setStatusMembers] = useState(false)
    // const [allMembers, setAllMembers] = useState([])
    const [productNames, setProductNames] = useState([])
    const [refNames, setRefNames] = useState([])

    const [changeLine, setChangeLine] = useState("")
    const [changeProduct, setChangeProduct] = useState("")
    const [changeRef, setChangeRef] = useState("")

    useEffect(() => {
        machineApi.product.getProductsByLineId(changeLine).then((res) => setProductNames(res.data))
    }, [changeLine])
    useEffect(() => {
        machineApi.reference
            .getReferenceByProductIdAndLineId(changeProduct, changeLine)
            .then((res) => setRefNames(res.data))
    }, [changeProduct])
    // console.log(changeRef)

    const handleChangeLine = (e) => {
        setChangeLine(e.target.value)
    }
    const handleChangeProduct = (e) => {
        setChangeProduct(e.target.value)
    }
    const handleChangeRef = (e) => {
        setChangeRef(e.target.value)
    }

    const handleAddLot = () => {
        const malo = document.getElementById("malo").value
        const soluonglo = document.getElementById("soluonglo").value
        machineApi.dropList.postDropData(changeRef, {
            lotCode: String(malo),
            lotSize: soluonglo,
        })
    }

    return (
        <>
            <Card
                className=" h-[8.5rem] w-full p-4 flex justify-around text-2xl font-semibold text-center text-[black]"
                onCLick={() => navigate()}
            >
                <div className="flex flex-col gap-7">
                    <span>Line:</span>
                    <span>Mã lô:</span>
                </div>
                <div className="flex flex-col gap-5">
                    <select className={clname} onChange={handleChangeLine}>
                        <option key="Chọn Line" value="">
                            Chọn Line
                        </option>
                        {allLines != [] ? (
                            allLines.map((res) => (
                                <option key={res} value={res}>
                                    {res}
                                </option>
                            ))
                        ) : (
                            <option>Loading...</option>
                        )}
                    </select>
                    <input id="malo" type="text" className={clname} />
                </div>
                <div className="flex flex-col gap-7">
                    <span>Tên SP:</span>
                    <span>Số lượng lô:</span>
                </div>
                <div className="flex flex-col gap-5">
                    <select className={clname} onChange={handleChangeProduct}>
                        <option key="Chọn Tên SP" value="">
                            Chọn Tên SP
                        </option>
                        {productNames != [] ? (
                            productNames.map((res) => (
                                <option key={res.productName} value={res.productId}>
                                    {res.productName}
                                </option>
                            ))
                        ) : (
                            <option>Loading...</option>
                        )}
                    </select>
                    <input id="soluonglo" type="text" className={clname} />
                </div>
                <div>
                    <span>Mã Ref:</span>
                </div>
                <div>
                    <select id="MaRef" className={clname} onChange={handleChangeRef}>
                        <option key="Chọn Mã Ref" value="">
                            Chọn Mã Ref
                        </option>
                        {refNames != [] ? (
                            refNames.map((res) => (
                                <option key={res.referenceId} value={res.referenceName}>
                                    {res.referenceName}
                                </option>
                            ))
                        ) : (
                            <option>Loading...</option>
                        )}
                    </select>
                </div>
                <button
                    className="cursor-pointer h-[3rem] w-[5rem] rounded-2xl bg-primary-1 text-neutron-4 hover:bg-primary-3"
                    onClick={handleAddLot}
                >
                    Tạo
                </button>
            </Card>
            {/* {statusMembers ? (
                <>
                    <Card className=" absolute top-[10.8rem]  z-10 h-[32.5rem] w-[30rem] bg-neutron-4 text-xl font-medium">
                        <button
                            className="h-[3rem] w-[3rem] shadow-sub rounded-full mt-1 ml-1 hover:bg-primary-3"
                            onClick={() => setStatusMembers(false)}
                        >
                            {" "}
                            X{" "}
                        </button>
                        <div className="h-fit w-full flex flex-col items-center p-3">
                            <div className=" h-full w-full flex items-center gap-8 ">
                                <span className="">Mã NV:</span>
                                <input
                                    id="MaNV"
                                    type="text"
                                    className="w-[14rem] h-[2.5rem] rounded-xl bg-[rgba(217,217,217,1)]"
                                />
                                <button
                                    className="cursor-pointer h-[3rem] w-[5rem] rounded-2xl bg-[#2F80ED] text-neutron-4 hover:bg-primary-3 mt-2"
                                    onClick={handleAddMembers}
                                >
                                    Thêm
                                </button>
                            </div>
                            <div className=" h-full w-full flex items-center gap-[1.8rem] mt-2">
                                <span>Tên NV: </span>
                                <input
                                    id="TenNV"
                                    type="text"
                                    className="w-[14rem] h-[2.5rem] rounded-xl bg-[rgba(217,217,217,1)]"
                                />
                            </div>
                        </div>
                        <div className=" h-[20rem] w-full p-3 text-center font-normal border-t overflow-y-scroll no-scrollbar">
                            <table className=" h-fit w-full table-auto border-separate border-spacing-y-2">
                                <thead className="sticky z-10 bg-primary-1">
                                    <tr className=" text-neutron-4">
                                        <th className=" first:rounded-tl-lg last:rounded-tr-lg h-11">
                                            <span>Mã nhân viên</span>
                                        </th>
                                        <th className=" first:rounded-tl-lg last:rounded-tr-lg h-11">
                                            <span>Tên nhân viên</span>
                                        </th>
                                        <th className=" first:rounded-tl-lg last:rounded-tr-lg h-11">
                                            <span></span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody key="tittle">
                                    {allMembers != [] ? (
                                        allMembers.map((res) => (
                                            <tr key={res.name} className="">
                                                <td className={clnametb}>{res.employeeId}</td>
                                                <td className={clnametb}>{res.employeeName}</td>
                                                <td className={clnametb}>
                                                    <button
                                                        className=" bg-warning-1 text-neutron-4 rounded-xl h-[2rem] w-[5rem] hover:bg-warning-2"
                                                        onClick={() => {
                                                            workerApi.deleteWorker(res.employeeId),
                                                                setAllMembers(
                                                                    allMembers.filter(
                                                                        (person) =>
                                                                            person.employeeId !== res.employeeId,
                                                                    ),
                                                                )
                                                        }}
                                                    >
                                                        Xóa
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
                        </div>
                    </Card>
                </>
            ) : (
                <></>
            )} */}
        </>
    )
}
export default TabBarParamater
