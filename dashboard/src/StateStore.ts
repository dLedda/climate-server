import Timeseries from "./Timeseries";
import {ScaleId} from "./chart/Chart";
import config from "./config.json";

export class AppStateError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AppStateError";
    }
}

export type DisplayMode = "window" | "pastMins";

export interface EventCallback {
    timeseriesUpdated: (timeseries: Timeseries) => void;
    newTimeseries: (timeseries: Timeseries, scale?: ScaleId) => void;
    stateChange: StateChangeCallback<AppState, keyof AppState>;
}
type StateChangeCallback<T, K extends keyof T> = (attrName?: K, oldVal?: T[K], newVal?: T[K]) => void;
type EventCallbackListing<K extends keyof EventCallback> = Record<K, EventCallback[K][]>;

export interface TimeWindow {
    start: number;
    stop: number;
}

interface AppState {
    lastUpdateTime: number;
    displayWindow: TimeWindow;
    minutesDisplayed: number;
    utcOffset: number;
    leftTimeseries: Timeseries[],
    rightTimeseries: Timeseries[],
    overlayText: string;
    dataEndpointBase: string;
    updateIntervalSeconds: number;
    isLoading: boolean;
    displayMode: DisplayMode;
    fatalError: Error | null;
    documentReady: boolean;
    highlightedTimeseries: string | null;
}

type StoreUpdateCallback<T> = (newValue?: T, oldValue?: T) => void;
type SubscriptionType<K extends keyof AppState> = Record<K, StoreUpdateCallback<AppState[K]>[]>;
type IAppStateSubscriptions = SubscriptionType<keyof AppState>;

function newDefaultState(): AppState {
    const now = new Date().getTime() / 1000;
    return {
        overlayText: "",
        lastUpdateTime: now,
        minutesDisplayed: config.defaultMinuteSpan,
        utcOffset: -(new Date().getTimezoneOffset() / 60),
        dataEndpointBase: config.dataEndpoint,
        isLoading: false,
        updateIntervalSeconds: config.reloadIntervalSec,
        displayMode: "pastMins",
        fatalError: null,
        displayWindow: {start: now - config.defaultMinuteSpan * 60, stop: now},
        documentReady: false,
        leftTimeseries: [],
        rightTimeseries: [],
        highlightedTimeseries: null,
    };
}

class AppStateStore {
    private readonly subscriptions: IAppStateSubscriptions;
    private readonly eventCallbacks: EventCallbackListing<keyof EventCallback>;
    private readonly state: AppState;
    private loaders = 0;

    constructor(initialState?: Partial<AppState>) {
        this.state = { ...newDefaultState(), ...initialState };
        const subscriptions: Record<string, (() => unknown)[]> = {};
        for (const key in this.state) {
            subscriptions[key] = [];
        }
        this.eventCallbacks = {newTimeseries: [], timeseriesUpdated: [], stateChange: []};
        this.subscriptions = subscriptions as IAppStateSubscriptions;
        this.init();
        setInterval(() => this.getNewTimeseriesData().catch(e => AppStore().fatalError(e)), this.state.updateIntervalSeconds * 1000);
    }

    async init() {
        await this.updateTimeseriesFromSettings();
        await this.getNewTimeseriesData();
    }

    addTimeseriesToScale(timeseries: Timeseries, scale?: ScaleId) {
        const group = scale === ScaleId.Left ? this.state.leftTimeseries : this.state.rightTimeseries;
        if (group.indexOf(timeseries) >= 0) {
            throw new AppStateError("Timeseries has already been added!");
        }
        if (scale === ScaleId.Left) {
            group.push(timeseries);
        } else {
            group.push(timeseries);
        }
        this.notifyStoreVal(scale === ScaleId.Left ? "leftTimeseries" : "rightTimeseries");
        this.emit("newTimeseries", timeseries, scale);
        this.updateTimeseriesFromSettings();
    }

    private notifyStoreVal<T extends keyof AppState>(subscribedValue: T, newValue?: AppState[T], oldValue?: AppState[T]) {
        this.emit("stateChange", subscribedValue, newValue, oldValue);
        for (const subscriptionCallback of this.subscriptions[subscribedValue]) {
            subscriptionCallback(newValue, oldValue);
        }
    }

    private emit<T extends keyof EventCallback>(eventName: T, ...callbackArgs: Parameters<EventCallback[T]>) {
        for (const sub of this.eventCallbacks[eventName]) {
            // @ts-ignore
            sub(...callbackArgs);
        }
    }

    private async updateTimeseriesFromSettings() {
        let start: number;
        let stop: number;
        if (this.state.displayMode === "window") {
            start = this.state.displayWindow.start;
            stop = this.state.displayWindow.stop;
        } else {
            start = this.state.lastUpdateTime - this.state.minutesDisplayed * 60;
            stop = this.state.lastUpdateTime;
        }
        this.addLoad();
        try {
            for (const timeseries of this.state.leftTimeseries) {
                await timeseries.updateFromWindow(start, stop);
            }
            for (const timeseries of this.state.rightTimeseries) {
                await timeseries.updateFromWindow(start, stop);
            }
        } catch (e) {
            AppStore().fatalError(e);
        }
        this.finishLoad();
        this.notifyAllTimeseriesUpdated();
    }

    private async getNewTimeseriesData() {
        const updateTime = new Date().getTime() / 1000;
        this.addLoad();
        try {
            for (const timeseries of this.state.leftTimeseries) {
                await timeseries.getLatest();
            }
            for (const timeseries of this.state.rightTimeseries) {
                await timeseries.getLatest();
            }
        } catch (e) {
            AppStore().fatalError(e);
        }
        this.finishLoad();
        this.setLastUpdateTime(updateTime);
        this.notifyAllTimeseriesUpdated();
    }

    private notifyAllTimeseriesUpdated() {
        for (const timeseries of this.state.leftTimeseries) {
            this.notifyStoreVal("leftTimeseries");
            this.emit("timeseriesUpdated", timeseries);
        }
        for (const timeseries of this.state.rightTimeseries) {
            this.notifyStoreVal("rightTimeseries");
            this.emit("timeseriesUpdated", timeseries);
        }
    }

    getState(): AppState {
        return this.state;
    }

    subscribeStoreVal<T extends keyof AppState>(dataName: T, callback: StoreUpdateCallback<AppState[T]>) {
        this.subscriptions[dataName].push(callback);
    }

    on<T extends keyof EventCallback>(event: T, callback: EventCallback[T]) {
        this.eventCallbacks[event].push(callback);
    }

    setDisplayMode(mode: DisplayMode) {
        this.state.displayMode = mode;
        this.updateTimeseriesFromSettings();
        this.notifyStoreVal("displayMode");
    }

    setDisplayWindow(newWin: TimeWindow) {
        if (newWin.start < newWin.stop) {
            if (newWin.stop < this.state.lastUpdateTime) {
                this.state.displayWindow = {...newWin};
                this.notifyStoreVal("displayWindow");
                this.updateTimeseriesFromSettings();
            }
        } else {
            console.warn(`Invalid display window from ${newWin.start} to ${newWin.stop}`);
        }
    }

    setMinutesDisplayed(mins: number) {
        if (mins > 0) {
            this.state.minutesDisplayed = Math.ceil(mins);
            this.notifyStoreVal("minutesDisplayed");
            this.updateTimeseriesFromSettings();
        } else {
            throw new AppStateError(`Invalid minutes passed: ${mins}`);
        }
    }

    setUtcOffset(newOffset: number) {
        if (Math.floor(newOffset) === newOffset && newOffset <= 14 && newOffset >= -12) {
            this.state.utcOffset = newOffset;
        } else {
            console.warn(`Invalid UTC offset: ${newOffset}`);
            if (newOffset > 14) {
                this.state.utcOffset = 14;
            } else if (newOffset < -12) {
                this.state.utcOffset = -12;
            } else {
                this.state.utcOffset = Math.floor(newOffset);
            }
        }
        this.notifyStoreVal("utcOffset");
    }

    private setLastUpdateTime(newTime: number) {
        if (this.state.lastUpdateTime <= newTime) {
            this.state.lastUpdateTime = newTime;
            this.notifyStoreVal("lastUpdateTime");
        } else {
            throw new AppStateError(`Bad new update time was before last update time. Old: ${this.state.lastUpdateTime}, New: ${newTime}`);
        }
    }

    setOverlayText(text: string) {
        this.state.overlayText = text;
        this.notifyStoreVal("overlayText");
    }

    addLoad() {
        this.loaders += 1;
        this.state.isLoading = this.loaders > 0;
        this.notifyStoreVal("isLoading");
    }

    finishLoad() {
        this.loaders -= 1;
        this.state.isLoading = this.loaders > 0;
        this.notifyStoreVal("isLoading");
    }

    fatalError(err: Error) {
        if (!this.state.fatalError) {
            this.state.fatalError = err;
            this.notifyStoreVal("fatalError");
        }
    }

    setDocumentReady(isReady: boolean) {
        this.state.documentReady = isReady;
        this.notifyStoreVal("documentReady");
    }

    setHighlightedTimeseries(name: string | null) {
        this.state.highlightedTimeseries = name;
        this.notifyStoreVal("highlightedTimeseries", name);
    }

    serialiseState(): string {
        const stateStringParams = [];
        if (this.state.displayMode === "pastMins") {
            if (this.state.minutesDisplayed !== 60) {
                stateStringParams.push(
                    `last-minutes=${this.state.minutesDisplayed}`,
                );
            }
        } else {
            stateStringParams.push(
                `from=${Math.floor(this.state.displayWindow.start)}&to=${Math.floor(this.state.displayWindow.stop)}`,
            );
        }
        if (this.state.utcOffset !== newDefaultState().utcOffset) {
            stateStringParams.push(
                `utc-offset=${this.state.utcOffset}`,
            );
        }
        return stateStringParams.join("&");
    }

    deserialise(serial: URLSearchParams) {
        if (serial.get("last-minutes") && (serial.get("from") || serial.get("to"))) {
            console.warn("Url param 'last-minutes' cannot be combined with 'from' or 'to'. Defaulting to 'last-minutes'.");
        }
        if (serial.get("utc-offset")) {
            this.setUtcOffset(Number(serial.get("utc-offset")));
        }
        if (serial.get("to") && !serial.get("from")) {
            console.warn("The url param 'to' must always be combined with 'from'. Ignoring.");
        }
        if (serial.get("from")) {
            let from = Number(serial.get("from"));
            if (isNaN(from)) {
                const fromDate = new Date(from);
                if (!isNaN(fromDate.valueOf())) {
                    from = fromDate.getTime();
                } else {
                    console.warn("Param 'from' must be a date must be a number (unix timestamp in seconds) or an ISO string.");
                    return;
                }
            }
            let to = Number(serial.get("to"));
            if (isNaN(to)) {
                const toDate = new Date(to);
                if (!isNaN(toDate.valueOf())) {
                    to = toDate.getTime();
                } else {
                    console.warn("Param 'to' must be a date must be a number (unix timestamp in seconds) or an ISO string.");
                    to = this.state.displayWindow.stop;
                }
            }
            const displayWindow = {start: from, stop: to};
            this.setDisplayWindow(displayWindow);
            this.setDisplayMode("window");
        }
        if (serial.get("last-minutes")) {
            const pastMins = Number(serial.get("last-minutes"));
            if (!isNaN(pastMins)) {
                this.setDisplayMode("pastMins");
                this.setMinutesDisplayed(pastMins);
            } else {
                console.warn("Param 'last-minutes' must be a number");
            }
        }
        this.emit("stateChange");
    }
}

let store: AppStateStore;

export async function initStore(initialState?: Partial<AppState> | URLSearchParams) {
    if (initialState instanceof URLSearchParams) {
        store = new AppStateStore();
        store.deserialise(initialState);
    } else {
        store = new AppStateStore(initialState);
    }
    return store;
}

export function AppStore() {
    if (store) {
        return store;
    } else {
        throw new AppStateError("Store not yet initialised!");
    }
}

export function getAppState() {
    if (store) {
        return store.getState();
    } else {
        throw new AppStateError("Store not yet initialised!");
    }
}