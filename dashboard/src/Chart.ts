import Snapshot from "./Snapshot";

export default class Chart {
    private readonly ctx: CanvasRenderingContext2D;
    constructor(context: CanvasRenderingContext2D) {
        this.ctx = context;
    }

    render(snapshots: Snapshot[]) {
        const snapshotWidth = this.ctx.canvas.width;
        let minTemp = Infinity;
        let maxTemp = -Infinity;
        let minCo2 = Infinity;
        let maxCo2 = -Infinity;
        let minHumidity = Infinity;
        let maxHumidity = -Infinity;
        for (const snapshot of snapshots) {
            if (snapshot.temp < minTemp) {
                minTemp = snapshot.temp;
            }
            if (snapshot.temp > maxTemp) {
                maxTemp = snapshot.temp;
            }
            if (snapshot.co2 < minCo2) {
                minCo2 = snapshot.co2;
            }
            if (snapshot.co2 > maxCo2) {
                maxCo2 = snapshot.co2;
            }
            if (snapshot.humidity < minHumidity) {
                minHumidity = snapshot.humidity;
            }
            if (snapshot.humidity > maxHumidity) {
                maxHumidity = snapshot.humidity;
            }
        }
        const humidityRange = maxHumidity - minHumidity;

        let x = snapshotWidth / 2;
        let y = (snapshots[0].humidity - minHumidity) / humidityRange;
        this.ctx.ellipse(x, y, 3, 3, 0, 0, 2 * Math.PI);
        this.ctx.moveTo(x, y);
        for (let i = 1; i < snapshots.length; i++) {
            x += snapshotWidth;
            y = (snapshots[i].humidity - minHumidity) / humidityRange;
            this.ctx.lineTo(x, y);
            this.ctx.ellipse(x, y, 3, 3, 0, 0, 2 * Math.PI);
        }
        this.ctx.stroke();

        const co2Range = maxCo2 - minCo2;
        x = snapshotWidth / 2;
        y = (snapshots[0].humidity - minHumidity) / humidityRange;
        this.ctx.ellipse(x, y, 3, 3, 0, 0, 2 * Math.PI);
        this.ctx.moveTo(x, y);
        for (let i = 1; i < snapshots.length; i++) {
            x += snapshotWidth;
            y = (snapshots[i].humidity - minHumidity) / humidityRange;
            this.ctx.lineTo(x, y);
            this.ctx.ellipse(x, y, 3, 3, 0, 0, 2 * Math.PI);
        }
        this.ctx.stroke();

        const tempRange = maxTemp - minTemp;
        x = snapshotWidth / 2;
        y = (snapshots[0].humidity - minHumidity) / humidityRange;
        this.ctx.ellipse(x, y, 3, 3, 0, 0, 2 * Math.PI);
        this.ctx.moveTo(x, y);
        for (let i = 1; i < snapshots.length; i++) {
            x += snapshotWidth;
            y = (snapshots[i].humidity - minHumidity) / humidityRange;
            this.ctx.lineTo(x, y);
            this.ctx.ellipse(x, y, 3, 3, 0, 0, 2 * Math.PI);
        }
        this.ctx.stroke();
    }
}