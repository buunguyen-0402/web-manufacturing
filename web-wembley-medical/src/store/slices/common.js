import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    pageTitle: "",
    loading: false,
}

const commonSLice = createSlice({
    name: "common",
    initialState,
    reducers: {
        setPageTitle(state, action) {
            state.pageTitle = action.payload
            return state
        },
        setLoading(state, action) {
            state.loading = action.payload
            return state
        },
        pushNotification(state, action) {
            const id = state.notifications.slice(-1)[0]?.id + 1 || 1
            const date = new Date()
            const newNotifications = [...state.notifications]
            newNotifications.push({
                ...action.payload,
                id,
                displayDate: `${date.getDate()}/${date.getMonth() + 1} ${date.getHours()}:${date.getMinutes()}`,
                dateTime: date.toISOString(),
                read: false,
            })
            state.notifications = newNotifications
            state.unRead = true
            return state
        },
        readAllNotifications(state, action) {
            const newNotifications = state.notifications.map((item) => ({ ...item, read: true }))
            state.notifications = newNotifications
            state.unRead = false
            return state
        },
        readNotification(state, action) {
            const id = action.payload
            const newNotifications = state.notifications.map((item) =>
                item.id === id ? { ...item, read: true } : item,
            )
            state.notifications = newNotifications
            state.unRead = newNotifications.some((item) => !item.read)
            return state
        },
        deleteNotification(state, action) {
            const id = action.payload
            const newNotifications = state.notifications.filter((item) => item.id !== id)
            state.notifications = newNotifications
            state.unRead = newNotifications.some((item) => !item.read)
            return state
        },
    },
})

export default commonSLice.reducer
export const {
    setPageTitle,
    setLoading,
    pushNotification,
    readAllNotifications,
    readNotification,
    deleteNotification,
} = commonSLice.actions
