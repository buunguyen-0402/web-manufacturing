export const worker_headers = [
    {
        Header: "Mã nhân viên",
        accessor: "employeeId",
        disableSortBy: false,
    },
    {
        Header: "Tên nhân viên",
        accessor: "employeeName",
        disableSortBy: false,
    },
    {
        Header: "Chức vụ",
        accessor: "",
        disableSortBy: false,
    },
]

export const paramaterSetting_headers = [
    {
        Header: "LSX",
        accessor: "LSX",
        disableSortBy: false,
    },
    {
        Header: "Tên sản phẩm",
        accessor: "Tên sản phẩm",
        disableSortBy: false,
    },
    {
        Header: "Mã Ref",
        accessor: "Mã Ref",
        disableSortBy: false,
    },
    {
        Header: "Line sản xuất",
        accessor: "Line sản xuất",
        disableSortBy: false,
    },
    {
        Header: "Ngày bắt đầu",
        accessor: "Ngày bắt đầu",
        disableSortBy: false,
    },
    {
        Header: "Ngày kết thúc",
        accessor: "Ngày kết thúc",
        disableSortBy: false,
    },
    {
        Header: "Mã lô",
        accessor: "Mã lô",
        disableSortBy: false,
    },
    {
        Header: "Cỡ lô",
        accessor: "Cỡ lô",
        disableSortBy: false,
    },
    {
        Header: "Tình trạng",
        accessor: "Tình trạng",
        disableSortBy: false,
    },
]

export const line_headers = [
    {
        Header: "ID máy",
        accessor: "lineId",
        disableSortBy: false,
    },
    {
        Header: "Tên máy",
        accessor: "lineName",
        disableSortBy: false,
    },
    {
        Header: "Trưởng line",
        accessor: "lineManager",
        disableSortBy: false,
    },
    {
        Header: "Chu kỳ lý tưởng",
        accessor: "idealCycleTime",
        disableSortBy: false,
    },
    {
        Header: "Số sản phẩm/ lượt",
        accessor: "productsPerShot",
        disableSortBy: false,
    },
    {
        Header: "Đơn vị",
        accessor: "productUnit",
        disableSortBy: false,
    },
    {
        Header: "Thời gian làm việc kế hoạch",
        accessor: "idealRunningTime",
        disableSortBy: false,
    },
]

export const station_headers = [
    {
        Header: "ID trạm",
        accessor: "stationId",
        disableSortBy: false,
    },
    {
        Header: "Tên máy",
        accessor: "name",
        disableSortBy: false,
    },
    {
        Header: "Chu kỳ lý tưởng",
        accessor: "idealCycleTime",
        disableSortBy: false,
    },
    {
        Header: "Số sản phẩm/ lượt",
        accessor: "productsPerShot",
        disableSortBy: false,
    },
    {
        Header: "Đơn vị",
        accessor: "productUnit",
        disableSortBy: false,
    },
]

export const product_category_headers = [
    {
        Header: "Dây chuyền sản xuất",
        accessor: "lineName",
        disableSortBy: false,
    },
    {
        Header: "Mã Ref",
        accessor: "referenceCode",
        disableSortBy: false,
    },
    {
        Header: "Tên sản phẩm",
        accessor: "productName",
        disableSortBy: false,
    },
    {
        Header: "Năng suất kế hoạch (Sp/phút)",
        accessor: "idealProductivity",
        disableSortBy: false,
    },
]

export const orders_headers = [
    {
        Header: "Lệnh sản xuất",
        accessor: "workOrderCode",
        disableSortBy: false,
    },
    {
        Header: "Mã Ref",
        accessor: "referenceCode",
        disableSortBy: false,
    },
    {
        Header: "Ngày bắt đầu",
        accessor: "expectedStartTime",
        disableSortBy: false,
    },
    {
        Header: "Ngày kết thúc",
        accessor: "expectedEndTime",
        disableSortBy: false,
    },
    {
        Header: "Mã lô",
        accessor: "lotCode",
        disableSortBy: false,
    },
    {
        Header: "Cỡ lô",
        accessor: "size",
        disableSortBy: false,
    },
    {
        Header: "Hiện trạng",
        accessor: "status",
        disableSortBy: false,
    },
]

export const manuReport_headers = [
    {
        Header: "Lệnh sản xuất",
        accessor: "workOrderCode",
        disableSortBy: false,
    },
    {
        Header: "Kế hoạch sản xuất",
        accessor: "scheduleTime",
        disableSortBy: false,
    },
    {
        Header: "Thời điểm bắt đầu",
        accessor: "startTime",
        disableSortBy: false,
    },
    {
        Header: "Thời điểm kết thúc",
        accessor: "endTime",
        disableSortBy: false,
    },
    {
        Header: "Mã Ref",
        accessor: "referenceCode",
        disableSortBy: false,
    },
    {
        Header: "Mã lô",
        accessor: "lotCode",
        disableSortBy: false,
    },
    {
        Header: "Cỡ lô",
        accessor: "size",
        disableSortBy: false,
    },
    {
        Header: "Sản lượng sản xuất",
        accessor: "productCount",
        disableSortBy: false,
    },
    {
        Header: "Sản lượng đạt",
        accessor: "goodProduct",
        disableSortBy: false,
    },
    {
        Header: "Sản lượng lỗi",
        accessor: "defectCount",
        disableSortBy: false,
    },
    {
        Header: "Độ hữu dụng(A%)",
        accessor: "a",
        disableSortBy: false,
    },
    {
        Header: "Hiệu suất(P%)",
        accessor: "p",
        disableSortBy: false,
    },
    {
        Header: "Chất lượng(Q%)",
        accessor: "q",
        disableSortBy: false,
    },
    {
        Header: "OEE(%)",
        accessor: "oee",
        disableSortBy: false,
    },
    {
        Header: "Năng suất yêu cầu (Sp/phút)",
        accessor: "expectProductivity",
        disableSortBy: false,
    },
    {
        Header: "Năng suất sản xuất (Sp/phút)",
        accessor: "productivity",
        disableSortBy: false,
    },
    {
        Header: "Hiện trạng",
        accessor: "status",
        disableSortBy: false,
    },
    {
        Header: "Yêu cầu năng suất",
        accessor: "productivityPrepare",
        disableSortBy: false,
    },
    {
        Header: "Đánh giá tiến độ",
        accessor: "result",
        disableSortBy: false,
    },
]

export const manuEachOrderReport_headers = [
    {
        Header: "Thời điểm",
        accessor: "timestamp",
        disableSortBy: false,
    },
    {
        Header: "Sản lượng sản xuất",
        accessor: "productCount",
        disableSortBy: false,
    },
    {
        Header: "Sản lượng lỗi",
        accessor: "defectCount",
        disableSortBy: false,
    },
    {
        Header: "Độ hữu dụng(A%)",
        accessor: "a",
        disableSortBy: false,
    },
    {
        Header: "Hiệu suất(P%)",
        accessor: "p",
        disableSortBy: false,
    },
    {
        Header: "Chất lượng(Q%)",
        accessor: "q",
        disableSortBy: false,
    },
    {
        Header: "OEE(%)",
        accessor: "oee",
        disableSortBy: false,
    },
    {
        Header: "Năng suất sản xuất (Sp/phút)",
        accessor: "productivity",
        disableSortBy: false,
    },
    {
        Header: "Tổng thời gian",
        accessor: "totalOnTime",
        disableSortBy: false,
    },
    {
        Header: "Thời gian sản xuất",
        accessor: "totalRunTime",
        disableSortBy: false,
    },
]

export const chiefReport_headers = [
    {
        Header: "Lệnh sản xuất",
        accessor: "workOrderCode",
        disableSortBy: false,
    },
    {
        Header: "Mã Ref",
        accessor: "referenceCode",
        disableSortBy: false,
    },
    {
        Header: "Ngày bắt đầu",
        accessor: "expectedStartTime",
        disableSortBy: false,
    },
    {
        Header: "Ngày kết thúc",
        accessor: "expectedEndTime",
        disableSortBy: false,
    },
    {
        Header: "Mã lô",
        accessor: "lotCode",
        disableSortBy: false,
    },
    {
        Header: "Cỡ lô",
        accessor: "size",
        disableSortBy: false,
    },
    {
        Header: "Sản lượng sản xuất",
        accessor: "productCount",
        disableSortBy: false,
    },
    {
        Header: "Sản lượng đạt",
        accessor: "goodProduct",
        disableSortBy: false,
    },
    {
        Header: "Hiện trạng",
        accessor: "status",
        disableSortBy: false,
    },
]

export const tagId_headers = [
    {
        Header: "Nhãn hiển thị",
        accessor: "name",
        disableSortBy: false,
    },
    {
        Header: "Tên biến",
        accessor: "tagId",
        disableSortBy: false,
    },
]

export const mfc_headers = [
    {
        Header: "Tên biến",
        accessor: "name",
        disableSortBy: false,
    },
]

export const mfcRef_headers = [
    {
        Header: "Tên biến",
        accessor: "name",
        disableSortBy: false,
    },
    {
        Header: "Mã Ref",
        accessor: "referenceCode",
        disableSortBy: false,
    },
    {
        Header: "Giá trị nhỏ nhất",
        accessor: "minValue",
        disableSortBy: false,
    },
    {
        Header: "Giá trị lớn nhất",
        accessor: "maxValue",
        disableSortBy: false,
    },
]

export const error_headers = [
    {
        Header: "Tên máy",
        accessor: "stationId",
        disableSortBy: false,
    },
    {
        Header: "Mã lỗi",
        accessor: "code",
        disableSortBy: false,
    },
    {
        Header: "Tên lỗi",
        accessor: "name",
        disableSortBy: false,
    },
]

export const errorAtDay_headers = [
    {
        Header: "Mã lỗi",
        accessor: "code",
        disableSortBy: false,
    },
    {
        Header: "Tên lỗi",
        accessor: "name",
        disableSortBy: false,
    },
    {
        Header: "Số lần xảy ra lỗi",
        accessor: "errorCount",
        disableSortBy: false,
    },
    {
        Header: "Thời gian lỗi",
        accessor: "totalTimeConvert",
        disableSortBy: false,
    },
]

export const errorProductAtDay_headers = [
    {
        Header: "Mã lỗi",
        accessor: "code",
        disableSortBy: false,
    },
    {
        Header: "Tên lỗi",
        accessor: "errorName",
        disableSortBy: false,
    },
    {
        Header: "Số lỗi sản phẩm",
        accessor: "errorProductCount",
        disableSortBy: false,
    },
]

export const errorWorkOrder_headers = [
    {
        Header: "Tên máy",
        accessor: "stationId",
        disableSortBy: false,
    },
    {
        Header: "Số lần xảy ra lỗi kỹ thuật",
        accessor: "totalError",
        disableSortBy: false,
    },
    {
        Header: "Tổng thời gian lỗi kỹ thuật",
        accessor: "totalErrorTimeStationConvert",
        disableSortBy: false,
    },
    {
        Header: "Số lỗi sản phẩm",
        accessor: "totalProductErrors",
        disableSortBy: false,
    },
]
export const errorWorkOrderDetail_headers = [
    {
        Header: "Tên máy",
        accessor: "stationId",
        disableSortBy: false,
    },
    {
        Header: "Mã lỗi",
        accessor: "code",
        disableSortBy: false,
    },
    {
        Header: "Tên lỗi",
        accessor: "errorName",
        disableSortBy: false,
    },
    {
        Header: "Số lần xảy ra lỗi khi sản xuất",
        accessor: "errorCount",
        disableSortBy: false,
    },
    {
        Header: "Tổng thời gian lỗi",
        accessor: "totalErrorTime",
        disableSortBy: false,
    },
]

export const dailyReport_headers = [
    {
        Header: "Ngày",
        accessor: "date",
        disableSortBy: false,
    },
    {
        Header: "Lệnh sản xuất",
        accessor: "workOrderCode",
        disableSortBy: false,
    },
    {
        Header: "Kế hoạch sản xuất",
        accessor: "scheduleTime",
        disableSortBy: false,
    },
    {
        Header: "Thời điểm bắt đầu",
        accessor: "startTime",
        disableSortBy: false,
    },
    {
        Header: "Thời điểm kết thúc",
        accessor: "endTime",
        disableSortBy: false,
    },
    {
        Header: "Mã Ref",
        accessor: "referenceCode",
        disableSortBy: false,
    },
    {
        Header: "Mã lô",
        accessor: "lotCode",
        disableSortBy: false,
    },
    {
        Header: "Cỡ lô",
        accessor: "size",
        disableSortBy: false,
    },
    {
        Header: "Sản lượng sản xuất",
        accessor: "productCount",
        disableSortBy: false,
    },
    {
        Header: "Sản lượng đạt",
        accessor: "goodProduct",
        disableSortBy: false,
    },
    {
        Header: "Sản lượng lỗi",
        accessor: "defectCount",
        disableSortBy: false,
    },
    {
        Header: "Độ hữu dụng(A%)",
        accessor: "a",
        disableSortBy: false,
    },
    {
        Header: "Hiệu suất(P%)",
        accessor: "p",
        disableSortBy: false,
    },
    {
        Header: "Chất lượng(Q%)",
        accessor: "q",
        disableSortBy: false,
    },
    {
        Header: "OEE(%)",
        accessor: "oee",
        disableSortBy: false,
    },
    {
        Header: "Năng suất yêu cầu",
        accessor: "expectProductivity",
        disableSortBy: false,
    },
    {
        Header: "Năng suất sản xuất",
        accessor: "productivity",
        disableSortBy: false,
    },
    {
        Header: "Hiện trạng",
        accessor: "status",
        disableSortBy: false,
    },
    {
        Header: "Yêu cầu năng suất",
        accessor: "productivityPrepare",
        disableSortBy: false,
    },
    {
        Header: "Đánh giá tiến độ",
        accessor: "result",
        disableSortBy: false,
    },
]
