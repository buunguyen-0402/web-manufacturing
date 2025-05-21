import axiosClient from "./axiosClient"
const listOrder = {
    getAlllist: async () => await axiosClient.get("/"),
    postAlllist: async (data) => await axiosClient.post("/", data),
    deleteAlllist: async (id) => await axiosClient.delete(`/${id}`),
    // getWorker: async(employeeId) => axiosClient.get(`/api/ Employees?EmployeeId=${employeeId} `),
    // createWorker: async(data) => axiosClient.post("/api/Employees", data),
    // createWorkerAtMachine: async(stationId, data) => axiosClient.post(`/api/Employees/WorkRecords/${stationId}`, data),
    // putWorkerAtMachine: async(stationId, data) => axiosClient.put(`/api/Employees/WorkRecords/${stationId}`, data),
    // deleteWorker: async(employeeId) => axiosClient.delete(`/api/Employees/${employeeId}`),
    // deleteWorkerAtMachine: async(stationId, data) => axiosClient.delete(`/api/Employees/WorkRecords/${stationId}`, data)
}

export default listOrder
