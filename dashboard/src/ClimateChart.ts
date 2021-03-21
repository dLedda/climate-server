import Timeseries from "./Timeseries";

export default class ClimateChart {
    private readonly ctx: CanvasRenderingContext2D;
    private readonly timeseries: Timeseries[] = [];
    private readonly lastMousePos = {x: 0, y: 0};
    private readonly indexRange = {start: 0, stop: 0};
    private readonly valRange = {high: -Infinity, low: Infinity}
    private formatTimestamp = (timestamp: number) => new Date(timestamp * 1000).toLocaleTimeString();
    private width = 0;
    private height = 0;
    constructor(context: CanvasRenderingContext2D) {
        this.ctx = context;
        this.ctx.fillStyle = "rgb(255,255,255)";
        this.width = this.ctx.canvas.width;
        this.height = this.ctx.canvas.height;
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.fill();
        this.ctx.translate(0.5, 0.5);
        this.ctx.canvas.onmousemove = (e) => this.handleMouseMove(e);
    }

    addTimeseries(timeseries: Timeseries) {
        this.timeseries.push(timeseries);
    }

    setRange(range: {start: number, stop: number}) {
        this.indexRange.start = range.start;
        this.indexRange.stop = range.stop;
    }

    handleMouseMove(event: MouseEvent) {
        const {left: canvasX, top: canvasY} = this.ctx.canvas.getBoundingClientRect();
        const x = event.clientX - canvasX;
        const y = event.clientY - canvasY;
        this.lastMousePos.x = x;
        this.lastMousePos.y = y;
        this.render();
    }

    render() {
        this.width = this.ctx.canvas.width;
        this.height = this.ctx.canvas.height;
        this.ctx.fillStyle = "rgb(255,255,255)";
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.fill();
        this.setDisplayRange();
        this.renderScale();
        for (const timeseries of this.timeseries) {
            this.renderTimeseries(timeseries);
        }
        this.renderTooltips();
    }

    private renderScale() {
        this.ctx.strokeStyle = "rgb(230,230,230)";
        this.ctx.fillStyle = "black";
        this.ctx.beginPath();
        const bottom = this.getY(this.valRange.low);
        this.ctx.moveTo(40, bottom);
        this.ctx.lineTo(this.width, bottom);
        this.ctx.fillText(this.valRange.low.toString(), 0, bottom + 4);
        const top = this.getY(this.valRange.high);
        this.ctx.moveTo(40, top);
        this.ctx.lineTo(this.width, top);
        this.ctx.fillText(this.valRange.high.toString(), 0, top + 4);
        const ticks = 20;
        const tickHeight = this.height / ticks;
        for (let i = 1; i < ticks; i++) {
            const pos = Math.floor(tickHeight * i);
            this.ctx.moveTo(40, pos);
            this.ctx.lineTo(this.width, pos);
            this.ctx.fillText(this.getValue(pos).toFixed(2), 0, pos + 4);
        }
        this.ctx.stroke();
    }

    private setDisplayRange() {
        for (const timeseries of this.timeseries) {
            const extrema = timeseries.getExtrema();
            if (extrema.maxVal > this.valRange.high) {
                this.valRange.high = extrema.maxVal;
            }
            if (extrema.minVal < this.valRange.low) {
                this.valRange.low = extrema.minVal;
            }
        }
    }

    private renderTooltips() {
        let bestDist = 20;
        let bestTimeseries = this.timeseries[0];
        let bestIndex = 0;
        let bestVal = 0;
        for (const timeseries of this.timeseries) {
            const cache = timeseries.cachedBetween(this.indexRange.start, this.indexRange.stop);
            for (let i = 0; i < cache.length; i += 2) {
                const x = this.getX(cache[i + 1]);
                const y = this.getY(cache[i]);
                const dist = Math.sqrt((y - this.lastMousePos.y) ** 2 + (x - this.lastMousePos.x) ** 2);
                if (dist < bestDist) {
                    bestDist = dist;
                    bestTimeseries = timeseries;
                    bestIndex = cache[i + 1];
                    bestVal = cache[i];
                }
            }
        }
        if (bestDist < 20) {
            this.renderTooltip(
                `${bestTimeseries.getName()} - (${bestVal.toFixed(2)}, ${this.formatTimestamp(bestIndex)})`,
                this.getX(bestIndex),
                this.getY(bestVal),
            );
        }
    }

    setTimestampFormatter(formatter: (timestamp: number) => string) {
        this.formatTimestamp = formatter;
    }

    private getX(index: number) {
        return (index - this.indexRange.start) / (this.indexRange.stop - this.indexRange.start) * this.width;
    }

    private getY(value: number) {
        return this.height - (value - this.valRange.low) / (this.valRange.high - this.valRange.low) * this.height;
    }

    private getIndex(x: number) {
        return (x / this.width) * this.indexRange.stop;
    }

    private getValue(y: number) {
        return ((this.height - y) / this.height) * this.valRange.high;
    }


    private renderTimeseries(timeseries: Timeseries) {
        const timeseriesPoints = timeseries.cachedBetween(this.indexRange.start, this.indexRange.stop);
        this.ctx.strokeStyle = timeseries.getColour();
        let y = this.getY(timeseriesPoints[0]);
        let x = this.getX(timeseriesPoints[1]);
        this.ctx.moveTo(Math.floor(x), Math.floor(y));
        this.ctx.beginPath();
        this.ctx.lineTo(Math.floor(x), Math.floor(y));
        this.ctx.ellipse(x, y, 3, 3, 0, 0, 2 * Math.PI);
        for (let i = 2; i < timeseriesPoints.length; i += 2) {
            y = this.getY(timeseriesPoints[i]);
            x = this.getX(timeseriesPoints[i + 1]);
            this.ctx.lineTo(Math.floor(x), Math.floor(y));
            this.ctx.ellipse(x, y, 3, 3, 0, 0, 2 * Math.PI);
        }
        this.ctx.stroke();
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
        this.ctx.fillRect(x, y, width, height);
        this.ctx.strokeRect(x, y, width, height);
        this.ctx.fillStyle = "rgb(0,0,0)";
        this.ctx.fillText(text, x + 5, y + textHeight + 5);
    }
}
