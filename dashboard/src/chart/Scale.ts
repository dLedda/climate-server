import Timeseries from "../Timeseries";
import {Bounds} from "./Chart";

export default class Scale {
    private readonly timeseries: Timeseries[] = [];
    private valRange: {high: number, low: number} = {high: -Infinity, low: Infinity};
    private tickCache: number[] = [];
    private tickCacheDirty = true;
    private bounds: Bounds;
    private margins: {top: number, bottom: number} =  {top: 10, bottom: 10};

    constructor(bounds?: Bounds) {
        this.bounds = bounds ?? {height: 0, width: 0, top: 0, left: 0};
    }

    updateIndexRange(indexRange: {start: number, stop: number}) {
        this.valRange.high = -Infinity;
        this.valRange.low = Infinity;
        for (const timeseries of this.timeseries) {
            const extrema = timeseries.getExtremaInRange(indexRange.start, indexRange.stop);
            if (extrema.maxVal > this.valRange.high) {
                this.valRange.high = extrema.maxVal;
            }
            if (extrema.minVal < this.valRange.low) {
                this.valRange.low = extrema.minVal;
            }
        }
        this.tickCacheDirty = true;
    }

    updateBounds(bounds: Bounds) {
        Object.assign(this.bounds, bounds);
    }

    getBounds() {
        return Object.assign({}, this.bounds);
    }

    addTimeseries(timeseries: Timeseries) {
        this.timeseries.push(timeseries);
    }

    listTimeseries() {
        return this.timeseries.slice();
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.fillRect(this.bounds.left, this.bounds.top, this.bounds.width, this.bounds.height);
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        for (const tick of this.getTicks()) {
            const text = tick.toFixed(2);
            const pos = Math.round(this.getY(tick));
            ctx.fillText(text, this.bounds.left + this.bounds.width/2, pos + 4);
        }
    }

    getTicks() {
        if (this.tickCacheDirty) {
            const ticks = [];
            const tickCount = 20;
            const tickHeight = (this.valRange.high - this.valRange.low) / tickCount;
            let currentTick = this.valRange.low - tickHeight;
            for (let i = 0; i <= tickCount; i++) {
                currentTick += tickHeight;
                ticks.push(currentTick);
            }
            this.tickCache = ticks;
            this.tickCacheDirty = false;
        }
        return this.tickCache;
    }

    getY(value: number) {
        const internalHeight = this.bounds.height - this.margins.top - this.margins.bottom;
        return this.bounds.top + this.bounds.height - this.margins.bottom - (value - this.valRange.low) / (this.valRange.high - this.valRange.low) * internalHeight;
    }

    getValue(y: number) {
        return ((this.bounds.height + this.bounds.top - y) / this.bounds.height) * (this.valRange.high - this.valRange.low) + this.valRange.low;
    }
}