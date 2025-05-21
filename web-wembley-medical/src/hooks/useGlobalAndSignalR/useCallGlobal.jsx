import { createContext, useState, useEffect } from "react"
import hubConnection from "@/services/signalR/hubConnection"

const ThemeContext = createContext()

function ThemeProvider({ children }) {
    const [error, setError] = useState()
    const [connection, setConnection] = useState(null)
    useEffect(() => {
        const startConnection = async () => {
            try {
                await hubConnection.start()
                setConnection(hubConnection.connection)
            } catch (error) {
                // console.error("Error starting SignalR connection:", error)
                setTimeout(startConnection, 5000)
            }
        }
        const handleConnectionStateChange = (state) => {
            if (state === "Reconnected") {
                startConnection()
            } else if (state === "Closed") {
                setConnection(null)
            }
        }
        startConnection()
        hubConnection.onConnectionStateChange(handleConnectionStateChange)
        return () => {
            hubConnection.offConnectionStateChange(handleConnectionStateChange)
            if (hubConnection.connection && hubConnection.connection.state === "Connected") {
                hubConnection
                    .stop()
                    .then(() => {
                        setConnection(null)
                    })
                    .catch((error) => {
                        // console.error("Error stopping SignalR connection:", error)
                    })
            }
        }
    }, [])

    return <ThemeContext.Provider value={{ connection, error, setError }}>{children}</ThemeContext.Provider>
}

export { ThemeContext, ThemeProvider }
