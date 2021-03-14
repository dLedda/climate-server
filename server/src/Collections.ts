import SnapshotCollection from "./SnapshotCollection";
import {establishDatabaseConnection} from "./database";

export interface CollectionRegistry {
    snapshots: SnapshotCollection
}

export async function setupCollections(): Promise<CollectionRegistry> {
    const dbConnection = await establishDatabaseConnection();
    return {
        snapshots: new SnapshotCollection(dbConnection),
    };
}