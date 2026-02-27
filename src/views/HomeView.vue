<script setup lang="ts">
import { onMounted } from 'vue'
import { useHabit } from '../composables/useHabit'
import { useNotification } from '../composables/useNotification'
import AppNav from '../components/AppNav.vue'
import InstallPwaButton from '../components/InstallPwaButton.vue'

const {
  habitName,
  progressPercent,
  completedCount,
  isTodayRecorded,
  recordToday
} = useHabit()
const { checkAndNotify } = useNotification()

const percent = progressPercent

onMounted(() => checkAndNotify())
</script>

<template>
  <div class="home">
    <header class="header">
      <h1>習慣の記録</h1>
    </header>
    <main class="main">
      <h2 class="habit-name">{{ habitName }}</h2>
      <p class="percent">{{ percent }}% 達成</p>

      <div class="progress-ring-wrap" @click="!isTodayRecorded && recordToday()">
        <svg class="progress-ring" viewBox="0 0 120 120">
          <circle
            class="ring-bg"
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke-width="10"
          />
          <circle
            class="ring-fill"
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke-width="10"
            :stroke-dasharray="`${(percent / 100) * 339.3} 339.3`"
          />
        </svg>
        <div class="ring-inner">
          <span class="count">{{ completedCount }}</span>
          <span class="label">{{ isTodayRecorded ? '完了!' : 'タップで記録' }}</span>
        </div>
      </div>

      <p v-if="isTodayRecorded" class="done-msg">今日の記録は完了しています</p>
      <p v-else class="tap-msg">画面をタップして今日の記録を追加</p>

      <InstallPwaButton />
    </main>
    <AppNav />
  </div>
</template>

<style scoped>
.home {
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
  flex-direction: column;
  align-items: center;
  padding: 24px 20px 88px;
}

.habit-name {
  margin: 0 0 4px;
  font-size: 1.35rem;
  font-weight: 700;
  color: #1c1917;
}

.percent {
  margin: 0 0 24px;
  font-size: 0.9rem;
  color: #78716c;
}

.progress-ring-wrap {
  position: relative;
  width: 200px;
  height: 200px;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.progress-ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ring-bg {
  stroke: #e7e5e4;
}

.ring-fill {
  stroke: #22c55e;
  stroke-linecap: round;
  transition: stroke-dasharray 0.4s ease;
}

.ring-inner {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.count {
  font-size: 3rem;
  font-weight: 700;
  color: #22c55e;
  line-height: 1;
}

.label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #22c55e;
  margin-top: 4px;
}

.done-msg {
  margin-top: 24px;
  font-size: 0.95rem;
  color: #22c55e;
  font-weight: 500;
}

.tap-msg {
  margin-top: 24px;
  font-size: 0.9rem;
  color: #78716c;
}
</style>
