import { validateRequiredField } from "@/utils/functions/validate"
export const editShots = () => [
    {
        id: "info",
        title: "Thay đổi thông tin",
        type: "form",
        items: [
            {
                id: "productCount",
                type: "text",
                label: "Tổng sản lượng",
                isError: validateRequiredField,
            },
            {
                id: "goodProduct",
                type: "text",
                label: "Sản phẩm đạt",
                isError: validateRequiredField,
            },
            {
                id: "totalOnTime",
                type: "text",
                label: "Thời gian máy ON",
                isError: validateRequiredField,
            },
            {
                id: "totalStoppingTime",
                type: "text",
                label: "Thời gian máy OFF",
                isError: validateRequiredField,
            },
            {
                id: "timeStamp",
                type: "datetime-local",
                label: "Thời gian cập nhật",
                isError: validateRequiredField,
            },
        ],
    },
]
