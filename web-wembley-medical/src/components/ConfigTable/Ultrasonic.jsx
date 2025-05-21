import cl from "classnames"
function Ultrasonic({ param, connection, data, type }) {
    const cl1 = "  h-10"
    const cl2 = " min-h-8 p-1 font-bold group-last:rounded-bl-lg group-last:last:rounded-br-lg h-12"

    // const data = useCallSignalR(connection, TagNameProperties["HerapinCap/IE-F2-HCA01"]["Ultrasonic"])

    return (
        <>
            {type === 1 ? (
                <>
                    <h3 className=" w-full text-center"> ULTRASONIC TR1-3</h3>
                    <table className=" h-[50%] w-full text-center text-[0.9rem] table-fixed">
                        <thead className="sticky top-0 z-10  text-center">
                            <tr className=" text-neutron-4 bg-primary-1">
                                <th className={cl1}>
                                    <span>Cycle</span>
                                </th>
                                <th className={cl1}>
                                    <span>RunTime</span>
                                </th>
                                <th className={cl1}>
                                    <span>Pk Pwr</span>
                                </th>
                                <th className={cl1}>
                                    <span>Energy</span>
                                </th>
                                <th className={cl1}>
                                    <span>Weld Abs</span>
                                </th>
                                <th className={cl1}>
                                    <span>Weld Col</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className=" bg-neutron-4 ">
                                <td className={cl2}>
                                    {data && data["Weld_Cycle_Tr1&3_S7"]
                                        ? Number(data["Weld_Cycle_Tr1&3_S7"].TagValue)
                                        : 0}
                                </td>
                                <td className={cl2}>
                                    {data && data["RunTime_Tr1&3_S7"] ? Number(data["RunTime_Tr1&3_S7"].TagValue) : 0}
                                </td>
                                <td className={cl2}>
                                    {data && data["Pk_Pwr_Tr1&3_S7"] ? Number(data["Pk_Pwr_Tr1&3_S7"].TagValue) : 0}
                                </td>
                                <td className={cl2}>
                                    {data && data["Energy_Tr1&3_S7"] ? Number(data["Energy_Tr1&3_S7"].TagValue) : 0}
                                </td>
                                <td className={cl2}>
                                    {data && data["Weld_Abs_Tr1&3_S7"] ? Number(data["Weld_Abs_Tr1&3_S7"].TagValue) : 0}
                                </td>
                                <td className={cl2}>
                                    {data && data["Weld_Col_Tr1&3_S7"] ? Number(data["Weld_Col_Tr1&3_S7"].TagValue) : 0}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table className=" h-[50%] w-full text-center text-[0.9rem] table-fixed">
                        <thead className="sticky top-0 z-10 bg-primary-1 text-center">
                            <tr className=" text-neutron-4">
                                <th className={cl1}>
                                    <span>Total Col</span>
                                </th>
                                <th className={cl1}>
                                    <span>Trig Force</span>
                                </th>
                                <th className={cl1}>
                                    <span>Weld Force</span>
                                </th>
                                <th className={cl1}>
                                    <span>Freq Chg</span>
                                </th>
                                <th className={cl1}>
                                    <span>Set AMP A</span>
                                </th>
                                <th className={cl1}>
                                    <span>Velocity</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className=" bg-neutron-4">
                                <td className={cl2}>
                                    {data && data["Total_Col_Tr1&3_S7"]
                                        ? Number(data["Total_Col_Tr1&3_S7"].TagValue)
                                        : 0}
                                </td>
                                <td className={cl2}>
                                    {data && data["Trig_Force_Tr1&3_S7"]
                                        ? Number(data["Trig_Force_Tr1&3_S7"].TagValue)
                                        : 0}
                                </td>
                                <td className={cl2}>
                                    {data && data["Weld_Force_Tr1&3_S7"]
                                        ? Number(data["Weld_Force_Tr1&3_S7"].TagValue)
                                        : 0}
                                </td>
                                <td className={cl2}>
                                    {data && data["Freq_Chg_Tr1&3_S7"] ? Number(data["Freq_Chg_Tr1&3_S7"].TagValue) : 0}
                                </td>
                                <td className={cl2}>
                                    {data && data["Set_AMP_A_Tr1&3_S7"]
                                        ? Number(data["Set_AMP_A_Tr1&3_S7"].TagValue)
                                        : 0}
                                </td>
                                <td className={cl2}>
                                    {data && data["Velocity_Tr1&3_S7"] ? Number(data["Velocity_Tr1&3_S7"].TagValue) : 0}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </>
            ) : (
                <></>
            )}
            {type === 2 ? (
                <>
                    <h3 className=" w-full text-center"> ULTRASONIC TR2-4</h3>
                    <table className=" h-[50%] w-full text-center text-[0.9rem] table-fixed">
                        <thead className="sticky top-0 z-10  text-center">
                            <tr className=" text-neutron-4 bg-primary-1">
                                <th className={cl1}>
                                    <span>Cycle</span>
                                </th>
                                <th className={cl1}>
                                    <span>RunTime</span>
                                </th>
                                <th className={cl1}>
                                    <span>Pk Pwr</span>
                                </th>
                                <th className={cl1}>
                                    <span>Energy</span>
                                </th>
                                <th className={cl1}>
                                    <span>Weld Abs</span>
                                </th>
                                <th className={cl1}>
                                    <span>Weld Col</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className=" bg-neutron-4">
                                <td className={cl2}>
                                    {data && data["Weld_Cycle_Tr2&4_S6"]
                                        ? Number(data["Weld_Cycle_Tr2&4_S6"].TagValue)
                                        : 0}
                                </td>
                                <td className={cl2}>
                                    {data && data["RunTime_Tr2&4_S6"] ? Number(data["RunTime_Tr2&4_S6"].TagValue) : 0}
                                </td>
                                <td className={cl2}>
                                    {data && data["Pk_Pwr_Tr2&4_S6"] ? Number(data["Pk_Pwr_Tr2&4_S6"].TagValue) : 0}
                                </td>
                                <td className={cl2}>
                                    {data && data["Energy_Tr2&4_S6"] ? Number(data["Energy_Tr2&4_S6"].TagValue) : 0}
                                </td>
                                <td className={cl2}>
                                    {data && data["Weld_Abs_Tr2&4_S6"] ? Number(data["Weld_Abs_Tr2&4_S6"].TagValue) : 0}
                                </td>
                                <td className={cl2}>
                                    {data && data["Weld_Col_Tr2&4_S6"] ? Number(data["Weld_Col_Tr2&4_S6"].TagValue) : 0}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table className=" h-[50%] w-full text-center text-[0.9rem] table-fixed">
                        <thead className="sticky top-0 z-10 bg-primary-1 text-center">
                            <tr className=" text-neutron-4">
                                <th className={cl1}>
                                    <span>Total Col</span>
                                </th>
                                <th className={cl1}>
                                    <span>Trig Force</span>
                                </th>
                                <th className={cl1}>
                                    <span>Weld Force</span>
                                </th>
                                <th className={cl1}>
                                    <span>Freq Chg</span>
                                </th>
                                <th className={cl1}>
                                    <span>Set AMP A</span>
                                </th>
                                <th className={cl1}>
                                    <span>Velocity</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className=" bg-neutron-4">
                                <td className={cl2}>
                                    {data && data["Total_Col_Tr2&4_S6"] ? data["Total_Col_Tr2&4_S6"].TagValue : 0}
                                </td>
                                <td className={cl2}>
                                    {data && data["Trig_Force_Tr2&4_S6"] ? data["Trig_Force_Tr2&4_S6"].TagValue : 0}
                                </td>
                                <td className={cl2}>
                                    {data && data["Weld_Force_Tr2&4_S6"] ? data["Weld_Force_Tr2&4_S6"].TagValue : 0}
                                </td>
                                <td className={cl2}>
                                    {data && data["Freq_Chg_Tr2&4_S6"] ? data["Freq_Chg_Tr2&4_S6"].TagValue : 0}
                                </td>
                                <td className={cl2}>
                                    {data && data["Set_AMP_A_Tr2&4_S6"] ? data["Set_AMP_A_Tr2&4_S6"].TagValue : 0}
                                </td>
                                <td className={cl2}>
                                    {data && data["Velocity_Tr2&4_S6"] ? data["Velocity_Tr2&4_S6"].TagValue : 0}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </>
            ) : (
                <></>
            )}
        </>
    )
}
export default Ultrasonic
