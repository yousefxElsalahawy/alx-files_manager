#!/usr/bin/node

const { MongoClient } = require('mongodb');
const mongodb = require('mongodb');
const { hashPassword } = require('./utils');

class DatabaseClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    this.dbName = process.env.DB_DATABASE || 'files_manager';
    const connectionString = `mongodb://${host}:${port}`;
    this.isConnected = false;
    this.mongoClient = new MongoClient(connectionString, { useUnifiedTopology: true });

    this.mongoClient.connect()
      .then(() => {
        this.isConnected = true;
      })
      .catch((error) => console.error(error.message));
  }

  isAlive() {
    return this.isConnected;
  }

  async countUsers() {
    await this.mongoClient.connect();
    const userCount = await this.mongoClient.db(this.dbName).collection('users').countDocuments();
    return userCount;
  }

  async countFiles() {
    await this.mongoClient.connect();
    const fileCount = await this.mongoClient.db(this.dbName).collection('files').countDocuments();
    return fileCount;
  }

  async addUser(email, password) {
    const encryptedPassword = hashPassword(password);
    await this.mongoClient.connect();
    const newUser = await this.mongoClient.db(this.dbName).collection('users').insertOne({ email, password: encryptedPassword });
    return newUser;
  }

  async findUserByEmail(email) {
    await this.mongoClient.connect();
    const user = await this.mongoClient.db(this.dbName).collection('users').find({ email }).toArray();
    return user.length ? user[0] : null;
  }

  async findUserById(id) {
    const objectId = new mongodb.ObjectID(id);
    await this.mongoClient.connect();
    const user = await this.mongoClient.db(this.dbName).collection('users').find({ _id: objectId }).toArray();
    return user.length ? user[0] : null;
  }

  async doesUserExist(email) {
    const user = await this.findUserByEmail(email);
    return !!user;
  }
}

const databaseClient = new DatabaseClient();
module.exports = databaseClient;