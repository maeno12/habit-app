<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHabit } from '../composables/useHabit'
import { useNotification } from '../composables/useNotification'
import AppNav from '../components/AppNav.vue'

const router = useRouter()
const { habitName, setHabitName, resetRecords } = useHabit()
const { permission, requestPermission, reminderHour, saveReminderHour, checkAndNotify } = useNotification()

const editName = ref('')
const saving = ref(false)
const resetting = ref(false)

onMounted(() => {
  editName.value = habitName.value
  checkAndNotify()
})

function updateName() {
  const v = editName.value.trim()
  if (!v) return
  saving.value = true
  setHabitName(v)
  saving.value = false
}

function reset() {
  if (!confirm('記録をすべてリセットします。よろしいですか？')) return
  resetting.value = true
  resetRecords()
  resetting.value = false
  router.replace({ name: 'home' })
}
</script>

<template>
  <div class="settings">
    <header class="header">
      <h1>設定</h1>
    </header>
    <main class="main">
      <section class="section">
        <h2>習慣の設定</h2>
        <p class="desc">習慣の名前を変更できます</p>
        <input
          v-model="editName"
          type="text"
          class="input"
          placeholder="習慣の名前"
          maxlength="50"
        />
        <button class="btn btn-update" :disabled="saving || !editName.trim()" @click="updateName">
          更新する
        </button>
      </section>

      <section class="section notification-section">
        <h2>通知</h2>
        <p class="desc">目標実行を忘れないようリマインドします</p>
        <div v-if="permission === 'granted'" class="notification-on">
          <label class="time-label">リマインド時刻</label>
          <input
            v-model.number="reminderHour"
            type="number"
            min="0"
            max="23"
            class="input time-input"
            @change="saveReminderHour"
          />
          <span class="time-suffix">時</span>
        </div>
        <button
          v-else-if="permission === 'default'"
          class="btn btn-notify"
          @click="requestPermission"
        >
          通知を有効にする
        </button>
        <p v-else class="permission-denied">通知はブラウザ設定から許可してください</p>
      </section>

      <section class="section">
        <h2>データの管理</h2>
        <p class="desc">記録を完全に削除します</p>
        <button class="btn btn-reset" :disabled="resetting" @click="reset">
          記録をリセット
        </button>
      </section>
    </main>
    <AppNav />
  </div>
</template>

<style scoped>
.settings {
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
  padding: 24px 20px 88px;
  max-width: 400px;
  margin: 0 auto;
  width: 100%;
}

.section {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.04);
}

.section h2 {
  margin: 0 0 6px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1c1917;
}

.desc {
  margin: 0 0 16px;
  font-size: 0.85rem;
  color: #78716c;
}

.input {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  margin-bottom: 12px;
  font-size: 1rem;
  border: 1px solid #e7e5e4;
  border-radius: 10px;
  background: #fafaf9;
  outline: none;
}

.input:focus {
  border-color: #f97316;
}

.btn {
  width: 100%;
  padding: 12px 20px;
  font-size: 0.95rem;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-update {
  background: #1c1917;
  color: #fff;
}

.btn-update:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-reset {
  background: #ec4899;
  color: #fff;
}

.btn-reset:hover:not(:disabled) {
  opacity: 0.9;
}

.notification-section .time-label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.9rem;
  color: #44403c;
}

.notification-on {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.time-input {
  width: 80px;
  margin-bottom: 0;
}

.time-suffix {
  font-size: 0.95rem;
  color: #78716c;
}

.btn-notify {
  background: #f97316;
  color: #fff;
}

.btn-notify:hover {
  opacity: 0.9;
}

.permission-denied {
  margin: 0;
  font-size: 0.9rem;
  color: #78716c;
}
</style>
