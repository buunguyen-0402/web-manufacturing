import { MdOutlineSearch, MdSelectAll } from "react-icons/md"
// import { HiOutlineDotsHorizontal } from "react-icons/hi"
import { FaTable, FaChartBar } from "react-icons/fa"
import Button from "@/components/Button"
import cl from "classnames"
import DateInput from "@/components/DateInput"

function OeeSearchBar({
    param,
    searchInput,
    setSearchInput,
    filter,
    setFilter,
    dayStart,
    setDayStart,
    dayEnd,
    setDayEnd,
    interval,
    setInterval,
    stateFilter,
    setStateFilter,
    handleExportExcel,
    type = "CMMSMaintenance",
    modeEachShift = true,
    CLassName,
}) {
    return (
        <>
            {/* <div className="flex justify-around text-[1.25rem] font-semibold w-[20%] items-center z-10">
                <span className=" text-primary-2">Mã máy:</span>
                <span>{param}</span>
            </div> */}
            <div
                className={cl(
                    " flex justify-around items-center sticky -top-5 rounded-xl bg-neutron-4 p-1 z-10",
                    CLassName,
                )}
            >
                {/* <input
                    className="h-10 flex-1 rounded-l-lg border bg-neutron-4 p-4"
                    placeholder="Tìm kiếm..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                ></input> */}

                {type == "CMMSMaintenance" && (
                    <>
                        <DateInput
                            id="startDate"
                            label="Ngày bắt đầu"
                            value={dayStart}
                            setValue={setDayStart}
                            type="dayStart"
                            dayCompare={dayEnd}
                            inputType="date"
                            className={" h-[80%] w-[24%]"}
                        />
                        <DateInput
                            id="endDate"
                            label="Ngày kết thúc"
                            value={dayEnd}
                            setValue={setDayEnd}
                            type="dayEnd"
                            dayCompare={dayStart}
                            inputType="date"
                            className={" h-[80%] w-[24%]"}
                        />
                        <div className="flex w-[12%] gap-1 items-center justify-center">
                            <h6 className="w-[90%] h-full">Mức chi tiết:</h6>
                            <input
                                className=" w-[50%] text-primary-2 cursor-pointer rounded-lg border bg-neutron-4 p-1"
                                value={interval}
                                onChange={(e) => setInterval(e.target.value)}
                                type="text"
                            />
                        </div>
                    </>
                )}
                {modeEachShift && (
                    <div
                        className="w-[3%] cursor-pointer flex justify-center items-center rounded-xl bg-primary-1 text-4xl text-neutron-4"
                        onClick={searchInput}
                    >
                        <MdOutlineSearch />
                    </div>
                )}
                <div className=" h-full w-[15%] flex justify-between ">
                    <div
                        onClick={() => setFilter(0)}
                        title="Tất cả"
                        className={`${filter === 0 && "!bg-maintenanceStatus-0 !text-neutron-4"} ${
                            filter !== 0 && "border !border-maintenanceStatus-0 !bg-neutron-4 !text-maintenanceStatus-0"
                        }  flex h-full w-[20%] cursor-pointer items-center justify-center rounded-l-lg  transition-all`}
                    >
                        All
                    </div>
                    <div
                        onClick={() => setFilter(1)}
                        title="Giá trị OEE"
                        className={`${filter === 1 && "!bg-maintenanceStatus-1 !text-neutron-4"} ${
                            filter !== 1 && "border !border-maintenanceStatus-1 !bg-neutron-4 !text-maintenanceStatus-1"
                        }  flex h-full w-[20%] cursor-pointer items-center  justify-center  text-neutron-4 transition-all`}
                    >
                        OEE
                    </div>
                    <div
                        onClick={() => setFilter(2)}
                        title="Giá trị A"
                        className={`${filter === 2 && "!bg-maintenanceStatus-2 !text-neutron-4"} ${
                            filter !== 2 && "border !border-maintenanceStatus-2 !bg-neutron-4 !text-maintenanceStatus-2"
                        }  flex h-full w-[20%] cursor-pointer items-center justify-center bg-maintenanceStatus-2   text-neutron-4 transition-all`}
                    >
                        A
                    </div>
                    <div
                        onClick={() => setFilter(3)}
                        title="Giá trị P"
                        className={`${filter === 3 && "!bg-maintenanceStatus-3 !text-neutron-4"} ${
                            filter !== 3 && "border !border-maintenanceStatus-3 !bg-neutron-4 !text-maintenanceStatus-3"
                        } flex h-full w-[20%] cursor-pointer items-center justify-center bg-maintenanceStatus-3 text-neutron-4 transition-all`}
                    >
                        P
                    </div>
                    <div
                        onClick={() => setFilter(4)}
                        title="Giá trị Q"
                        className={`${filter === 4 && "!bg-maintenanceStatus-4 !text-neutron-4"} ${
                            filter !== 4 && "border !border-maintenanceStatus-4 !bg-neutron-4 !text-maintenanceStatus-4"
                        } flex h-full w-[20%] cursor-pointer items-center justify-center  rounded-r-lg bg-maintenanceStatus-4  text-neutron-4 transition-all`}
                    >
                        Q
                    </div>
                </div>
                <div className=" h-full w-[11%] flex justify-between">
                    <div
                        onClick={() => setStateFilter(0)}
                        title="Hiện tất cả"
                        className={`${stateFilter === 0 && "!bg-maintenanceStatus-0 !text-neutron-4"} ${
                            stateFilter !== 0 &&
                            "border !border-maintenanceStatus-0 !bg-neutron-4 !text-maintenanceStatus-0"
                        }  flex h-full w-[33%] cursor-pointer items-center justify-center rounded-l-lg bg-[#FFAF45] text-3xl text-neutron-4 transition-all`}
                    >
                        <MdSelectAll />
                    </div>
                    <div
                        onClick={() => setStateFilter(1)}
                        title="Hiển thị dạng đồ thị"
                        className={`${stateFilter === 1 && "!bg-maintenanceStatus-4 !text-neutron-4"} ${
                            stateFilter !== 1 &&
                            "border !border-maintenanceStatus-4 !bg-neutron-4 !text-maintenanceStatus-4"
                        }  flex h-full w-[33%] cursor-pointer items-center justify-center  bg-maintenanceStatus-4 text-3xl text-neutron-4 transition-all`}
                    >
                        <FaChartBar />
                    </div>
                    <div
                        onClick={() => setStateFilter(2)}
                        title="Hiển thị theo dạng bảng"
                        className={`${stateFilter === 2 && "!bg-maintenanceStatus-1 !text-neutron-4"} ${
                            stateFilter !== 2 &&
                            "border !border-maintenanceStatus-1 !bg-neutron-4 !text-maintenanceStatus-1"
                        } flex h-full w-[33%] cursor-pointer items-center justify-center rounded-r-lg bg-maintenanceStatus-1 text-3xl text-neutron-4 transition-all`}
                    >
                        <FaTable />
                    </div>
                </div>
                {/* {modeEachShift && <Button onClick={handleExportExcel}>Xuất file</Button>} */}
            </div>
        </>
    )
}

export default OeeSearchBar
