import Chart from "react-apexcharts"
import cl from "classnames"
import { formatNumberValue } from "@/utils/functions"

function Radialbar({ height, width, value, labelName, color = "#4D7EB3", fontSize = 20, format, rounded, fixed = 2 }) {
    const options = {
        chart: {
            type: "radialBar",
        },
        plotOptions: {
            radialBar: {
                hollow: {
                    margin: 0,
                    size: "70%",
                    background: "rgba(210, 210, 210, 0.3)",
                },
                track: {
                    dropShadow: {
                        enabled: true,
                        top: 2,
                        left: 0,
                        blur: 2,
                        opacity: 0.15,
                    },
                },
                dataLabels: {
                    enabled: true,
                    name: {
                        show: true,
                        color: "#4D7EB3",
                        fontSize: fontSize,
                        offsetY: "-10%",
                    },
                    value: {
                        color: "#111",
                        fontSize: fontSize,
                        fontWeight: "bold",
                        show: true,
                        offsetY: "10%",
                    },
                },
            },
        },
        fill: {
            type: "gradient",
            gradient: {
                shade: "dark",
                type: "vertical",
                gradientToColors: ["#87D4F9"],
                stops: [0, 100],
            },
        },
        stroke: {
            lineCap: "round",
        },
        colors: [color],
        labels: [labelName],
    }

    const series = [formatNumberValue(value, format ?? rounded ?? fixed)]

    return (
        // <div data-component="Radialbar" className={cl("  flex justify-center items-center bg-primary-1", widthSize)}>
        <Chart options={options} series={series} type="radialBar" height={height} width={width} />
        // </div>
    )
}

export default Radialbar
