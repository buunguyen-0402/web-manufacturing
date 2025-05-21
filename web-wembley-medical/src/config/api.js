// const coreAxiosClientConfig = {
//     baseURL: import.meta.env.VITE_SERVER_ADDRESS + "/api",
//     headers: {
//         "Content-Type": "application/json",
//     },
//     validateStatus: (status) => status < 400,
// }

// //test
// const testAxiosClientConfig = {
//     baseURL: import.meta.env.VITE_TEST,
//     headers: {
//         "Content-Type": "application/json",
//     },
//     validateStatus: (status) => status < 400,
// }
// //test2
// const testAxiosClientConfig2 = {
//     baseURL: import.meta.env.VITE_TEST_2,
//     headers: {
//         "Content-Type": "application/json",
//     },
//     validateStatus: (status) => status < 400,
// }

// const oeeAxiosClientConfig = {
//     baseURL: import.meta.env.VITE_OEE_SERVER_ADDRESS + "/api",
//     headers: {
//         "Content-Type": "application/json",
//     },
//     validateStatus: (status) => status < 400,
// }
// const injectionMachineAxiosClientConfig = {
//     baseURL: import.meta.env.VITE_INJECTION_MACHINE_SERVER_ADDRESS + "/api",
//     headers: {
//         "Content-Type": "application/json",
//     },
//     validateStatus: (status) => status < 400,
// }
// const cmmsClientConfig = {
//     baseURL: import.meta.env.VITE_CMMS_SERVER_ADDRESS + "/api",
//     headers: {
//         "Content-Type": "application/json",
//     },
//     validateStatus: (status) => status < 400,
// }
const authorizationClientConfig = {
    baseURL: import.meta.env.VITE_AUTHORITY_SERVER,
    headers: {
        "Content-Type": "application/json",
    },
    validateStatus: (status) => status < 400,
}
export {
    // coreAxiosClientConfig,
    // oeeAxiosClientConfig,
    // injectionMachineAxiosClientConfig,
    // cmmsClientConfig,
    authorizationClientConfig,
    // testAxiosClientConfig,
    // testAxiosClientConfig2,
}
