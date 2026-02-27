<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useHabit } from '../composables/useHabit'
import AppNav from '../components/AppNav.vue'

const input = ref('')
const router = useRouter()
const { setHabitName } = useHabit()

function start() {
  const name = input.value.trim()
  if (!name) return
  setHabitName(name)
  router.replace({ name: 'home' })
}
</script>

<template>
  <div class="welcome">
    <header class="header">
      <h1>習慣の記録</h1>
    </header>
    <main class="main">
      <div class="card">
        <h2>習慣を始めましょう</h2>
        <p class="sub">30日間の継続で新しい習慣が身につきます</p>
        <input
          v-model="input"
          type="text"
          class="habit-input"
          placeholder="習慣を入力..."
          maxlength="50"
          @keydown.enter="start"
        />
        <button class="btn-start" :disabled="!input.trim()" @click="start">
          始める
        </button>
      </div>
    </main>
    <AppNav />
  </div>
</template>

<style scoped>
.welcome {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff7ed;
}

.header {
  padding: 16px;
  text-align: center;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}

.header h1 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1c1917;
}

.main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 20px 88px;
}

.card {
  background: #fff;
  border-radius: 16px;
  padding: 32px 24px;
  width: 100%;
  max-width: 360px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
}

.card h2 {
  margin: 0 0 8px;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1c1917;
}

.sub {
  margin: 0 0 24px;
  font-size: 0.9rem;
  color: #78716c;
  line-height: 1.5;
}

.habit-input {
  width: 100%;
  box-sizing: border-box;
  padding: 14px 16px;
  margin-bottom: 16px;
  font-size: 1rem;
  border: 1px solid #e7e5e4;
  border-radius: 10px;
  background: #fafaf9;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.habit-input:focus {
  border-color: #f97316;
  box-shadow: 0 0 0 3px rgba(249,115,22,0.15);
}

.habit-input::placeholder {
  color: #a8a29e;
}

.btn-start {
  width: 100%;
  padding: 14px 24px;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background: #22c55e;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-start:hover:not(:disabled) {
  background: #16a34a;
}

.btn-start:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
