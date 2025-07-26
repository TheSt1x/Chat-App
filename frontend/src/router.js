import { createRouter, createWebHistory } from 'vue-router';
import LoginView from './views/LoginView.vue';
import ChatView from './views/ChatView.vue';
import ProfileView from './views/ProfileView.vue';

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: LoginView },
    { path: '/chat', component: ChatView },
    { path: '/profile', component: ProfileView },
    { 
      path: '/profile/:username',
      component: () => import('./views/UserProfileView.vue')
    }
  ]
});
