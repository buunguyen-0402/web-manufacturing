import { paths } from "@/config"
import {
    MFC,
    Report,
    Configuration,
    Account,
    AddLot,
    WorkerList,
    AddChart,
    // StatusHistory,
    // BugHistory
} from "@/components/Icons"

const SIDEBAR_ITEMS_DASHBOARD = [
    {
        label: "TỔNG QUAN",
        icon: Configuration,
        route: paths.dashboard,
    },
    {
        label: "THÔNG TIN LỆNH SẢN XUẤT",
        icon: AddLot,
        route: paths.paramaterSetting,
    },
    {
        label: "NHẬP THÔNG TIN SẢN XUẤT",
        icon: AddChart,
        route: paths.updatedData,
    },
    {
        label: "BÁO CÁO SẢN XUẤT",
        icon: Report,
        route: paths.manufacturingReport,
    },
    // {
    //     label: "QUẢN LÝ NHÂN VIÊN",
    //     icon: WorkerList,
    //     route: paths.workerList,
    // },
    {
        label: "TÀI KHOẢN",
        icon: Account,
        route: paths.setting.account,
    },
    // {
    //     label: "QUẢN LÝ NHÂN VIÊN",
    //     icon: Report,
    //     route: paths.setting.user,
    // },
    // {
    //     label: "QUẢN LÝ CHỨC VỤ",
    //     icon: Report,
    //     route: paths.setting.role,
    // },
]

export { SIDEBAR_ITEMS_DASHBOARD }
