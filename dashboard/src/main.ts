import config from "./config.json";
import {AppStore, getAppState, initStore} from "./StateStore";
import AppUI from "./ui-components/AppUI";
import Timeseries from "./Timeseries";
import {ClayPIDashboardError} from "./errors";
export {config};

function getDisplayedMinutes() {
    let minutesDisplayed = config.defaultMinuteSpan;
    const argsStart = window.location.search.search(/\?minute-span=/);
    if (argsStart !== -1) {
        const parsedMins = Number(window.location.search.substring(13));
        if (!isNaN(parsedMins) && parsedMins > 0) {
            minutesDisplayed = parsedMins;
        }
    }
    return minutesDisplayed;
}

function getUtcOffset() {
    return -(new Date().getTimezoneOffset() / 60);
}

async function init() {
    const now = new Date().getTime() / 1000;
    await initStore({
        overlayText: "",
        lastUpdateTime: now,
        minutesDisplayed: getDisplayedMinutes(),
        utcOffset: getUtcOffset(),
        dataEndpointBase: config.dataEndpoint,
        isLoading: false,
        updateIntervalSeconds: config.reloadIntervalSec,
        displayMode: "pastMins",
        fatalError: null,
        displayWindow: {start: now - getDisplayedMinutes() * 60, stop: now},
        documentReady: false,
        timeseries: [],
    });
    AppStore().addTimeseries(new Timeseries(
        "temp",
        (start, stop) => loadClimateTimeseriesData("temp", start, stop),
        getAppState().updateIntervalSeconds
    ));
    AppStore().addTimeseries(new Timeseries(
        "humidity",
        (start, stop) => loadClimateTimeseriesData("humidity", start, stop),
        getAppState().updateIntervalSeconds
    ));
    AppStore().addTimeseries(new Timeseries(
        "co2",
        (start, stop) => loadClimateTimeseriesData("co2", start, stop),
        getAppState().updateIntervalSeconds
    ));
    const ui = new AppUI();
    ui.bootstrap("root");
}

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
                const chunkBuffer = new Int32Array(chunk.value.buffer);
                chunks.push(chunkBuffer);
                receivedLength += chunkBuffer.length;
            }
        }
        const data = new Int32Array(receivedLength);
        let position = 0;
        for (const chunk of chunks) {
            data.set(chunk, position);
            position += chunk.length;
        }
        return data;
    } catch (e) {
        const message = "Error fetching timerseries data from the server";
        throw new ClayPIDashboardError(`${message}: ${e}`, message);
    }
}

document.onreadystatechange = async () => {
    await init();
    AppStore().setDocumentReady(true);
    // @ts-ignore
    window.store = AppStore();
    document.onreadystatechange = null;
};
