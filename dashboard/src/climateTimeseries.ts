import Timeseries from "./Timeseries";
import {getAppState} from "./StateStore";
import {ClayPIDashboardError} from "./errors";

export const newCo2Timeseries = (tolerance: number) => new Timeseries({
    name: "CO₂ (ppm)",
    loader: (start, stop) => loadClimateTimeseriesData("co2", start, stop),
    tolerance,
    valueRangeOverride: { high: 800, low: 400 },
});

export const newTempTimeseries = (tolerance: number) => new Timeseries({
    name: "Temperature (°C)",
    loader: (start, stop) => loadClimateTimeseriesData("temp", start, stop),
    tolerance,
    valueRangeOverride: { high: 30, low: 10 },
});

export const newHumidityTimeseries = (tolerance: number) => new Timeseries({
    name: "Humidity (%)",
    loader: (start, stop) => loadClimateTimeseriesData("humidity", start, stop),
    tolerance,
    valueRangeOverride: { high: 75, low: 40 },
});

async function loadClimateTimeseriesData(dataType: "temp" | "humidity" | "co2", start?: number, stop?: number) {
    const endpoint = `${getAppState().dataEndpointBase}/timeseries/${dataType}${start && `?from=${start * 1000}`}${stop && `&to=${stop * 1000}`}`;
    try {
        const response = await fetch(endpoint, { headers: {
            "Content-Type": "application/octet-stream",
        }});
        const reader = await response.body.getReader();
        let receivedLength = 0;
        const chunks = [];
        let finishedReading = false;
        while (!finishedReading) {
            const chunk = await reader.read();
            finishedReading = chunk.done;
            if (!finishedReading) {
                chunks.push(chunk.value.buffer);
                receivedLength += chunk.value.buffer.byteLength;
            }
        }
        const data = new Uint8Array(receivedLength);
        let position = 0;
        for (const chunk of chunks) {
            const chunkArray = new Uint8Array(chunk);
            data.set(chunkArray, position);
            position += chunkArray.length;
        }
        return new Int32Array(data.buffer);
    } catch (e) {
        const message = "timerseries data couldn't be loaded from the server";
        throw new ClayPIDashboardError(`${message}: ${e}`, message);
    }
}