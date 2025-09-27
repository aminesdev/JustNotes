// src/config/redis.js
import { Redis } from "@upstash/redis";

const client = Redis.fromEnv();

export default client;
