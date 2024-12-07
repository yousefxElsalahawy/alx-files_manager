#!/usr/bin/node

const sha1 = require('sha1');

export const hashPassword = (password) => sha1(password);

export const extractAuthorizationHeader = (request) => {
  const authorizationHeader = request.headers.authorization;
  return authorizationHeader || null;
};

export const extractToken = (authorizationHeader) => {
  const prefix = authorizationHeader.substring(0, 6);
  if (prefix !== 'Basic ') {
    return null;
  }
  return authorizationHeader.substring(6);
};

export const parseToken = (token) => {
  const decoded = Buffer.from(token, 'base64').toString('utf8');
  return decoded.includes(':') ? decoded : null;
};

export const retrieveCredentials = (decoded) => {
  const [email, password] = decoded.split(':');
  return email && password ? { email, password } : null;
};