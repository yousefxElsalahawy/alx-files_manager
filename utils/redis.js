// utils/redis.js

import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
    #client;
    #isConnected;

    constructor() {
        this.#client = createClient();
        this.#isConnected = false;

        // Handle connection errors
        this.#client.on('error', (error) => {
            console.error(`Redis Client Error: ${error.message}`);
        });

        // Set connection state
        this.#client.on('connect', () => {
            this.#isConnected = true;
        });
    }

    // Check connection status
    isAlive() {
        return this.#isConnected;
    }

    // Retrieve a value by key
    async getValue(key) {
        const asyncGet = promisify(this.#client.get).bind(this.#client);
        try {
            return await asyncGet(key);
        } catch (error) {
            console.error(`Error fetching key ${key}: ${error.message}`);
            return null;
        }
    }

    // Set a key with a value and expiration time
    async setValue(key, value, ttl) {
        const asyncSet = promisify(this.#client.set).bind(this.#client);
        try {
            await asyncSet(key, value, 'EX', ttl);
        } catch (error) {
            console.error(`Error setting key ${key}: ${error.message}`);
        }
    }

    // Delete a key
    async deleteKey(key) {
        const asyncDel = promisify(this.#client.del).bind(this.#client);
        try {
            await asyncDel(key);
        } catch (error) {
            console.error(`Error deleting key ${key}: ${error.message}`);
        }
    }
}

const redisClient = new RedisClient();
export default redisClient;
