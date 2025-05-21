import { useEffect, useState } from "react"
import Button from "../Button"
import Card from "../Card"
import Table from "../Table"
import { errorAtDay_headers, errorProductAtDay_headers } from "@/utils/tableColumns"
import { handleDataErrorMachineOverview } from "@/utils/functions"
import cl from "classnames"

function ErrorStatus({ param, error, errorAtDay, productError }) {
    const sortedErrors = [...error].sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp))
    const [openMenuErrorAtDay, setOpenMenuErrorAtDay] = useState(false)
    return (
        <div className="h-[40%] w-full flex flex-col p-2 ">
            <div className=" h-[15%] w-full">
                <Button className={" h-full"} bg={"rgba(233,34,34,0.85)"} onClick={() => setOpenMenuErrorAtDay(true)}>
                    Các lỗi trong ngày
                </Button>
            </div>
            <div className=" h-[85%] w-full">
                <h4>Lỗi hiện tại</h4>
                <div className=" h-[70%] flex flex-col overflow-y-scroll">
                    {sortedErrors.length > 0 ? (
                        sortedErrors.map((res, index) => (
                            <h9 key={index} className="text-[red]">
                                {String(res.Timestamp).slice(0, 10) +
                                    " " +
                                    String(res.Timestamp).slice(11, 19) +
                                    " " +
                                    res.TagValue}
                            </h9>
                        ))
                    ) : (
                        <h9 className="">Không có lỗi</h9>
                    )}
                </div>
            </div>
            {openMenuErrorAtDay && (
                <>
                    <Card
                        className={cl(
                            " h-[80%] w-[60%] z-10 bg-neutron-3 absolute left-[20%] top-[15%] flex flex-col gap-[2%] p-2 overflow-y-scroll",
                        )}
                    >
                        <h1 className=" text-center">Danh sách các lỗi trong ngày</h1>
                        <div className=" ml-5 w-[95%] border-[0.2px] border-primary-1"></div>
                        <Table
                            activable
                            primary
                            sticky
                            headers={errorAtDay_headers}
                            body={handleDataErrorMachineOverview(errorAtDay)} //mảng dữ liệu
                            className="mt-2 h-[70%] overflow-y-scroll"
                            // onEdit={handleEditError}
                            // onRowClick={handleTableRowClickError}
                            // onDeleteRow={handleDeleteError}
                            // enableIdClick
                            // idClickFunction={(e, row, index) => {
                            //     console.log(row)
                            //     navigate(`/setting/Test`, { state: row })
                            // }}
                        />
                        <Table
                            activable
                            primary
                            sticky
                            headers={errorProductAtDay_headers}
                            body={productError} //mảng dữ liệu
                            className="mt-2 h-[70%] overflow-y-scroll"
                            // onEdit={handleEditError}
                            // onRowClick={handleTableRowClickError}
                            // onDeleteRow={handleDeleteError}
                            // enableIdClick
                            // idClickFunction={(e, row, index) => {
                            //     console.log(row)
                            //     navigate(`/setting/Test`, { state: row })
                            // }}
                        />
                        <Button bg={"red"} onClick={() => setOpenMenuErrorAtDay(false)}>
                            Đóng
                        </Button>
                    </Card>
                </>
            )}
        </div>
    )
}

export default ErrorStatus
