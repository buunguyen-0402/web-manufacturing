import {
    validateRequiredField,
    // validateIdField,
    // validateDescField,
    // validateNumberField,
} from "@/utils/functions/validate"

export const editSETTINGRole = () => [
    {
        id: "info",
        title: "Chỉnh sửa quyền truy cập",
        type: "form",
        items: [
            {
                id: "roleName",
                type: "text",
                label: "Quyền truy cập",
                isError: validateRequiredField,
            },
            {
                id: "displayName",
                type: "text",
                label: "Chức vụ",
                isError: validateRequiredField,
            },
            {
                id: "description",
                type: "text",
                label: "Mô tả",
                isError: validateRequiredField,
            },
        ],
    },
]
export const getSETTINGRoleMenuNav = () => [
    {
        id: "info",
        title: "Thêm chức vụ",
        type: "form",
        items: [
            {
                id: "roleName",
                type: "text",
                label: "Quyền truy cập",
                isError: validateRequiredField,
            },
            {
                id: "displayName",
                type: "text",
                label: "Chức vụ",
                isError: validateRequiredField,
            },
            {
                id: "description",
                type: "text",
                label: "Mô tả",
                isError: validateRequiredField,
            },
        ],
    },
]

export const getSETTINGUserEditMenuNav = (roleList) => [
    {
        id: "info",
        title: "Chỉnh sửa thông tin người dùng",
        type: "form",
        items: [
            {
                id: "roles",
                type: "selectMutils",
                label: "Chức vụ",
                list: roleList ?? [],
                value: "Admin",
                isError: validateRequiredField,
            },
            {
                id: "lastName",
                type: "text",
                label: "Họ và tên đệm",
                // list: roleList ?? [],
                // value: "Admin",
                isError: validateRequiredField,
            },
            {
                id: "firstName",
                type: "text",
                label: "Tên người dùng",
                // list: roleList ?? [],
                // value: "Admin",
                isError: validateRequiredField,
            },
            {
                id: "displayRole",
                type: "text",
                label: "Chức vụ hiện tại",
                // list: roleList ?? [],
                // value: "Admin",
                isError: validateRequiredField,
            },
        ],
    },
]

export const getSETTINGUserMenuNav = () => [
    {
        id: "info",
        title: "Thêm nhân viên",
        type: "form",
        items: [
            {
                id: "employeeId",
                type: "text",
                label: "Mã nhân viên",
                isError: validateRequiredField,
            },
            {
                id: "lastName",
                type: "text",
                label: "Họ và tên đệm",
                isError: validateRequiredField,
            },
            {
                id: "firstName",
                type: "text",
                label: "Tên nhân viên",
                isError: validateRequiredField,
            },
            {
                id: "displayRole",
                type: "text",
                label: "Chức vụ hiện tại",
                isError: validateRequiredField,
            },
        ],
    },
]

export const getSETTINGPageMenuNav = () => [
    {
        id: "info",
        title: "Thêm trang",
        type: "form",
        items: [
            {
                id: "name",
                type: "text",
                label: "Tên trang",
                isError: validateRequiredField,
            },
            {
                id: "buttons",
                type: "text",
                label: "Các nút thao tác",
                isError: validateRequiredField,
            },
        ],
    },
]

export const editSETTINGPageMenuNav = () => [
    {
        id: "info",
        title: "Thêm nút thao tác vào trang",
        type: "form",
        items: [
            {
                id: "buttons",
                type: "text",
                label: "Các nút thao tác",
                isError: validateRequiredField,
            },
        ],
    },
]
