import { Redis } from "ioredis";
import type { RedisClientOptions } from "./types.js";

export function createRedisClient(options?: RedisClientOptions) {
    if (options === undefined) {
        return new Redis();
    }
    return new Redis(options);
}