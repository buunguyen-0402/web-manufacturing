import Chart from "react-apexcharts"

function StackedColumnChart({ height, width, name, unit, fontSize, dataChartX, dataChartValue, colors }) {
    const options = {
        series: dataChartValue,
        chart: {
            type: "bar",
            height: 350,
            stacked: true,
            toolbar: {
                show: true,
            },
            zoom: {
                enabled: true,
            },
        },
        responsive: [
            {
                options: {
                    legend: {
                        position: "top",
                        offsetX: -10,
                        offsetY: 0,
                    },
                },
            },
        ],
        plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: 10,
                borderRadiusApplication: "end", // 'around', 'end'
                borderRadiusWhenStacked: "last", // 'all', 'last'
                dataLabels: {
                    total: {
                        enabled: true,
                        style: {
                            fontSize: "0px",
                            fontWeight: 600,
                        },
                    },
                },
            },
        },
        xaxis: {
            type: "string",
            categories: dataChartX,
            labels: {
                style: {
                    fontSize: fontSize, // Thêm fontSize cho xaxis
                },
            },
        },
        yaxis: {
            labels: {
                style: {
                    fontSize: fontSize, // Thêm fontSize cho yaxis
                },
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
        legend: {
            position: "right",
            offsetY: 40,
            fontSize: "14rem", // Chỉnh kích thước font chữ
            fontFamily: "Arial, sans-serif", // Tuỳ chỉnh font chữ nếu cần
        },
        fill: {
            opacity: 1,
        },
        colors: colors,
    }

    return (
        <>
            <Chart options={options} series={options.series} type="bar" width={width} height={height} />
        </>
    )
}
export default StackedColumnChart
