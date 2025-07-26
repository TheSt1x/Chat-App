<template>
  <div class="flex h-screen overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 text-white font-sans">
    <aside class="w-64 hidden sm:flex flex-col justify-between bg-gray-900 border-r border-gray-700 p-6">
      <div>
        <h1 class="text-2xl font-bold mb-8">💬 ChatSphere</h1>
        <div class="space-y-4">
          <div>
            <p class="text-gray-400 text-sm">Группа</p>
            <p class="text-lg font-semibold">{{ chat.currentGroup }}</p>
          </div>
          <div>
            <p class="text-gray-400 text-sm">Пользователь</p>
            <p class="text-lg font-semibold">{{ chat.username }}</p>
          </div>
          <div class="mt-10 p-4 bg-white/10 rounded-lg border border-white/10">
            <h2 class="text-sm font-semibold text-indigo-400 mb-2">💡 Подсказка</h2>
            <p class="text-xs text-gray-300">
              Используйте <span class="text-green-400 font-bold">@</span> для упоминаний, и
              <span class="text-green-400 font-bold">#</span> для навигации между каналами.
            </p>
          </div>
        </div>
      </div>
      <div>
        <button
          @click="logout"
          class="flex items-center justify-center gap-2 px-4 py-2 mt-6 bg-gradient-to-r from-red-500 to-red-700 text-white text-sm font-semibold rounded-lg shadow hover:from-red-600 hover:to-red-800 transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-9V7" />
          </svg>
          Выйти
        </button>
        <button
          @click="goToProfile"
          class="flex items-center justify-center gap-2 px-4 py-2 mt-3 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white text-sm font-semibold rounded-lg shadow hover:from-indigo-600 hover:to-indigo-800 transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Профиль
        </button>
      </div>
    </aside>
    <div class="flex flex-col flex-1 overflow-hidden">
      <header class="sm:hidden flex items-center justify-between bg-gray-900 px-4 py-3 border-b border-gray-700">
        <div>
          <p class="text-sm text-gray-400">Группа:</p>
          <p class="font-semibold">{{ chat.currentGroup }}</p>
        </div>
        <button @click="logout" class="text-red-400 hover:text-red-300 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-9V7" />
          </svg>
        </button>
      </header>
      <main class="flex-1 flex flex-col p-4 sm:p-6 backdrop-blur-md bg-white/5 rounded-lg mx-2 my-2 sm:m-4 overflow-hidden shadow-lg border border-white/10">
        <div class="flex items-center mb-4 gap-4">
          <img src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png" alt="Bot Character" class="w-10 h-10" />
          <div>
            <h2 class="text-lg font-semibold">Добро пожаловать в ChatSphere!</h2>
            <p class="text-xs text-gray-400">Общение начинается здесь ⚡</p>
          </div>
        </div>
        <div class="flex-1 overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <div v-for="m in chat.messages" :key="m.id" class="mb-2 group relative">
            <router-link :to="`/profile/${m.sender}`" class="font-bold hover:underline text-blue-700">
              {{ m.sender === chat.username ? 'Вы' : m.sender }}
            </router-link>:
            <template v-if="m.deleted">
              <span class="italic text-gray-500">Сообщение удалено</span>
            </template>
            <template v-else>
              <span>
                <template v-if="m.type === 'text' || !m.type">
                  {{ m.text || m.content }}
                </template>
                <template v-else-if="m.type === 'image'">
                  <img :src="m.content" class="max-w-xs rounded shadow mt-1" />
                </template>
                <template v-else-if="m.type === 'audio'">
                  <audio :src="m.content" controls class="mt-1" />
                </template>
                <template v-else>
                  <a :href="m.content" target="_blank" class="underline text-blue-500 mt-1 inline-block">
                    📄 {{ m.filename || 'Файл' }}
                  </a>
                </template>
                <span v-if="m.edited" class="text-xs text-yellow-400 ml-1">(отредактировано)</span>
              </span>
              <span v-if="m.sender === chat.username && !m.deleted" class="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <button @click="() => chat.setEditingMessage(m)" class="text-indigo-400 hover:text-indigo-600 text-xs">✏️</button>
                <button @click="deleteMsg(m)" class="text-red-400 hover:text-red-600 text-xs">🗑️</button>
              </span>
              <div class="flex gap-1 mt-1 items-center">
                <template v-for="(r, idx) in (m.reactions || []).reduce((acc, cur) => {
                  const found = acc.find(a => a.emoji === cur.emoji);
                  if (found) found.count++;
                  else acc.push({ emoji: cur.emoji, count: 1 });
                  return acc;
                }, [])" :key="r.emoji">
                  <button @click="onReactionClick(m, r.emoji)" class="px-2 py-0.5 rounded-full bg-gray-800 text-lg hover:bg-indigo-600 transition flex items-center">
                    {{ r.emoji }} <span class="ml-1 text-xs">{{ r.count }}</span>
                  </button>
                </template>
                <button @click="() => togglePicker(m.id)" class="px-2 py-0.5 rounded-full bg-gray-700 text-lg hover:bg-indigo-500 transition">+</button>
                <emoji-picker v-if="showPickerFor === m.id" :data-picker-id="m.id" style="position:absolute;z-index:10;" />
              </div>
            </template>
            <span class="text-xs text-gray-400 ml-2 align-middle">
              {{ new Date(m.timestamp).toLocaleTimeString() }}
            </span>
          </div>
        </div>
        <div>
          <MessageInput />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import 'emoji-picker-element';
import ChatWindow from '../components/ChatWindow.vue';
import MessageInput from '../components/MessageInput.vue';
import { useChatStore } from '../store';
import { useRouter } from 'vue-router';
import { ref, nextTick, watch } from 'vue';

const chat = useChatStore();
const router = useRouter();
const newMessage = ref('');
const showPickerFor = ref(null);

function togglePicker(msgId) {
  showPickerFor.value = showPickerFor.value === msgId ? null : msgId;
}
function onReactionClick(m, emoji) {
  chat.addReaction(m.id, emoji, m.groupId);
}

watch(showPickerFor, async (val, oldVal) => {
  if (val !== null) {
    await nextTick();
    const picker = document.querySelector(`[data-picker-id='${val}']`);
    if (picker) {
      const handler = (e) => {
        chat.addReaction(val, e.detail.unicode, chat.messages.find(msg => msg.id === val)?.groupId);
        showPickerFor.value = null;
      };
      picker.addEventListener('emoji-click', handler, { once: true });
    }
  }
});

function logout() {
  chat.logout();
  router.push('/');
}

function goToProfile() {
  router.push('/profile');
}

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();

    const fileMessage = {
      type: getFileType(data.type),
      content: data.url,
      filename: file.name,
      mimetype: data.type
    };

    chat.sendMessage(fileMessage);
  } catch (err) {
    alert('Ошибка загрузки файла');
    console.error(err);
  }
};

function getFileType(mimetype) {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('audio/')) return 'audio';
  return 'file';
}

function deleteMsg(msg) {
  if (confirm('Удалить сообщение?')) {
    chat.deleteMessage(msg.id, msg.groupId);
  }
}

if (!chat.token) {
  router.push('/');
}
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}
</style>
