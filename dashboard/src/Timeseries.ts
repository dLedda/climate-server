type TimeseriesLoader = (start: number, stop: number) => Promise<Int32Array>;

type TimeseriesOptions = {
    name: string,
    loader: TimeseriesLoader,
    tolerance?: number,
    valueRangeOverride?: {
        high: number,
        low: number,
    },
    colour?: string,
};

type Extrema = {
    minVal: number,
    maxVal: number,
    minIndex: number,
    maxIndex: number,
};

class Timeseries {
    private cache: Int32Array;
    private loader: TimeseriesLoader;
    private currentEndPointer: number;
    private name: string;
    private fetching = false;
    private extrema: Extrema = {
        minVal: Infinity,
        maxVal: -Infinity,
        minIndex: Infinity,
        maxIndex: -Infinity,
    };
    private valExtremaOverride?: { high: number, low: number };
    private colour: string;
    private tolerance: number;
    private historyComplete = false;

    constructor(options: TimeseriesOptions) {
        this.cache = new Int32Array();
        this.loader = options.loader;
        this.name = options.name;
        this.tolerance = options.tolerance ?? 0;
        let newColour: string | null;
        if (options.colour) {
            const style = new Option().style;
            style.color = options.colour;
            newColour = style.color === options.colour ? options.colour : null;
        }
        this.colour = newColour ?? `rgb(${Math.random() * 150},${Math.random() * 150},${Math.random() * 150})`;
        if (options.valueRangeOverride) {
            this.valExtremaOverride = { ...options.valueRangeOverride };
        }
    }

    getExtrema(): Extrema {
        return Object.assign({}, this.extrema);
    }

    getExtremaInRange(start: number, stop: number): Extrema {
        let maxVal = -Infinity;
        let minVal = Infinity;
        for (let i = this.findIndexInCache(start) - 1; i < this.findIndexInCache(stop) + 1; i += 2) {
            if (this.cache[i] < minVal) {
                minVal = this.cache[i];
            }
            if (this.cache[i] > maxVal) {
                maxVal = this.cache[i];
            }
        }
        return {
            minIndex: this.extrema.minIndex,
            maxIndex: this.extrema.maxIndex,
            maxVal: this.valExtremaOverride ? Math.max(this.valExtremaOverride.high, maxVal) : maxVal,
            minVal: this.valExtremaOverride ? Math.min(this.valExtremaOverride.low, minVal) : minVal,
        };
    }

    getName() {
        return this.name;
    }

    getCache() {
        return this.cache;
    }

    getColour() {
        return this.colour;
    }

    cachedBetween(start: number, stop: number, blockSize = 1): Int32Array {
        if (this.cache.length <= 0) {
            return new Int32Array();
        } else {
            blockSize = Math.round(blockSize) * 2;
            const cacheStartIndex = this.findIndexInCache(start);
            const cacheStopIndex = this.findIndexInCache(stop);
            return this.cache.slice(
                (cacheStartIndex - (cacheStartIndex) % blockSize),
                (cacheStopIndex + blockSize - (cacheStopIndex) % blockSize) + blockSize,
            );
        }
    }

    append(value: number, index: number): void {
        if (this.cache.length < this.currentEndPointer + 2) {
            const newCache = new Int32Array(this.cache.length * 2);
            newCache.set(this.cache, 0);
            newCache.set([value, index], this.currentEndPointer);
            this.cache = newCache;
        }
    }

    async updateFromWindow(start: number, stop: number) {
        if (!this.fetching) {
            try {
                if (this.cache.length === 0) {
                    this.fetching = true;
                    await this.fullFetch(start, stop);
                }
                if (this.cache[1] > start + this.tolerance) {
                    this.fetching = true;
                    await this.fetchPrior(this.cache[1], start);
                }
                if (this.cache[this.currentEndPointer - 1] < stop - this.tolerance) {
                    this.fetching = true;
                    await this.fetchAfter(this.cache[this.currentEndPointer - 1], stop);
                }
            } catch (e) {
                throw new Error(`Error fetching timeseries data: ${e}`);
            }
        }
        this.fetching = false;
    }

    async getLatest() {
        this.fetching = true;
        try {
            await this.fetchAfter(this.cache[this.currentEndPointer - 1]);
        } catch (e) {
            throw new Error(`Error fetching timeseries data: ${e}`);
        }
        this.fetching = false;
    }

    private async fullFetch(start: number, stop: number) {
        try {
            this.cache = await this.loader(start, stop);
            this.currentEndPointer = this.cache.length;
            this.updateExtremaFrom(this.cache);
        } catch (e) {
            throw new Error(`Error fully fetching data: ${e}`);
        }
    }

    private async fetchAfter(after: number, atLeastUntil?: number) {
        try {
            let forwardDist = 2 * (this.cache[this.currentEndPointer - 1] - this.cache[1]);
            if (atLeastUntil && (atLeastUntil > after + forwardDist)) {
                forwardDist = atLeastUntil - after;
            }
            const result = await this.loader(after, after + forwardDist);
            const newCache = new Int32Array(this.cache.length + result.length);
            newCache.set(this.cache, 0);
            newCache.set(result, this.currentEndPointer);
            this.cache = newCache;
            this.currentEndPointer += result.length;
            this.updateExtremaFrom(result);
        } catch (e) {
            throw new Error(`Error fetching anterior data: ${e}`);
        }
    }

    private async fetchPrior(priorTo: number, atLeastUntil?: number) {
        try {
            let backDist = 2 * (this.cache[this.currentEndPointer - 1] - this.cache[1]);
            if (atLeastUntil < priorTo - backDist) {
                backDist = priorTo - atLeastUntil;
            }
            const requestIndexStart = priorTo - backDist;
            const result = await this.loader(requestIndexStart, priorTo);
            const newCache = new Int32Array(this.cache.length + result.length);
            newCache.set(result, 0);
            newCache.set(this.cache, result.length);
            this.cache = newCache;
            this.currentEndPointer += result.length;
            this.updateExtremaFrom(result);
            if (this.extrema.minIndex === priorTo) {
                this.historyComplete = true;
            }
        } catch (e) {
            throw new Error(`Error fetching prior data: ${e}`);
        }
    }

    private updateExtremaFrom(data: Int32Array) {
        for (let i = 0; i < data.length; i += 2) {
            if (data[i] < this.extrema.minVal) {
                this.extrema.minVal = data[i];
            }
            if (data[i] > this.extrema.maxVal) {
                this.extrema.maxVal = data[i];
            }
        }
        for (let i = 1; i < this.cache.length; i += 2) {
            if (data[i] < this.extrema.minIndex) {
                this.extrema.minIndex = data[i];
            }
            if (data[i] > this.extrema.maxIndex) {
                this.extrema.maxIndex = data[i];
            }
        }
    }

    private findIndexInCache(soughtIndex: number) {
        return this.findIndexInCacheBinary(soughtIndex);
    }

    private findIndexInCacheLinear(soughtIndex: number) {
        for (let i = 1; i < this.cache.length; i += 2) {
            if (soughtIndex < this.cache[i]) {
                return i > 3 ? i - 3 : i - 1;
            }
        }
        return this.cache.length - 2;
    }

    private findIndexInCacheBinary(soughtIndex: number, listStart = 0, listStop: number = (this.currentEndPointer / 2)): number {
        if (listStop - listStart === 1) {
            return listStart * 2 + 1;
        } else {
            const middle = Math.floor((listStop + listStart) / 2);
            const val = this.cache[middle * 2 + 1];
            if (val > soughtIndex) {
                return this.findIndexInCacheBinary(soughtIndex, listStart, middle);
            } else if (val < soughtIndex) {
                return this.findIndexInCacheBinary(soughtIndex, middle, listStop);
            } else {
                return middle * 2 + 1;
            }
        }
    }

    historyIsComplete(): boolean {
        return this.historyComplete;
    }
}

export default Timeseries;