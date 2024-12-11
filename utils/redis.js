#!/usr/bin/node

const redis = require('redis');
const { promisify } = require('util');

class RedisHandler {
  constructor() {
    this.connection = redis.createClient();
    this.connection.on('error', (err) => console.error('Redis Error:', err));
    this.isConnected = false;
    this.connection.on('connect', () => {
      this.isConnected = true;
    });
  }

  isAlive() {
    return this.isConnected;
  }

  async fetch(key) {
    const asyncGet = promisify(this.connection.get).bind(this.connection);
    try {
      return await asyncGet(key);
    } catch (err) {
      console.error('Fetch Error:', err);
      return null;
    }
  }

  async store(key, value, expiry) {
    const asyncSet = promisify(this.connection.set).bind(this.connection);
    try {
      await asyncSet(key, value, 'EX', expiry);
    } catch (err) {
      console.error('Store Error:', err);
    }
  }

  async remove(key) {
    const asyncDel = promisify(this.connection.del).bind(this.connection);
    try {
      await asyncDel(key);
    } catch (err) {
      console.error('Remove Error:', err);
    }
  }
}

const redisHandlerInstance = new RedisHandler();

module.exports = redisHandlerInstance;