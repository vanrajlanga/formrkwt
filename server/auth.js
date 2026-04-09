const crypto = require('crypto');

const ADMIN_USER = process.env.ADMIN_USER || 'superadmin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'pass1234';

// In-memory token store. Tokens expire after 24h.
const tokens = new Map();
const TOKEN_TTL = 24 * 60 * 60 * 1000;

function createToken() {
  const token = crypto.randomBytes(32).toString('hex');
  tokens.set(token, Date.now() + TOKEN_TTL);
  return token;
}

function isValidToken(token) {
  if (!token) return false;
  const expiry = tokens.get(token);
  if (!expiry) return false;
  if (Date.now() > expiry) {
    tokens.delete(token);
    return false;
  }
  return true;
}

function login(username, password) {
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return createToken();
  }
  return null;
}

function requireAuth(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : req.query.token;
  if (!isValidToken(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

module.exports = { login, requireAuth };
