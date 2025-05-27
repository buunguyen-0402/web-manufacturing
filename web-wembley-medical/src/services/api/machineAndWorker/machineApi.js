import axiosClient from "./axiosClient"

const machineApi = {
    histories: {
        // lay data cho trang Lich su loi
        getBugHistory: async (id, start, end) =>
            axiosClient.get(`/api/ErrorInformations?DeviceId=${id}&StartTime=${start}&EndTime=${end}`),
    },
    reports: {
        getFind: async (id, start, end) =>
            axiosClient.get(`/api/ShiftReports?DeviceId=${id}&StartTime=${start}&EndTime=${end}`),
        getDataEachShift: async (id, interval) =>
            axiosClient.get(`/api/ShiftReports/ShortenDetails?ShiftReportId=${id}&Interval=${interval}`),
        downloadExcel: async (id, start, end) =>
            axiosClient.get(`/api/ShiftReports/downloadReport?DeviceId=${id}&StartTime=${start}&EndTime=${end}`),
    },
    line: {
        getAllLine: async () => axiosClient.get("/api/Lines"), //lấy thông tin toàn bộ các Line
        postLine: async (data) => axiosClient.post(`api/Lines/`, data),
        patchLine: async (lineId, data) => axiosClient.patch(`api/Lines?LineId=${lineId}`, data),
        deleteLine: async (lineId) => axiosClient.delete(`api/Lines?LineId=${lineId}`),
        getLineByLineId: async (lineId) => axiosClient.get(`/api/Lines?LineId=${lineId}`), //lấy thông tin một line theo ID
        getAvailableLineId: async (lineId, startTime, endTime) =>
            axiosClient.get(`/api/Lines/Avaliability?LineId=${lineId}&StartTime=${startTime}&EndTime=${endTime}`),
    },
    station: {
        getAllStation: async () => axiosClient.get("/api/Stations"), //lấy thông tin toàn bộ station
        postStation: async (data) => axiosClient.post(`api/Stations/`, data),
        patchStation: async (stationId, data) => axiosClient.patch(`api/Stations?StationId=${stationId}`, data),
        deleteStation: async (stationId) => axiosClient.delete(`api/Stations?StationId=${stationId}`),
        getStationByLineId: async (lineId) => axiosClient(`/api/Stations?LineId=${lineId}`), //lấy thông tin một station theo ID
    },
    product: {
        getAllProducts: async () => axiosClient.get("/api/Products"), //lấy thông tin toàn bộ sản phẩm
        getProductsByLineId: async (lineId) => axiosClient.get(`/api/Products?LineId=${lineId}`), //lấy thông tin một sản phẩm theo ID
        postProducts: async (data) => axiosClient.post("/api/Products", data),
        patchProducts: async (productId, data) => axiosClient.patch(`/api/Products?ProductId=${productId}`, data),
        deleteProducts: async (productId) => axiosClient.delete(`/api/Products?ProductId=${productId}`),
    },
    reference: {
        getAllReferences: async () => axiosClient.get("/api/References"), //Lấy thông tin toàn bộ reference
        getReferenceByProductIdAndLineId: async (productId, lineId) =>
            axiosClient.get(`/api/References?ProductId=${productId}&LineId=${lineId}`), ///Lấy thông tin Ref theo productId và lineId
        getReferenceByLineId: async (lineId) => axiosClient.get(`/api/References?LineId=${lineId}`), // hiển thị list tên Ref
        getParamaterByRefId: async (ReferenceId) =>
            axiosClient.get(`/api/References/Parameters?ReferenceId=${ReferenceId}`),
        getAllParamaters: async () => axiosClient.get("/api/References/Parameters"), // lấy thông số cài đặt cho các line
        getParamaterByLineId: async (lineId) => axiosClient.get(`/api/References/Parameters?LineId=${lineId}`), //lấy thông số cho line nhất định
        postParamaters: async (referenceName, data) => axiosClient.post(`/api/References/${referenceName}`, data), // thêm lô sản phẩm trong trong cài đặt thông số line
        putParamaters: async (referenceName, data) => axiosClient.put(`/api/References/${referenceName}`, data), // sửa lô sản phẩm vừa cài đặt
        deleteLot: async (referenceName) => axiosClient.put(`/api/References/Parameters/Completed/${referenceName}`), //xóa lô sản phẩm
    },
    machineStatus: {
        getMachineStatusByStationId: async (stationId, startTime, endTime) =>
            axiosClient.get(
                `/api/MachineStatuses/station?StationId=${stationId}&StartTime=${startTime}&EndTime=${endTime}`,
            ),
    },
    errorInformation: {
        getErrorInformation: async (stationId, startTime, endTime) =>
            axiosClient.get(`/api/MachineErrors?StationId=${stationId}&StartTime=${startTime}&EndTime=${endTime}`),
        getErrorListOfStationAtDay: async (stationId, startTime, endTime) =>
            axiosClient.get(
                `api/MachineErrors/daily-count?StationId=${stationId}&StartTime=${startTime}&EndTime=${endTime}`,
            ),
        getErrorListOfStation: async (stationId) => axiosClient.get(`api/MachineErrors/detail?StationId=${stationId}`),
        postErrorListOfStation: async (data) => axiosClient.post(`api/MachineErrors/detail`, data),
        patchErrorListOfStation: async (data) => axiosClient.patch(`api/MachineErrors/detail`, data),
        deleteErrorListOfStation: async (data) => axiosClient.delete(`api/MachineErrors/detail`, data),
    },
    stationReference: {
        getMFCByRefIdAndStationId: async (referenceId, stationId) =>
            axiosClient.get(`/api/StationReferences?ReferenceId=${referenceId}&StationId=${stationId}`), //lấy thông tin MFC theo StaionId và RefId
        putMFCByRefIdAndStationId: async (stationId, referenceId, data) =>
            axiosClient.put(`/api/StationReferences/${stationId}/${referenceId}`, data), //sửa thông tin MFC
        getMFCByRefAndStationId: async () => axiosClient.get(`/api/StationReferences/Store`),
    },
    shiftReport: {
        getDataReport: async (stationId, startTime, endTime, interval) =>
            axiosClient.get(
                `api/Shots?StationId=${stationId}&StartTime=${startTime}&EndTime=${endTime}&Interval=${interval}`,
            ), //lấy tổng thông tin báo cáo
        getExcel: async (stationId, startTime, endTime) =>
            axiosClient.get(
                `/api/ShiftReports/DownloadReport?StationId=${stationId}&StartTime=${startTime}&EndTime=${endTime}`,
            ),
        getEachShift: async (shiftReportId, interval) =>
            axiosClient.get(`/api/ShiftReports/ShortenDetails?ShiftReportId=${shiftReportId}&Interval=${interval}`),
        getDataReportByWorkOrderId: async (workOrderId, startTime, endTime, interval) =>
            axiosClient.get(
                `api/Shots/WorkOrderShot?WorkOrderId=${workOrderId}&StartTime=${startTime}&EndTime=${endTime}&PageIndex=1&PageSize=${interval} `,
            ),
    },
    dataHistory100: {
        getData100: async (startTime, endTime) =>
            axiosClient.get(`/api/ChemicalTrays?StartTime=${startTime}&EndTime=${endTime}&PageIndex=1&PageSize=5`),
    },
    workOrders: {
        getWorkOrders: async () => axiosClient.get("/api/WorkOrders"),
        getWorkOrdersByWorkOrderId: async (id) => axiosClient.get(`/api/WorkOrders?WorkOrderId=${id}`),
        getWorkOrdersByStartTimeAndEndTime: async (startTime, endTime) =>
            axiosClient.get(`/api/WorkOrders?ExpectedStartTime=${startTime}&ExpectedEndTime=${endTime}`),
        getWorkOrdersByLineIdAndStartTimeAndEndTime: async (lineId, startTime, endTime) =>
            axiosClient.get(
                `/api/WorkOrders?LineId=${lineId}&ExpectedStartTime=${startTime}&ExpectedEndTime=${endTime}`,
            ),
        getWorkOrdersByLineManagerAndStartTimeAndEndTime: async (lineManager, startTime, endTime) =>
            axiosClient.get(
                `api/WorkOrders/line-manager?LineManager=${lineManager}&StartTime=${startTime}&EndTime=${endTime}`,
            ),
        getWorkOrdersByStatus: async (status) => axiosClient.get(`/api/WorkOrders?Status=${status}`),
        getWorkOrderDailyByLineIdAndStartAndEndTime: async (lineId, startTime, endTime) =>
            axiosClient.get(`api/WorkOrders/daily?LineId=${lineId}&StartDate=${startTime}&EndDate=${endTime}`),
        getErrorByWorkOrderId: async (workOrderId) =>
            axiosClient.get(`api/WorkOrders/WorkOrderError?WorkOrderId=${workOrderId}`),
        postWorkOrders: async (data) => axiosClient.post("/api/WorkOrders", data),
        postWorkOrderLastShot: async (data) => axiosClient.post(`api/WorkOrders/update-last-shot`, data),
        patchStatusWorkOrders: async (id, data) => axiosClient.patch(`/api/WorkOrders`, data),
        patchWorkOrders: async (data) => axiosClient.patch(`/api/WorkOrders`, data),
        deleteWorkOrders: async (id, data) => axiosClient.delete(`/api/WorkOrders?WorkOrderId=${id}`),
        postWorkOrderShot: async (data) => axiosClient.post(`/api/Shots`, data),
    },
    tagId: {
        getTagId: async (stationId) => axiosClient.get(`/api/VarTemplates?StationId=${stationId}`),
        postTagId: async (data) => axiosClient.post("/api/VarTemplates", data),
        patchTagId: async (data) => axiosClient.patch("/api/VarTemplates", data),
        deleteTagId: async (data) => axiosClient.delete(`/api/VarTemplates`, data),
    },
    currentStatus: {
        getCurrentStatus: async (stationId) => axiosClient.get(`/api/MachineStatuses/latest?StationId=${stationId}`),
        getAllStatusTime: async (stationId, startTime, endTime) =>
            axiosClient.get(
                `api/MachineStatuses/duration?StationId=${stationId}&StartTime=${startTime}&EndTime=${endTime}`,
            ),
        getStatusTimeByStatus: async (stationId, status) =>
            axiosClient.get(`api/MachineStatuses/duration?StationId=${stationId}&Status=${status}`),
        getTimeStatusWorkOrder: async (workOrderId) =>
            axiosClient.get(`api/Shots/latest-work-order-shot?WorkOrderId=${workOrderId}`),
    },
    shots: {
        getWorkOrderShotAndInterval: async (workOrderId, minute) =>
            axiosClient.get(`api/Shots?WorkOrderId=${workOrderId}&Interval=${minute}`),
        getWorkOrderShotById: async (workOrderId) => axiosClient.get(`api/Shots?WorkOrderId=${workOrderId}`),
        patchShots: async (data) => axiosClient.patch(`api/Shots`, data),
        getWorkOrderShotByIdAndStartTimeAndEndTime: async (workOrderId, startTime, endTime) =>
            axiosClient.get(`api/Shots?WorkOrderId=${workOrderId}&StartTime=${startTime}&EndTime=${endTime}`),
    },
    mfcs: {
        getMFCsByStationId: async (stationId) => axiosClient.get(`api/Mfcs?StationId=${stationId}`),
        postMFCsByStationId: async (data) => axiosClient.post(`api/Mfcs`, data),
        patchMFCsByStationId: async (data) => axiosClient.patch(`api/Mfcs`, data),
        deleteMFCsByStationId: async (data) => axiosClient.delete(`api/Mfcs`, data),
        getMFCsValueByStationIdAndRef: async (stationId, ref) =>
            axiosClient.get(`api/Mfcs/values?StationId=${stationId}&ReferenceCode=${ref}`),
        postMFCsValueByStationIdAndRef: async (data) => axiosClient.post(`api/Mfcs/values`, data),
        patchMFCsValueByStationIdAndRef: async (data) => axiosClient.patch(`api/Mfcs/values`, data),
        deleteMFCsValueByStationIdAndRef: async (data) => axiosClient.delete(`api/Mfcs/values`, data),
    },
}

export default machineApi
