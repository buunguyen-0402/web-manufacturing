import { paths } from "@/config"
import { MFC, Report, Configuration, StatusHistory, BugHistory } from "@/components/Icons"

const SIDEBAR_ITEMS = [
    {
        label: "THÔNG SỐ HOẠT ĐỘNG",
        icon: Configuration,
        route: paths.propertiesMachine,
    },
    {
        label: "CÀI ĐẶT MFC",
        icon: MFC,
        route: paths.settingMFC,
    },
    {
        label: "LỊCH SỬ LỖI",
        icon: BugHistory,
        route: paths.historyBugs,
    },
    {
        label: "LỊCH SỬ HOẠT ĐỘNG",
        icon: Report,
        route: paths.propertiesReport,
    },
    {
        label: "TRẠNG THÁI MÁY",
        icon: StatusHistory,
        route: paths.propertiesStatus,
    },
]

export { SIDEBAR_ITEMS }
