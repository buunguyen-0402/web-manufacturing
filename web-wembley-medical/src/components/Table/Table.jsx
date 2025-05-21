import { useState, useEffect } from "react"
import { HiPencil } from "react-icons/hi"
import { BiSortDown, BiSortUp } from "react-icons/bi"
import { RiDeleteBin4Line } from "react-icons/ri"
import { MdExpandMore } from "react-icons/md"
import { MdAdd } from "react-icons/md"
import cl from "classnames"
import Card from "../Card"
import { BiDetail } from "react-icons/bi"
import Button from "../Button"

function Table({
    activable,
    onRowClick,
    onEdit,
    onDetails,
    headers = [],
    body = [],
    hightlight = false,
    colors = {},
    className,
    primary,
    sticky,
    unActive,
    onDeleteRow,
    onAdd,
    setMode,
    accordionTable = false, // = true thì bảng sẽ chuyển sang dạng accordion table
    accordionTableTitle = "",
    enableIdClick = false, //cho phép click vào id của hàng
    idClickFunction, // hàm thực thi khi click vào id của hàng
    columnSticky, // cột cố định đầu tiên
}) {
    const [activeIndex, setActiveIndex] = useState(null)
    const [accordionTableOpenState, setAccordionTableOpenState] = useState(true) // lưu state open cho accodion table
    const handleRowClick = (row, index) => {
        if (!onRowClick) return

        setActiveIndex(index)
        onRowClick(row, index)
    }

    const handleEdit = (e, row, index) => {
        e.stopPropagation()
        // if (accordionTableTitle == "Đơn vị phụ") {
        //     setMode("workUnit")
        // } else if (accordionTableTitle == "Công đoạn") {
        //     setMode("operation")
        // } else setMode("normal")
        onEdit(e, row, index, accordionTableTitle)
    }
    const handleDetails = (e, row, index) => {
        // if (accordionTableTitle == "Đơn vị phụ") {
        //     setMode("workUnit")
        // } else if (accordionTableTitle == "Công đoạn") {
        //     setMode("operation")
        // } else setMode("normal")
        onDetails(e, row, index, accordionTableTitle)
    }
    const handleDeleteRow = (e, row, index) => {
        e.stopPropagation()
        onDeleteRow(row, index)
    }
    const handleAddButtonClick = (e, row, index) => {
        e.stopPropagation()
        if (accordionTableTitle == "Đơn vị phụ") {
            setMode("workUnit")
        } else setMode("operation")
        onAdd(e)
    }
    const handleIdClick = (e, row, index) => {
        // console.log(row)
        idClickFunction(e, row, index)
    }
    useEffect(() => {
        if (unActive) {
            setActiveIndex(null)
        }
    }, [unActive])

    return (
        <>
            {(accordionTableOpenState || (!accordionTableOpenState && !accordionTable)) && (
                <Card data-component="Table" className={cl(className)}>
                    <table
                        className={cl("w-full table-auto", {
                            // " border-separate ": !activable,
                            "rounded-lg shadow-level1": activable,
                        })}
                    >
                        {activable ? (
                            <>
                                <thead
                                    className={cl({
                                        "sticky top-0 z-10": sticky,
                                        "bg-primary-1": primary,
                                        "bg-primary-2": !primary,
                                    })}
                                >
                                    <tr className={cl(" text-table text-neutron-4")}>
                                        {headers.map((column, index) => (
                                            <th
                                                className={cl(
                                                    `${!accordionTable && "first:rounded-tl-lg last:rounded-tr-lg"}`,
                                                    {
                                                        "sticky left-0 z-20 bg-primary-1": index === 0, // Cố định cột đầu tiên
                                                    },
                                                )}
                                                key={column.accessor}
                                            >
                                                <div className="flex items-center rounded-tl-lg rounded-tr-lg p-2">
                                                    {column.Header}

                                                    <span className="">
                                                        {column.isSorted ? (
                                                            column.isSortedDesc ? (
                                                                <BiSortDown />
                                                            ) : (
                                                                <BiSortUp />
                                                            )
                                                        ) : null}
                                                    </span>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {body.map((row, index) => {
                                        return (
                                            <tr
                                                className={cl("group relative", {
                                                    "even:bg-primary-4": activeIndex !== index,
                                                    "cursor-pointer hover:bg-hoverBg":
                                                        onRowClick && activeIndex !== index,
                                                    "bg-primary-2 text-neutron-4": activeIndex === index,
                                                })}
                                                onClick={() => handleRowClick(row, index)}
                                                key={index}
                                            >
                                                {headers.map((column, i) => (
                                                    <td
                                                        className={cl(
                                                            " p-2 group-last:first:rounded-bl-lg group-last:last:rounded-br-lg",
                                                            {
                                                                "sticky left-0 z-20 bg-primary-4 text-primary-1":
                                                                    i === columnSticky, // Cố định cột đầu tiên
                                                            },
                                                        )}
                                                        key={i}
                                                    >
                                                        <p
                                                            className={`${
                                                                i === 0 && enableIdClick && "cursor-pointer underline"
                                                            } w-full ${hightlight && colors[column.accessor] ? `${colors[column.accessor][row[column.accessor]]} + text-center` : ""}`}
                                                            onClick={(e) => {
                                                                if (i === 0 && enableIdClick) {
                                                                    handleIdClick(e, row, index)
                                                                }
                                                            }}
                                                        >
                                                            {Array.isArray(row[column.accessor])
                                                                ? row[column.accessor].join(", ")
                                                                : row[column.accessor]}
                                                        </p>
                                                        {onDetails &&
                                                            i === headers.length - 1 &&
                                                            activeIndex === index && (
                                                                <i
                                                                    className={cl(
                                                                        "absolute right-3 top-[50%] h-[30px] w-[30px] translate-y-[-50%]",
                                                                        "flex items-center justify-center rounded-full bg-accent-1 text-neutron-4",
                                                                        "heading-20-b invisible cursor-pointer group-hover:visible",
                                                                    )}
                                                                    onClick={(e) => handleDetails(e, row, index)}
                                                                >
                                                                    <Button>
                                                                        <BiDetail />
                                                                    </Button>
                                                                </i>
                                                            )}
                                                        {onEdit &&
                                                            i === headers.length - 1 &&
                                                            activeIndex === index && (
                                                                <i
                                                                    className={cl(
                                                                        "absolute right-[1rem] top-[50%] h-[2.5rem] w-[2.5rem] translate-y-[-50%]",
                                                                        "flex items-center justify-center rounded-full bg-accent-1 text-neutron-4",
                                                                        "heading-20-b invisible cursor-pointer group-hover:visible",
                                                                    )}
                                                                    onClick={(e) => handleEdit(e, row, index)}
                                                                >
                                                                    <HiPencil />
                                                                </i>
                                                            )}

                                                        {onDeleteRow &&
                                                            i === headers.length - 1 &&
                                                            activeIndex === index && (
                                                                <i
                                                                    className={cl(
                                                                        "absolute right-[4rem] top-[50%] h-[2.5rem] w-[2.5rem] translate-y-[-50%]",
                                                                        "flex items-center justify-center rounded-full text-neutron-4",
                                                                        "heading-20-b invisible mr-2 cursor-pointer bg-warning-1 group-hover:visible",
                                                                    )}
                                                                    onClick={(e) => handleDeleteRow(e, row, index)}
                                                                >
                                                                    <RiDeleteBin4Line />
                                                                </i>
                                                            )}
                                                    </td>
                                                ))}
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </>
                        ) : (
                            <>
                                <thead className={cl({ "sticky top-0 z-10 bg-neutron-4": sticky })}>
                                    <tr className="text-16-b border-b-[1px]  border-primary-3 text-left ">
                                        {headers.map((column) => (
                                            <th key={column.accessor}>
                                                <div className="flex items-center p-2">
                                                    {column.Header}
                                                    <span className="heading-20-b">
                                                        {column.isSorted ? (
                                                            column.isSortedDesc ? (
                                                                <BiSortDown />
                                                            ) : (
                                                                <BiSortUp />
                                                            )
                                                        ) : null}
                                                    </span>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {body.map((row, index) => {
                                        return (
                                            <tr
                                                className={cl(
                                                    " group rounded-md border-b-[1px] border-primary-3 bg-neutron-4",
                                                    {
                                                        "cursor-pointer hover:bg-hoverBg": onRowClick,
                                                    },
                                                )}
                                                onClick={() => handleRowClick(row, index)}
                                                key={index}
                                            >
                                                {headers.map((column, i) => (
                                                    <td
                                                        className={cl(
                                                            "min-h-11 relative   p-2",
                                                            // "first:rounded-bl-lg first:rounded-tl-lg first:border-l-[1px]    border-t-[1px] border-b-[1px]",
                                                            // "last:rounded-br-lg last:rounded-tr-lg last:border-r-[1px]",
                                                        )}
                                                        key={i}
                                                    >
                                                        {Array.isArray(row[column.accessor])
                                                            ? row[column.accessor].join(", ")
                                                            : row[column.accessor]}
                                                        {onDetails &&
                                                            i === headers.length - 1 &&
                                                            activeIndex === index && (
                                                                <i
                                                                    className={cl(
                                                                        "absolute right-3 top-[50%] h-[30px] w-[30px] translate-y-[-50%]",
                                                                        "flex items-center justify-center rounded-full bg-accent-1 text-neutron-4",
                                                                        "heading-20-b invisible cursor-pointer group-hover:visible",
                                                                    )}
                                                                    onClick={(e) => handleDetails(e, row, index)}
                                                                >
                                                                    <Button>
                                                                        <BiDetail />
                                                                    </Button>
                                                                </i>
                                                            )}
                                                        {onEdit && i === headers.length - 1 && (
                                                            <i
                                                                className={cl(
                                                                    "absolute right-1 top-[50%] h-[30px] w-[30px] translate-y-[-50%]",
                                                                    "flex items-center justify-center rounded-full text-accent-1",
                                                                    "heading-20-b invisible cursor-pointer hover:bg-hoverBg group-hover:visible",
                                                                )}
                                                                onClick={(e) => handleEdit(e, row, index)}
                                                            >
                                                                <HiPencil />
                                                            </i>
                                                        )}
                                                        {onDeleteRow && i === headers.length - 1 && (
                                                            <i
                                                                className={cl(
                                                                    "absolute right-8 top-[50%] h-[30px] w-[30px] translate-y-[-50%]",
                                                                    "flex items-center justify-center rounded-full text-warning-1",
                                                                    "heading-20-b invisible cursor-pointer hover:bg-warning-2 group-hover:visible",
                                                                )}
                                                                onClick={(e) => handleDeleteRow(e, row, index)}
                                                            >
                                                                <RiDeleteBin4Line />
                                                            </i>
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </>
                        )}
                    </table>
                </Card>
            )}
        </>
    )
}

export default Table
