import {ISOSnapshot} from "./Snapshot";
import {exec} from "child-process-promise";
import path from "path";
import fetch from "node-fetch";
import {ClayPIError} from "./errors";

async function pingSensors(): Promise<Omit<ISOSnapshot, "id">> {
    try {
        const process = await exec(`python3 ${path.resolve(__dirname + "/../scripts/pinger-test.py")}`);
        const result = process.stdout;
        const snapshotArray = result.split("\t").map(piece => piece.trim());
        return {
            time: snapshotArray[1],
            temp: Number(snapshotArray[3]),
            humidity: Number(snapshotArray[5]),
            co2: Number(snapshotArray[7]),
        };
    } catch (err) {
        throw new ClayPIError(
            `Could not generate a new snapshot: Python error: ${err}. Have you installed python 3 and the necessary requirements?`,
            "Could not generate a new snapshot."
        );
    }
}

async function submitToServer(snapshot: Omit<ISOSnapshot, "id">) {
    await fetch(`http://localhost:${process.env.PORT}${process.env.SERVER_ROOT}/api/snapshots`, {
        method: "POST",
        body: JSON.stringify({ snapshots: [snapshot] }),
        headers: {
            "Content-type": "application/json"
        }
    });
}

export function startSensorPinger() {
    const createAndSubmitNewSnapshot = async () => {
        try {
            await submitToServer(await pingSensors());
        } catch (e) {
            console.log(e);
        }
    };
    createAndSubmitNewSnapshot();
    setInterval(createAndSubmitNewSnapshot, (Number(process.env.SENSOR_PING_INTERVAL) ?? 30) * 1000);
}