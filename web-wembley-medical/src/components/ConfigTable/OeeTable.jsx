import Chart from "react-apexcharts"
import ProgressBar from "../ProgressBar"
import Radialbar from "../Radialbar"
import Card from "../Card"
import cl from "classnames"

function OeeTable({ param, data, CLassName, fixed = 2, dataChartTime, dataChartValue }) {
    // const [dataChartValue, setDataChartValue] = useState([])
    // const [dataChartTime, setDataChartTime] = useState([])

    // useEffect(() => {
    //     if (data && data["OEE"]) {
    //         setDataChartValue((prev) => {
    //             const newData = [
    //                 ...prev,
    //                 formatNumberValue(Number(data["OEE"].TagValue) * 100, fixed),
    //                 // Number(data["OEE"].TagValue).toFixed(2) * 100,
    //             ]
    //             if (newData.length > 20) {
    //                 newData.shift()
    //             }
    //             return newData
    //         })
    //         setDataChartTime((prev) => {
    //             const newData = [...prev, String(data["OEE"].TimeStamp).slice(11, 19)]
    //             return newData
    //         })
    //     }
    // }, [JSON.stringify(data?.OEE?.TagValue)])
    // String(data["OEE"].TimeStamp).slice(0, 10) + String(data["OEE"].TimeStamp).slice(12, 19),
    // const setUpChart = {
    //     options: {
    //         chart: {
    //             id: "basic-line",
    //         },
    //         xaxis: {
    //             categories: dataChartTime,
    //             labels: { show: false },
    //         },
    //         markers: {
    //             size: 4,
    //         },
    //         yaxis: {
    //             title: { text: "OEE %" },
    //         },
    //     },
    //     series: [
    //         {
    //             name: "OEE%",
    //             data: dataChartValue,
    //         },
    //     ],
    // }
    // console.log(data && data["endErrorStatus"] ? data["endErrorStatus"].TagValue : 0)
    return (
        <>
            {/* <Card className={"flex flex-col h-full text-xl font-semibold"}> */}
            {/* <div className=" h-[40%] p-2">
                <h3>Biểu đồ OEE trong ngày</h3>
                <Chart options={setUpChart.options} series={setUpChart.series} type="line" width="100%" height="90%" />
            </div>
            <div className=" ml-5 w-[94%] border-[0.2px] border-primary-1"></div> */}
            <Card className={cl(` w-full flex justify-around items-center bg-neutron-4 overflow-y-scroll`, CLassName)}>
                {/* <Radialbar
                    value={data && data["OEE"] ? Number(data["OEE"].TagValue).toFixed(3) * 100 : 0}
                    labelName={"OEE"}
                    fontSize={"1.3rem"}
                    height={"100%"}
                    width={"100%"}
                /> */}
                <div className=" h-full w-[77%] flex flex-col gap-5 flex-1 p-2 text-[1.15rem] ">
                    <div className=" h-[30%] w-full flex flex-col">
                        <h4 className=" flex items-center">
                            Độ hữu dụng{" "}
                            <p className=" text-base font-medium text-[black]">
                                = Thời gian máy chạy / Tổng thời gian = A
                            </p>
                        </h4>

                        <ProgressBar
                            textLimit={10}
                            value={data && data["a"] ? Number(data["a"].TagValue) * 100 : 0}
                            className={"grow"}
                            unit="%"
                            color="#3468C0"
                            fixed={2}
                        />
                    </div>
                    <div className=" h-[30%] w-full flex flex-col">
                        <h4 className=" flex items-center">
                            Hiệu suất
                            <p className=" text-base font-medium text-[black]">
                                = Chu kỳ lý tưởng * Số chu kỳ / Thời gian máy chạy = P
                            </p>
                        </h4>

                        <ProgressBar
                            textLimit={10}
                            value={data && data["p"] ? Number(data["p"].TagValue) * 100 : 0}
                            className={"grow"}
                            unit="%"
                            color="#3468C0"
                            fixed={2}
                        />
                    </div>
                    <div className=" h-[30%] w-full flex flex-col">
                        <h4 className=" flex items-center">
                            Chất lượng{" "}
                            <p className=" text-base font-medium text-[black]"> = Sản lượng đạt / Tổng sản lượng = Q</p>
                        </h4>

                        <ProgressBar
                            textLimit={10}
                            value={data && data["q"] ? Number(data["q"].TagValue) * 100 : 0}
                            className={"grow"}
                            unit="%"
                            color="#3468C0"
                            fixed={2}
                        />
                    </div>
                </div>
                <div className=" h-full w-[23%] flex flex-col justify-center items-center">
                    <div className=" h-[80%] w-full">
                        <Radialbar
                            value={data && data["oee"] ? Number(data["oee"].TagValue).toFixed(3) * 100 : 0}
                            labelName={"OEE"}
                            height={"100%"}
                            width={"100%"}
                            fontSize={"1rem"}
                        />
                    </div>
                    <h6>OEE = A * P * Q</h6>
                </div>
            </Card>
            {/* <div className=" ml-5 w-[94%] border-[0.2px] border-primary-1"></div> */}
            {/* </Card> */}
        </>
    )
}

export default OeeTable
