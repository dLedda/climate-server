import Timeseries from "./Timeseries";

interface Scale {
    timeseries: Timeseries[];
    valRange: {high: number, low: number};
    width: number;
}

export enum ScaleId {
    Left,
    Right
}

const MIN_PIXELS_PER_POINT = 3;

export default class ClimateChart {
    private readonly ctx: CanvasRenderingContext2D;
    private readonly leftScale: Scale;
    private readonly rightScale: Scale;
    private readonly lastMousePos = {x: 0, y: 0};
    private readonly indexRange = {start: 0, stop: 0};
    private readonly margins = {top: 20, bottom: 20};
    private formatTimestamp = (timestamp: number) => new Date(timestamp * 1000).toLocaleTimeString();
    private width = 0;
    private height = 0;
    private resolution = 1;
    constructor(context: CanvasRenderingContext2D) {
        this.ctx = context;
        this.ctx.fillStyle = "rgb(255,255,255)";
        this.updateDimensions();
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.fill();
        this.ctx.translate(0.5, 0.5);
        this.ctx.canvas.onmousemove = (e) => this.handleMouseMove(e);
        this.leftScale = {
            timeseries: [],
            valRange: {high: -Infinity, low: Infinity},
            width: 0,
        };
        this.rightScale = {
            timeseries: [],
            valRange: {high: -Infinity, low: Infinity},
            width: 0,
        };
    }

    private updateDimensions() {
        this.width = Number(getComputedStyle(this.ctx.canvas).width.slice(0, -2));
        this.height = Number(getComputedStyle(this.ctx.canvas).height.slice(0, -2));
    }

    addTimeseries(timeseries: Timeseries, scale?: ScaleId) {
        if (scale === ScaleId.Left) {
            this.leftScale.timeseries.push(timeseries);
        } else {
            this.rightScale.timeseries.push(timeseries);
        }
    }

    setRange(range: {start: number, stop: number}) {
        this.indexRange.start = range.start;
        this.indexRange.stop = range.stop;
    }

    private handleMouseMove(event: MouseEvent) {
        const {left: canvasX, top: canvasY} = this.ctx.canvas.getBoundingClientRect();
        const x = event.clientX - canvasX;
        const y = event.clientY - canvasY;
        this.lastMousePos.x = x;
        this.lastMousePos.y = y;
        this.render();
    }

    render() {
        this.updateDimensions();
        this.clearCanvas();
        this.updateResolution();
        this.setDisplayRangeForScale(this.leftScale);
        this.setDisplayRangeForScale(this.rightScale);
        this.renderRightScale();
        this.leftScale.timeseries.forEach(timeseries => this.renderTimeseries(timeseries, ScaleId.Left));
        this.rightScale.timeseries.forEach(timeseries => this.renderTimeseries(timeseries, ScaleId.Right));
        this.renderLeftScale();
        this.renderTooltips();
    }

    private clearCanvas() {
        this.ctx.fillStyle = "rgb(255,255,255)";
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.fill();
    }

    private updateResolution() {
        const chartWidth = (this.width - this.rightScale.width - this.leftScale.width);
        const points = this.rightScale.timeseries[0].cachedBetween(this.indexRange.start, this.indexRange.stop).length / 2;
        const pixelsPerPoint = chartWidth / points;
        if (pixelsPerPoint < MIN_PIXELS_PER_POINT) {
            this.resolution = Math.ceil(MIN_PIXELS_PER_POINT / pixelsPerPoint);
        } else {
            this.resolution = 1;
        }
    }

    private renderLeftScale() {
        this.ctx.fillStyle = "rgb(255,255,255)";
        this.ctx.fillRect(0, 0, this.leftScale.width, this.height);
        this.ctx.fill();
        this.ctx.strokeStyle = "rgb(230,230,230)";
        this.ctx.fillStyle = "black";
        const ticks = 20;
        const tickHeight = (this.leftScale.valRange.high - this.leftScale.valRange.low) / ticks;
        let currentTick = this.leftScale.valRange.low - tickHeight;
        for (let i = 0; i <= ticks; i++) {
            currentTick += tickHeight;
            const text = currentTick.toFixed(2);
            const textWidth = this.ctx.measureText(text).width;
            if (textWidth > this.leftScale.width) {
                this.leftScale.width = textWidth + 10;
            }
            const pos = Math.round(this.getY(currentTick, ScaleId.Left));
            this.ctx.fillText(text, 0, pos + 4);
        }
    }

    private renderRightScale() {
        this.ctx.strokeStyle = "rgb(230,230,230)";
        this.ctx.fillStyle = "black";
        const ticks = 20;
        const tickHeight = (this.rightScale.valRange.high - this.rightScale.valRange.low) / ticks;
        let currentTick = this.rightScale.valRange.low - tickHeight;
        for (let i = 0; i <= ticks; i++) {
            currentTick += tickHeight;
            const pos = Math.round(this.getY(currentTick, ScaleId.Right));
            const text = currentTick.toFixed(2);
            const textWidth = this.ctx.measureText(text).width;
            if (textWidth > this.rightScale.width) {
                this.rightScale.width = textWidth;
            }
            this.ctx.fillText(text, this.width - textWidth, pos + 4);
            this.ctx.beginPath();
            this.ctx.moveTo(this.leftScale.width, pos);
            this.ctx.lineTo(this.width - textWidth - 5, pos);
            this.ctx.stroke();
        }
    }

    private setDisplayRangeForScale(scale: Scale) {
        for (const timeseries of scale.timeseries) {
            const extrema = timeseries.getExtrema();
            if (extrema.maxVal > scale.valRange.high) {
                scale.valRange.high = extrema.maxVal;
            }
            if (extrema.minVal < scale.valRange.low) {
                scale.valRange.low = extrema.minVal;
            }
        }
    }

    private renderTooltips(radius = 20) {
        let bestDist = radius;
        let bestTimeseries = this.rightScale.timeseries[0];
        let bestIndex = 0;
        let bestVal = 0;
        let bestScale = ScaleId.Right;
        for (const scaleId of [ScaleId.Left, ScaleId.Right]) {
            for (const timeseries of (scaleId === ScaleId.Right ? this.rightScale : this.leftScale).timeseries) {
                const cache = timeseries.cachedBetween(
                    this.getIndex(this.lastMousePos.x - radius / 2),
                    this.getIndex(this.lastMousePos.x + radius / 2)
                );
                for (let i = 0; i < cache.length; i += 2) {
                    const y = this.getY(cache[i], scaleId);
                    if (y + radius / 2 >= this.lastMousePos.y && y - radius / 2 <= this.lastMousePos.y) {
                        const x = this.getX(cache[i + 1]);
                        const dist = Math.sqrt((y - this.lastMousePos.y) ** 2 + (x - this.lastMousePos.x) ** 2);
                        if (dist < bestDist) {
                            bestDist = dist;
                            bestTimeseries = timeseries;
                            bestIndex = cache[i + 1];
                            bestVal = cache[i];
                            bestScale = scaleId;
                        }
                    }
                }
            }
        }
        if (bestDist < 20) {
            this.renderTooltip(
                `${bestTimeseries.getName()} - (${bestVal.toFixed(2)}, ${this.formatTimestamp(bestIndex)})`,
                this.getX(bestIndex),
                this.getY(bestVal, bestScale),
            );
        }
    }

    setTimestampFormatter(formatter: (timestamp: number) => string) {
        this.formatTimestamp = formatter;
    }

    getX(index: number) {
        return (index - this.indexRange.start) / (this.indexRange.stop - this.indexRange.start) * (this.width - this.rightScale.width - this.leftScale.width) + this.leftScale.width;
    }

    getY(value: number, scale: ScaleId) {
        const valRange = scale === ScaleId.Left ? this.leftScale.valRange : this.rightScale.valRange;
        return this.height - (value - valRange.low) / (valRange.high - valRange.low) * (this.height - this.margins.bottom - this.margins.top) - this.margins.top;
    }

    getIndex(x: number) {
        return ((x - this.leftScale.width) / (this.width - this.leftScale.width - this.rightScale.width)) * (this.indexRange.stop - this.indexRange.start) + this.indexRange.start;
    }

    getValue(y: number, scale: ScaleId) {
        const valRange = scale === ScaleId.Left ? this.leftScale.valRange : this.rightScale.valRange;
        return ((this.height - y) / this.height) * (valRange.high - valRange.low) + valRange.low;
    }


    private renderTimeseries(timeseries: Timeseries, scale: ScaleId) {
        const timeseriesPoints = timeseries.cachedBetween(this.indexRange.start, this.indexRange.stop);
        this.ctx.strokeStyle = timeseries.getColour();
        let y = this.getY(timeseriesPoints[0], scale);
        let x = this.getX(timeseriesPoints[1]);
        for (let i = 0; i < timeseriesPoints.length; i += 2 * this.resolution) {
            this.ctx.beginPath();
            this.ctx.moveTo(Math.round(x), Math.round(y));
            y = 0;
            x = 0;
            for (let j = 0; j < this.resolution * 2 && (j + 2 < timeseriesPoints.length); j += 2) {
                y += timeseriesPoints[i + j];
                x += timeseriesPoints[i + 1 + j];
            }
            y = this.getY(y / this.resolution, scale);
            x = this.getX(x / this.resolution);
            this.ctx.lineTo(Math.round(x), Math.round(y));
            this.ctx.stroke();
            if (this.resolution === 1) {
                this.ctx.beginPath();
                this.ctx.ellipse(x, y, 2, 2, 0, 0, 2 * Math.PI);
                this.ctx.stroke();
            }
        }
    }

    private renderTooltip(text: string, x: number, y: number) {
        this.ctx.strokeStyle = "rgb(255,0,0)";
        this.ctx.beginPath();
        this.ctx.ellipse(x, y, 5, 5, 0, 0, 2 * Math.PI);
        this.ctx.stroke();
        const measurements = this.ctx.measureText(text);
        const textHeight = measurements.actualBoundingBoxAscent + measurements.actualBoundingBoxDescent;
        const height = textHeight + 10;
        const width = measurements.width + 10;
        if (x + width > this.width) {
            x -= width;
        }
        if (y + height > this.height) {
            y -= height;
        }
        this.ctx.fillStyle = "rgb(255,255,255)";
        this.ctx.strokeStyle = "rgb(0,0,0)";
        this.ctx.fillRect(Math.round(x), Math.round(y), Math.round(width), Math.round(height));
        this.ctx.strokeRect(Math.round(x), Math.round(y), Math.round(width), Math.round(height));
        this.ctx.fillStyle = "rgb(0,0,0)";
        this.ctx.fillText(text, Math.round(x + 5), Math.round(y + textHeight + 5));
    }
}
