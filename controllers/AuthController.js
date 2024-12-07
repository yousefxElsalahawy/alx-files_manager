#!/usr/bin/node

const { v4: createUUID } = require('uuid');
const db = require('../utils/db');
const cache = require('../utils/redis');
const { extractAuthHeader, extractToken, hashPassword } = require('../utils/utils');
const { parseToken, retrieveCredentials } = require('../utils/utils');

class AuthenticationHandler {
  static async initiateConnection(request, response) {
    // Extract authorization header
    const authHeader = extractAuthHeader(request);
    if (!authHeader) {
      response.status(401).json({ error: 'Unauthorized' });
      response.end();
      return;
    }

    // Extract token from header
    const token = extractToken(authHeader);
    if (!token) {
      response.status(401).json({ error: 'Unauthorized' });
      response.end();
      return;
    }

    // Decode the token
    const decoded = parseToken(token);
    if (!decoded) {
      response.status(401).json({ error: 'Unauthorized' });
      response.end();
      return;
    }

    // Retrieve user credentials
    const { email, password } = retrieveCredentials(decoded);
    const user = await db.getUser(email);
    if (!user) {
      response.status(401).json({ error: 'Unauthorized' });
      response.end();
      return;
    }

    // Verify password
    if (user.password !== hashPassword(password)) {
      response.status(401).json({ error: 'Unauthorized' });
      response.end();
      return;
    }

    // Generate access token and store in cache
    const accessToken = createUUID();
    await cache.set(`auth_${accessToken}`, user._id.toString('utf8'), 60 * 60 * 24);
    response.json({ token: accessToken });
    response.end();
  }

  static async terminateConnection(request, response) {
    // Retrieve token from headers
    const token = request.headers['x-token'];
    if (!token) {
      response.status(401).json({ error: 'Unauthorized' });
      response.end();
      return;
    }

    // Get user ID from cache
    const userId = await cache.get(`auth_${token}`);
    if (!userId) {
      response.status(401).json({ error: 'Unauthorized' });
      response.end();
      return;
    }

    // Verify user existence
    const user = await db.getUserById(userId);
    if (!user) {
      response.status(401).json({ error: 'Unauthorized' });
      response.end();
      return;
    }

    // Remove token from cache
    await cache.del(`auth_${token}`);
    response.status(204).end();
  }

  static async fetchCurrentUser(request, response) {
    // Retrieve token from headers
    const token = request.headers['x-token'];
    if (!token) {
      response.status(401).json({ error: 'Unauthorized' });
      response.end();
      return;
    }

    // Get user ID from cache
    const userId = await cache.get(`auth_${token}`);
    if (!userId) {
      response.status(401).json({ error: 'Unauthorized' });
      response.end();
      return;
    }

    // Fetch user details
    const user = await db.getUserById(userId);
    if (!user) {
      response.status(401).json({ error: 'Unauthorized' });
      response.end();
      return;
    }

    // Respond with user information
    response.json({ id: user._id, email: user.email }).end();
  }
}

module.exports = AuthenticationHandler;