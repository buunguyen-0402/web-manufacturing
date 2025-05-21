import axiosClient from "./axiosClient";

const workerApi = {
    getAllWoker: async () => await axiosClient.get("/api/Employees"),
    getWorker: async(employeeId) => axiosClient.get(`/api/ Employees?EmployeeId=${employeeId} `),
    createWorker: async(data) => axiosClient.post("/api/Employees", data),
    createWorkerAtMachine: async(stationId, data) => axiosClient.post(`/api/Employees/WorkRecords/${stationId}`, data),
    putWorkerAtMachine: async(stationId, data) => axiosClient.put(`/api/Employees/WorkRecords/${stationId}`, data),
    deleteWorker: async(employeeId) => axiosClient.delete(`/api/Employees/${employeeId}`),
    deleteWorkerAtMachine: async(stationId, data) => axiosClient.delete(`/api/Employees/WorkRecords/${stationId}`, data)
}

export default workerApi