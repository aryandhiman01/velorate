import { VelorateError } from "./VelorateError.js";

export class InvalidConfigurationError extends VelorateError {
    constructor(message: string) {
        super(message);

        this.name = "InvalidConfigurationError";
    }
}