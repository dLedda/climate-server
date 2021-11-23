import express from "express";
import {ClayPIError, GenericPersistenceError} from "./errors";
import newSnapshotRouter from "./snapshotRouter";
import {CollectionRegistry} from "./Collections";
import newByteSeriesRouter from "./byteSeriesRouter";

export function newMainRouter(collections: CollectionRegistry) {
    const router = express.Router();

    router.get("/dashboard", (req, res) => {
        res.render("index.ejs", { rootUrl: req.app.locals.rootUrl });
    });
    router.use("/api/snapshots", newSnapshotRouter(collections));
    router.use("/api/timeseries", newByteSeriesRouter(collections));
    router.use(topLevelErrorHandler);

    return router;
}

const topLevelErrorHandler: express.ErrorRequestHandler = (err, req, res, next) => {
    const errOutput = {
        error: true,
        message: "",
    };
    if (err instanceof GenericPersistenceError) {
        errOutput.message = `An error occurred accessing the database: ${err.displayMessage}`;
    }
    else if (err instanceof ClayPIError) {
        errOutput.message = `An error occurred: ${err.displayMessage}`;
    }
    else {
        errOutput.message = "An unknown error occurred!";
    }
    console.log({...errOutput, internalMessage: err.message});
    res.status(500).send(errOutput);
};
