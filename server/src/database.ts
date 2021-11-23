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
            connectTimeout: 30000,
        });
        await dbConnection.query("CREATE DATABASE IF NOT EXISTS `climate`;");
        dbConnection.changeUser({database: "climate"});
        await dbConnection.query(`CREATE TABLE IF NOT EXISTS \`snapshots\` (
            \`id\` INT AUTO_INCREMENT PRIMARY KEY, 
            \`temp\` INT NOT NULL,
            \`humidity\` INT NOT NULL,
            \`co2\` INT NOT NULL,
            \`time\` DATETIME NOT NULL);`
        );
    } catch (e) {
        throw new Error(`Error setting up the database: ${e.message}`);
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