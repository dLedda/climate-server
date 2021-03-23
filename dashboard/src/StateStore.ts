import Timeseries from "./Timeseries";

export class AppStateError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AppStateError";
    }
}

export type DisplayMode = "window" | "pastMins";

export interface EventCallback {
    newTimeseries: (timeseries: Timeseries) => void;
    timeseriesUpdated: (timeseries: Timeseries) => void;
}
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
    timeseries: Timeseries[],
    overlayText: string;
    dataEndpointBase: string;
    updateIntervalSeconds: number;
    isLoading: boolean;
    displayMode: DisplayMode;
    fatalError: Error | null;
    documentReady: boolean;
}

type StoreUpdateCallback<T> = (newValue?: T, oldValue?: T) => void;
type SubscriptionType<K extends keyof AppState> = Record<K, StoreUpdateCallback<AppState[K]>[]>;
type IAppStateSubscriptions = SubscriptionType<keyof AppState>;


class AppStateStore {
    private readonly subscriptions: IAppStateSubscriptions;
    private readonly eventCallbacks: EventCallbackListing<keyof EventCallback>;
    private readonly state: AppState;
    private loaders = 0;

    constructor(initialState: AppState) {
        this.state = initialState;
        const subscriptions: Record<string, (() => unknown)[]> = {};
        for (const key in this.state) {
            subscriptions[key] = [];
        }
        this.eventCallbacks = {newTimeseries: [], timeseriesUpdated: []};
        this.subscriptions = subscriptions as IAppStateSubscriptions;
        this.init();
        setInterval(() => this.getNewTimeseriesData(), this.state.updateIntervalSeconds * 1000);
    }

    async init() {
        await this.updateTimeseriesFromSettings();
        await this.getNewTimeseriesData();
    }

    addTimeseries(timeseries: Timeseries) {
        if (this.state.timeseries.indexOf(timeseries) >= 0) {
            throw new AppStateError("Timeseries has already been added!");
        }
        this.state.timeseries.push(timeseries);
        this.notifyStoreVal("timeseries");
        this.eventCallbacks["newTimeseries"].forEach(cb => cb(timeseries));
        this.updateTimeseriesFromSettings();
    }

    private notifyStoreVal<T extends keyof AppState>(subscribedValue: T, newValue?: AppState[T], oldValue?: AppState[T]) {
        for (const subscriptionCallback of this.subscriptions[subscribedValue]) {
            new Promise(() => subscriptionCallback(newValue, oldValue));
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
        console.log(start, stop);
        for (const timeseries of this.state.timeseries) {
            await timeseries.updateFromWindow(start, stop);
        }
        this.finishLoad();
        for (const timeseries of this.state.timeseries) {
            this.notifyStoreVal("timeseries");
            this.eventCallbacks["timeseriesUpdated"].forEach(cb => cb(timeseries));
        }
    }

    private async getNewTimeseriesData() {
        const updateTime = new Date().getTime() / 1000;
        this.addLoad();
        for (const timeseries of this.state.timeseries) {
            await timeseries.getLatest();
        }
        this.finishLoad();
        for (const timeseries of this.state.timeseries) {
            this.notifyStoreVal("timeseries");
            this.eventCallbacks["timeseriesUpdated"].forEach(cb => cb(timeseries));
        }
        this.setLastUpdateTime(updateTime);
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
        this.notifyStoreVal("displayMode");
    }

    setDisplayWindow(newWin: TimeWindow) {
        if (newWin.start < newWin.stop) {
            this.state.displayWindow = {...newWin};
            this.notifyStoreVal("displayWindow");
            this.updateTimeseriesFromSettings();
        } else {
            throw new AppStateError(`Invalid display window from ${newWin.start} to ${newWin.stop}`);
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
}

let store: AppStateStore;

export async function initStore(initialState: AppState) {
    store = new AppStateStore(initialState);
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