export class ClayPIDashboardError extends Error {
    displayMessage: string;
    constructor(message: string, displayMessage?: string) {
        super(message);
        this.name = "ClayPIError";
        this.displayMessage = displayMessage ?? message;
    }
}
