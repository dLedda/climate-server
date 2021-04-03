import config from "./config.json";
import {AppStore, getAppState, initStore} from "./StateStore";
import AppUI from "./ui-components/AppUI";
import {
    newCo2Timeseries,
    newHumidityTimeseries,
    newTempTimeseries,
} from "./climateTimeseries";
import {ScaleId} from "./chart/Chart";
export {config};

async function init() {
    await initStore(new URLSearchParams(window.location.search));
    AppStore().addTimeseriesToScale(newCo2Timeseries(getAppState().updateIntervalSeconds), ScaleId.Right);
    AppStore().addTimeseriesToScale(newTempTimeseries(getAppState().updateIntervalSeconds), ScaleId.Left);
    AppStore().addTimeseriesToScale(newHumidityTimeseries(getAppState().updateIntervalSeconds), ScaleId.Left);
    const ui = new AppUI();
    ui.bootstrap("root");
}

function updateUrlState() {
    const appStateSerial = AppStore().serialiseState();
    const newUrl = `${window.location.pathname}${appStateSerial !== "" ? `?${appStateSerial}` : ""}`;
    window.history.replaceState("", "", newUrl);
}

let timer: ReturnType<typeof setTimeout>;
function debounce<F extends () => void>(func: F, timeout = 300){
    return (...args: Parameters<F>[]) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

document.onreadystatechange = async () => {
    await init();
    AppStore().setDocumentReady(true);
    AppStore().on("stateChange", () => debounce(() => updateUrlState())());
    // @ts-ignore
    window.store = AppStore();
    document.onreadystatechange = null;
};
