// import { toast } from "react-toastify"
import { VALUE_TYPE, SEGMENT_RELATION } from "@/utils/constants"
import { validateValueType } from "./validate"
import {
    convertDateFormat,
    convertDateFormatForReport,
    convertToSecond,
    convertToHour,
    convertToHourRenderName,
    convertOverDayToSecond,
} from "./dateTime"

export const formatNumberValue = (value, format) => {
    if (isNaN(value)) {
        return 0
    } else {
        value = Number(value)
    }

    switch (typeof format) {
        case "boolean":
            return Math.round(value)
        case "number":
            return value.toFixed(format)
        case "function":
            return format(value)
        default:
            return value
    }
}

export const getMenuItemValue = (value, path = [], id) => {
    let crrValue = value
    for (let i = 0; i < path.length; i++) {
        crrValue = value?.[path[i]]
    }
    return id ? crrValue?.[id] : crrValue
}

export const getUpdatedMenuValue = (value, itemValue, path = [], id) => {
    let updateValue = value
    if (id) {
        for (let i = 0; i < path.length; i++) {
            if (!updateValue[path[i]]) {
                updateValue[path[i]] = {}
            }
            updateValue = updateValue[path[i]]
        }
        updateValue[id] = itemValue
    } else {
        for (let i = 0; i < path.length - 1; i++) {
            if (!updateValue[path[i]]) {
                updateValue[path[i]] = {}
            }
            updateValue = updateValue[path[i]]
        }
        updateValue[path[path.length - 1]] = itemValue
    }

    return { ...value }
}

export const getMenuTableData = (value, id) => {
    return value?.map((v) => v[id])
}

export const getSegmentOptionList = (segments) => {
    const segmenList = segments.productSegments?.map((item) => ({
        key: item.info.description,
        value: item.info.productSegmentId,
    }))
    if (Array.isArray(segmenList)) {
        segmenList.unshift({ key: "Start", value: "start-segment" })
    }
    return segmenList
}

export const getResourceOptionsList = (items, key) => {
    return items.map((item) => ({ value: item[key], key: item.name }))
}
export const poperListMapper = (items, key, name) => {
    return items.map((item) => ({ value: item[key], key: item[name] }))
}
export const poperListMapperUniqueArray = (items) => {
    return items.map((item) => ({ value: item, key: item }))
}
export const getPrerequisteOperationList = (items, valueKey, keyKey) => {
    return items.map((item) => ({ value: item[valueKey], key: item[keyKey] }))
}

export function cloneDeep(obj) {
    let newObj = {}

    if (Array.isArray(obj)) {
        newObj = []
    }

    for (let key in obj) {
        if (typeof obj[key] === "object" && obj[key] !== null) {
            newObj[key] = cloneDeep(obj[key])
        } else {
            newObj[key] = obj[key]
        }
    }

    return newObj
}

export const updateValidateRuleForSubnav = (valueType, subNav = []) => {
    if (valueType !== undefined) {
        const newNav = cloneDeep(subNav)
        newNav.forEach((nav) => {
            if (nav.type === "form") {
                nav.items.forEach((item) => {
                    if (item.id === "valueString") {
                        if (valueType === VALUE_TYPE.boolean) {
                            item.type = "checkbox"
                        } else {
                            item.isError = (value) => validateValueType(value, valueType)
                        }
                    }
                })
            }
        })

        return newNav
    }
    return subNav
}

export const updateValidateRuleForFormMenuItems = (valueType, items = []) => {
    if (valueType !== undefined) {
        const newItems = cloneDeep(items)
        newItems.forEach((item) => {
            if (item.id === "valueString") {
                if (valueType === VALUE_TYPE.boolean) {
                    item.type = "checkbox"
                } else {
                    item.type = "text"
                    item.isError = (value) => validateValueType(value, valueType)
                }
            }
        })
        return newItems
    }
    return items
}

export const handleGanttChartData = (segments, segmentRelationships) => {
    const result = segments.map((item) => {
        return {
            id: item.segmentId,
            description: item.description,
            begin: 0,
            end: 0,
            duration: item.duration,
        }
    })

    segmentRelationships.forEach((item) => {
        let time, begin, end, prevEnd
        const segA = result.find((s) => s.id === item.segmentA)
        const segB = result.find((s) => s.id === item.segmentB)

        switch (item.relation) {
            case SEGMENT_RELATION.afterJustDone:
            case SEGMENT_RELATION.after:
                prevEnd = item.segmentA === "start-segment" ? 0 : segA.end
                begin = segB.begin > prevEnd ? segB.begin : prevEnd
                time = segB.duration
                end = begin + time
                break

            case SEGMENT_RELATION.afterWithDuration:
                prevEnd = item.segmentA === "start-segment" ? 0 : segA.end
                begin = segB.begin > prevEnd ? segB.begin : prevEnd
                begin += item.duration
                time = segB.duration
                end = begin + time
                break
            default:
        }

        result.forEach((r) => {
            if (r.id === segB.id) {
                r.begin = begin
                r.end = end
            }
        })
    })
    return result.map((item) => ({
        x: item.id,
        y: [item.begin, item.end],
        name: item.description,
    }))
}

export const handleCovertDataToSecond = (data) => {
    const on = convertOverDayToSecond(data.onTime)
    const run = convertOverDayToSecond(data.runTime)
    const idle = convertOverDayToSecond(data.idleTime)
    const alarm = convertOverDayToSecond(data.alarmTime)
    const setup = convertOverDayToSecond(data.setUpTime)
    const off = convertOverDayToSecond(data.offTime)
    return { onTime: on, runTime: run, idleTime: idle, alarmTime: alarm, setUpTime: setup, offTime: off }
}

export const handleMachineOverviewFilterData = (data) => {
    const productivity = data.map((res) => ({ x: convertDateFormatForReport(res.timestamp), y: res.productivity }))
    const a = data.map((res) => ({ x: convertDateFormatForReport(res.timestamp), y: (res.a * 100).toFixed(1) }))
    const p = data.map((res) => ({ x: convertDateFormatForReport(res.timestamp), y: (res.p * 100).toFixed(1) }))
    const q = data.map((res) => ({ x: convertDateFormatForReport(res.timestamp), y: (res.q * 100).toFixed(1) }))
    const oee = data.map((res) => ({ x: convertDateFormatForReport(res.timestamp), y: (res.oee * 100).toFixed(1) }))
    return [productivity, a, p, q, oee]
}

export const handleManufacturingFilterData = (data) => {
    const toFixedData = handleOeeData(data)
    const name = data.map((res) => res.timestamp.slice(0, 18))
    const productivity = data.map((res) => ({ x: convertDateFormatForReport(res.timestamp), y: res.productivity }))
    const a = data.map((res) => ({ x: convertDateFormatForReport(res.timestamp), y: (res.a * 100).toFixed(1) }))
    const p = data.map((res) => ({ x: convertDateFormatForReport(res.timestamp), y: (res.p * 100).toFixed(1) }))
    const q = data.map((res) => ({ x: convertDateFormatForReport(res.timestamp), y: (res.q * 100).toFixed(1) }))
    const oee = data.map((res) => ({ x: convertDateFormatForReport(res.timestamp), y: (res.oee * 100).toFixed(1) }))
    return [toFixedData, name, productivity, a, p, q, oee]
}

export const handleDataError = (data) => {
    const filterData = data.map((res) => {
        const error = res.machineErrors.reduce((sum, item) => sum + item.errorCount, 0)
        const time = res.machineErrors.reduce((sum, item) => sum + convertToSecond(item.totalErrorTime), 0)
        const product = res.productErrors.reduce((sum, item) => sum + item.errorProductCount, 0)

        return {
            stationId: res.stationId,
            totalError: error,
            totalErrorTimeStationConvert: convertToHourRenderName(time),
            totalErrorTimeStation: time,
            eachError: res.machineErrors,
            totalProductErrors: product,
        }
    })

    return filterData
}

export const handleDataErrorMachineOverview = (data) => {
    const filterData = data.map((res) => {
        const time = convertToSecond(res.totalTime)

        return {
            ...res,
            totalTimeConvert: convertToHourRenderName(time),
        }
    })

    return filterData
}

export const filterDataDashboard = (data) => {
    const filterData = {}
    const listTagNeedToFilter = [
        "productCount",
        "EFF",
        "goodProduct",
        "errorProduct",
        "isConnectPLC",
        "machineStatus",
        "S1_VISION_TOTAL_TUBES",
        "S1_VISION_GOOD_TUBES",
        "S1_VISION_BAD_TUBES",
    ]
    for (const key in data) {
        const item = data[key]
        const { StationId, TagId } = item
        if (listTagNeedToFilter.includes(TagId)) {
            if (!filterData[StationId]) {
                filterData[StationId] = {}
            }
            filterData[StationId][TagId] = item
        }
    }
    return filterData
}

export const filterErrorStatus = (data) => {
    const filterData = []
    for (let key in data) {
        if (key.includes("error_machine")) {
            filterData.push(data[key])
        }
    }
    return filterData
}
export const filterOEEValue = (data) => {
    if (data?.OEE?.TagId === "OEE") {
        const currOee = data?.OEE
        return {
            ...currOee,
            TagValue: parseFloat((currOee.TagValue * 100).toFixed(2)),
            TimeStamp: String(currOee.TimeStamp).slice(11, 17),
        }
    }
}

export const handleManufacturingData = (data) => {
    // const roundedData = data
    const roundedData = data.map((item) => {
        const oldEndTime = item["expectedEndTime"] ? new Date(item.expectedEndTime) : null
        const newEndTIme = item["endTime"] ? new Date(item.endTime) : null
        const prepare = newEndTIme > oldEndTime ? "Không đạt" : "Đạt"
        return {
            ...item,
            scheduleTime: `${convertDateFormat(item.expectedStartTime)} -> ${convertDateFormat(item.expectedEndTime)}`,
            startTime: convertDateFormat(item.startTime),
            endTime: convertDateFormat(item.endTime),
            result: String(item.status) === "Hoàn thành" ? prepare : "Lệnh chưa hoàn thành",
            productivityPrepare: Number(item.productivity) >= Number(item.expectProductivity) ? "Đạt" : "Không đạt",
            a: (item.a * 100).toFixed(0),
            p: (item.p * 100).toFixed(0),
            q: (item.q * 100).toFixed(0),
            oee: (item.oee * 100).toFixed(0),
        }
    })
    return roundedData
}

export const handleManufacturingDataProductivity = (data) => {
    // const roundedData = data
    const roundedData = data.map((item) => {
        return {
            x: item.workOrderCode,
            y: item.productivity,
            goals: [
                {
                    name: "Năng suất yêu cầu",
                    value: item.expectProductivity,
                    strokeHeight: 5,
                    strokeColor: "rgba(233,34,34,0.85)",
                },
            ],
        }
    })
    return roundedData
}

export const handleOeeData = (data) => {
    // const roundedData = data
    const roundedData = data.map((item) => {
        const convertSecond = convertToSecond(item.totalOnTime)
        const convertSeconds = convertToSecond(item.totalRunTime)
        return {
            ...item,
            timestamp: convertDateFormatForReport(item.timestamp),
            totalOnTime: convertToHourRenderName(convertSecond),
            totalRunTime: convertToHourRenderName(convertSeconds),
            a: (item.a * 100).toFixed(2),
            p: (item.p * 100).toFixed(2),
            q: (item.q * 100).toFixed(2),
            oee: (item.oee * 100).toFixed(2),
            // a: (Number(item.a) * 100).toFixed(2),
            // p: (Number(item.p) * 100).toFixed(2),
            // q: (Number(item.q) * 100).toFixed(2),
            // l: Number(item.l.toFixed(2)),
            // oee: (Number(item.oee) * 100).toFixed(2),
        }
    })
    return roundedData
}

export const handleDataParamter = (data) => {
    // const roundedData = data
    const roundedData = data.map((item) => {
        return {
            ...item,
            expectedStartTime: convertDateFormatForReport(item.expectedStartTime),
            expectedEndTime: convertDateFormatForReport(item.expectedEndTime),

            // a: (Number(item.a) * 100).toFixed(2),
            // p: (Number(item.p) * 100).toFixed(2),
            // q: (Number(item.q) * 100).toFixed(2),
            // l: Number(item.l.toFixed(2)),
            // oee: (Number(item.oee) * 100).toFixed(2),
        }
    })
    return roundedData
}

export const handleManufacturingOeeData = (data) => {
    // const roundedData = data
    const oee = data.map((res) => res.oee)
    const a = data.map((res) => res.a)
    const p = data.map((res) => res.p)
    const q = data.map((res) => res.q)

    return [
        { name: "OEE", data: oee },
        { name: "A", data: a },
        { name: "P", data: p },
        { name: "Q", data: q },
    ]
}

export const handleSETTINGRoleData = (data) => {
    const roundedData = data.map((items) => {
        return {
            ...items,
            allPages: items.pages.flatMap((res) => res.name),
            allButtons: items.pages.flatMap((res) => res.buttons),
        }
    })
    return roundedData
}

// export const handleMachinesListData = (data) => {
//     // const roundedData = data
//     const roundedData = data.map((item) => {
//         return {
//             value: item.id,
//             key: item.name,
//         }
//     })
//     return roundedData
// }
export const handleOeeMode = (mode) => {
    switch (mode) {
        case 0:
            return "ALL"
        case 1:
            return "OEE"
        case 2:
            return "A"
        case 3:
            return "P"
        case 4:
            return "Q"
        case 5:
            return "L"
        default:
    }
}
export const handleOeeModeEachShift = (mode) => {
    switch (mode) {
        case 0:
            return "ALL"
        case 1:
            return "OEE"
        case 2:
            return "A"
        case 3:
            return "P"
        case 4:
            return "Q"
        case 5:
            return "L"
        default:
    }
}

export const handleOeePageHeader = (mode) => {
    const header = [
        {
            Header: "Thời gian",
            accessor: "timestamp",
            disableSortBy: false,
        },
        {
            Header: "OEE(%)",
            accessor: "oee",
            disableSortBy: false,
        },
        {
            Header: "Độ hữu dụng A(%)",
            accessor: "a",
            disableSortBy: false,
        },
        {
            Header: "Hiệu suất P(%)",
            accessor: "p",
            disableSortBy: false,
        },
        {
            Header: "Chất lượng Q(%)",
            accessor: "q",
            disableSortBy: false,
        },
        {
            Header: " Tổng sản lượng",
            accessor: "productCount",
            disableSortBy: false,
        },
        {
            Header: "Sản lượng lỗi",
            accessor: "defectCount",
            disableSortBy: false,
        },
    ]
    switch (mode) {
        case 0:
            return header
        case 1:
            return header.filter((item) => item.accessor === "timestamp" || item.accessor === "oee")
        case 2:
            return header.filter((item) => item.accessor === "timestamp" || item.accessor === "a")
        case 3:
            return header.filter((item) => item.accessor === "timestamp" || item.accessor === "p")
        case 4:
            return header.filter((item) => item.accessor === "timestamp" || item.accessor === "q")
        case 5:
            return header.filter((item) => item.accessor === "timestamp" || item.accessor === "l")
        default:
            return []
    }
}
export const handleOeePageHeaderEachShift = (mode) => {
    const header = [
        {
            Header: "Thời gian",
            accessor: "timeStamp",
            disableSortBy: false,
        },
        {
            Header: "OEE(%)",
            accessor: "oee",
            disableSortBy: false,
        },
        {
            Header: "Độ hữu dụng A(%)",
            accessor: "a",
            disableSortBy: false,
        },
        {
            Header: "Hiệu suất P(%)",
            accessor: "p",
            disableSortBy: false,
        },
        {
            Header: "Chất lượng Q(%)",
            accessor: "q",
            disableSortBy: false,
        },

        // {
        //     Header: "Thời gian chết L(s)",
        //     accessor: "l",
        //     disableSortBy: false,
        // },
    ]
    switch (mode) {
        case 0:
            return header
        case 1:
            return header.filter((item) => item.accessor === "timeStamp" || item.accessor === "oee")
        case 2:
            return header.filter((item) => item.accessor === "timeStamp" || item.accessor === "a")
        case 3:
            return header.filter((item) => item.accessor === "timeStamp" || item.accessor === "p")
        case 4:
            return header.filter((item) => item.accessor === "timeStamp" || item.accessor === "q")
        case 5:
            return header.filter((item) => item.accessor === "timeStamp" || item.accessor === "l")
        default:
            return []
    }
}
export const handleOeeValueSignalR = (data) => {
    const arrayOee = []
    if (data) {
        data.map((res) => {
            arrayOee.push(parseFloat((res.oee * 100).toFixed(2)))
        })
    }
    return arrayOee
}
export const handleOeeTimeSignalR = (data) => {
    const arrayOee = []
    if (data) {
        data.map((res) => {
            arrayOee.push(String(res.timeStamp).slice(11, 19))
        })
    }
    return arrayOee
}

export const handleRefInfor = (data) => {
    const refInfor = {}

    data.forEach(({ referenceCode, productCount, goodProduct, defectCount }) => {
        if (!refInfor[referenceCode]) {
            refInfor[referenceCode] = {
                referenceCode: referenceCode,
                totalCount: 0,
                totalProductCount: 0,
                totalGoodProduct: 0,
                totalDefectCount: 0,
            }
        }
        refInfor[referenceCode].totalCount += 1
        refInfor[referenceCode].totalProductCount += productCount
        refInfor[referenceCode].totalGoodProduct += goodProduct
        refInfor[referenceCode].totalDefectCount += defectCount
    })

    const resultCount = [
        { name: "Tổng sản lượng", data: Object.keys(refInfor).map((key) => refInfor[key].totalProductCount) },
        { name: "Tổng sản lượng đạt", data: Object.keys(refInfor).map((key) => refInfor[key].totalGoodProduct) },
        { name: "Tổng sản lượng lỗi", data: Object.keys(refInfor).map((key) => refInfor[key].totalDefectCount) },
    ]
    const resultTotalCount = Object.keys(refInfor).map((key) => refInfor[key].totalCount)
    const resultName = Object.keys(refInfor).map((key) => refInfor[key].referenceCode)

    return {
        ref: resultName,
        total: resultCount,
        columnData: resultTotalCount,
    }
}

export const handleInProgressWorkOrder = (data) => {
    const inProgressWorkOrder = {}
    data.forEach(({ lineId, workOrderCode, productivity, referenceCode, a, p, q, oee }) => {
        if (!inProgressWorkOrder[lineId]) {
            inProgressWorkOrder[lineId] = {
                lineId: lineId,
                workOrderCode: workOrderCode,
                productivity: productivity,
                a: a,
                p: p,
                q: q,
                oee: oee,
                referenceCode: referenceCode,
            }
        }
    })
    return inProgressWorkOrder
}

export const handleAvaliability = (data) => {
    const running = data.reduce((acc, res) => acc + convertToSecond(res.actualRunningTime), 0)
    const runningIdeal = data.reduce((acc, res) => acc + convertToSecond(res.idealRunningTime), 0)

    return {
        running: convertToHourRenderName(running),
        ideal: convertToHourRenderName(runningIdeal),
        avaliability: Number((running * 100) / runningIdeal).toFixed(0),
    }
}

export const handleDataMatrix = (data) => {
    if (data.length > 0) {
        const letter = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K"]
        const matrix = letter.flatMap((letter) =>
            Array.from({ length: 10 }, (_, i) => `${data[0].tagId}_${letter}${i + 1}`),
        )
        return [...matrix, `${data[0].tagId}_MAX`, `${data[0].tagId}_MIN`]
    }
    return []
}
