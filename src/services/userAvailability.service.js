import redis from "../config/redis.js";
import { User } from "../models/users/user.model.js";

const USERNAME_TTL = 60 * 5;

export const checkUsernameAvailability = async (username) => {
  username = username.toLowerCase().trim();
  const key = `username:taken:${username}`;
  const existsInCache = await redis.exists(key);
  if (existsInCache) {
    return false;
  }
  const existsInDB = !!(await User.exists({ username }));
  if (existsInDB) {
    await redis.set(key, "1", "EX", USERNAME_TTL);
    return false;
  }
  return true;
};
