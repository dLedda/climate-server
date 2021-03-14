export interface Snapshot {
    time: number | string,
    temp: number,
    co2: number,
    humidity: number,
    id: number,
}

export interface ISOSnapshot extends Snapshot {
    time: string,
}

export interface UnixTimeSnapshot extends Snapshot {
    time: number,
}