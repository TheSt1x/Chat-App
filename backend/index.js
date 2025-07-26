const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const http = require('http');
const axios = require('axios');
const jsonwebtoken = require('jsonwebtoken');

const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });


const uploadRoute = require('./routes/upload');

// Разрешить отдачу статики
app.use('/uploads', express.static('uploads'));
// Подключить маршрут загрузки
app.use('/upload', uploadRoute);

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);


let users = {};

const sanitize = (str) => str.replace(/[<>]/g, '');

io.on('connection', (socket) => {
  let username = '';
  // Проверка токена
  const token = socket.handshake.auth?.token;
  try {
    if (!token) throw new Error('Нет токена');
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET || 'supersecret');
    username = decoded.username;
  } catch (e) {
    socket.disconnect();
    return;
  }
  users[socket.id] = username;
  console.log('Connected', socket.id);

  socket.on('joinGroup', async ({ groupId }) => {
    socket.join(groupId);

    // Получаем историю сообщений из json-server
    try {
      const { data: history } = await axios.get(`http://localhost:3001/messages?groupId=${groupId}&_sort=timestamp&_order=asc&_limit=100`);
      socket.emit('chatHistory', history);
    } catch (e) {
      socket.emit('chatHistory', []);
    }

    io.to(groupId).emit('userJoined', `${username} joined`);
  });

  socket.on('sendMessage', async ({ groupId, message }) => {
    const msg = {
      groupId,
      text: sanitize(message.text),
      sender: username,
      timestamp: new Date().toISOString(),
      type: message.type || 'text',
      filename: message.filename || null,
      mimetype: message.mimetype || null
    };
    // Сохраняем сообщение через json-server
    try {
      const { data: savedMsg } = await axios.post('http://localhost:3001/messages', msg);
      io.to(groupId).emit('newMessage', savedMsg);
    } catch (e) {
      socket.emit('error', 'Ошибка отправки сообщения');
    }
  });

  socket.on('editMessage', async ({ messageId, newText, groupId }) => {
    try {
      // Получаем сообщение
      const { data: msgs } = await axios.get(`http://localhost:3001/messages?id=${messageId}`);
      if (!msgs.length) return;
      const msg = msgs[0];
      if (msg.sender !== username) return; // Только автор может редактировать
      await axios.patch(`http://localhost:3001/messages/${messageId}`, {
        text: sanitize(newText),
        edited: true
      });
      // Получаем обновлённое сообщение
      const { data: updatedMsg } = await axios.get(`http://localhost:3001/messages/${messageId}`);
      io.to(groupId).emit('messageEdited', updatedMsg);
    } catch (e) {
      socket.emit('error', 'Ошибка редактирования сообщения');
    }
  });

  socket.on('deleteMessage', async ({ messageId, groupId }) => {
    try {
      const { data: msgs } = await axios.get(`http://localhost:3001/messages?id=${messageId}`);
      if (!msgs.length) return;
      const msg = msgs[0];
      if (msg.sender !== username) return; // Только автор может удалять
      await axios.patch(`http://localhost:3001/messages/${messageId}`, {
        text: '',
        deleted: true
      });
      const { data: updatedMsg } = await axios.get(`http://localhost:3001/messages/${messageId}`);
      io.to(groupId).emit('messageDeleted', updatedMsg);
    } catch (e) {
      socket.emit('error', 'Ошибка удаления сообщения');
    }
  });

  socket.on('addReaction', async ({ messageId, emoji, groupId }) => {
    try {
      const { data: msgs } = await axios.get(`http://localhost:3001/messages?id=${messageId}`);
      if (!msgs.length) return;
      const msg = msgs[0];
      let reactions = Array.isArray(msg.reactions) ? msg.reactions : [];
      // Проверяем, есть ли уже реакция от этого пользователя с этим emoji
      const existing = reactions.find(r => r.user === username && r.emoji === emoji);
      if (!existing) {
        reactions.push({ user: username, emoji });
      } else {
        reactions = reactions.filter(r => !(r.user === username && r.emoji === emoji));
      }
      await axios.patch(`http://localhost:3001/messages/${messageId}`, { reactions });
      const { data: updatedMsg } = await axios.get(`http://localhost:3001/messages/${messageId}`);
      io.to(groupId).emit('messageReacted', updatedMsg);
    } catch (e) {
      socket.emit('error', 'Ошибка добавления реакции');
    }
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
  });
});

server.listen(3000, () => console.log('Backend on http://localhost:3000'));
