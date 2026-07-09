export interface RateLimitState {
    // Number of requests made in the current window.
    count: number;

    // Timestamp (in milliseconds) when the current window resets.
    resetAt: number;
}