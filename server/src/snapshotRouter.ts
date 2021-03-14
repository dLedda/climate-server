import {Snapshot} from "./Snapshot";
import SnapshotCollection from "./SnapshotCollection";
import express, {Router} from "express";
import {CollectionRegistry} from "./Collections";
import {ClayPIError} from "./errors";
import {toMySQLDatetime} from "./utils";

function newSnapshotRouter(collections: CollectionRegistry) {
    const router = Router();

    router.use(unixTimeParamMiddleware);

    router.get("", async (req, res) => {
        const query = req.query as Record<string, string>;
        const isMinutesQuery = typeof query["last-minutes"] !== "undefined" && !query.from && !query.to;
        const isFromToQuery = typeof query.from !== "undefined";
        let snapshots: Snapshot[] = [];
        let timeFormat = res.locals.timeFormat;
        if (!isMinutesQuery && !isFromToQuery) {
            if (query.to) {
                throw new ClayPIError("The parameter 'to' must always be accompanied by a 'from'.");
            }
            snapshots = await collections.snapshots.getSnapshotsSince(new Date().getTime() - 60 * 60000);
        } else if (isMinutesQuery) {
            const lastMinutes = Math.floor(Number(query["last-minutes"]));
            if (isNaN(lastMinutes)) {
                throw new ClayPIError("The parameter 'last-minutes' must be a number.");
            } else {
                snapshots = await collections.snapshots.getSnapshotsSince(new Date().getTime() - lastMinutes * 60000);
            }
        } else if (isFromToQuery) {
            const timeFrom = isNaN(Number(query.from)) ? query.from : Number(query.from);
            const timeTo = isNaN(Number(query.to)) ? query.to : Number(query.to);
            if (timeTo) {
                if (!timeFormat && typeof timeFrom === typeof timeTo) {
                    timeFormat = typeof timeFrom === "string" ? "iso" : "unix";
                }
                snapshots = await collections.snapshots.getSnapshotsInRange(timeFrom, timeTo);
            } else {
                snapshots = await collections.snapshots.getSnapshotsSince(timeFrom);
            }
        } else {
            throw new ClayPIError("Malformed request.");
        }
        if (timeFormat === "unix") {
            snapshots = SnapshotCollection.toUnixTime(...snapshots);
        } else if (timeFormat === "iso") {
            snapshots = SnapshotCollection.toISOTime(...snapshots);
        }
        res.send({snapshots});
    });

    router.get("/latest", async (req, res) => {
        let snapshot;
        snapshot = await collections.snapshots.getLatestSnapshot();
        if (!snapshot) {
            res.send({snapshots: []});
        } else {
            if (res.locals.timeFormat === "unix") {
                snapshot = SnapshotCollection.toUnixTime(...[snapshot])[0];
            } else if (res.locals.timeFormat === "iso") {
                snapshot = SnapshotCollection.toISOTime(...[snapshot])[0];
            }
            res.send({snapshots: [snapshot]});
        }
    });

    router.post("/", async (req, res) => {
        const goodRequest = req.body.snapshots
            && req.body.snapshots.length === 1
            && SnapshotCollection.isSubmissibleSnapshot(req.body.snapshots[0]);
        if (!goodRequest) {
            throw new ClayPIError("The request must contain the property 'snapshots' as an array with exactly one snapshot.");
        } else {
            const result = await collections.snapshots.insertSnapshots(req.body.snapshots[0]);
            res.send({message: "Success!", ...result});
        }
    });

    return router;
}

const unixTimeParamMiddleware: express.Handler = (req, res, next) => {
    const timeFormat = req.query.timeFormat;
    if (typeof timeFormat !== "undefined" && timeFormat !== "iso" && timeFormat !== "unix") {
        throw new ClayPIError("Parameter 'timeFormat' must be either 'iso' or 'unix'");
    } else {
        res.locals.timeFormat = timeFormat;
        next();
    }
};

export default newSnapshotRouter;