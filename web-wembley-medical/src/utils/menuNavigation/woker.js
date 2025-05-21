import {
    validateRequiredField,
    // validateIdField,
    // validateDescField,
    // validateNumberField,
} from "@/utils/functions/validate"

export const getWorkerMenu = () => [
    {
        id: "info",
        title: "Thêm thông tin",
        type: "form",
        items: [
            {
                id: "employeeId",
                type: "text",
                label: "Mã nhân viên",
                isError: validateRequiredField,
            },
            {
                id: "employeeName",
                type: "text",
                label: "Tên nhân viên",
                isError: validateRequiredField,
            },
            {
                id: "employeeRole",
                type: "text",
                label: "Chức vụ",
                isError: validateRequiredField,
            },
        ],
    },
]

export const editWorkerMenu = () => [
    {
        id: "info",
        title: "Thêm thông tin",
        type: "form",
        items: [
            {
                id: "employeeId",
                type: "text",
                label: "Mã nhân viên",
                isError: validateRequiredField,
            },
            {
                id: "employeeName",
                type: "text",
                label: "Tên nhân viên",
                isError: validateRequiredField,
            },
            {
                id: "employeeRole",
                type: "text",
                label: "Chức vụ",
                isError: validateRequiredField,
            },
        ],
    },
]
