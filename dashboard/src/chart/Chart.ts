import Timeseries from "../Timeseries";
import Scale from "./Scale";

export enum ScaleId {
    Left,
    Right
}

export type Bounds = {
    top: number;
    left: number;
    width: number;
    height: number;
};

export interface ChartEventCallback {
    scroll: (direction: -1 | 1, magnitude: number, index: number) => void;
    mousemove: (coords: { x: number, y: number }) => void;
    drag: (deltaX: number, deltaY: number, deltaIndex: number) => void;
}
type EventCallbackListing<K extends keyof ChartEventCallback> = Record<K, ChartEventCallback[K][]>;

const MIN_PIXELS_PER_POINT = 5;

export default class Chart {
    private readonly ctx: CanvasRenderingContext2D;
    private leftScale: Scale;
    private rightScale: Scale;
    private readonly lastMousePos = {x: 0, y: 0};
    private readonly indexRange = {start: 0, stop: 0};
    private readonly margins = {top: 20, bottom: 20, left: 10, right: 10};
    private readonly timeseries: Timeseries[] = [];
    private chartBounds: Bounds;
    private formatTimestamp = (timestamp: number) => new Date(timestamp * 1000).toLocaleTimeString();
    private resolution = 1;
    private subscriptions: EventCallbackListing<keyof ChartEventCallback>;
    private dragging = false;
    private highlightedTimeseries: string | null = null;

    constructor(context: CanvasRenderingContext2D) {
        this.subscriptions = {scroll: [], mousemove: [], drag: []};
        this.ctx = context;
        this.leftScale = new Scale();
        this.rightScale = new Scale();
        this.updateLayout();
        this.ctx.fillStyle = "rgb(255,255,255)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fill();
        this.ctx.translate(0.5, 0.5);
        this.ctx.canvas.onmousemove = (e) => this.handleMouseMove(e);
        this.ctx.canvas.onmousedown = (e) => this.dragging = true;
        this.ctx.canvas.onmouseup = (e) => this.dragging = false;
        this.ctx.canvas.onmouseleave = (e) => this.dragging = false;
        this.ctx.canvas.onmouseout = (e) => this.dragging = false;
        this.ctx.canvas.onwheel = (e) => this.handleScroll(e);
    }

    updateLayout() {
        const leftScaleInitialWidth = 50;
        const rightScaleInitialWidth = 50;
        const verticalMargins = this.margins.bottom + this.margins.top;
        const horizontalMargins = this.margins.left + this.margins.right;
        this.leftScale.updateBounds({
            top: this.margins.top,
            left: this.margins.left,
            height: this.ctx.canvas.height - verticalMargins,
            width: leftScaleInitialWidth,
        });
        this.chartBounds = {
            top: this.margins.top,
            left: this.margins.left + leftScaleInitialWidth,
            height: this.ctx.canvas.height - verticalMargins,
            width: this.ctx.canvas.width - (horizontalMargins + leftScaleInitialWidth + rightScaleInitialWidth),
        };
        this.rightScale.updateBounds({
            top: this.margins.top,
            left: this.ctx.canvas.width - this.margins.right - rightScaleInitialWidth,
            height: this.ctx.canvas.height - verticalMargins,
            width: rightScaleInitialWidth,
        });
        this.render();
    }

    addTimeseries(timeseries: Timeseries, scale?: ScaleId) {
        this.timeseries.push(timeseries);
        if (scale === ScaleId.Left) {
            this.leftScale.addTimeseries(timeseries);
        } else {
            this.rightScale.addTimeseries(timeseries);
        }
    }

    setRange(range: {start: number, stop: number}) {
        this.indexRange.start = range.start;
        this.indexRange.stop = range.stop;
    }

    private handleMouseMove(event: MouseEvent) {
        const {left: canvasX, top: canvasY} = this.ctx.canvas.getBoundingClientRect();
        const oldX = this.lastMousePos.x;
        this.lastMousePos.x = event.clientX - canvasX;
        this.lastMousePos.y = event.clientY - canvasY;
        this.render();
        if (this.dragging) {
            this.emit("drag", event.movementX, event.movementY, this.getIndex(oldX) - this.getIndex(this.lastMousePos.x));
        }
    }

    private handleScroll(e: WheelEvent) {
        this.emit("scroll", e.deltaY > 0 ? 1 : -1, Math.abs(e.deltaY), this.getIndex(this.lastMousePos.x));
    }

    private emit<T extends keyof ChartEventCallback>(eventName: T, ...callbackArgs: Parameters<ChartEventCallback[T]>) {
        for (const sub of this.subscriptions[eventName]) {
            // @ts-ignore
            sub(...callbackArgs);
        }
    }

    highlightTimeseries(name: string | null) {
        if (!name) {
            this.highlightedTimeseries = null;
            this.render();
            return;
        }
        for (const timeseries of this.timeseries) {
            if (timeseries.getName() === name) {
                this.highlightedTimeseries = name;
                this.render();
                return;
            }
        }
        throw new Error(`The timeseries ${name} could not be highlighted because it doesn't exist on the chart!`);
    }

    on<T extends keyof ChartEventCallback>(eventName: T, callback: ChartEventCallback[T]) {
        this.subscriptions[eventName].push(callback);
    }

    render() {
        this.clearCanvas();
        this.updateResolution();
        this.renderGuides();
        this.leftScale.updateIndexRange(this.indexRange);
        this.rightScale.updateIndexRange(this.indexRange);
        this.leftScale.listTimeseries().forEach(timeseries => this.renderTimeseries(timeseries, ScaleId.Left));
        this.rightScale.listTimeseries().forEach(timeseries => this.renderTimeseries(timeseries, ScaleId.Right));
        this.renderMargins();
        this.leftScale.render(this.ctx);
        this.rightScale.render(this.ctx);
        this.renderTooltips();
    }

    private renderMargins() {
        this.ctx.fillStyle = "rgb(255,255,255)";
        this.ctx.fillRect(
            this.ctx.canvas.clientLeft - 1,
            this.ctx.canvas.clientTop - 1,
            this.ctx.canvas.width + 1,
            this.margins.top + 1,
        );
        this.ctx.fillRect(
            this.ctx.canvas.clientLeft + this.ctx.canvas.width - this.margins.right - 1,
            this.ctx.canvas.clientTop - 1,
            this.margins.right + 1,
            this.ctx.canvas.height + 1,
        );
        this.ctx.fillRect(
            this.ctx.canvas.clientLeft - 1,
            this.ctx.canvas.clientTop - 1,
            this.margins.left + 1,
            this.ctx.canvas.height + 1,
        );
        this.ctx.fillRect(
            this.ctx.canvas.clientLeft,
            this.ctx.canvas.clientTop + this.ctx.canvas.height - this.margins.bottom,
            this.ctx.canvas.width,
            this.margins.bottom,
        );
    }

    private clearCanvas() {
        this.ctx.fillStyle = "rgb(255,255,255)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    private updateResolution() {
        const chartWidth = (this.chartBounds.width - this.rightScale.getBounds().width - this.leftScale.getBounds().width);
        const points = this.timeseries[0]?.cachedBetween(this.indexRange.start, this.indexRange.stop, 1).length / 2 ?? 0;
        const pixelsPerPoint = chartWidth / points;
        if (pixelsPerPoint < MIN_PIXELS_PER_POINT) {
            this.resolution = Math.ceil(MIN_PIXELS_PER_POINT / pixelsPerPoint);
        } else {
            this.resolution = 1;
        }
    }

    private renderGuides() {
        this.ctx.strokeStyle = "rgb(230, 230, 230)";
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        for (const tick of this.rightScale.getTicks()) {
            const pos = Math.floor(this.rightScale.getY(tick));
            this.ctx.moveTo(this.chartBounds.left, pos);
            this.ctx.lineTo(this.chartBounds.left + this.chartBounds.width, pos);
        }
        this.ctx.stroke();
    }

    private renderTooltips(radius = 20) {
        let bestDist = radius;
        let bestTimeseries = this.timeseries[0];
        let bestIndex = 0;
        let bestVal = 0;
        let bestScale = this.leftScale;
        for (const scale of [this.leftScale, this.rightScale]) {
            for (const timeseries of scale.listTimeseries()) {
                const cache = timeseries.cachedBetween(
                    this.getIndex(this.lastMousePos.x - radius / 2),
                    this.getIndex(this.lastMousePos.x + radius / 2),
                    this.resolution
                );
                for (let i = 0; i < cache.length; i += 2) {
                    const y = scale.getY(cache[i]);
                    if (y + radius / 2 >= this.lastMousePos.y && y - radius / 2 <= this.lastMousePos.y) {
                        const x = this.getX(cache[i + 1]);
                        const dist = Math.sqrt((y - this.lastMousePos.y) ** 2 + (x - this.lastMousePos.x) ** 2);
                        if (dist < bestDist) {
                            bestDist = dist;
                            bestTimeseries = timeseries;
                            bestIndex = cache[i + 1];
                            bestVal = cache[i];
                            bestScale = scale;
                        }
                    }
                }
            }
        }
        if (bestDist < 20) {
            this.renderTooltip(
                `${bestTimeseries.getName()} - (${bestVal.toFixed(2)}, ${this.formatTimestamp(bestIndex)})`,
                this.getX(bestIndex),
                bestScale.getY(bestVal),
                bestTimeseries.getColour()
            );
        }
    }

    setTimestampFormatter(formatter: (timestamp: number) => string) {
        this.formatTimestamp = formatter;
    }

    getX(index: number) {
        return (index - this.indexRange.start) / (this.indexRange.stop - this.indexRange.start) * this.chartBounds.width + this.chartBounds.left;
    }

    getY(value: number, scale: ScaleId) {
        return (scale === ScaleId.Left ? this.leftScale : this.rightScale).getY(value);
    }

    getIndex(x: number) {
        return (x - this.leftScale.getBounds().width) / this.chartBounds.width * (this.indexRange.stop - this.indexRange.start) + this.indexRange.start;
    }

    getValue(y: number, scale: ScaleId) {
        return (scale === ScaleId.Left ? this.leftScale : this.rightScale).getValue(y);
    }


    private renderTimeseries(timeseries: Timeseries, scaleId: ScaleId) {
        const scale = scaleId === ScaleId.Left ? this.leftScale : this.rightScale;
        const timeseriesPoints = timeseries.cachedBetween(this.indexRange.start, this.indexRange.stop, this.resolution);
        this.ctx.strokeStyle = timeseries.getColour();
        this.ctx.lineWidth = timeseries.getName() === this.highlightedTimeseries ? 2 : 1;
        let y = scale.getY(timeseriesPoints[0]);
        let x = this.getX(timeseriesPoints[1]);
        this.ctx.beginPath();
        for (let i = 0; i < timeseriesPoints.length; i += 2 * this.resolution) {
            this.ctx.moveTo(Math.round(x), Math.round(y));
            y = 0;
            x = 0;
            for (let j = 0; j < this.resolution * 2 && (j + 2 < timeseriesPoints.length); j += 2) {
                y += timeseriesPoints[i + j];
                x += timeseriesPoints[i + 1 + j];
            }
            y = scale.getY(y / this.resolution);
            x = this.getX(x / this.resolution);
            this.ctx.lineTo(Math.round(x), Math.round(y));
            if (this.resolution === 1) {
                this.ctx.ellipse(x, y, 2, 2, 0, 0, 2 * Math.PI);
            }
        }
        this.ctx.stroke();
    }

    private renderTooltip(text: string, x: number, y: number, markerColour: string) {
        this.ctx.strokeStyle = "rgb(255,0,0)";
        this.ctx.beginPath();
        this.ctx.ellipse(x, y, 5, 5, 0, 0, 2 * Math.PI);
        this.ctx.stroke();

        const measurements = this.ctx.measureText(text);
        const textHeight = measurements.actualBoundingBoxAscent + measurements.actualBoundingBoxDescent;
        const height = textHeight + 10;
        const width = measurements.width + 10 + 15;
        y -= height + 2;
        x += 2;
        if (x + width > this.ctx.canvas.width) {
            x -= width + 4;
        }
        if (y - height < 0) {
            y += height + 4;
        }

        this.ctx.fillStyle = "rgb(255,255,255)";
        this.ctx.strokeStyle = "rgb(0,0,0)";
        this.ctx.fillRect(Math.round(x), Math.round(y), Math.round(width), Math.round(height));
        this.ctx.strokeRect(Math.round(x), Math.round(y), Math.round(width), Math.round(height));

        this.ctx.fillStyle = markerColour;
        this.ctx.beginPath();
        this.ctx.arc(Math.round(x + 10), Math.round(y + height/2), 5, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = "rgb(0,0,0)";
        this.ctx.textAlign = "left";
        this.ctx.fillText(text, Math.round(x + 20), Math.round(y + textHeight + 5));

    }
}
