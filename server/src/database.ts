import mysql from "mysql2/promise";
import {GenericPersistenceError} from "./errors";

export type DatabaseConnection = mysql.Connection;

export async function establishDatabaseConnection() {
    let dbConnection;
    try {
        dbConnection = await mysql.createConnection({
            host: process.env.MYSQL_ADDRESS,
            user: process.env.MYSQL_USERNAME,
            password: process.env.MYSQL_PW,
            database: "climate",
            connectTimeout: 30000,
        });
    } catch (e) {
        throw new Error(`Couldn't establish a connection with the database: ${e.message}`);
    }
    return dbConnection;
}

export async function tryQuery<T>(cb: () => Promise<T>): Promise<T> {
    try {
        return await cb();
    } catch (err) {
        throw new GenericPersistenceError(err.message, "There was an error querying the database.");
    }
}