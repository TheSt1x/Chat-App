<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white px-4 py-8">
    <div class="w-full max-w-xl bg-white/5 backdrop-blur-md rounded-2xl shadow-lg border border-white/10 p-6">

      <!-- Назад -->
      <router-link to="/chat" class="text-indigo-400 hover:underline text-sm mb-4 inline-block">&larr; Назад</router-link>

      <!-- Заголовок -->
      <h1 class="text-2xl font-bold mb-6 text-center text-white">🧑 Профиль</h1>

      <!-- Avatar Upload -->
      <label class="block cursor-pointer group relative w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-indigo-300 hover:border-indigo-400 transition">
        <img
          :src="profile.avatarUrl || defaultAvatar"
          class="object-cover w-full h-full group-hover:brightness-75"
        />
        <input type="file" accept="image/*" hidden @change="uploadAvatar" />
        <div class="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-white bg-black/50 px-2 py-0.5 rounded hidden group-hover:block">
          Изменить
        </div>
      </label>

      <!-- Имя -->
      <input
        v-model="profile.displayName"
        placeholder="Ваше имя"
        class="w-full mt-6 px-4 py-2 rounded-lg border border-white/10 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <!-- Username (read-only) -->
      <div class="mt-2 text-gray-300 text-sm text-center">@{{ profile.username }}</div>

      <!-- Статус -->
      <textarea
        v-model="profile.status"
        rows="2"
        placeholder="О себе / статус"
        class="w-full mt-4 px-4 py-2 rounded-lg border border-white/10 bg-white/10 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
      ></textarea>

      <!-- Save button -->
      <button
        @click="saveProfile"
        class="w-full mt-6 bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white px-6 py-2 rounded-xl transition shadow"
      >
        💾 Сохранить
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useChatStore } from '../store';
import axios from 'axios';
import { useRouter } from 'vue-router';

const chat = useChatStore();
const router = useRouter();

const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/4712/4712027.png';
const profile = ref({
  username: '',
  displayName: '',
  avatarUrl: '',
  status: '',
});

// Загрузка профиля
onMounted(async () => {
  try {
    const { data } = await axios.get(`http://localhost:3000/auth/profile/${chat.username}`);
    profile.value = data;
  } catch (e) {
    alert('Ошибка загрузки профиля');
  }
});

// Сохранение профиля
async function saveProfile() {
  try {
    await axios.put(`http://localhost:3000/auth/profile/${chat.username}`, profile.value);
    alert('Профиль обновлен!');
    router.push('/chat');
  } catch (e) {
    alert('Ошибка сохранения профиля');
  }
}

// Загрузка аватара
async function uploadAvatar(event) {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const { data } = await axios.post('http://localhost:3000/upload', formData);
    profile.value.avatarUrl = data.url;
  } catch (e) {
    alert('Ошибка загрузки аватара');
  }
}
</script>