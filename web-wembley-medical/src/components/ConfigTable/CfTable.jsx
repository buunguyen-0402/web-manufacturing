import cl from "classnames"
function CfTable({ param, data }) {
    const cl1 = " first:rounded-tl-lg last:rounded-tr-lg h-8"
    const cl2 = " min-h-8 p-1 group-last:rounded-bl-lg group-last:last:rounded-br-lg h-10"

    return (
        <table className=" h-full w-full text-center text-[1.1rem]">
            <thead className="sticky top-0 z-10 bg-primary-1 text-center">
                <tr className=" text-neutron-4">
                    <th className={cl1}>
                        <span>Station</span>
                    </th>
                    <th className={cl1}>
                        <span>Track 1</span>
                    </th>
                    <th className={cl1}>
                        <span>Track 2</span>
                    </th>
                    <th className={cl1}>
                        <span>Track 3</span>
                    </th>
                    <th className={cl1}>
                        <span>Track 4</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr className=" bg-neutron-4">
                    <td className={cl("text-left", cl2)}>Station-1 Bottom Cap Check</td>
                    <td className={cl2}>
                        {data && data["BOTTOM_CAP_REJ_TR1"] ? Number(data["BOTTOM_CAP_REJ_TR1"].TagValue) : 0}
                    </td>
                    <td className={cl2}>
                        {data && data["BOTTOM_CAP_REJ_TR2"] ? Number(data["BOTTOM_CAP_REJ_TR2"].TagValue) : 0}
                    </td>
                    <td className={cl2}>
                        {data && data["BOTTOM_CAP_REJ_TR3"] ? Number(data["BOTTOM_CAP_REJ_TR3"].TagValue) : 0}
                    </td>
                    <td className={cl2}>
                        {data && data["BOTTOM_CAP_REJ_TR4"] ? Number(data["BOTTOM_CAP_REJ_TR4"].TagValue) : 0}
                    </td>
                </tr>
                <tr className=" bg-primary-3">
                    <td className={cl("text-left", cl2)}>Station-3 Silicon Check</td>
                    <td className={cl2}>
                        {data && data["SILICON_PRESENCE_REJ_TR1"]
                            ? Number(data["SILICON_PRESENCE_REJ_TR1"].TagValue)
                            : 0}
                    </td>
                    <td className={cl2}>
                        {data && data["SILICON_PRESENCE_REJ_TR2"]
                            ? Number(data["SILICON_PRESENCE_REJ_TR2"].TagValue)
                            : 0}
                    </td>
                    <td className={cl2}>
                        {data && data["SILICON_PRESENCE_REJ_TR3"]
                            ? Number(data["SILICON_PRESENCE_REJ_TR3"].TagValue)
                            : 0}
                    </td>
                    <td className={cl2}>
                        {data && data["SILICON_PRESENCE_REJ_TR4"]
                            ? Number(data["SILICON_PRESENCE_REJ_TR4"].TagValue)
                            : 0}
                    </td>
                </tr>
                <tr className=" bg-neutron-4">
                    <td className={cl("text-left", cl2)}>Station-5 Cover Check</td>
                    <td className={cl2}>
                        {data && data["COVER_PRESENCE_REJ_TR1"] ? Number(data["COVER_PRESENCE_REJ_TR1"].TagValue) : 0}
                    </td>
                    <td className={cl2}>
                        {data && data["COVER_PRESENCE_REJ_TR2"] ? Number(data["COVER_PRESENCE_REJ_TR2"].TagValue) : 0}
                    </td>
                    <td className={cl2}>
                        {data && data["COVER_PRESENCE_REJ_TR3"] ? Number(data["COVER_PRESENCE_REJ_TR3"].TagValue) : 0}
                    </td>
                    <td className={cl2}>
                        {data && data["COVER_PRESENCE_REJ_TR4"] ? Number(data["COVER_PRESENCE_REJ_TR4"].TagValue) : 0}
                    </td>
                </tr>
                <tr className=" bg-primary-3">
                    <td className={cl("text-left", cl2)}>Station-8,9 Height Check</td>
                    <td className={cl2}>
                        {data && data["HEIGHT_CHK_REJ_TR1"] ? Number(data["HEIGHT_CHK_REJ_TR1"].TagValue) : 0}
                    </td>
                    <td className={cl2}>
                        {data && data["HEIGHT_CHK_REJ_TR2"] ? Number(data["HEIGHT_CHK_REJ_TR2"].TagValue) : 0}
                    </td>
                    <td className={cl2}>
                        {data && data["HEIGHT_CHK_REJ_TR3"] ? Number(data["HEIGHT_CHK_REJ_TR3"].TagValue) : 0}
                    </td>
                    <td className={cl2}>
                        {data && data["HEIGHT_CHK_REJ_TR4"] ? Number(data["HEIGHT_CHK_REJ_TR4"].TagValue) : 0}
                    </td>
                </tr>
                <tr className=" bg-neutron-4">
                    <td className={cl("text-left", cl2)}>Station-10 Leak Check</td>
                    <td className={cl2}>
                        {data && data["LEAK_TEST_CHK_TR1"] ? Number(data["LEAK_TEST_CHK_TR1"].TagValue) : 0}
                    </td>
                    <td className={cl2}>
                        {data && data["LEAK_TEST_CHK_TR2"] ? Number(data["LEAK_TEST_CHK_TR2"].TagValue) : 0}
                    </td>
                    <td className={cl2}>
                        {data && data["LEAK_TEST_CHK_TR3"] ? Number(data["LEAK_TEST_CHK_TR3"].TagValue) : 0}
                    </td>
                    <td className={cl2}>
                        {data && data["LEAK_TEST_CHK_TR4"] ? Number(data["LEAK_TEST_CHK_TR4"].TagValue) : 0}
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

export default CfTable
