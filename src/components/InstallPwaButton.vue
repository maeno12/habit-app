<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { BeforeInstallPromptEvent } from '../types/pwa'

const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)
const isInstalled = ref(false)
const isIOS = ref(false)

function handleBeforeInstallPrompt(e: BeforeInstallPromptEvent) {
  e.preventDefault()
  deferredPrompt.value = e
}

function handleAppInstalled() {
  isInstalled.value = true
  deferredPrompt.value = null
}

function detectIOS(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  const isIPad = navigator.maxTouchPoints > 1 && /Macintosh/.test(ua)
  return /iPad|iPhone|iPod/.test(ua) || isIPad
}

async function install() {
  const prompt = deferredPrompt.value
  if (!prompt) return
  await prompt.prompt()
  const { outcome } = await prompt.userChoice
  if (outcome === 'accepted') {
    deferredPrompt.value = null
    isInstalled.value = true
  }
}

onMounted(() => {
  isIOS.value = detectIOS()
  if (window.matchMedia('(display-mode: standalone)').matches) {
    isInstalled.value = true
  }
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener)
  window.addEventListener('appinstalled', handleAppInstalled)
})

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener)
  window.removeEventListener('appinstalled', handleAppInstalled)
})
</script>

<template>
  <div v-if="!isInstalled" class="install-area">
    <!-- Chrome/Edge: beforeinstallprompt が来たときだけボタン表示 -->
    <button
      v-if="deferredPrompt"
      type="button"
      class="install-btn"
      @click="install"
    >
      アプリをインストール
    </button>
    <!-- iOS/Safari: 案内テキスト -->
    <p v-else-if="isIOS" class="install-hint">
      共有 <span class="arrow">→</span> 「ホーム画面に追加」でインストール
    </p>
  </div>
</template>

<style scoped>
.install-area {
  margin-top: 20px;
  text-align: center;
  min-height: 44px;
}

.install-btn {
  padding: 10px 20px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #fff;
  background: #f97316;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.2s;
  font-family: inherit;
}

.install-btn:hover {
  opacity: 0.9;
}

.install-btn:active {
  opacity: 0.85;
}

.install-hint {
  margin: 0;
  font-size: 0.8rem;
  color: #78716c;
  line-height: 1.5;
}

.arrow {
  margin: 0 2px;
  color: #f97316;
}
</style>
