import { defineStore } from 'pinia';
import { io } from 'socket.io-client';
import axios from 'axios';

export const useChatStore = defineStore('chat', {
  state: () => ({
    socket: null,
    username: '',
    token: '',
    currentGroup: '',
    messages: [],
    editingMessage: null,
  }),
  actions: {
    async register(username, password) {
      if (password.length < 6) throw new Error('Пароль слишком короткий');
      await axios.post('http://localhost:3000/auth/register', { username, password });
    },
    async login(username, password) {
      try {
        const res = await axios.post('http://localhost:3000/auth/login', { username, password });
        this.token = res.data.token;
        this.username = username;
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.token;
      } catch (e) {
        throw new Error(e.response?.data || 'Ошибка входа');
      }
    },
    logout() {
      this.token = '';
      this.username = '';
      this.currentGroup = '';
      this.messages = [];
      delete axios.defaults.headers.common['Authorization'];
      if (this.socket) this.socket.disconnect();
    },
    connect() {
      if (!this.token) throw new Error('Нет токена');
      this.socket = io('http://localhost:3000', {
        auth: { token: this.token }
      });
      this.socket.on('chatHistory', (msgs) => {
        this.messages = msgs;
      });
      this.socket.on('newMessage', (msg) => {
        this.messages.push(msg);
      });
      this.socket.on('messageEdited', (updatedMsgArr) => {
        const updatedMsg = Array.isArray(updatedMsgArr) ? updatedMsgArr[0] : updatedMsgArr;
        const idx = this.messages.findIndex(m => m.id === updatedMsg.id);
        if (idx !== -1) {
          this.messages[idx] = { ...this.messages[idx], ...updatedMsg };
        }
      });
      this.socket.on('messageDeleted', (updatedMsgArr) => {
        const updatedMsg = Array.isArray(updatedMsgArr) ? updatedMsgArr[0] : updatedMsgArr;
        const idx = this.messages.findIndex(m => m.id === updatedMsg.id);
        if (idx !== -1) {
          this.messages[idx] = { ...this.messages[idx], ...updatedMsg };
        }
      });
      this.socket.on('messageReacted', (updatedMsgArr) => {
        const updatedMsg = Array.isArray(updatedMsgArr) ? updatedMsgArr[0] : updatedMsgArr;
        const idx = this.messages.findIndex(m => m.id === updatedMsg.id);
        if (idx !== -1) {
          this.messages[idx] = { ...this.messages[idx], ...updatedMsg };
        }
      });
      this.socket.on('connect_error', (err) => {
        alert('Ошибка соединения: ' + err.message);
      });
    },
    joinGroup(groupId) {
      if (!groupId) throw new Error('ID группы обязателен');
      this.currentGroup = groupId;
      this.socket.emit('joinGroup', { groupId, username: this.username });
    },
    sendMessage(msg) {
      let messageObj;
      if (typeof msg === 'string') {
        if (!msg.trim()) return;
        messageObj = {
          sender: this.username,
          groupId: this.currentGroup,
          timestamp: Date.now(),
          type: 'text',
          text: msg,
          filename: null,
          mimetype: null,
        };
      } else if (typeof msg === 'object' && msg !== null) {
        messageObj = {
          sender: this.username,
          groupId: this.currentGroup,
          timestamp: Date.now(),
          type: msg.type || 'text',
          text: msg.content || msg.text,
          filename: msg.filename || null,
          mimetype: msg.mimetype || null,
        };
      } else {
        return;
      }
      this.socket.emit('sendMessage', { groupId: this.currentGroup, message: messageObj });
    },
    editMessage(messageId, newText, groupId) {
      this.socket.emit('editMessage', { messageId, newText, groupId });
    },
    deleteMessage(messageId, groupId) {
      this.socket.emit('deleteMessage', { messageId, groupId });
    },
    addReaction(messageId, emoji, groupId) {
      this.socket.emit('addReaction', { messageId, emoji, groupId });
    },
    setEditingMessage(msg) {
      this.editingMessage = msg;
    },
    clearEditingMessage() {
      this.editingMessage = null;
    }
  }
});
