import Button from "@/components/Button"
import Card from "@/components/Card"
import TextInput from "@/components/TextInput"
import SelectInput from "@/components/SelectInput"
import Table from "@/components/Table"
import cl from "classnames"
import Confirm from "@/components/Confirm"
import { product_category_headers } from "@/utils/tableColumns"
import { useState, useEffect, useCallback, useRef } from "react"
import { useCallApi } from "@/hooks"
import { authorizationApi, machineApi } from "@/services/api"
import { toast } from "react-toastify"
import usePoperMenuNew from "@/hooks/usePoperMenuNew"
import PoperMenuNew from "@/components/PoperMenuNew"
import { getProductionData, editProductionData } from "@/utils/menuNavigation"
import { poperListMapper } from "@/utils/functions"
import { useSelector } from "react-redux"
import { FixedSizeList as List } from "react-window"
import { HiPencil } from "react-icons/hi"
import { RiDeleteBin4Line } from "react-icons/ri"

function ParamaterSettingProduct() {
    const callApi = useCallApi()
    const user = useSelector((state) => state.auth)
    const container = useRef()
    const { active, position, handleClose, handleOpen } = usePoperMenuNew(400)

    const [deleteConfirm, setDeleteConfirm] = useState({})
    const [filteredProducts, setFilteredProducts] = useState([])
    const [line, setLine] = useState([])
    const [filterLine, setFilterLine] = useState([])
    const [refFilter, setRefFilter] = useState([])
    const [productsList, setProductsList] = useState([])
    const [activedItem, setActivedItem] = useState()
    const [initValue, setInitValue] = useState()
    const [lineToMenu, setLineToMenu] = useState()

    const [acceptRole, setAcceptRole] = useState()
    const [click, setClick] = useState(null)

    const fetchLineData = useCallback(() => {
        callApi(
            [machineApi.product.getAllProducts(), machineApi.line.getAllLine()],
            (res) => {
                setProductsList(res[0].data)
                setFilteredProducts(res[0].data)
                setLine(res[1].data.map((res) => ({ key: res.lineId, value: res.lineId })))
                setLineToMenu(poperListMapper(res[1].data, "lineId", "lineName"))
            },
            "Truy xuất thành công",
        )
    }, [callApi])
    useEffect(() => {
        fetchLineData()
    }, [fetchLineData])

    useEffect(() => {
        if (refFilter.length > 0 || filterLine.length > 0) {
            const line = filterLine.length > 0 ? filterLine[0] : ""
            console.log(line, refFilter)
            const filtered = productsList.filter((product) => {
                return (
                    String(product.lineId).toLocaleLowerCase().includes(String(line).toLocaleLowerCase()) &&
                    String(product.referenceCode).toLocaleLowerCase().includes(String(refFilter).toLocaleLowerCase())
                )
            })
            setFilteredProducts(filtered)
            setClick(null)
        }
    }, [refFilter, filterLine, productsList])

    const handleEdit = (e, index) => {
        setInitValue({ info: { ...activedItem, name: activedItem.productName } })
        handleOpen(e)
        console.log({ info: { ...activedItem, name: activedItem.productName } })
    }

    const handleTableRowClick = (index) => {
        const activedRow = filteredProducts[index]
        setActivedItem(activedRow)
        setClick(index)
    }

    const handleDeleteProduct = () => {
        const productId = activedItem.productId
        const productName = activedItem.productName
        setDeleteConfirm({
            actived: true,
            title: "Xác nhận xóa sản phẩm " + productName,
            content: `Sản phẩm ${productName} sẽ bị xóa vĩnh viễn và không được hiển thị tại trang này nữa`,
            onConfirm() {
                callApi(
                    () => machineApi.product.deleteProducts(productId),
                    fetchLineData,
                    `Sản phẩm ${productName} được xóa thành công`,
                )
            },
        })
    }
    const handleAdd = (e) => {
        setInitValue(null)
        handleOpen(e)
    }

    const handleUpdateProductList = () => {
        setFilteredProducts(productsList)
        setClick(null)
        setRefFilter("")
        setFilterLine("")
    }

    const handleSubmit = (value) => {
        let data
        let callApiFunction
        let successMessage
        if (!initValue) {
            data = { ...value.info, lineId: value.info.lineId[0] }
            callApiFunction = () => machineApi.product.postProducts(data)
            successMessage = "Tạo nhân viên thành công"
        } else {
            data = {
                productId: value.info.productId,
                lineId: value.info.lineId,
                referenceCode: value.info.referenceCode,
                name: value.info.name,
                idealProductivity: value.info.idealProductivity,
            }
            callApiFunction = () => machineApi.product.patchProducts(value.info.id, data)
            successMessage = "Chỉnh sửa nhân viên thành công"
        }
        callApi(callApiFunction, fetchLineData, successMessage)
    }

    const Row = ({ index, style }) => (
        <div
            style={style}
            className={cl(
                " relative w-full flex justify-center items-center text-left border hover:bg-primary-4 cursor-pointer",
                {
                    "bg-primary-3": click === index,
                },
            )}
            onClick={() => handleTableRowClick(index)}
        >
            <span className=" w-[27%] p-2">{filteredProducts[index].lineName ?? filteredProducts[index].lineId}</span>
            <span className=" w-[15%] p-2">
                {filteredProducts[index].referenceCode ?? filteredProducts[index].referenceCode}
            </span>
            <span className=" w-[46%] p-2">{filteredProducts[index].productName ?? filteredProducts[index].name}</span>
            <span className=" w-[12%] p-2">
                {filteredProducts[index].idealProductivity ?? filteredProducts[index].idealProductivity}
            </span>
            {click === index && (
                <div className=" absolute right-[4.5%] h-[80%] w-[3%]">
                    <Button className={" h-full w-full"} bg={"rgba(233,34,34,0.8)"} onClick={handleDeleteProduct}>
                        <RiDeleteBin4Line />
                    </Button>
                </div>
            )}
            {click === index && (
                <div className=" absolute right-[0.2%] h-[80%] w-[3%]">
                    <Button className={" h-full w-full"} onClick={handleEdit}>
                        <HiPencil />
                    </Button>
                </div>
            )}
        </div>
    )

    return (
        <>
            <Card className={cl(" h-[8%] w-full flex justify-around items-center bg-neutron-4")}>
                <Button onClick={handleUpdateProductList}>ALL</Button>
                <SelectInput
                    label="Dây chuyền sản xuất"
                    list={line}
                    id={1}
                    value={filterLine}
                    setValue={setFilterLine}
                    canSearch={true}
                    mutilChoises={false}
                    className={" h-[80%] w-[40%] z-50 "}
                />
                <div className=" w-[25%] h-[80%]">
                    <TextInput
                        id="Mã Ref"
                        label="Mã Ref"
                        value={refFilter}
                        setValue={setRefFilter}
                        className={" h-full w-full"}
                        // isError={validateUsername}
                        // setValidateRows={setValidate}
                    />
                </div>
                <Button onClick={handleAdd}>Thêm sản phẩm mới</Button>
            </Card>
            <div ref={container} className={" h-[80%] w-full overflow-y-scroll"}>
                {/* <Table
                    activable
                    primary
                    sticky
                    headers={product_category_headers}
                    body={filteredProducts} //mảng dữ liệu
                    className=" bg-neutron-4"
                    onEdit={
                        acceptRole &&
                        acceptRole.buttons.includes("Tất cả các thao tác", "Chỉnh sửa thông tin") &&
                        handleEdit
                    }
                    onRowClick={
                        acceptRole &&
                        acceptRole.buttons.includes("Tất cả các thao tác", "Chọn thông tin trong bảng") &&
                        handleTableRowClick
                    }
                    onDeleteRow={
                        acceptRole &&
                        acceptRole.buttons.includes("Tất cả các thao tác", "Xóa thông tin") &&
                        handleDeleteProduct
                    }
                /> */}
                <div className=" w-full flex justify-center items-center text-left text-[white] font-semibold">
                    <span className=" w-[27%] bg-primary-1 rounded-tl-lg p-2">Tên dây chuyền</span>
                    <span className=" w-[15%] bg-primary-1 p-2">Mã Ref</span>
                    <span className=" w-[45%] bg-primary-1 p-2">Tên sản phẩm</span>
                    <span className=" w-[13%] bg-primary-1 rounded-tr-lg p-2">Năng suất (Sp/phút)</span>
                </div>
                {container.current && filteredProducts && (
                    <List
                        height={container.current.getBoundingClientRect().height * 0.9}
                        itemCount={filteredProducts.length}
                        itemSize={Number(container.current.getBoundingClientRect().height * 0.09)}
                        width={"100%"}
                    >
                        {Row}
                    </List>
                )}

                {active && (
                    <PoperMenuNew
                        position={position}
                        onClose={handleClose}
                        menuNavigaton={initValue ? editProductionData() : getProductionData(lineToMenu)}
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
    )
}

export default ParamaterSettingProduct
