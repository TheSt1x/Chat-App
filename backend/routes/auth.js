const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
// const User = require('../models/User');

const router = express.Router();
const secret = process.env.JWT_SECRET || 'supersecret';
const refreshSecret = process.env.JWT_REFRESH_SECRET || 'refreshsecret';

function isStrongPassword(password) {
  return password.length >= 6;
}

router.post('/register', async (req, res) => {
  const { username, password, displayName, avatar, status } = req.body;
  if (!isStrongPassword(password)) return res.status(400).send('Пароль слишком короткий');
  try {
    const { data: exists } = await axios.get(`http://localhost:3001/users?username=${username}`);
    if (exists.length > 0) return res.status(400).send('User exists');
    const hashed = await bcrypt.hash(password, 10);
    await axios.post('http://localhost:3001/users', {
      username,
      password: hashed,
      displayName: displayName || username,
      avatar: avatar || '',
      status: status || 'Онлайн'
    });
    res.sendStatus(201);
  } catch (e) {
    res.status(500).send('Ошибка регистрации');
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const { data: users } = await axios.get(`http://localhost:3001/users?username=${username}`);
    if (users.length === 0) return res.status(400).send('User not found');
    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).send('Wrong password');
    const token = jwt.sign({ username }, secret, { expiresIn: '1d' });
    const refreshToken = jwt.sign({ username }, refreshSecret, { expiresIn: '7d' });
    res.json({ token, refreshToken });
  } catch (e) {
    res.status(500).send('Ошибка входа');
  }
});

// Получить профиль пользователя по username
router.get('/profile/:username', async (req, res) => {
  try {
    const { data: users } = await axios.get(`http://localhost:3001/users?username=${req.params.username}`);
    if (users.length === 0) return res.status(404).send('User not found');
    const { password, ...profile } = users[0];
    res.json(profile);
  } catch (e) {
    res.status(500).send('Ошибка получения профиля');
  }
});
// Обновить профиль пользователя (по username)
router.put('/profile/:username', async (req, res) => {
  try {
    const { data: users } = await axios.get(`http://localhost:3001/users?username=${req.params.username}`);
    if (users.length === 0) return res.status(404).send('User not found');
    const user = users[0];
    const update = req.body;
    await axios.patch(`http://localhost:3001/users/${user.id}`, update);
    res.sendStatus(200);
  } catch (e) {
    res.status(500).send('Ошибка обновления профиля');
  }
});

module.exports = router;
