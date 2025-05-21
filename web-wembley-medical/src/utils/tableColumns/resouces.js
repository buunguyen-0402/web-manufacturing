export const SETTING_ROLE_TABLE_COLUMNS = [
    {
        Header: "Quyền truy cập",
        accessor: "roleName",
        disableSortBy: false,
    },
    {
        Header: "Chức vụ",
        accessor: "displayName",
        disableSortBy: false,
    },
    {
        Header: "Mô tả",
        accessor: "description",
        disableSortBy: false,
    },
    {
        Header: "Các trang được thao tác",
        accessor: "allPages",
        disableSortBy: false,
    },
    {
        Header: "Các nút được thao tác",
        accessor: "allButtons",
        disableSortBy: false,
    },
]
export const SETTING_USER_TABLE_COLUMNS = [
    {
        Header: "Mã nhân viên",
        accessor: "employeeId",
        disableSortBy: false,
    },
    {
        Header: "Họ và tên đệm",
        accessor: "lastName",
        disableSortBy: false,
    },
    {
        Header: "Tên nhân viên",
        accessor: "firstName",
        disableSortBy: false,
    },
    {
        Header: "Quyền truy cập",
        accessor: "roles",
        disableSortBy: false,
    },
    {
        Header: "Chức vụ hiện tại",
        accessor: "displayRole",
        disableSortBy: false,
    },
]

export const SETTING_PAGE_TABLE_COLUMNS = [
    {
        Header: "Tên trang",
        accessor: "name",
        disableSortBy: false,
    },
    {
        Header: "Các nút thao tác",
        accessor: "buttons",
        disableSortBy: false,
    },
]
