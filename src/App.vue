<script setup>
import { RouterView } from 'vue-router'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div class="app-wrapper">
    <Header />
    <main class="contingut">
      <RouterView v-slot="{ Component }">
        <transition name="fade-slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>
    <Footer />
  </div>
</template>

<style>
/* ═══════════════════════════════════════════════
   GLOBAL DESIGN SYSTEM — Warm Professional Theme
   ═══════════════════════════════════════════════ */

:root {
  /* Warm neutral palette — professional & inviting */
  --bg-primary: #faf9f7;
  --bg-secondary: #f2f0ec;
  --bg-card: #ffffff;
  --bg-card-hover: #fefefe;
  --bg-input: #f5f4f1;
  --border-subtle: rgba(0, 0, 0, 0.07);
  --border-focus: #d97706;

  --text-primary: #1c1917;
  --text-secondary: #57534e;
  --text-muted: #a8a29e;

  /* Warm accent colors — amber/terracotta tones */
  --accent-primary: #d97706;
  --accent-primary-hover: #b45309;
  --accent-secondary: #059669;
  --accent-gradient: linear-gradient(135deg, #d97706 0%, #ea580c 100%);
  --accent-gradient-soft: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);

  --danger: #dc2626;
  --danger-hover: #b91c1c;

  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 10px 30px rgba(0, 0, 0, 0.1);
  --shadow-glow: 0 4px 20px rgba(217, 119, 6, 0.12);

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;

  --transition-fast: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-smooth: 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

/* Subtle warm background texture */
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(ellipse at 20% 0%, rgba(251, 191, 36, 0.06) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 100%, rgba(234, 88, 12, 0.04) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.app-wrapper {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.contingut {
  padding: 40px 24px 100px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  flex: 1;
}

/* ═══ Page Transition Animations ═══ */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ═══ Scrollbar ═══ */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: var(--bg-primary);
}
::-webkit-scrollbar-thumb {
  background: #d6d3d1;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #a8a29e;
}

/* ═══ Selection ═══ */
::selection {
  background: rgba(217, 119, 6, 0.2);
  color: #1c1917;
}

@media (max-width: 768px) {
  .contingut {
    padding: 24px 16px 100px;
  }
}
</style>
