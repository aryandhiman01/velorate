// Configuration of a Rate Limiter
export interface RateLimitConfig {
    limit: number;  //Max number of requests allowed
    window: number;  //window duration in milliseconds
}