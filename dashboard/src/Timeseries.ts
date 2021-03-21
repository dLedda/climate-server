type TimeseriesLoader = (start: number, stop: number) => Promise<Int32Array>;

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
    private colour: string;

    constructor(name: string, loader: TimeseriesLoader) {
        this.cache = new Int32Array();
        this.loader = loader;
        this.name = name;
        this.colour = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;
    }

    getExtrema(): Extrema {
        return Object.assign(this.extrema);
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

    cachedBetween(start: number, stop: number): Int32Array {
        if (this.cache.length <= 0) {
            return new Int32Array();
        } else {
            return this.cache.slice(
                this.findIndexInCache(start),
                this.findIndexInCache(stop)
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
                } else if (this.cache[1] > start) {
                    this.fetching = true;
                    await this.fetchPrior(start);
                } else if (this.cache[this.currentEndPointer - 1] < stop) {
                    this.fetching = true;
                    await this.fetchAnterior(stop);
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
            await this.fetchAnterior(this.cache[this.currentEndPointer - 1]);
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

    private async fetchAnterior(after: number) {
        try {
            const doubleTimespan = 2 * (this.cache[this.currentEndPointer - 1] - this.cache[1]);
            const result = await this.loader(after, after + doubleTimespan);
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

    private async fetchPrior(before: number) {
        try {
            const doubleTimespan = 2 * (this.cache[this.currentEndPointer - 1] - this.cache[1]);
            const result = await this.loader(before - doubleTimespan, before);
            const newCache = new Int32Array(this.cache.length + result.length);
            newCache.set(result, 0);
            newCache.set(this.cache, result.length);
            this.cache = newCache;
            this.currentEndPointer += result.length;
            this.updateExtremaFrom(result);
        } catch (e) {
            throw new Error(`Error fetching anterior data: ${e}`);
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
        for (let i = 1; i < this.cache.length; i += 2) {
            if (soughtIndex < this.cache[i]) {
                return i - 1;
            }
        }
        return this.cache.length - 2;
    }

    private findIndexInCacheBinary(soughtIndex: number, listStart = 0, listStop: number = (this.currentEndPointer / 2)): number {
        if (listStop - listStart === 1) {
            return listStart;
        } else {
            const middle = Math.floor((listStop + listStart) / 2);
            const val = this.cache[middle * 2 + 1];
            if (val > soughtIndex) {
                return this.findIndexInCacheBinary(soughtIndex, listStart, middle);
            } else if (val < soughtIndex) {
                return this.findIndexInCacheBinary(soughtIndex, middle, listStop);
            } else {
                return middle;
            }
        }
    }
}

export default Timeseries;