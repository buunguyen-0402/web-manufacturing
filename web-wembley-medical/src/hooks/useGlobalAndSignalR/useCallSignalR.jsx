import { useState, useEffect, useCallback } from "react"
import hubConnection from "@/services/signalR/hubConnection"

function useCallSignalR(connection, station, arrayDataBuffer, arrayData) {
    const [machineData, setMachineData] = useState()
    const fetchDataByKeyTag = useCallback(() => {
        if (connection && connection.state === "Connected" && arrayDataBuffer.length > 0 && arrayData.length > 0) {
            try {
                connection.invoke("SendStationTagsAsync", station, arrayDataBuffer).then((res) => {
                    const test = JSON.parse(res)
                    test.forEach((res, index) => {
                        setMachineData((prevData) => {
                            if (res.TagId === "errorStatus") {
                                const updateError = { ...prevData, [res.TagId + "_" + res.TagValue]: res }
                                return updateError
                            } else {
                                const updateData = { ...prevData, [res.TagId]: res }
                                return updateData
                            }
                        })
                    })
                })
            } catch (error) {
                // console.log(error)
            }
        }
    }, [connection, station, arrayDataBuffer])

    const fetchData = useCallback(async () => {
        if (connection && connection.state === "Connected" && arrayDataBuffer.length > 0 && arrayData.length > 0) {
            try {
                await connection.invoke("UpdateTopics", arrayData)
                connection.on("OnTagChanged", (res) => {
                    const obj = JSON.parse(res)
                    obj.forEach((res) => {
                        // console.log(res)
                        setMachineData((prevData) => {
                            if (res.TagId === "errorStatus") {
                                const updateError = { ...prevData, [res.TagId + "_" + res.TagValue]: res }
                                return updateError
                            } else {
                                const updateData = { ...prevData, [res.TagId]: res }
                                return updateData
                            }
                        })
                    })
                })
                return () => {
                    connection.off("OnTagChanged")
                }
            } catch (error) {
                // console.error("Error sending data via SignalR connection:", error)
            }
        }
        return undefined
    }, [connection, arrayData])
    useEffect(() => {
        fetchDataByKeyTag()
    }, [connection])

    // useEffect(() => {
    //     fetchData()
    //     return () => {
    //         if (connection && connection.state === "Connected") {
    //             connection.off("OnTagChanged")
    //         }
    //     }
    // }, [fetchData])
    useEffect(() => {
        const cleanup = fetchData()
        return () => {
            if (cleanup && typeof cleanup === "function") {
                cleanup()
            }
        }
    }, [fetchData])
    useEffect(() => {
        const handleReconnection = () => {
            if (connection && connection.state === "Connected") {
                fetchDataByKeyTag()
                fetchData()
            }
        }

        hubConnection.onConnectionStateChange(handleReconnection)

        return () => {
            hubConnection.offConnectionStateChange(handleReconnection)
        }
    }, [connection, fetchDataByKeyTag, fetchData])

    return machineData
}

export default useCallSignalR
