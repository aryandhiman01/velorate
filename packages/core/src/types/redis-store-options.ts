import type { Redis } from "ioredis";

export interface RedisStoreOptions {

    client: Redis;

    prefix?: string;

}