import { HubConnectionBuilder, HttpTransportType } from "@microsoft/signalr"
import { toast } from "react-toastify"

const connection = new HubConnectionBuilder()
    .withUrl(import.meta.env.VITE_SIGNALR, { transport: HttpTransportType.WebSockets })
    .withAutomaticReconnect([0, 3000, 5000, 10000, 15000, 20000, 30000, 45000, 60000])
    .build()

const hubConnection = {
    connection,
    start: async () => {
        try {
            if (connection.state === "Disconnected" || connection.state === "Connecting") {
                await connection.start().then(() => {
                    // toast.success("Kết nối thành công server")
                })
            }
            if (connection.state === "Connected") {
                return connection
            }
        } catch (error) {
            // toast.error("Kết nối server thất bại: " + error)
            setTimeout(() => hubConnection.start(), 5000)
            throw error
        }
    },
    stop: async () => {
        if (connection.state === "Connected") {
            await connection.stop()
            // toast.error("Đã ngắt kết nối Websocket server")
        }
    },
    onConnectionStateChange: (callback) => {
        connection.onreconnecting((error) => {
            // toast.warning(`Reconnecting: ${error}`)
            callback("Đang thực hiện kết nối")
        })

        connection.onreconnected((connectionId) => {
            // toast.info(`Reconnected: ${connectionId}`)
            callback("Đã kết nối lại thành công")
        })

        connection.onclose(async (error) => {
            // toast.error(`Closed: ${error}`)
            callback("Closed")
            // await hubConnection.start()
            setTimeout(() => hubConnection.start(), 5000)
        })
    },
    offConnectionStateChange: (callback) => {
        connection.off("reconnecting", callback)
        connection.off("reconnected", callback)
        connection.off("close", callback)
    },
}

hubConnection.onConnectionStateChange((state) => {
    // toast.info(`Connection state changed: ${state}`)
})

export default hubConnection
