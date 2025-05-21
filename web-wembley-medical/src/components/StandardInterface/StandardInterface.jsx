import Card from "@/components/Card"
import MachineLine from "../MachineLine/MachineLine"
import ErrorStatus from "@/components/ErrorStatus"
import VisionAndEnable from "../VisionAndEnable"
import OeeTable from "../ConfigTable/OeeTable"
import { usePoperMenuNew } from "@/hooks"
import PoperMenuNew from "../PoperMenuNew"
import Confirm from "../Confirm"
import Table from "../Table"
import useCallApi from "@/hooks/useCallApi"
import { authorizationApi, machineApi } from "@/services/api"
import cl from "classnames"
import { useState, useEffect, useCallback } from "react"
import { getTagIdData, editTagIdData } from "@/utils/menuNavigation"
import Button from "../Button"
import { tagId_headers } from "@/utils/tableColumns"
import { useSelector } from "react-redux"

function StandardInterface({ param, totalData, data, error, productError, errorAtDay, dataChartTime, dataChartValue }) {
    const callApi = useCallApi()
    const [control, setControl] = useState(0)
    const user = useSelector((state) => state.auth)

    const [tagIdList, setTagIdList] = useState([])
    const [machineName, setMachineName] = useState("")

    const { active, position, handleClose, handleOpen } = usePoperMenuNew(400)

    const [initValue, setInitValue] = useState()
    const [deleteConfirm, setDeleteConfirm] = useState({})
    const [activedItem, setActivedItem] = useState()
    const [acceptRole, setAcceptRole] = useState()

    const [mode, setMode] = useState()

    const fetchLineData = useCallback(() => {
        callApi(
            [
                machineApi.tagId.getTagId(param.stationId),
                machineApi.station.getStationByLineId(param.lineId),
                authorizationApi.role.getRole(),
            ],
            (res) => {
                const stationList = res[1].data
                setTagIdList(res[0].data[0])
                setMachineName(stationList.find((stationId) => stationId.stationId === param.stationId))
                const filter = res[2].data.find((res) => String(res.roleName) === user.role).pages
                setAcceptRole(
                    filter.find(
                        (res) => String(res.name) === "Thông số hoạt động" || String(res.name) === "Tất cả các trang",
                    ),
                )
            },
            "Truy xuất thành công",
        )
    }, [callApi])
    useEffect(() => {
        fetchLineData()
    }, [fetchLineData])

    const handleTableRowClickTagParamater = (row, index) => {
        const activedRow = tagIdList.metricVars[index]
        setActivedItem({ info: activedRow })
        setMode(1)
    }

    const handleAddTagParamater = (e) => {
        setInitValue(null)
        handleOpen(e)
        setMode(1)
    }

    const handleEditTagParamater = (e) => {
        setInitValue(activedItem)
        handleOpen(e)
        setMode(1)
    }

    const handleDeleteTagParamater = (row) => {
        const tagName = row.name
        setDeleteConfirm({
            actived: true,
            title: "Xác nhận xóa tên biến " + tagName,
            content: `Tên biến ${tagName} sẽ bị xóa vĩnh viễn và không được hiển thị tại trang này nữa`,
            onConfirm() {
                callApi(
                    () =>
                        machineApi.tagId.deleteTagId({
                            data: {
                                templateId: tagIdList.templateId,
                                varNames: [String(tagName)],
                            },
                        }),
                    fetchLineData,
                    `Tên biến ${tagName} được xóa thành công`,
                )
            },
        })
    }

    const handleTableRowClickTagStatus = (row, index) => {
        const activedRow = tagIdList.statusVars[index]
        setActivedItem({ info: activedRow })
        setMode(0)
    }

    const handleAddTagStatus = (e) => {
        setInitValue(null)
        handleOpen(e)
        setMode(0)
    }

    const handleEditTagStatus = (e) => {
        setInitValue(activedItem)
        handleOpen(e)
        setMode(0)
    }

    const handleSubmit = (value) => {
        let data
        let callApiFunction
        let successMessage
        if (!initValue) {
            data = value.info
            callApiFunction = machineApi.tagId.postTagId({
                stationId: param.stationId,
                vars: [{ ...data, varType: mode }],
            })
            successMessage = "Tạo biến mới thành công"
        } else {
            data = { templateId: tagIdList.templateId, vars: [{ ...value.info, varType: mode }] }
            callApiFunction = machineApi.tagId.patchTagId(data)
            successMessage = "Chỉnh sửa biến thành công"
        }
        callApi(() => callApiFunction, fetchLineData, successMessage)
    }

    const handleDeleteTagStatus = (row) => {
        const tagName = row.name
        setDeleteConfirm({
            actived: true,
            title: "Xác nhận xóa tên biến " + tagName,
            content: `Tên biến ${tagName} sẽ bị xóa vĩnh viễn và không được hiển thị tại trang này nữa`,
            onConfirm() {
                callApi(
                    () =>
                        machineApi.tagId.deleteTagId({
                            data: {
                                templateId: tagIdList.templateId,
                                varNames: [String(tagName)],
                            },
                        }),
                    fetchLineData,
                    `Tên biến ${tagName} được xóa thành công`,
                )
            },
        })
    }
    return (
        <div className=" w-full h-[93%] flex justify-around  ">
            {control === 0 && (
                <>
                    <div className=" h-full w-[50%] flex flex-col justify-between">
                        <MachineLine
                            statusInfor={true}
                            lineName={param.stationId}
                            stationName={machineName.name}
                            lineData={totalData}
                            data={data}
                            keyTag={param.stationId}
                            CLassname={"h-[58%]"}
                        />

                        <OeeTable
                            param={param}
                            data={data}
                            CLassName={"h-[40%]"}
                            dataChartTime={dataChartTime}
                            dataChartValue={dataChartValue}
                        />
                    </div>
                    <Card className=" h-full w-[49%] bg-neutron-4 p-1">
                        <VisionAndEnable
                            setControl={setControl}
                            data={data}
                            name={"Thông số máy"}
                            visionProcessing={tagIdList?.metricVars}
                            enableStation={tagIdList?.statusVars}
                        />
                        <div className=" ml-5 w-[94%] border-[0.2px] border-primary-1"></div>
                        <ErrorStatus
                            param={param}
                            error={error}
                            errorAtDay={errorAtDay}
                            productError={productError}
                        ></ErrorStatus>
                    </Card>
                </>
            )}
            {control === 1 && (
                <>
                    <div className=" h-full w-full flex justify-between">
                        <Card className={cl(" h-full w-[48%] bg-neutron-4 flex flex-col items-center gap-2 p-2")}>
                            <h2>Danh sách các biến thông số máy </h2>
                            {acceptRole &&
                                ["Tất cả các thao tác", "Thêm biến thông số"].some((role) =>
                                    acceptRole.buttons.includes(role),
                                ) && <Button onClick={handleAddTagParamater}>Thêm biến thông số</Button>}
                            <Table
                                activable
                                primary
                                sticky
                                headers={tagId_headers}
                                body={tagIdList?.metricVars} //mảng dữ liệu
                                className=" w-full overflow-y-scroll bg-neutron-4"
                                onEdit={
                                    acceptRole &&
                                    ["Tất cả các thao tác", "Chỉnh sửa thông tin"].some((role) =>
                                        acceptRole.buttons.includes(role),
                                    ) &&
                                    handleEditTagParamater
                                }
                                onRowClick={
                                    acceptRole &&
                                    ["Tất cả các thao tác", "Chọn thông tin"].some((role) =>
                                        acceptRole.buttons.includes(role),
                                    ) &&
                                    handleTableRowClickTagParamater
                                }
                                onDeleteRow={
                                    acceptRole &&
                                    ["Tất cả các thao tác", "Xóa thông tin"].some((role) =>
                                        acceptRole.buttons.includes(role),
                                    ) &&
                                    handleDeleteTagParamater
                                }
                                // enableIdClick
                                // idClickFunction={(e, row, index) => {
                                //     console.log(row)
                                //     navigate(`/setting/Test`, { state: row })
                                // }}
                            />
                        </Card>
                        <Card className={cl(" h-full w-[48%] bg-neutron-4 flex flex-col items-center gap-2 p-2")}>
                            <h2>Danh sách các biến trạng thái sử dụng trạm</h2>
                            {acceptRole &&
                                ["Tất cả các thao tác", "Thêm biến trạng thái"].some((role) =>
                                    acceptRole.buttons.includes(role),
                                ) && <Button onClick={handleAddTagStatus}>Thêm biến trạng thái</Button>}
                            <Table
                                activable
                                primary
                                sticky
                                headers={tagId_headers}
                                body={tagIdList?.statusVars} //mảng dữ liệu
                                className=" w-full overflow-y-scroll bg-neutron-4"
                                onEdit={
                                    acceptRole &&
                                    ["Tất cả các thao tác", "Chỉnh sửa thông tin"].some((role) =>
                                        acceptRole.buttons.includes(role),
                                    ) &&
                                    handleEditTagStatus
                                }
                                onRowClick={
                                    acceptRole &&
                                    ["Tất cả các thao tác", "Chọn thông tin"].some((role) =>
                                        acceptRole.buttons.includes(role),
                                    ) &&
                                    handleTableRowClickTagStatus
                                }
                                onDeleteRow={
                                    acceptRole &&
                                    ["Tất cả các thao tác", "Xóa thông tin"].some((role) =>
                                        acceptRole.buttons.includes(role),
                                    ) &&
                                    handleDeleteTagStatus
                                }
                                // enableIdClick
                                // idClickFunction={(e, row, index) => {
                                //     console.log(row)
                                //     navigate(`/setting/Test`, { state: row })
                                // }}
                            />
                        </Card>
                        {active && (
                            <PoperMenuNew
                                position={position}
                                onClose={handleClose}
                                menuNavigaton={initValue ? editTagIdData() : getTagIdData()}
                                onClick={handleSubmit}
                                initValue={initValue ? initValue : undefined}
                                activateValidation={false}
                            />
                        )}
                        {deleteConfirm.actived && (
                            <Confirm
                                title={deleteConfirm.title}
                                content={deleteConfirm.content}
                                onConfirm={deleteConfirm.onConfirm}
                                onClose={() => setDeleteConfirm({ actived: false })}
                            />
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default StandardInterface
