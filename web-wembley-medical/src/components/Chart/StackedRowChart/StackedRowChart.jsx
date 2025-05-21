import Chart from "react-apexcharts"

function StackedRowChart({ height, width, name, unit, fontSize, dataChartX, dataChartValue, colors }) {
    const options = {
        series: dataChartValue,
        chart: {
            type: "bar",
            height: 350,
            stacked: false,
            toolbar: {
                show: true,
            },
            zoom: {
                enabled: true,
            },
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    legend: {
                        position: "bottom",
                        offsetX: -10,
                        offsetY: 0,
                    },
                },
            },
        ],
        plotOptions: {
            bar: {
                horizontal: true,
                scrollable: true,
                barHeight: "100%",
                dataLabels: {
                    total: {
                        enabled: true,
                        offsetX: 0,
                        style: {
                            fontSize: "0px",
                            fontWeight: 900,
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
                    fontSize: fontSize, // Thêm fontSize cho yaxis
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
export default StackedRowChart
