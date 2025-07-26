<template>
  <div class="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white font-sans overflow-hidden relative">

    <!-- Background Pulse -->
    <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div class="absolute top-[-50px] left-[-100px] w-[300%] h-[300%] bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-indigo-500/10 rounded-full animate-pulse-slow blur-3xl" />
    </div>

    <!-- Container -->
    <div class="relative z-10 flex flex-col md:flex-row w-full max-w-6xl mx-4 sm:mx-8 bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
      
      <!-- Left Panel: Bot & Content -->
      <div class="hidden md:flex flex-col justify-between w-full md:w-1/2 p-8 border-r border-white/10">
        <!-- Bot Section -->
        <div class="flex flex-col items-center text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
            alt="Bot Character"
            class="w-40 h-40 mb-4"
          />
          <h2 class="text-2xl font-bold mb-2">Привет, я Ботик!</h2>
          <p class="text-gray-300 text-sm max-w-xs">
            Я помогу тебе мгновенно подключиться к беседе 💬<br />
            Просто войди — и начнём общение!
          </p>

          <div class="mt-6 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full uppercase tracking-wide">
            🚀 Новинка: Поддержка групповых чатов!
          </div>
        </div>

        <!-- Features -->
        <div class="mt-10 text-sm text-gray-400 space-y-3">
          <div class="flex items-start gap-2">
            <span class="text-green-400 mt-1">✔</span>
            <span>Работает в реальном времени с WebSocket</span>
          </div>
          <div class="flex items-start gap-2">
            <span class="text-green-400 mt-1">✔</span>
            <span>Безопасная авторизация и хранение данных</span>
          </div>
          <div class="flex items-start gap-2">
            <span class="text-green-400 mt-1">✔</span>
            <span>Гибкое расширение, добавление групп и каналов</span>
          </div>
        </div>

        <div class="mt-8 text-xs text-center text-gray-500">
          © 2025 ChatSphere. Твой личный мессенджер.
        </div>
      </div>

      <!-- Right Panel: Form -->
      <div class="flex-1 p-8 flex flex-col justify-center">
        <div class="flex flex-col items-center mb-6">
          <img src="https://cdn-icons-png.flaticon.com/512/906/906334.png" class="w-14 h-14 mb-2" alt="Chat Icon" />
          <h2 class="text-2xl font-extrabold tracking-wide">Вход в ChatSphere</h2>
          <p class="text-gray-400 text-sm mt-1">Общайся без границ и без задержек</p>
        </div>

        <!-- Inputs -->
        <div class="space-y-4 w-full max-w-sm mx-auto">
          <div>
            <label class="text-sm text-gray-300 mb-1 block">Имя пользователя</label>
            <div class="flex items-center bg-white/10 border border-white/20 rounded-lg px-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 10a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
              <input
                v-model="username"
                placeholder="Введите имя"
                class="w-full bg-transparent focus:outline-none text-white py-2"
              />
            </div>
          </div>

          <div>
            <label class="text-sm text-gray-300 mb-1 block">Пароль</label>
            <div class="flex items-center bg-white/10 border border-white/20 rounded-lg px-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5 8a5 5 0 0110 0v2h1a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6a1 1 0 011-1h1V8zm2 0a3 3 0 016 0v2H7V8z" clip-rule="evenodd" />
              </svg>
              <input
                v-model="password"
                type="password"
                placeholder="Введите пароль"
                class="w-full bg-transparent focus:outline-none text-white py-2"
              />
            </div>
          </div>

          <!-- Buttons -->
          <button
            @click="register"
            class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition text-white font-semibold py-2 rounded-lg shadow-md"
          >
            Зарегистрироваться
          </button>
          <button
            @click="login"
            class="w-full bg-blue-500 hover:bg-blue-600 transition text-white font-semibold py-2 rounded-lg shadow-md"
          >
            Войти
          </button>
          <button
            @click="guestLogin"
            class="w-full bg-white/10 hover:bg-white/20 transition text-gray-300 font-semibold py-2 rounded-lg border border-white/20"
          >
            Войти как гость
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useChatStore } from '../store';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const chat = useChatStore();
const router = useRouter();

const username = ref('');
const password = ref('');

async function login() {
  try {
    await chat.login(username.value, password.value);
    chat.connect();
    const group = prompt('Введите ID группы');
    if (group) {
      chat.joinGroup(group);
      router.push('/chat');
    }
  } catch (e) {
    alert(e.message);
  }
}

async function register() {
  try {
    await chat.register(username.value, password.value);
    alert('Успешная регистрация');
  } catch (e) {
    alert(e.message);
  }
}

async function guestLogin() {
  username.value = 'Гость';
  password.value = 'guest123';
  try {
    await login();
  } catch (e) {
    if (e.message === 'User not found') {
      try {
        await chat.register(username.value, password.value);
        await login();
      } catch (regErr) {
        alert(regErr.message);
        return;
      }
    } else {
      alert(e.message);
      return;
    }
  }
}
</script>

<style scoped>
@keyframes pulse-slow {
  0%, 100% {
    transform: scale(1);
    opacity: 0.4;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
}
.animate-pulse-slow {
  animation: pulse-slow 10s ease-in-out infinite;
}
</style>
