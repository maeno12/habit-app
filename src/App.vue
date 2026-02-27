<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHabit } from './composables/useHabit'

const router = useRouter()
const { hasGoal } = useHabit()

onMounted(() => {
  if (!hasGoal() && router.currentRoute.value.name !== 'welcome') {
    router.replace({ name: 'welcome' })
  }
})
</script>

<template>
  <router-view />
</template>

<style>
#app {
  margin: 0;
  padding: 0;
  min-height: 100vh;
}
</style>
