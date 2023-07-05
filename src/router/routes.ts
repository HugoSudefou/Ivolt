import { RouteRecordRaw } from 'vue-router';
import { sessionStorageService } from 'boot/iv-api';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout/MainLayout.vue'),
    beforeEnter: async (to, from, next) => {
      if (sessionStorageService.isConnected()) {
        next();
      }
      next('login');
    },
    children: [
      { path: '', component: () => import('pages/IndexPage/IndexPage.vue') },
    ],
  },
  {
    path: '/login',
    component: () => import('layouts/LoginLayout/LoginLayout.vue'),
    children: [
      { path: '', component: () => import('pages/LoginPage/LoginPage.vue') },
    ],
  },
  // url de récupération pour la connexion discord
  {
    path: '/discord/redirect-url',
    component: () => import('pages/RedirectUrl/RedirectUrl.vue'),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound/ErrorNotFound.vue'),
  },
];

export default routes;
