import {Connection, ResultSetHeader, RowDataPacket} from "mysql2/promise";
import {Snapshot, ISOSnapshot} from "./Snapshot";
import {isValidDatetime, toISOTime, toMySQLDatetime, toUnixTime} from "./utils";
import {DatabaseConnection, tryQuery} from "./database";

class SnapshotCollection {
    private readonly db: Connection;

    constructor(db: DatabaseConnection) {
        this.db = db;
    }

    async insertSnapshots(...snapshots: Omit<Snapshot, "id">[]) {
        return tryQuery(async () => {
            const query = "INSERT INTO `snapshots` (`time`, `co2`, `humidity`, `temp`) VALUES ?";
            const [resultSetHeader] = await this.db.query(query, [SnapshotCollection.toMySQLRows(...snapshots)]);
            return {
                affectedRows: (resultSetHeader as ResultSetHeader).affectedRows,
                insertId: (resultSetHeader as ResultSetHeader).insertId,
            };
        });
    }

    async getLatestSnapshot(): Promise<ISOSnapshot | null> {
        return tryQuery(async () => {
            const query = "SELECT `id`, DATE_FORMAT(`time`, '%Y-%m-%dT%TZ') `time`, `co2`, `humidity`, `temp` FROM `snapshots` ORDER BY `id` DESC LIMIT 1;";
            const [rows] = await this.db.query(query);
            if ((rows as RowDataPacket[]).length === 0) {
                return null;
            } else {
                return SnapshotCollection.rowsToSnapshots(...(rows as RowDataPacket[]))[0];
            }
        });
    }

    async getSnapshotsInRange(start: number | string, stop: number | string): Promise<ISOSnapshot[]> {
        start = toMySQLDatetime(start);
        stop = toMySQLDatetime(stop);
        return tryQuery(async () => {
            const query = "SELECT `id`, DATE_FORMAT(`time`, '%Y-%m-%dT%TZ') `time`, `co2`, `humidity`, `temp` FROM `snapshots` WHERE `time` BETWEEN ? AND ? ORDER BY `id` DESC;";
            const [rows] = await this.db.query(query, [start, stop]);
            return SnapshotCollection.rowsToSnapshots(...(rows as RowDataPacket[]));
        });
    }

    async getSnapshotsSince(timeSince: number | string): Promise<ISOSnapshot[]> {
        timeSince = toMySQLDatetime(timeSince);
        return tryQuery(async () => {
            const query = "SELECT `id`, DATE_FORMAT(`time`, '%Y-%m-%dT%TZ') `time`, `co2`, `humidity`, `temp` FROM `snapshots` WHERE TIMESTAMPDIFF(SECOND, `time`, ?) < 0 ORDER BY `id` DESC;";
            const [rows] = await this.db.query(query, [timeSince]);
            return SnapshotCollection.rowsToSnapshots(...(rows as RowDataPacket[]));
        });
    }

    static toUnixTime<T extends {time: string | number}>(...snapshots: T[]): (T & {time: number})[] {
        return snapshots.map(s => ({...s, time: toUnixTime(s.time)}));
    }

    static toISOTime<T extends {time: string | number}>(...snapshots: T[]): (T & {time: string})[] {
        return snapshots.map(s => ({...s, time: toISOTime(s.time)}));
    }

    private static toMySQLRows(...snapshots: Omit<Snapshot, "id">[]): (number | string | Date)[][] {
        return snapshots.map(s => [new Date(s.time), s.co2, s.humidity, s.temp]);
    }

    static isSubmissibleSnapshot(potentialSnapshot: Record<string, unknown>): potentialSnapshot is Omit<Snapshot, "id"> {
        return typeof potentialSnapshot.temp === "number"
            && typeof potentialSnapshot.co2 === "number"
            && typeof potentialSnapshot.humidity === "number"
            && (typeof potentialSnapshot.time === "number"
                || typeof potentialSnapshot.time === "string" && isValidDatetime(potentialSnapshot.time));
    }

    private static rowsToSnapshots(...rows: RowDataPacket[]): ISOSnapshot[] {
        return rows.map(row => ({
            id: row.id,
            temp: row.temp,
            co2: row.co2,
            humidity: row.humidity,
            time: row.time,
        }));
    }
}

export default SnapshotCollection;