import Chart from "react-apexcharts"

function ColumnChart({
    height,
    width,
    name,
    unit,
    zoom = true,
    nameY = true,
    fontSize,
    dataChartX,
    dataChartValue,
    colors,
}) {
    const setUpChart = {
        chart: {
            type: "bar",
            zoom: { enabled: zoom },
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
        colors: colors,
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return val
            },
            offsetY: -20,
            style: {
                fontSize: fontSize,
                fontWeight: 600,
                colors: colors,
            },
        },
        legend: { show: false },
        xaxis: {
            categories: dataChartX,
            position: "bottom",
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            crosshairs: {
                fill: {
                    type: "gradient",
                    gradient: {
                        colorFrom: "rgba(0,255,172,0.85)",
                        colorTo: "rgba(0,245,0,0.85)",
                        stops: [0, 100],
                        opacityFrom: 0.4,
                        opacityTo: 0.5,
                    },
                },
            },
            tooltip: {
                enabled: true,
            },
            labels: {
                style: {
                    colors: colors,
                    fontSize: fontSize,
                    fontWeight: 600,
                },
            },
            tickPlacement: "on",
        },
        yaxis: {
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            labels: {
                show: nameY,
                formatter: function (val) {
                    return val
                },
                style: {
                    fontSize: fontSize,
                },
            },
            // titles: "Sản lượng",
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
            <Chart options={setUpChart} series={setUpChart.series} type="bar" width={width} height={height} />
        </>
    )
}
export default ColumnChart
