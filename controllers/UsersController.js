#!/usr/bin/node

const database = require('../utils/db');

class UserHandler {
  static async addNewUser(request, response) {
    const { email, password } = request.body;

    // Check for missing email
    if (!email) {
      response.status(400).json({ error: 'Missing email' });
      response.end();
      return;
    }

    // Check for missing password
    if (!password) {
      response.status(400).json({ error: 'Missing password' });
      response.end();
      return;
    }

    // Verify if user already exists
    const doesUserExist = await database.userExist(email);
    if (doesUserExist) {
      response.status(400).json({ error: 'Already exist' });
      response.end();
      return;
    }

    // Create new user
    const newUser = await database.createUser(email, password);
    const userId = `${newUser.insertedId}`;
    response.status(201).json({ id: userId, email });
    response.end();
  }
}

module.exports = UserHandler;