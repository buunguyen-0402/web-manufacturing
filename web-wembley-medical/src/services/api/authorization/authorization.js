import axiosClient from "./axiosClient"

const authorizationApi = {
    user: {
        getUser: async () => axiosClient.get("/api/Users"), // get all user
        getUserById: async (id) => axiosClient.get(`/api/Users/${id}`),
        getUserInfo: async () => axiosClient.get("/api/Users/myInfor"), // get current user info

        postPassword: async (data) => await axiosClient.post("api/Users/change-password", data),

        createUser: async (data) => await axiosClient.post("/api/Users", data),
        updateUserRole: async (data, id) => await axiosClient.patch(`/api/Users/${id}`, data),
        updateUser: async (data, id) => await axiosClient.patch(`/api/Users/update-info/${id}`, data),
        deleteUser: async (id) => await axiosClient.delete(`/api/Users/${id}`),
    },
    role: {
        getRole: async () => axiosClient.get("/api/Roles"), // get all Role
        createRole: async (data) => await axiosClient.post("/api/Roles", data),
        updateRole: async (data) => await axiosClient.patch(`/api/Roles/update-info`, data),
        deleteRole: async (id) => await axiosClient.delete(`/api/Roles/${id}`),
    },
    pages: {
        getPage: async () => axiosClient.get("/api/Pages"), // get all page
        createPage: async (data) => await axiosClient.post("/api/Pages", data),
        addButtonToPage: async (data) => await axiosClient.patch("/api/Pages/add-buttons", data),
        deletePage: async (data) => await axiosClient.delete("api/Pages", data),
        deleteButtonToPage: async (data) => await axiosClient.patch("/api/Pages/delete-buttons", data),

        addPageToRole: async (data) => await axiosClient.patch("/api/Roles/add-pages", data),
        deletePageToRole: async (data) => await axiosClient.patch("/api/Roles/delete-pages", data),
    },

    logOut: {
        logout: async () => axiosClient.get("/Account/Logout"),
        endSession: async (token, url) =>
            axiosClient.get(`/connect/endsession?id_token_hint=${token}&post_logout_redirect_uri=${url}`),
    },
}
export default authorizationApi
