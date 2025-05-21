import { useState, useEffect } from "react"

function Table100TextAndNumber({ data, columnArray = [], rowArray = [], numberPage, valueMax, valueMin }) {
    // const columns = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K"] // Hàng ngang
    // const rows = Array.from({ length: 10 }, (_, i) => i + 1) // Hàng dọc từ 1 đến 10

    // Tạo mảng 2 chiều => grid[hang][cot]
    // const grid = rows.map((row) => columns.map((col) => `${col}${row}`))
    // console.log(grid[0][1])
    return (
        <>
            <div>
                <table className="h-full w-full text-[1.2rem] font-medium table-fixed border-separate border-spacing-y-2 border-spacing-x-2 text-center">
                    <thead className="sticky top-0 z-10 min-h-10 bg-primary-1 text-[white]">
                        <tr>
                            <th></th>
                            {columnArray.map((col) => (
                                <th key={col} className={" "}>
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rowArray.map((row, rowIndex) => (
                            <tr key={row} className={""}>
                                <th className=" sticky bg-primary-1 text-[white] rounded-xl min-h-10 ">{row}</th>
                                {columnArray.map((col) => (
                                    <td key={col} className=" border-[2px] border-primary-2 rounded-xl">
                                        {data && data[`EdtaChemical_${col}${row}`]
                                            ? data[`EdtaChemical_${col}${row}`].TagValue
                                            : 0}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}
export default Table100TextAndNumber
