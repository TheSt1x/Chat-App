<template>
  <div class="flex items-center p-3 border-t border-gray-700 bg-gray-900">
    <input
      v-model="msg"
      @keyup.enter="send"
      :placeholder="chat.editingMessage ? 'Редактировать сообщение...' : 'Введите сообщение...'"
      class="flex-1 bg-gray-800 text-white placeholder-gray-400 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
    />
    <label class="ml-3 cursor-pointer flex items-center justify-center w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 hover:border-indigo-500 transition">
      📎
      <input type="file" class="hidden" @change="handleFileUpload" />
    </label>
    <button
      @click="send"
      aria-label="Отправить сообщение"
      class="ml-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg px-5 py-2 text-white shadow-md transition flex items-center justify-center select-none"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none"
           viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" >
        <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7-7 7M5 5l7 7-7 7" />
      </svg>
    </button>
    <button v-if="chat.editingMessage" @click="cancelEdit" class="ml-2 text-gray-400 hover:text-red-400 text-sm">Отмена</button>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue';
import { useChatStore } from '../store';
import 'emoji-picker-element';

const chat = useChatStore();
const msg = ref('');

watch(() => chat.editingMessage, (val) => {
  if (val) {
    msg.value = val.text || val.content || '';
  } else {
    msg.value = '';
  }
});

function send() {
  if (!msg.value.trim()) return;
  if (chat.editingMessage) {
    chat.editMessage(chat.editingMessage.id, msg.value, chat.editingMessage.groupId);
    chat.clearEditingMessage();
    msg.value = '';
  } else {
    chat.sendMessage(msg.value);
    msg.value = '';
  }
}

function cancelEdit() {
  chat.clearEditingMessage();
  msg.value = '';
}

function addEmoji(e) {
  msg.value += e.detail.unicode;
}
</script>
