import config from "./config.json";
import {AppStore, initStore} from "./StateStore";
import AppUI from "./AppUI";
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
    return 0;
}

async function init() {
    const now = new Date().getTime();
    await initStore({
        overlayText: "",
        lastUpdateTime: now,
        minutesDisplayed: getDisplayedMinutes(),
        utcOffset: getUtcOffset(),
        snapshots: [],
        dataEndpointBase: config.dataEndpoint,
        isLoading: false,
        updateIntervalSeconds: config.reloadIntervalSec,
        displayMode: "pastMins",
        fatalError: null,
        displayWindow: {start: now - getDisplayedMinutes() * 60000, stop: now},
        documentReady: false,
    });
    const ui = new AppUI();
    ui.bootstrap("root");
}

document.onreadystatechange = async () => {
    await init();
    AppStore().setDocumentReady(true);
    // @ts-ignore
    window.store = AppStore();
    document.onreadystatechange = null;
};
