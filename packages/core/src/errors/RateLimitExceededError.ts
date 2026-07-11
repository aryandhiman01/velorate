import { VelorateError } from "./VelorateError.js";

export class RateLimitExceededError extends VelorateError {
    constructor(message = "Rate limit exceeded") {
        super(message);
        
        this.name = "RateLimitExceededError";
    }
}