#!/usr/bin/node

const redis = require('../utils/redis');
const database = require('../utils/db');

class ApplicationController {
  static checkStatus(request, response) {
    const redisStatus = redis.isAlive();
    const dbStatus = database.isAlive();
    if (redisStatus && dbStatus) {
      response.json({ redis: redisStatus, db: dbStatus });
      response.end();
    }
  }

  static async fetchStats(request, response) {
    const userCount = await database.nbUsers();
    const fileCount = await database.nbFiles();
    response.json({ users: userCount, files: fileCount });
    response.end();
  }
}

module.exports = ApplicationController;