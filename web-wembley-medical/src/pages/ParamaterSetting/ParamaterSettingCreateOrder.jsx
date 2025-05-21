import Button from "@/components/Button"
import Card from "@/components/Card"
import TextInput from "@/components/TextInput"
import SelectInput from "@/components/SelectInput"
import DateInput from "@/components/DateInput"
import { convertDateFormatForReport } from "@/utils/functions"
import { useState, useEffect, useCallback } from "react"
import { useCallApi } from "@/hooks"
import { authorizationApi, machineApi } from "@/services/api"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"

function ParamaterSettingCreateOrder() {
    const callApi = useCallApi()
    const user = useSelector((state) => state.auth)

    const [refCode, setRefCode] = useState()
    const [lineName, setLineName] = useState()
    const [productionName, setProductionName] = useState()
    const [expectedStartTime, setExpectedStartTime] = useState(() => {
        const now = new Date()
        now.setDate(now.getDate())
        return now.toISOString().slice(0, 16)
    })
    const [expectedEndTime, setExpectedEndTime] = useState(() => {
        const now = new Date()
        now.setDate(now.getDate() + 7)
        return now.toISOString().slice(0, 16)
    })
    const [properties, setProperties] = useState()
    const [LSX, setLSX] = useState()
    const [lotCode, setLotCode] = useState()
    const [lotSize, setLotSize] = useState()
    const [productivity, setProductivity] = useState()
    const [orderCreater, setOrderCreater] = useState()
    const [note, setNote] = useState("Ghi chú")

    const [line, setLine] = useState([])

    const [productName, setProductName] = useState([])
    const [ref, setRef] = useState([])
    const [productsList, setProductsList] = useState([])
    const [lineInfor, setLineInfor] = useState([])

    const [acceptRole, setAcceptRole] = useState()

    const fetchLineData = useCallback(() => {
        callApi(
            [machineApi.product.getAllProducts(), machineApi.line.getAllLine()],
            (res) => {
                setProductsList(res[0].data)
                setRef(res[0].data.map((res) => ({ key: res.referenceCode, value: res.referenceCode })))
                setProductName(res[0].data.map((res) => ({ key: res.name, value: res.name })))
                setLine(res[1].data.map((res) => ({ key: res.lineName, value: res.lineId })))
                setLineInfor(res[1].data)
                setOrderCreater(user.username)
            },
            "Truy xuất thành công",
        )
    }, [callApi])
    useEffect(() => {
        fetchLineData()
    }, [fetchLineData])

    const handleRefChange = (selectedRef) => {
        setRefCode(selectedRef)
        const selectedProduct = productsList.find((product) => String(product.referenceCode) === String(selectedRef))
        const manager = lineInfor.find((res) => res.lineId === selectedProduct.lineId)
        if (selectedProduct) {
            setProductionName([selectedProduct.name])
            setLineName([selectedProduct.lineId])
            setProperties(manager)
            setProductivity(selectedProduct.idealProductivity)
        }
        // console.log(lineName)
    }

    const handleLineChange = (selectedLine) => {
        setLineName(selectedLine)
    }

    const handleProductNameChange = (selectedProductName) => {
        setProductionName(selectedProductName)
        const selectedName = productsList.find((product) => String(product.productName) === String(selectedProductName))
        const manager = lineInfor.find((res) => res.lineId === selectedName.lineId)
        if (selectedName) {
            setRefCode([selectedName.referenceCode])
            setLineName([selectedName.lineName])
            setProperties(manager)
        }
    }

    const handleAddLot = () => {
        console.log({
            workOrderCode: LSX,
            lotCode: lotCode,
            size: lotSize,
            expectProductivity: productivity,
            note: note,
            expectStartDate: expectedStartTime,
            expectEndDate: expectedEndTime,
            createdBy: "Buu",
            referenceCode: refCode[0],
        })
        callApi(
            () =>
                machineApi.workOrders.postWorkOrders({
                    workOrderCode: LSX,
                    lotCode: lotCode,
                    size: lotSize,
                    expectProductivity: productivity,
                    note: note,
                    expectStartDate: expectedStartTime,
                    expectEndDate: expectedEndTime,
                    createdBy: "Buu",
                    referenceCode: refCode[0],
                }),
            (res) => {
                fetchLineData()
            },
            "Tạo lô thành công",
            (res) => toast.error(`Tạo lô thất bại: ${res.response.data.detail}`),
        )
    }

    return (
        <div className=" grow w-full flex justify-around p-2">
            <Card className=" h-full w-[49%] p-1 flex flex-col justify-around bg-neutron-4 overflow-y-scroll">
                <h2 className=" text-center">Tạo lô sản xuất</h2>
                <SelectInput
                    label="Mã Ref"
                    list={ref}
                    id={1}
                    value={refCode}
                    setValue={handleRefChange}
                    canSearch={true}
                    mutilChoises={false}
                    className={" h-[6%] w-full"}
                />
                <SelectInput
                    label="Line sản xuất"
                    list={line}
                    id={2}
                    value={lineName}
                    setValue={handleLineChange}
                    canSearch={true}
                    mutilChoises={false}
                    className={" h-[6%] w-full"}
                />
                <SelectInput
                    label="Tên sản phẩm"
                    list={productName}
                    id={3}
                    value={productionName}
                    setValue={handleProductNameChange}
                    canSearch={true}
                    mutilChoises={false}
                    className={" h-[6%] w-full"}
                />
                <DateInput
                    id="startDate"
                    label="Ngày bắt đầu"
                    value={expectedStartTime}
                    setValue={setExpectedStartTime}
                    type="dayStart"
                    dayCompare={expectedEndTime}
                    className={" h-[6%] w-full"}
                />
                <DateInput
                    id="endDate"
                    label="Ngày kết thúc"
                    value={expectedEndTime}
                    setValue={setExpectedEndTime}
                    type="dayEnd"
                    dayCompare={expectedStartTime}
                    className={" h-[6%] w-full"}
                />

                <TextInput
                    id="Lệnh sản xuất"
                    label="Lệnh sản xuất"
                    value={LSX}
                    setValue={setLSX}
                    // isError={validateUsername}
                    // setValidateRows={setValidate}
                />
                <TextInput
                    id="Mã lô"
                    label="Mã lô"
                    value={lotCode}
                    setValue={setLotCode}
                    // isError={validateUsername}
                    // setValidateRows={setValidate}
                />
                <TextInput
                    id="Cỡ lô"
                    label="Cỡ lô"
                    value={lotSize}
                    setValue={setLotSize}
                    // isError={validateUsername}
                    // setValidateRows={setValidate}
                />
                {/* <TextInput
                            id="Năng suất"
                            label={`Năng suất định kiến (${properties ? properties.productUnit : ""}/phút)`}
                            setValue={setProductivity}
                            // isError={validateUsername}
                            // setValidateRows={setValidate}
                        /> */}
                <div className=" w-full flex justify-around">
                    <Button onClick={handleAddLot}>Tạo lệnh sản xuất</Button>
                </div>
            </Card>
            <Card className="  h-full w-[49%] p-1 flex flex-col justify-around bg-neutron-4 overflow-y-scroll">
                <h2 className=" text-center">Thông tin đơn sản xuất</h2>
                <div className=" h-full w-full flex flex-col justify-around">
                    <div className=" w-full h-full flex items-center border-b-2 border-primary-3">
                        <p className=" w-[25%]">Mã Ref</p>
                        <h7 className=" w-[75%]">{refCode}</h7>
                    </div>
                    <div className=" w-full h-full flex items-center border-b-2 border-primary-3">
                        <p className=" w-[25%]">Line sản xuất</p>
                        <h7 className=" w-[75%]">
                            {lineInfor && lineName ? lineInfor.find((line) => line.lineId == lineName[0]).lineName : ""}
                        </h7>
                    </div>
                    <div className=" w-full h-full flex items-center border-b-2 border-primary-3">
                        <p className=" w-[25%]">Tên sản phẩm</p>
                        <h7 className=" w-[75%]">{productionName}</h7>
                    </div>
                    <div className=" w-full h-full flex items-center border-b-2 border-primary-3">
                        <p className=" w-[25%]">Ngày bắt đầu</p>
                        <h7 className=" w-[75%]">{convertDateFormatForReport(expectedStartTime)}</h7>
                    </div>
                    <div className=" w-full h-full flex items-center border-b-2 border-primary-3">
                        <p className=" w-[25%]">Ngày kết thúc</p>
                        <h7 className=" w-[75%]">{convertDateFormatForReport(expectedEndTime)}</h7>
                    </div>
                    <div className=" w-full h-full flex items-center border-b-2 border-primary-3">
                        <p className=" w-[25%]">Trưởng line</p>
                        <h7 className=" w-[75%]">{properties ? properties.lineManager : ""}</h7>
                    </div>
                    <div className=" w-full h-full flex items-center border-b-2 border-primary-3">
                        <p className=" w-[25%]">Lệnh sản xuất</p>
                        <h7 className=" w-[75%]">{LSX}</h7>
                    </div>
                    <div className=" w-full h-full flex items-center border-b-2 border-primary-3">
                        <p className=" w-[25%]">Mã lô</p>
                        <h7 className=" w-[75%]">{lotCode}</h7>
                    </div>
                    <div className=" w-full h-full flex items-center border-b-2 border-primary-3">
                        <p className=" w-[25%]">Cỡ lô</p>
                        <h7 className=" w-[75%]">{lotSize}</h7>
                    </div>
                    <div className=" w-full h-full flex items-center border-b-2 border-primary-3">
                        <p className=" w-[25%]">Năng suất</p>
                        <h7 className=" w-[75%]">
                            {productivity} {properties ? properties.productUnit : ""}/phút
                        </h7>
                    </div>
                    <div className=" w-full h-full flex items-center border-b-2 border-primary-3">
                        <p className=" w-[25%]">Người tạo lô</p>
                        <h7 className=" w-[75%]">{orderCreater}</h7>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default ParamaterSettingCreateOrder
