import {Router} from "express";
import {CollectionRegistry} from "./Collections";
import {ClayPIError} from "./errors";
import {ClimateDataType, SnapshotAttrTimeseries} from "./Snapshot";

function newByteSeriesRouter(collections: CollectionRegistry) {
    const router = Router();

    router.get("/:dataType", async (req, res) => {
        const query = req.query as Record<string, string>;
        const isMinutesQuery = typeof query["last-minutes"] !== "undefined" && !query.from && !query.to;
        const isFromToQuery = typeof query.from !== "undefined";
        const dataType = req.params.dataType;
        if (!isValidDataType(dataType)) {
            throw new ClayPIError(`The parameter 'data-type' must be one of the following: 'temp', 'humidity', 'co2'. Got: ${dataType}`);
        }
        let timeseries: SnapshotAttrTimeseries;
        if (!isMinutesQuery && !isFromToQuery) {
            if (query.to) {
                throw new ClayPIError("The parameter 'to' must always be accompanied by a 'from'.");
            }
            timeseries = await collections.snapshots.getTimeseriesBytestreamSince(dataType, new Date().getTime() - 60 * 60000);
        } else if (isMinutesQuery) {
            const lastMinutes = Math.floor(Number(query["last-minutes"]));
            if (isNaN(lastMinutes)) {
                throw new ClayPIError("The parameter 'last-minutes' must be a number.");
            } else {
                timeseries = await collections.snapshots.getTimeseriesBytestreamSince(dataType, new Date().getTime() - lastMinutes * 60000);
            }
        } else if (isFromToQuery) {
            const timeFrom = isNaN(Number(query.from)) ? query.from : Number(query.from);
            const timeTo = isNaN(Number(query.to)) ? query.to : Number(query.to);
            if (timeTo) {
                timeseries = await collections.snapshots.getTimeseriesBytestreamInRange(dataType, timeFrom, timeTo);
            } else {
                timeseries = await collections.snapshots.getTimeseriesBytestreamSince(dataType, timeFrom);
            }
        } else {
            throw new ClayPIError("Malformed request.");
        }
        res.type("application/octet-stream");
        res.end(Buffer.from(timeseries.buffer), "binary");
    });

    return router;
}

function isValidDataType(dataType: string | undefined): dataType is ClimateDataType {
    return typeof dataType !== "undefined" && (dataType === "temp" || dataType === "humidity" || dataType === "co2");
}

export default newByteSeriesRouter;