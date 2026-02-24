import { Redis } from "ioredis";
import { loadConfig } from "./loadConfig.js";

const secrets = await loadConfig();

const redis = new Redis({
  host: secrets.REDIS_HOST,
  port: Number(secrets.REDIS_PORT),
  username: secrets.REDIS_USERNAME,
  password: secrets.REDIS_PASSWORD,
});

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("error", (err) => {
  console.error("Redis error", err);
});

export default redis;
