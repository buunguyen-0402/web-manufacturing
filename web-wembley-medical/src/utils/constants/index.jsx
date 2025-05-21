export const ColorStatus = [
    {
        name: "ON",
        // color: "bg-[rgba(0,255,172,0.85)]",
        color: "bg-[rgba(60,179,113,0.8)]",
        textColor: "text-[rgba(16,138,177,0.8)]",
    },
    {
        name: "RUN",
        // color: "bg-[rgba(0,245,0,0.85)]",
        color: "bg-[rgba(5,240,95,0.8)]",
        textColor: "text-[rgba(16,180,177,0.8)]",
    },
    {
        name: "IDLE",
        // color: "bg-[rgba(250,175,36,0.85)]",
        color: "bg-[rgba(250,175,36,0.8)]",
        textColor: "text-[rgba(0,39,149,0.8)]",
    },
    {
        name: "ALARM",
        // color: "bg-[rgba(233,34,34,0.85)]",
        color: "bg-[rgba(233,34,34,0.8)]",
        textColor: "text-[rgba(217,217,217,0.8)]",
    },
    {
        name: "SETUP",
        // color: "bg-[rgba(139,114,200,0.85)]",
        // color: "bg-[#9C009F]",
        color: "bg-[rgba(16,138,177,0.8)]",
        textColor: "text-[rgba(255,255,255,0.8)]",
    },
    {
        name: "OFF",
        color: "bg-[rgba(100,100,100,0.8)]",
        textColor: "text-[rgba(255,255,255,0.8)]",
    },
]

export const SEGMENT_RELATION = {
    afterWithDuration: 0,
    afterJustDone: 1,
    after: 2,
}
export const VALUE_TYPE = {
    boolean: 0,
    interger: 1,
    decimal: 2,
    string: 3,
}

export const togglePropertiesMachine_Line2 = ["GIÁM SÁT", "MFC"]
export const togglePropertiesReport = ["BÁO CÁO TỔNG", "BÁO CÁO THEO CA"]
export const toggleParamater = ["TẠO LỆNH SẢN XUẤT", "QUẢN LÝ LỆNH SẢN XUẤT", "DANH MỤC SẢN PHẨM"]
export const toggleManufacturingReport = [
    "TRUY XUẤT THEO DÂY CHUYỀN",
    "TRUY XUẤT LỆNH SẢN XUẤT TỪNG NGÀY",
    "TRUY XUẤT THEO TRƯỞNG LINE",
]
export const toggleErrorLineMachine = [
    "BẢNG THÔNG TIN",
    "SỐ LẦN LỖI KỸ THUẬT",
    "THỜI GIAN LỖI KỸ THUẬT",
    "SỐ LỖI SẢN PHẨM",
]
export const toggleManufacturing = ["TẤT CẢ", "NĂNG SUẤT", "A", "P", "Q", "OEE"]

export const enableStationVBT01 = [
    { name: "TUBE_LIFT", TagName: "TUBE_LIFT" },
    { name: "FIRST_CONVEYOR", TagName: "FIRST_CONVEYOR" },
    { name: "SECOND_CONVEYOR", TagName: "SECOND_CONVEYOR" },
    { name: "SERVO_START", TagName: "SERVO_START" },
    { name: "VACUUM_PUMP", TagName: "VACUUM_PUMP" },
]
export const enableStationVBT02 = [
    { name: "MAIN_ENGINE_START", TagName: "MAIN_ENGINE_START" },
    { name: "LABEL_PRESSING_START", TagName: "LABEL_PRESSING_START" },
    { name: "LABEL_START", TagName: "LABEL_START" },
]
export const enableStationVBT03 = [
    { name: "CONVEYOR", TagName: "CONVEYOR" },
    { name: "MOTOR_STEP_START", TagName: "MOTOR_STEP_START" },
]
export const enableStationVBT05 = [
    { name: "DRYING_STATION_1", TagName: "DRYING_STATION_1" },
    { name: "DRYING_STATION_2", TagName: "DRYING_STATION_2" },
    { name: "DRYING_STATION_3", TagName: "DRYING_STATION_3" },
]
export const enableStationVBT09 = [
    { name: "CONVEYOR", TagName: "CONVEYOR" },
    { name: "DOSING", TagName: "DOSING" },
    { name: "DRYING_STATION_1", TagName: "DRYING_STATION_1" },
    { name: "SPRAYING", TagName: "SPAYING" },
]
export const listOrderPage = [
    { name: "Lệnh sản xuất:", TagName: "LSX" },
    { name: "Line sản xuất:", TagName: "LSX" },
    { name: "Tên sản phẩm:", TagName: "LSX" },
    { name: "Mã Ref:", TagName: "LSX" },
    { name: "Ngày bắt đầu:", TagName: "LSX" },
    { name: "Ngày kết thúc:", TagName: "LSX" },
    { name: "Mã lô:", TagName: "LSX" },
    { name: "Cỡ lô:", TagName: "LSX" },
    { name: "Năng suất định kiến:", TagName: "LSX" },
    { name: "Trưởng line:", TagName: "LSX" },
    { name: "Người tạo lô:", TagName: "LSX" },
    { name: "Ghi chú:", TagName: "LSX" },
]
