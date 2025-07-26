const jwt = require('jsonwebtoken');
const secret = 'supersecret';

module.exports = function(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).send('No or bad token');
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(403).send('Invalid token: ' + e.message);
  }
};
