export class VelorateError extends Error {
    constructor(message: string) {
        super(message);

        this.name = "VelorateError";

        Object.setPrototypeOf(this, new.target.prototype);
    }
}