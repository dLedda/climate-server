export class ClayPIError extends Error {
    displayMessage: string;
    constructor(message: string, displayMessage?: string) {
        super(message);
        this.name = "ClayPIError";
        this.displayMessage = displayMessage ?? message;
    }
}

export class GenericPersistenceError extends ClayPIError {
    constructor(message: string, displayMessage: string) {
        super(message, displayMessage);
        this.name = "GenericPersistenceError";
    }
}

export class DataValidationError extends ClayPIError {
    constructor(message: string) {
        super(message);
        this.name = "DataValidationError";
    }
}