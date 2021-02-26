import { createVuexStore } from 'vuex-simple';

import { SnakeGameStore } from './store';

export const store = new SnakeGameStore();

// create and export our store
export default createVuexStore(store, {
  strict: process.env.NODE_ENV !== 'production',
  modules: {},
  plugins: []
});
