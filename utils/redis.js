import { promisify } from 'util';
import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient();
    this.isClientConnected = true;

    this.client.on('error', (err) => {
      console.error('Redis client failed to connect:', err.message || err.toString());
      this.isClientConnected = false;
    });

    this.client.on('connect', () => {
      this.isClientConnected = true;
    });
  }

  isAlive() {
    return this.isClientConnected;
  }

  async get(key) {
    if (!this.isAlive()) {
      throw new Error('Redis client is not connected');
    }

    try {
      const getAsync = promisify(this.client.get).bind(this.client);
      return await getAsync(key);
    } catch (err) {
      console.error('Error getting key:', err);
      throw err;
    }
  }

  async set(key, value, duration) {
    if (!this.isAlive()) {
      throw new Error('Redis client is not connected');
    }

    try {
      const setAsync = promisify(this.client.setex).bind(this.client);
      await setAsync(key, duration, value);
    } catch (err) {
      console.error('Error setting key:', err);
      throw err;
    }
  }

  async del(key) {
    if (!this.isAlive()) {
      throw new Error('Redis client is not connected');
    }

    try {
      const delAsync = promisify(this.client.del).bind(this.client);
      await delAsync(key);
    } catch (err) {
      console.error('Error deleting key:', err);
      throw err;
    }
  }
}

export const redisClient = new RedisClient();
export default redisClient;
