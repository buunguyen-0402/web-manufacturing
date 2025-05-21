import {
    validateRequiredField,
    // validateIdField,
    // validateDescField,
    // validateNumberField,
} from "@/utils/functions/validate"

export const getTagIdData = () => [
    {
        id: "info",
        title: "Thêm biến thông số máy",
        type: "form",
        items: [
            {
                id: "name",
                type: "text",
                label: "Nhãn hiển thị",
                isError: validateRequiredField,
            },
            {
                id: "tagId",
                type: "text",
                label: "Tên biến",
                isError: validateRequiredField,
            },
        ],
    },
]

export const editTagIdData = () => [
    {
        id: "info",
        title: "Chỉnh sửa biến thông số máy",
        type: "form",
        items: [
            {
                id: "name",
                type: "text",
                label: "Nhãn hiển thị",
                isError: validateRequiredField,
            },
            {
                id: "tagId",
                type: "text",
                label: "Tên biến",
                isError: validateRequiredField,
            },
        ],
    },
]

export const getMfcData = () => [
    {
        id: "info",
        title: "Thêm biến MFC",
        type: "form",
        items: [
            {
                id: "name",
                type: "text",
                label: "Tên biến",
                isError: validateRequiredField,
            },
        ],
    },
]

export const editMfcData = () => [
    {
        id: "info",
        title: "Chỉnh sửa biến MFC",
        type: "form",
        items: [
            {
                id: "name",
                type: "text",
                label: "Tên biến",
                isError: validateRequiredField,
            },
        ],
    },
]

export const getMfcValueData = (tagList) => [
    {
        id: "info",
        title: "Thêm mới thông số MFC",
        type: "form",
        items: [
            {
                id: "name",
                type: "selectMutils",
                label: "Tên biến",
                list: tagList ?? [],
                isError: validateRequiredField,
            },
            {
                id: "minValue",
                type: "text",
                label: "Giá trị nhỏ nhất",
                isError: validateRequiredField,
            },
            {
                id: "maxValue",
                type: "text",
                label: "Giá trị lớn nhất",
                isError: validateRequiredField,
            },
        ],
    },
]

export const editMfcValueData = () => [
    {
        id: "info",
        title: "Chỉnh sửa thông số MFC",
        type: "form",
        items: [
            {
                id: "name",
                type: "text",
                label: "Tên biến",
                isError: validateRequiredField,
            },
            {
                id: "minValue",
                type: "text",
                label: "Giá trị nhỏ nhất",
                isError: validateRequiredField,
            },
            {
                id: "maxValue",
                type: "text",
                label: "Giá trị lớn nhất",
                isError: validateRequiredField,
            },
        ],
    },
]
