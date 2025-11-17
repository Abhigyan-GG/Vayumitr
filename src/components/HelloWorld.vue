<template>
  <div class="hello-world">
    {{ msg }}
  </div>
</template>

<script setup lang="ts">
interface Props {
  msg?: string
}

const props = defineProps<Props>()
</script>

<style scoped>
.hello-world {
  color: #111827;
}
</style>
