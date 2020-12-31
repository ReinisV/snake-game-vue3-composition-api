<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/snake">Snake</router-link>
  </div>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import router from './router';

export default defineComponent({
  name: 'App',
  setup() {
    router.afterEach((to, from) => {
      if (to.name === 'Snake') {
        document.body.style.backgroundColor = 'black';
        return;
      }

      if (from.name === 'Snake') {
        document.body.style.backgroundColor = 'white';
      }
    });
  },
});
</script>

<style lang="scss">
body {
  width: 100%;
  margin: 0;
  padding: 0;
  top: 0;
  left: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
