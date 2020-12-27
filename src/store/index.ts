import { createVuexStore } from 'vuex-simple';

import { MyStore } from './store';

export const store = new MyStore();

// create and export our store
export default createVuexStore(store, {
  strict: false,
  modules: {},
  plugins: []
});
