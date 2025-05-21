import axios from "axios"

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_LIST_ORDER,
})

// axiosClient.interceptors.response.use(
//     async (response) => {
//        if (response & response.data){
//         return response.data
//        }
//     },
//     async (error) => {
//         const errorData = error.response?.data || "Error!"
//         return Promise.reject(errorData)
//     }
// )

export default axiosClient
