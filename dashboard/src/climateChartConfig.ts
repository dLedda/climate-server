import {ChartConfiguration, ChartPoint, TimeUnit} from "chart.js";

interface ClimateChartSettings  {
    humidity?: ChartPoint[];
    temp?: ChartPoint[];
    co2?: ChartPoint[];
    colors?: {
        humidity?: string;
        temp?: string;
        co2?: string;
    }
}

const defaultHumidityColor = "rgb(196,107,107)";
const defaultTempColor = "rgb(173,136,68)";
const defaultCo2Color = "rgb(52,133,141)";

export function generateClimateChartConfig(settings: ClimateChartSettings): ChartConfiguration {
    return {
        type: "line",
        data: {
            datasets: [{
                label: "Humidity",
                data: settings.humidity,
                borderColor: settings.colors?.humidity ?? defaultHumidityColor,
                fill: false,
                yAxisID: "y-axis-3",
            }, {
                label: "Temperature",
                data: settings.temp,
                borderColor: settings.colors?.temp ?? defaultTempColor,
                fill: false,
                yAxisID: "y-axis-2",
            }, {
                label: "Co2 Concentration",
                data: settings.co2,
                borderColor: settings.colors?.co2 ?? defaultCo2Color,
                fill: false,
                yAxisID: "y-axis-1",
            }]
        },
        options: {
            animation: {animateRotate: false, duration: 0, animateScale: false},
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                position: "top",
                align: "end",
            },
            scales: {
                xAxes: [{
                    type: "time",
                    time: {
                        unit: "second" as TimeUnit
                    }
                }],
                yAxes: [{
                    type: "linear",
                    display: true,
                    position: "right",
                    id: "y-axis-1",
                    ticks: {
                        fontColor: settings.colors?.co2 ?? defaultCo2Color,
                        suggestedMin: 400,
                        suggestedMax: 1100,
                    },
                }, {
                    type: "linear",
                    display: true,
                    position: "left",
                    id: "y-axis-2",
                    ticks: {
                        fontColor: settings.colors?.temp ?? defaultTempColor,
                        suggestedMin: 10,
                        suggestedMax: 35,
                    },
                    gridLines: {
                        drawOnChartArea: false,
                    },
                }, {
                    type: "linear",
                    display: true,
                    position: "left",
                    id: "y-axis-3",
                    ticks: {
                        fontColor: settings.colors?.humidity ?? defaultHumidityColor,
                        suggestedMin: 15,
                        suggestedMax: 85,
                    },
                    gridLines: {
                        drawOnChartArea: false,
                    },
                }],
            }
        },
    };
}