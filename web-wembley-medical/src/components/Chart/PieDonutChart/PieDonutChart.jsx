import Chart from "react-apexcharts"
function PieDonutChart({ height, width, name, label, unit, fontSize, dataChartLabels, dataChartValue, arrayColors }) {
    const setUpChart = {
        options: {
            chart: {
                type: "donut",
            },
            labels: dataChartLabels,
            colors: arrayColors,
            legend: {
                position: "right", // Vị trí của chú thích
                fontSize: "11rem", // Kích thước chữ của chú thích
            },
            plotOptions: {
                pie: {
                    expandOnClick: true,
                    donut: {
                        size: "60%",
                        labels: {
                            show: true,
                            total: {
                                show: true,
                                showAlways: true,
                                fontSize: fontSize,
                                color: "black",
                                label: label,
                            },
                        },
                    },
                },
            },
            dataLabels: {
                enabled: true,
                style: {
                    fontSize: fontSize,
                    fontWeight: 600,
                },
                formatter: function (val) {
                    return val.toFixed(2) + "%"
                },
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
            title: {
                text: String(name),
                align: "center",
                fontSize: fontSize,
                fontFamily: "Arial, sans-serif",
            },
        },
        series: dataChartValue,
    }
    return (
        <>
            <Chart options={setUpChart.options} series={setUpChart.series} type="donut" width={width} height={height} />
        </>
    )
}
export default PieDonutChart
