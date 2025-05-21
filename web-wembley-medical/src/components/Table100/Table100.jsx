import { useState, useEffect, useMemo } from "react"
import Button from "../Button"
import cl from "classnames"
import { useCallApi } from "@/hooks"
import { machineApi } from "@/services/api"
import { toast } from "react-toastify"
import Card from "../Card"
import { useParams } from "react-router-dom"
import TextInput from "../TextInput"

function Table100({ data, tagName }) {
    const clnametb = " max-h-11 max-w-5 relative border-[2px] border-primary-2 p-1 rounded-lg "
    const callApi = useCallApi()
    const param = useParams()
    const [controlTable, setControlTable] = useState("Detection In-time")
    const [page, setPage] = useState(null)

    const [getApi, setGetApi] = useState()

    const matrixData = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => 0))
    const [sheetData, setSheetData] = useState(Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => 0)))

    const columns = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K"]
    const rows = Array.from({ length: 10 }, (_, i) => 10 - i)

    const [tagId, setTagId] = useState([])
    const [name, setName] = useState([])
    const [openPopup, setOpenPopup] = useState(0)
    // const handleGetData = () => {
    //     callApi(
    //         () =>
    //             machineApi.dataHistory100.getData100(new Date().toLocaleDateString(), new Date().toLocaleDateString()),
    //         (res) => setGetApi(res.data),
    //         "Truy xuất dữ liệu thành công",
    //         (err) => toast.error(err.message),
    //     )
    // }

    // useEffect(() => {
    //     try {
    //         if (getApi && getApi.length > 0) {
    //             const newMatrixData = Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => 0))
    //             getApi[page].cells.forEach(({ row, column, value }) => {
    //                 newMatrixData[row][column] = value
    //             })
    //             setSheetData(newMatrixData)
    //         }
    //     } catch {
    //         toast.error("Không có dữ liệu")
    //     }
    // }, [page])
    const handleCreate = () => {
        if (name.length > 0 && tagId.length > 0) {
            callApi(
                () =>
                    machineApi.tagId.postTagId({
                        stationId: param.stationId,
                        vars: [{ name: name, tagId: tagId, varType: 2 }],
                    }),
                (res) => setOpenPopup(0),
                "Tạo biến thành công",
            )
        }
    }
    const handleDelete = () => {
        if (tagName && tagName.matrixVars.length > 0) {
            callApi(
                () =>
                    machineApi.tagId.deleteTagId({
                        data: {
                            templateId: tagName.templateId,
                            varNames: [String(tagName.matrixVars[0].name)],
                        },
                    }),
                () => {},
                "Xóa thành công",
            )
        }
    }
    // const handleChange = () => {
    //     if(name.length>0 && tagId.length>0){

    //     callApi(() => machineApi.tagId.patchTagId({
    //         stationId: param.stationId,
    //         vars: [{ name:name, tagId:tagId , varType: 2 }],
    //     }), "Tạo biến thành công"
    //     )
    //     }
    // }
    const matrixVars = useMemo(() => tagName?.matrixVars?.[0], [tagName])
    const maxTagValue = useMemo(() => data?.[`${matrixVars?.tagId}_MAX`]?.TagValue || 0, [data, matrixVars])
    const minTagValue = useMemo(() => data?.[`${matrixVars?.tagId}_MIN`]?.TagValue || 0, [data, matrixVars])

    const getCellBackground = (col, row) => {
        const cellData = data?.[`${matrixVars?.tagId}_${col}${row}`]?.TagValue
        if (cellData === undefined) return "bg-neutron-4"
        return cellData >= minTagValue && cellData <= maxTagValue
            ? "bg-[rgba(60,179,113,0.85)]"
            : "bg-[rgba(233,34,34,0.85)]"
    }

    return (
        <div className=" flex w-full h-full">
            <div className=" flex flex-col gap-2 w-[18%] h-full p-1">
                <div className=" h-[50%] w-full flex flex-col border rounded-lg shadow-type1 p-3 gap-2 bg-neutron-4">
                    <div className=" h-[10%] w-full flex">
                        <h6 className=" w-[60%]">Tên biến:</h6>
                        <h7 className=" w-[40%]">
                            {tagName && tagName.matrixVars.length > 0 ? tagName.matrixVars[0].tagId : ""}
                        </h7>
                    </div>
                    <div className=" h-[10%] w-full flex">
                        <h6 className=" w-[60%]">Giá trị lớn nhất:</h6>
                        <h7 className=" w-[40%]">
                            {tagName && tagName.matrixVars.length > 0
                                ? data && data[`${tagName.matrixVars[0].tagId}_MAX`]
                                    ? data[`${tagName.matrixVars[0].tagId}_MAX`].TagValue
                                    : 0
                                : 0}
                        </h7>
                    </div>
                    <div className=" h-[10%] w-full flex">
                        <h6 className=" w-[60%]">Giá trị nhỏ nhất:</h6>
                        <h7 className=" w-[40%]">
                            {tagName && tagName.matrixVars.length > 0
                                ? data && data[`${tagName.matrixVars[0].tagId}_MIN`]
                                    ? data[`${tagName.matrixVars[0].tagId}_MIN`].TagValue
                                    : 0
                                : 0}
                        </h7>
                    </div>
                    <Button onClick={() => setOpenPopup(1)}>Tạo tên biến </Button>
                    <Button bg={"rgba(233,34,34,0.85)"} onClick={() => setOpenPopup(2)}>
                        Xóa tên biến
                    </Button>
                </div>
            </div>
            <table className=" h-full w-[97%] ml-5 text-[1.2rem] table-auto border-separate border-spacing-y-2 border-spacing-x-2 text-center">
                <thead className="sticky top-0 z-10 min-h-10 bg-primary-1 text-center text-[white]">
                    <tr>
                        <th></th>
                        {columns.map((col) => (
                            <th key={col} className={clnametb}>
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row}>
                            <td className=" bg-primary-1 text-neutron-4 relative border-[2px] border-primary-2 p-1 rounded-lg">
                                {row}
                            </td>
                            {columns.map((col) => (
                                <td
                                    key={`${col}${row}`}
                                    className={cl(
                                        "border px-4 py-2 text-center rounded-xl",
                                        getCellBackground(col, row),
                                    )}
                                >
                                    {tagName && tagName.matrixVars.length > 0
                                        ? data && data[`${tagName.matrixVars[0].tagId}_${col}${row}`]
                                            ? data[`${tagName.matrixVars[0].tagId}_${col}${row}`].TagValue
                                            : 0
                                        : 0}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {openPopup === 1 && (
                <Card
                    className={
                        " absolute top-[30%] left-[30%] h-[30%] w-[40%] flex flex-col justify-around items-center p-[1%] z-20 bg-neutron-4"
                    }
                >
                    <TextInput
                        id="Nhãn hiển thị"
                        label="Nhãn hiển thị"
                        value={name}
                        setValue={setName}
                        // isError={validateUsername}
                        // setValidateRows={setValidate}
                    />
                    <TextInput
                        id="Tên biến"
                        label="Tên biến"
                        value={tagId}
                        setValue={setTagId}
                        // isError={validateUsername}
                        // setValidateRows={setValidate}
                    />
                    <Button onClick={handleCreate} className={"h-[20%] w-[30%]"}>
                        Xác nhận
                    </Button>
                    <Button bg={"rgba(233,34,34,0.85)"} onClick={() => setOpenPopup(0)} className={"h-[20%] w-[30%]"}>
                        Đóng lại
                    </Button>
                </Card>
            )}
            {openPopup === 2 && (
                <Card
                    className={
                        " absolute top-[30%] left-[30%] h-[30%] w-[40%] flex flex-col justify-around items-center p-[1%] z-20 bg-neutron-4"
                    }
                >
                    <h2>Xóa tên biến: {tagName.matrixVars[0].name}</h2>

                    <Button onClick={handleDelete} className={"h-[20%] w-[30%]"}>
                        Xác nhận
                    </Button>
                    <Button bg={"rgba(233,34,34,0.85)"} onClick={() => setOpenPopup(0)} className={"h-[20%] w-[30%]"}>
                        Đóng lại
                    </Button>
                </Card>
            )}
        </div>
    )
}
export default Table100
