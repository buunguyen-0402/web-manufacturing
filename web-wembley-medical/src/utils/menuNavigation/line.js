import {
    validateRequiredField,
    // validateIdField,
    // validateDescField,
    // validateNumberField,
} from "@/utils/functions/validate"

export const getLineMenu = () => [
    {
        id: "info",
        title: "Thay đổi thông tin",
        type: "form",
        items: [
            {
                id: "lineId",
                type: "text",
                label: "ID máy",
                isError: validateRequiredField,
            },
            {
                id: "lineName",
                type: "text",
                label: "Tên máy",
                isError: validateRequiredField,
            },
            {
                id: "lineManager",
                type: "text",
                label: "Tên trưởng line",
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
                label: "Số sản phẩm /lượt",
                isError: validateRequiredField,
            },
            {
                id: "productUnit",
                type: "text",
                label: "Đơn vị",
                isError: validateRequiredField,
            },
            {
                id: "idealRunningTme",
                type: "text",
                label: "Thời gian làm việc kế hoạch",
                isError: validateRequiredField,
            },
        ],
    },
]
export const editLineMenu = () => [
    {
        id: "info",
        title: "Thay đổi thông tin",
        type: "form",
        items: [
            {
                id: "lineManager",
                type: "text",
                label: "Tên trưởng line",
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
                label: "Số sản phẩm /lượt",
                isError: validateRequiredField,
            },
            {
                id: "productUnit",
                type: "text",
                label: "Đơn vị",
                isError: validateRequiredField,
            },
            {
                id: "idealRunningTime",
                type: "text",
                label: "Thời gian làm việc kế hoạch",
                isError: validateRequiredField,
            },
        ],
    },
]
