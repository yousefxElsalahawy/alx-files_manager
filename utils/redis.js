#!/usr/bin/node

const { createClient } = require('redis');
const { promisify } = require('util');

class CacheClient {
  constructor() {
    this.redisClient = createClient();
    this.redisClient.on('error', (error) => console.error(error));
    this.isConnected = false;
    this.redisClient.on('connect', () => {
      this.isConnected = true;
    });
  }

  isAlive() {
    return this.isConnected;
  }

  async fetch(key) {
    const asyncGet = promisify(this.redisClient.get).bind(this.redisClient);
    const value = await asyncGet(key);
    return value;
  }

  async store(key, value, duration) {
    const asyncSet = promisify(this.redisClient.set).bind(this.redisClient);
    await asyncSet(key, value, 'EX', duration);
  }

  async remove(key) {
    const asyncDel = promisify(this.redisClient.del).bind(this.redisClient);
    await asyncDel(key);
  }
}

const cacheClient = new CacheClient();

module.exports = cacheClient;