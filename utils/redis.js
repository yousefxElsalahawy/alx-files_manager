#!/usr/bin/node

const { createClient } = require('redis');
const { promisify } = require('util');

class CacheClient {
  constructor() {
    this.redisClient = createClient();
    this.isConnected = false;

    // Handle connection events
    this.redisClient.on('error', (error) => console.error(error));
    this.redisClient.on('connect', () => {
      this.isConnected = true;
    });
  }

  isAlive() {
    return this.isConnected;
  }

  async getValue(key) {
    const asyncGet = promisify(this.redisClient.get).bind(this.redisClient);
    const value = await asyncGet(key);
    return value;
  }

  async setValue(key, value, duration) {
    const asyncSet = promisify(this.redisClient.set).bind(this.redisClient);
    await asyncSet(key, value, 'EX', duration);
  }

  async deleteValue(key) {
    const asyncDelete = promisify(this.redisClient.del).bind(this.redisClient);
    await asyncDelete(key);
  }
}

const cacheClient = new CacheClient();

module.exports = cacheClient;