import Chart from "react-apexcharts"

function GroupChart({ height, width, nameY = true, unit, fontSize, dataChartX, dataChartValue, colors }) {
    const options = {
        chart: {
            type: "bar",
            height: 350,
            zoom: {
                enabled: true,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "65%",
                endingShape: "rounded",
                dataLabels: {
                    position: "top",
                },
            },
        },
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return val
            },
            offsetY: -10,
            style: {
                fontSize: fontSize,
                fontWeight: 600,
                colors: colors,
            },
        },
        stroke: {
            show: true,
            width: 2,
            colors: ["transparent"],
        },
        xaxis: {
            categories: dataChartX,
            labels: {
                style: {
                    fontSize: fontSize,
                },
            },
            tickPlacement: "on",
        },
        yaxis: {
            title: {
                style: {
                    fontSize: fontSize,
                },
            },
            labels: {
                show: nameY,
                style: {
                    fontSize: fontSize,
                },
            },
        },
        fill: {
            opacity: 1,
        },
        tooltip: {
            y: {
                formatter: (val) => `${val} ${unit}`,
            },
            style: {
                fontSize: fontSize, // Chỉnh kích thước font chữ
                fontFamily: "Arial, sans-serif", // Tuỳ chỉnh font chữ nếu cần
            },
        },
        colors: colors,
    }

    const series = dataChartValue

    return (
        <>
            <>
                <Chart options={options} series={series} type="bar" width={width} height={height} />
            </>
        </>
    )
}
export default GroupChart
