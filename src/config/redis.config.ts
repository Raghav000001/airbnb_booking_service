import {Redis} from "ioredis"
import Redlock from "redlock";
import { serverConfig } from "./index.ts"

const redisClient = new Redis(serverConfig.REDIS_URL)

const redlock = new Redlock([redisClient],{
    driftFactor: 0.01,
    retryCount:10,
    retryDelay: 200,
    retryJitter: 200,
})

export { 
    redisClient,
    redlock
}
