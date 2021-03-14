import Chart from "chart.js/dist/Chart.bundle.min";
import {generateClimateChartConfig} from "./climateChartConfig";
import Snapshot from "./Snapshot";
import {AppStore, DisplayMode, getAppState, TimeWindow} from "./StateStore";
import GridWidget, {GridProps} from "./GridWidget";
import UIComponent from "./UIComponent";

interface ClimatePoint {
    x: string;
    y: number;
}

class ClimateChartWidget extends UIComponent {
    private readonly skeleton: GridWidget;
    private chart: Chart | null;
    private initialised: boolean;
    private displayMode: DisplayMode = "pastMins";
    private latestSnapshotInChartTime: number;
    private readonly canvasElement: HTMLCanvasElement = document.createElement("canvas");
    private body = document.createElement("div");

    constructor(gridProps: GridProps) {
        super();
        this.initialised = false;
        this.skeleton = new GridWidget({
            ...gridProps,
            body: this.body,
        });
        const now = new Date().getTime();
        this.latestSnapshotInChartTime = now - getAppState().minutesDisplayed * 60000;
        this.setupListeners();
        AppStore().subscribe("documentReady", async () => {
            try {
                AppStore().addLoad();
                await this.initChart();
                this.initialised = true;
            } catch (e) {
                AppStore().fatalError(e);
            } finally {
                AppStore().finishLoad();
            }
        });
    }

    private setupListeners() {
        AppStore().subscribe("displayMode", () => this.updateDisplayMode());
        AppStore().subscribe("minutesDisplayed", () => this.update());
        AppStore().subscribe("displayWindow", () => this.update());
        AppStore().subscribe("snapshots", () => this.update());
    }

    private async initChart() {
        const ctx = this.canvasElement.getContext("2d");
        this.chart = new Chart(ctx, generateClimateChartConfig({}));
        await this.update();
    }
    
    private async updateDisplayMode() {
        this.displayMode = getAppState().displayMode;
        await this.update();
    }

    private async update() {
        if (this.initialised) {
            if (this.displayMode === "window") {
                await this.updateChartFromTimeWindow();
            } else if (this.displayMode === "pastMins") {
                await this.updateChartFromMinuteSpan();
            }
        }
    }

    private async updateChartFromTimeWindow() {
        this.clearChart();
        this.appendSnapshots(await AppStore().snapshotsBetween(
            getAppState().displayWindow.start, getAppState().displayWindow.stop));
        this.chart.update();
    }

    private async updateChartFromMinuteSpan() {
        const mins = getAppState().minutesDisplayed;
        this.clearChart();
        this.appendSnapshots(await AppStore().snapshotsBetween(
            getAppState().lastUpdateTime - mins * 60000,
            getAppState().lastUpdateTime));
        this.chart.update();
    }

    private appendSnapshots(snapshots: Snapshot[]) {
        for (const snapshot of snapshots.reverse()) {
            this.humidityPointList().push({x: snapshot.time, y: snapshot.humidity});
            this.tempPointList().push({x: snapshot.time, y: snapshot.temp});
            this.co2PointList().push({x: snapshot.time, y: snapshot.co2});
        }
        this.latestSnapshotInChartTime = snapshots[0] && new Date(snapshots[0].time).getTime();
    }

    private removePoint(index: number) {
        this.humidityPointList().splice(index, 1);
        this.tempPointList().splice(index, 1);
        this.co2PointList().splice(index, 1);
    }

    private clearChart() {
        for (const dataset of this.chart.data.datasets) {
            dataset.data = [];
        }
    }

    private humidityPointList(): ClimatePoint[] {
        return this.chart.data.datasets[0].data as ClimatePoint[];
    }

    private tempPointList(): ClimatePoint[] {
        return this.chart.data.datasets[1].data as ClimatePoint[];
    }

    private co2PointList(): ClimatePoint[] {
        return this.chart.data.datasets[2].data as ClimatePoint[];
    }

    current() {
        return this.skeleton.current();
    }
}

export default ClimateChartWidget;