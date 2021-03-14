import Snapshot from "./Snapshot";
import ListCache from "./ListCache";

export class AppStateError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AppStateError";
    }
}

export type DisplayMode = "window" | "pastMins";

export interface TimeWindow {
    start: number;
    stop: number;
}

interface AppState {
    lastUpdateTime: number;
    displayWindow: TimeWindow;
    minutesDisplayed: number;
    utcOffset: number;
    snapshots: Snapshot[];
    overlayText: string;
    dataEndpointBase: string;
    updateIntervalSeconds: number;
    isLoading: boolean;
    displayMode: DisplayMode;
    fatalError: Error | null;
    documentReady: boolean;
}

type StoreUpdateCallback<T> = (newValue?: T, oldValue?: T) => void;
type SubscriptionType<T, K extends keyof T> = Record<K, StoreUpdateCallback<T[K]>[]>;
type IAppStateSubscriptions = SubscriptionType<AppState, keyof AppState>;

class AppStateStore {
    private readonly subscriptions: IAppStateSubscriptions;
    private readonly state: AppState;
    private initialised = false;
    private loaders = 0;
    private readonly climateDataStore: ListCache<number, Snapshot> = new ListCache<number, Snapshot>(
        async (start, stop) => {
            const dataEndpoint = `${ this.state.dataEndpointBase }/snapshots?from=${ new Date(start).toISOString() }${stop ? `&to=${new Date(stop).toISOString()}` : ""}`;
            const payload = await fetch(dataEndpoint);
            return ((await payload.json()) as any).snapshots.reverse();
        },
        (data, index) => {
            const time = new Date(data.time).getTime();
            if (time + getAppState().updateIntervalSeconds * 1000 > index) {
                return 1;
            } else if (time - getAppState().updateIntervalSeconds * 1000< index) {
                return -1;
            } else {
                return 0;
            }
        }
    );

    constructor(initialState: AppState) {
        this.state = initialState;
        const subscriptions: Record<string, (() => unknown)[]> = {};
        for (const key in this.state) {
            subscriptions[key] = [];
        }
        this.subscriptions = subscriptions as IAppStateSubscriptions;
        setInterval(() => this.updateClimateData(), this.state.updateIntervalSeconds * 1000);
    }

    async init() {
        if (!this.initialised) {
            await this.updateClimateData();
            this.initialised = true;
        }
    }

    private notify(subscribedValue: keyof AppState) {
        for (const subscriptionCallback of this.subscriptions[subscribedValue]) {
            new Promise(() => subscriptionCallback());
        }
    }

    private async updateClimateData() {
        const now = new Date().getTime();
        if (this.state.displayMode === "window") {
            await this.climateDataStore.updateFromWindow(
                this.state.displayWindow.start,
                this.state.displayWindow.stop
            );
        } else {
            await this.climateDataStore.updateFromWindow(
                now - this.state.minutesDisplayed * 60000,
                now
            );
        }
        this.setLastUpdateTime(now);
        this.setSnapshots(this.climateDataStore.getCache());
    }

    async snapshotsBetween(start: number, stop: number) {
        return this.climateDataStore.snapshotsBetween(start, stop);
    }

    getState(): AppState {
        return this.state;
    }

    subscribe<T extends keyof AppState>(dataName: T, callback: StoreUpdateCallback<AppState[T]>) {
        this.subscriptions[dataName].push(callback);
    }

    setDisplayMode(mode: DisplayMode) {
        this.state.displayMode = mode;
        this.notify("displayMode");
    }

    setDisplayWindow(newWin: TimeWindow) {
        if (newWin.start < newWin.stop) {
            this.state.displayWindow = {...newWin};
            this.notify("displayWindow");
            this.updateClimateData();
        } else {
            throw new AppStateError(`Invalid display window from ${newWin.start} to ${newWin.stop}`);
        }
    }

    setMinutesDisplayed(mins: number) {
        if (mins > 0) {
            this.state.minutesDisplayed = Math.ceil(mins);
            this.notify("minutesDisplayed");
            this.updateClimateData();
        } else {
            throw new AppStateError(`Invalid minutes passed: ${mins}`);
        }
    }

    setUtcOffset(newOffset: number) {
        if (Math.floor(newOffset) === newOffset && newOffset <= 14 && newOffset >= -12) {
            this.state.utcOffset = newOffset;
            this.notify("snapshots");
        } else {
            throw new AppStateError(`Invalid UTC offset: ${newOffset}`);
        }
    }

    private setLastUpdateTime(newTime: number) {
        if (this.state.lastUpdateTime <= newTime) {
            this.state.lastUpdateTime = newTime;
            this.notify("lastUpdateTime");
        } else {
            throw new AppStateError(`Bad new update time was before last update time. Old: ${this.state.lastUpdateTime}, New: ${newTime}`);
        }
    }

    setOverlayText(text: string) {
        this.state.overlayText = text;
        this.notify("overlayText");
    }

    addLoad() {
        this.loaders += 1;
        this.state.isLoading = this.loaders > 0;
        this.notify("isLoading");
    }

    finishLoad() {
        this.loaders -= 1;
        this.state.isLoading = this.loaders > 0;
        this.notify("isLoading");
    }

    fatalError(err: Error) {
        if (!this.state.fatalError) {
            this.state.fatalError = err;
            this.notify("fatalError");
        }
    }

    setDocumentReady(isReady: boolean) {
        this.state.documentReady = isReady;
        this.notify("documentReady");
    }

    private setSnapshots(snapshots: Snapshot[]) {
        this.state.snapshots = snapshots;
        this.notify("snapshots");
    }
}

let store: AppStateStore;

export async function initStore(initialState: AppState) {
    store = new AppStateStore(initialState);
    await store.init();
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