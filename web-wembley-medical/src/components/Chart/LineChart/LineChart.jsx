import Chart from "react-apexcharts"
function LineChart({ height, width, name, unit, fontSize, dataChartTime = [], dataChartValue = [] }) {
    const setUpChart = {
        options: {
            chart: {
                id: "basic-line",
            },
            plotOptions: {
                bar: {
                    borderRadius: 10,
                    dataLabels: {
                        position: "top", // top, center, bottom
                    },
                    distributed: true,
                },
            },
            xaxis: {
                categories: dataChartTime,
                labels: {
                    style: {
                        fontSize: fontSize, // Thêm fontSize cho yaxis
                    },
                    rotate: -45, // Xoay nhãn theo chiều kim đồng hồ
                    hideOverlappingLabels: true, // Ẩn nhãn chồng chéo
                    trim: true, // Cắt nhãn nếu quá dài
                },
                tickAmount: dataChartValue.length,
            },
            markers: {
                size: 5,
            },
            stroke: {
                width: 5,
            },
            yaxis: {
                title: { text: String(name) },
                labels: {
                    style: {
                        fontSize: fontSize, // Thêm fontSize cho yaxis
                    },
                },
            },
            connectNulls: true,
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return `${val} ${unit}` // Thêm đơn vị phía sau số
                },
            },
            style: {
                fontSize: fontSize, // Chỉnh kích thước font chữ
                fontFamily: "Arial, sans-serif", // Tuỳ chỉnh font chữ nếu cần
            },
        },
        series: [
            {
                name: String(name),
                data: dataChartValue,
            },
        ],
    }

    return (
        <>
            <Chart options={setUpChart.options} series={setUpChart.series} type="line" width={width} height={height} />
        </>
    )
}
export default LineChart
