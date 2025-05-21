import Chart from "react-apexcharts"

function ColumnExpectChart({ height, width, nameY = true, unit, fontSize, dataChartX, dataChartValue, colors }) {
    const options = {
        chart: {
            height: 350,
            type: "bar",
            zoom: {
                show: true,
            },
        },
        plotOptions: {
            bar: {
                columnWidth: "60%",
            },
        },
        colors: colors[0],
        dataLabels: {
            enabled: true,
            style: {
                fontSize: fontSize, // Thêm fontSize cho dataLabels
                fontWeight: "bold",
            },
        },
        legend: {
            show: true,
            showForSingleSeries: true,
            customLegendItems: dataChartX,
            markers: {
                fillColors: colors,
            },
            fontSize: fontSize * 15,
        },
        xaxis: {
            labels: {
                style: {
                    fontSize: fontSize, // Thêm fontSize cho xaxis
                },
            },
            tickPlacement: "on",
        },
        yaxis: {
            labels: {
                show: nameY,
                style: {
                    fontSize: fontSize, // Thêm fontSize cho yaxis
                },
            },
        },
        tooltip: {
            y: {
                formatter: (val) => `${val} ${unit}`,
            },
            style: {
                fontSize: fontSize,
            },
        },
    }

    const series = [
        {
            name: dataChartX[0],
            data: dataChartValue,
        },
    ]
    return (
        <>
            <>
                <Chart options={options} series={series} type="bar" width={width} height={height} />
            </>
        </>
    )
}
export default ColumnExpectChart
