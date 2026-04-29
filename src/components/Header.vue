<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
const mobileMenuOpen = ref(false)

const navItems = [
  { path: '/', label: 'Portada', icon: '🏠' },
  { path: '/api', label: 'Receptes API', icon: '🍽️' },
  { path: '/crud', label: 'Planificador', icon: '📅' }
]

const toggleMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMenu = () => {
  mobileMenuOpen.value = false
}
</script>

<template>
  <header class="navbar" id="main-navbar">
    <div class="navbar-inner">
      <RouterLink to="/" class="navbar-brand" @click="closeMenu">
        <span class="brand-icon">🍳</span>
        <span class="brand-text">Meal<span class="brand-accent">Planner</span></span>
      </RouterLink>

      <button class="mobile-toggle" @click="toggleMenu" :class="{ active: mobileMenuOpen }" id="mobile-menu-toggle" aria-label="Obrir menú">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav class="navbar-nav" :class="{ open: mobileMenuOpen }">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-link"
          :class="{ active: route.path === item.path }"
          @click="closeMenu"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-subtle);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 0 24px;
}

.navbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 700;
  font-size: 1.25rem;
  transition: transform var(--transition-fast);
}

.navbar-brand:hover {
  transform: scale(1.03);
}

.brand-icon {
  font-size: 1.5rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.brand-accent {
  color: var(--accent-primary);
}

.navbar-nav {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 0.9rem;
  transition: all var(--transition-fast);
  position: relative;
}

.nav-link:hover {
  color: var(--text-primary);
  background: rgba(217, 119, 6, 0.06);
}

.nav-link.active {
  color: var(--accent-primary);
  background: rgba(217, 119, 6, 0.08);
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background: var(--accent-gradient);
  border-radius: 1px;
}

.nav-icon {
  font-size: 1.1rem;
}

/* ═══ Mobile ═══ */
.mobile-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  z-index: 101;
}

.mobile-toggle span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--text-primary);
  border-radius: 2px;
  transition: all var(--transition-fast);
}

.mobile-toggle.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.mobile-toggle.active span:nth-child(2) {
  opacity: 0;
}

.mobile-toggle.active span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

@media (max-width: 768px) {
  .mobile-toggle {
    display: flex;
  }

  .navbar-nav {
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.97);
    backdrop-filter: blur(20px);
    flex-direction: column;
    padding: 16px;
    gap: 8px;
    border-bottom: 1px solid var(--border-subtle);
    transform: translateY(-120%);
    opacity: 0;
    transition: all var(--transition-smooth);
  }

  .navbar-nav.open {
    transform: translateY(0);
    opacity: 1;
  }

  .nav-link {
    width: 100%;
    padding: 14px 16px;
    font-size: 1rem;
  }
}
</style>
