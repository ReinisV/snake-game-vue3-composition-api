import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/snake',
    name: 'Snake',
    component: () => import('../views/Snake')
  }
];

const router = createRouter({
  // cant use regular history, since gh-pages dont support that
  // history: createWebHistory(process.env.BASE_URL),
  history: createWebHashHistory(process.env.BASE_URL),
  routes
});

export default router;
