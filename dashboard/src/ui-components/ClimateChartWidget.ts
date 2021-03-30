import {AppStore, DisplayMode, getAppState} from "../StateStore";
import GridWidget, {GridProps} from "./GridWidget";
import UIComponent from "./UIComponent";
import Chart, {ScaleId} from "../chart/Chart";

class ClimateChartWidget extends UIComponent {
    private readonly skeleton: GridWidget;
    private chart: Chart | null = null;
    private initialised: boolean;
    private displayMode: DisplayMode = "pastMins";
    private latestSnapshotInChartTime: number;
    private readonly canvasElement: HTMLCanvasElement = document.createElement("canvas");

    constructor(gridProps: GridProps) {
        super();
        this.initialised = false;
        this.canvasElement.className = "chart-canvas";
        this.skeleton = new GridWidget({
            ...gridProps,
            body: this.canvasElement,
        });
        const now = new Date().getTime() / 1000;
        this.latestSnapshotInChartTime = now - getAppState().minutesDisplayed * 60;
        this.setupListeners();
        this.updateDisplayMode();
    }

    updateDimensions() {
        const skelStyle = getComputedStyle(this.skeleton.current());
        this.canvasElement.height = this.skeleton.current().clientHeight
            - Number(skelStyle.paddingTop.slice(0, -2))
            - Number(skelStyle.paddingBottom.slice(0, -2));
        this.canvasElement.width = this.skeleton.current().clientWidth
            - Number(skelStyle.paddingLeft.slice(0, -2))
            - Number(skelStyle.paddingRight.slice(0, -2));
    }

    private setupListeners() {
        AppStore().subscribeStoreVal("displayMode", () => this.updateDisplayMode());
        AppStore().subscribeStoreVal("minutesDisplayed", () => this.rerender());
        AppStore().subscribeStoreVal("displayWindow", () => this.rerender());
        AppStore().on("timeseriesUpdated", () => this.rerender());
        AppStore().on("newTimeseries", (timeseries) => this.chart.addTimeseries(timeseries));
        AppStore().subscribeStoreVal("documentReady", () => this.initChart());
        AppStore().subscribeStoreVal("utcOffset", () => this.updateTimezone());
        AppStore().subscribeStoreVal("highlightedTimeseries", (name) => this.chart.highlightTimeseries(name));
    }

    private handleScroll(direction: number, magnitude: number, index: number) {
        let displayedWindow = getAppState().displayWindow;
        if (getAppState().displayMode === "pastMins") {
            AppStore().setDisplayMode("window");
            const now = new Date().getTime() / 1000;
            displayedWindow = {start: now - getAppState().minutesDisplayed * 60, stop: now};
        }
        const beforeIndex = index - displayedWindow.start;
        const afterIndex = displayedWindow.stop - index;
        const factor = direction === 1 ? 1.1 : 0.9;
        const newBeforeIndex = factor * beforeIndex;
        const newAfterIndex = factor * afterIndex;
        AppStore().setDisplayWindow({
            start: index - newBeforeIndex,
            stop: index + newAfterIndex,
        });
    }

    private handleDrag(deltaX: number, deltaY: number, deltaIndex: number) {
        if (getAppState().displayMode === "pastMins") {
            AppStore().setDisplayMode("window");
        }
        const displayWindow = getAppState().displayWindow;
        AppStore().setDisplayWindow({
            start: displayWindow.start + deltaIndex,
            stop: displayWindow.stop + deltaIndex,
        });
    }

    private updateTimezone() {
        const offset = getAppState().utcOffset * 60 * 60 * 1000;
        this.chart.setTimestampFormatter((timestamp) => new Date(timestamp * 1000 + offset).toLocaleTimeString());
    }

    private async initChart() {
        try {
            AppStore().addLoad();
            const ctx = this.canvasElement.getContext("2d", {alpha: false});
            this.chart = new Chart(ctx);
            getAppState().leftTimeseries.forEach(timeseries => this.chart.addTimeseries(timeseries, ScaleId.Left));
            getAppState().rightTimeseries.forEach(timeseries => this.chart.addTimeseries(timeseries, ScaleId.Right));
            this.chart.on("scroll", (...args) => this.handleScroll(...args));
            this.chart.on("drag", (...args) => this.handleDrag(...args));
            await this.rerender();
            this.initialised = true;
        } catch (e) {
            AppStore().fatalError(e);
        } finally {
            AppStore().finishLoad();
        }
    }
    
    private async updateDisplayMode() {
        this.displayMode = getAppState().displayMode;
        await this.rerender();
    }

    private async rerender() {
        if (!this.initialised) {
            return;
        }
        let start;
        let stop;
        if (this.displayMode === "window") {
            start = getAppState().displayWindow.start;
            stop = getAppState().displayWindow.stop;
        } else if (this.displayMode === "pastMins") {
            const mins = getAppState().minutesDisplayed;
            start = getAppState().lastUpdateTime - mins * 60;
            stop = getAppState().lastUpdateTime;
        }
        this.chart.setRange({start, stop});
        this.chart.render();
    }

    current() {
        return this.skeleton.current();
    }
}

export default ClimateChartWidget;