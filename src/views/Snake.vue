<template>
 <div class="text">
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Snake',
  data() {
    return {
      color: 'red'
    }
  }
})
</script>

<style vars="{ color }">
.text {
  position: absolute;
  left: 0;
  top: 0;
  width: 10px;
  height: 10px;
  color: var(--color);
}
</style>