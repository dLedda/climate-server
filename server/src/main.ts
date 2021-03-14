import dotenv from "dotenv";
import express from "express";
import {newMainRouter} from "./mainRouter";
import {setupCollections} from "./Collections";
import path from "path";
import {startSensorPinger} from "./pingSensors";

dotenv.config();
const SERVER_ROOT = process.env.SERVER_ROOT ?? "/";

async function main() {
    try {
        const collections = await setupCollections();
        const mainRouter = newMainRouter(collections);
        const app = express();
        app.use(express.json());
        app.set("port", process.env.PORT || 3000);
        app.use(express.urlencoded({ extended: false}));
        app.locals = {
            rootUrl: SERVER_ROOT,
        };
        app.set("view-engine", "ejs");
        app.set("views", path.resolve(__dirname + "/../static"));
        app.use(SERVER_ROOT + "/static", express.static(path.resolve(__dirname + "/../static")));
        app.use(SERVER_ROOT, mainRouter);
        app.listen(app.get("port"), () => {
            console.log("ClayPI running on http://localhost:%d", app.get("port"));
        });
        startSensorPinger();
    } catch (e) {
        throw new Error(`Problem setting up the server: ${e.message}`);
    }
}

main();

