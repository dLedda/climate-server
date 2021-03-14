import {AppStore} from "./StateStore";

type ListCacheLoader<I, D> = (start: I, stop: I) => Promise<D[]>;
type ListCacheComparator<I, D> = (data: D, index: I) => -1 | 1 | 0;

class ListCache<IndexType, DataType> {
    private cache: DataType[];
    private loader: ListCacheLoader<IndexType, DataType>;
    private comparator: ListCacheComparator<IndexType, DataType>;

    constructor(loader: ListCacheLoader<IndexType, DataType>, comparator: ListCacheComparator<IndexType, DataType>) {
        this.cache = [];
        this.loader = loader;
        this.comparator = comparator;
    }

    getCache() {
        return this.cache;
    }

    async snapshotsBetween(start: IndexType, stop: IndexType): Promise<DataType[]> {
        return this.cachedBetween(start, stop);
    }

    async updateFromWindow(start: IndexType, stop: IndexType) {
        if (!this.cacheValidForWindow(start, stop)) {
            await this.fetchMissingElementsBetween(start, stop);
        }
    }

    private cacheValidForWindow(start: IndexType, stop: IndexType) {
        if (this.cache.length > 0) {
            return this.comparator(this.cache[0], start) !== 1
                && this.comparator(this.cache[this.cache.length - 1], stop) !== -1;
        } else {
            return false;
        }
    }

    private async fetchMissingElementsBetween(start: IndexType, stop: IndexType) {
        AppStore().addLoad();
        this.cache = await this.loader(start, stop);
        AppStore().finishLoad();
    }

    private cachedBetween(start: IndexType, stop: IndexType): DataType[] {
        if (this.cache.length <= 0) {
            return [];
        } else {
            return this.cache.slice(
                this.findIndexInCache(start),
                this.findIndexInCache(stop)
            );
        }
    }

    private findIndexInCache(soughtVal: IndexType, listStart = 0, listStop: number = this.cache.length): number {
        if (listStop - listStart === 1) {
            return listStart;
        } else {
            const middle = Math.floor((listStop + listStart) / 2);
            const comparison = this.comparator(this.cache[middle], soughtVal);
            if (comparison === 1) {
                return this.findIndexInCache(soughtVal, listStart, middle);
            } else if (comparison === -1) {
                return this.findIndexInCache(soughtVal, middle, listStop);
            } else {
                return middle;
            }
        }
    }
}

export default ListCache;