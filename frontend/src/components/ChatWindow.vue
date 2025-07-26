<template>
  <div class="flex-1 overflow-y-auto p-4 bg-gray-900 rounded-lg scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
    <div v-for="m in chat.messages" :key="m.id" class="mb-2">
      <b>{{ m.sender === chat.username ? 'Вы' : m.sender }}</b>:
      <template v-if="m.type === 'text' || !m.type">
        {{ m.text }}
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
      <span class="text-xs text-gray-400 ml-2 align-middle">
        {{ new Date(m.timestamp).toLocaleTimeString() }}
      </span>
    </div>
  </div>
</template>
<script setup>
import { useChatStore } from '../store';
const chat = useChatStore();
</script>
<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgba(255 255 255 / 0.2);
  border-radius: 3px;
}
</style>
