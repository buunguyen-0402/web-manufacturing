import {
    validateRequiredField,
    // validateIdField,
    // validateDescField,
    // validateNumberField,
} from "@/utils/functions/validate"
export const getOrderData = () => [
    {
        id: "info",
        title: "Thêm thông tin",
        type: "form",
        items: [
            {
                id: "LSX",
                type: "select",
                label: "Lệnh sản xuất",
                isError: validateRequiredField,
            },
            {
                id: "Tên sản phẩm",
                type: "text",
                label: "Tên sản phẩm",
                isError: validateRequiredField,
            },
            {
                id: "Mã Ref",
                type: "text",
                label: "Mã Ref",
                isError: validateRequiredField,
            },
            {
                id: "Line sản xuất",
                type: "text",
                label: "Line sản xuất",
                isError: validateRequiredField,
            },
            {
                id: "Mã lô",
                type: "text",
                label: "Mã lô",
                isError: validateRequiredField,
            },
            {
                id: "Cỡ lô",
                type: "text",
                label: "Cỡ lô",
                isError: validateRequiredField,
            },
            {
                id: "Ngày bắt đầu",
                type: "datetime-local",
                label: "Ngày bắt đầu",
                isError: validateRequiredField,
            },
            {
                id: "Ngày kết thúc",
                type: "datetime-local",
                label: "Ngày kết thúc",
                isError: validateRequiredField,
            },
            {
                id: "Tình trạng",
                type: "text",
                label: "Tình trạng",
                isError: validateRequiredField,
            },
        ],
    },
]

export const editOrderData = () => [
    {
        id: "info",
        title: "Thêm thông tin",
        type: "form",
        items: [
            {
                id: "Lệnh sản xuất",
                type: "text",
                label: "Lệnh sản xuất",
                isError: validateRequiredField,
            },
            {
                id: "Tên sản phẩm",
                type: "text",
                label: "Tên sản phẩm",
                isError: validateRequiredField,
            },
            {
                id: "Mã Ref",
                type: "text",
                label: "Mã Ref",
                isError: validateRequiredField,
            },
            {
                id: "Line sản xuất",
                type: "text",
                label: "Line sản xuất",
                isError: validateRequiredField,
            },
            {
                id: "Mã lô",
                type: "text",
                label: "Mã lô",
                isError: validateRequiredField,
            },
            {
                id: "Cỡ lô",
                type: "text",
                label: "Cỡ lô",
                isError: validateRequiredField,
            },
            {
                id: "Ngày bắt đầu",
                type: "text",
                label: "Ngày bắt đầu",
                isError: validateRequiredField,
            },
            {
                id: "Ngày kết thúc",
                type: "text",
                label: "Ngày kết thúc",
                isError: validateRequiredField,
            },
            {
                id: "Tình trạng",
                type: "text",
                label: "Tình trạng",
                isError: validateRequiredField,
            },
        ],
    },
]

export const getProductionData = (lineList) => [
    {
        id: "info",
        title: "Thêm thông tin",
        type: "form",
        items: [
            {
                id: "lineId",
                type: "selectMutils",
                label: "Dây chuyền sản xuất",
                list: lineList ?? [],
                isError: validateRequiredField,
            },
            {
                id: "referenceCode",
                type: "text",
                label: "Mã Ref",
                isError: validateRequiredField,
            },
            {
                id: "name",
                type: "text",
                label: "Tên sản phẩm",
                isError: validateRequiredField,
            },
            {
                id: "idealProductivity",
                type: "text",
                label: "Năng suất kế hoạch",
                isError: validateRequiredField,
            },
        ],
    },
]

export const editProductionData = () => [
    {
        id: "info",
        title: "Thêm thông tin",
        type: "form",
        items: [
            {
                id: "name",
                type: "text",
                label: "Tên sản phẩm",
                isError: validateRequiredField,
            },
            {
                id: "idealProductivity",
                type: "text",
                label: "Năng suất kế hoạch",
                isError: validateRequiredField,
            },
        ],
    },
]
