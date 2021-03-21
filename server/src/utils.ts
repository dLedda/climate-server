import {ClayPIError, DataValidationError} from "./errors";
import express from "express";

export function toMySQLDatetime(datetime: number | string) {
    try {
        return new Date(datetime).toISOString().slice(0, 19).replace("T", " ");
    } catch (e) {
        throw new DataValidationError(`Bad datetime value: ${datetime}`);
    }
}

export function isValidDatetime(datetime: string) {
    try {
        new Date(datetime);
        return true;
    } catch (e) {
        return false;
    }
}

export function toUnixTime(datetime: string | number) {
    return new Date(datetime).getTime();
}

export function toISOTime(datetime: string | number) {
    return new Date(datetime).toISOString();
}

export const unixTimeParamMiddleware: express.Handler = (req, res, next) => {
    const timeFormat = req.query.timeFormat;
    if (typeof timeFormat !== "undefined" && timeFormat !== "iso" && timeFormat !== "unix") {
        throw new ClayPIError("Parameter 'timeFormat' must be either 'iso' or 'unix'");
    } else {
        res.locals.timeFormat = timeFormat;
        next();
    }
};