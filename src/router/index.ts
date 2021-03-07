import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'main-menu',
    component: () => import('../views/main-menu')
  },
  {
    path: '/snake',
    name: 'snake',
    component: () => import('../views/snake')
  }
];

const router = createRouter({
  // cant use regular history, since gh-pages dont support that
  // history: createWebHistory(process.env.BASE_URL),
  history: createWebHashHistory(process.env.BASE_URL),
  routes
});

export default router;
