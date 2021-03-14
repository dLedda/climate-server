import {DataValidationError} from "./errors";

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