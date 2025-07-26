<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white px-4 py-8">
    <div class="w-full max-w-xl bg-white/5 backdrop-blur-md rounded-2xl shadow-lg border border-white/10 p-6">
      <router-link
        to="/chat"
        class="text-indigo-400 hover:underline text-sm mb-4 inline-block"
      >
        &larr; Назад
      </router-link>
      <h1 class="text-2xl font-bold mb-6 text-center text-white">🧑 Профиль</h1>
      <div v-if="profile" class="text-center">
        <div class="w-28 h-28 mx-auto mb-4">
          <img
            :src="profile.avatarUrl || defaultAvatar"
            alt="Аватар"
            class="object-cover w-full h-full rounded-full border-4 border-indigo-300"
          />
        </div>
        <h2 class="text-xl font-bold text-white">{{ profile.displayName || profile.username }}</h2>
        <div class="text-gray-300 text-sm mb-2">@{{ profile.username }}</div>
        <p class="mt-4 text-white/80 italic">
          {{ profile.status || 'Нет статуса' }}
        </p>
      </div>
      <div v-else class="text-center text-gray-400 mt-10">
        Профиль не найден.
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const profile = ref(null);
const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/4712/4712027.png';

onMounted(async () => {
  try {
    const res = await fetch(`http://localhost:3000/auth/profile/${route.params.username}`);
    if (!res.ok) throw new Error('Профиль не найден');
    profile.value = await res.json();
  } catch (err) {
    console.error('Ошибка загрузки профиля:', err);
    profile.value = null;
  }
});
</script>
  