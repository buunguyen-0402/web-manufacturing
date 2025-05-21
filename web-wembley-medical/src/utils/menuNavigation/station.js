import {
    validateRequiredField,
    // validateIdField,
    // validateDescField,
    // validateNumberField,
} from "@/utils/functions/validate"

export const getStationMenu = () => [
    {
        id: "info",
        title: "Thêm máy mới",
        type: "form",
        items: [
            {
                id: "stationId",
                type: "text",
                label: "ID máy",
                isError: validateRequiredField,
            },
            {
                id: "stationName",
                type: "text",
                label: "Tên máy",
                isError: validateRequiredField,
            },
            {
                id: "idealCycleTime",
                type: "text",
                label: "Chu kỳ lý tưởng",
                isError: validateRequiredField,
            },
            {
                id: "productsPerShot",
                type: "text",
                label: "Số sản phẩm/ lượt",
                isError: validateRequiredField,
            },
            {
                id: "productUnit",
                type: "text",
                label: "Đơn vị",
                isError: validateRequiredField,
            },
        ],
    },
]
export const editStationMenu = () => [
    {
        id: "info",
        title: "Thay đổi thông tin",
        type: "form",
        items: [
            {
                id: "stationId",
                type: "text",
                label: "ID máy",
                isError: validateRequiredField,
            },
            {
                id: "stationName",
                type: "text",
                label: "Tên máy",
                isError: validateRequiredField,
            },
            // {
            //     id: "lineId",
            //     type: "text",
            //     label: "Mã dây chuyền",
            //     isError: validateRequiredField,
            // },
            {
                id: "idealCycleTime",
                type: "text",
                label: "Chu kỳ lý tưởng",
                isError: validateRequiredField,
            },
            {
                id: "productsPerShot",
                type: "text",
                label: "Số sản phẩm/ lượt",
                isError: validateRequiredField,
            },
            {
                id: "productUnit",
                type: "text",
                label: "Đơn vị",
                isError: validateRequiredField,
            },
        ],
    },
]

export const getStationMenuError = () => [
    {
        id: "info",
        title: "Thêm mã lỗi mới",
        type: "form",
        items: [
            {
                id: "stationId",
                type: "text",
                label: "Mã máy",
                isError: validateRequiredField,
            },
            {
                id: "code",
                type: "text",
                label: "Mã lỗi",
                isError: validateRequiredField,
            },
            {
                id: "name",
                type: "text",
                label: "Tên lỗi",
                isError: validateRequiredField,
            },
        ],
    },
]

export const editStationMenuError = () => [
    {
        id: "info",
        title: "Chỉnh sửa mã lỗi",
        type: "form",
        items: [
            {
                id: "stationId",
                type: "text",
                label: "Mã máy",
                isError: validateRequiredField,
            },
            {
                id: "code",
                type: "text",
                label: "Mã lỗi",
                isError: validateRequiredField,
            },
            {
                id: "name",
                type: "text",
                label: "Tên lỗi",
                isError: validateRequiredField,
            },
        ],
    },
]
