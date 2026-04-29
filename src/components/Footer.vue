<template>
  <footer class="footer" id="main-footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <span class="footer-icon">🍳</span>
        <span>Meal<span class="footer-accent">Planner</span></span>
      </div>
      <p class="footer-text">Creat per <strong>Jordi</strong> · Assignatura M9 — Implantació d'Aplicacions Web</p>
      <p class="footer-tech">Fet amb <span class="heart">♥</span> Vue.js 3 + Vite</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-subtle);
  padding: 24px;
  text-align: center;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.footer-icon {
  font-size: 1.3rem;
}

.footer-accent {
  color: var(--accent-primary);
}

.footer-text {
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.footer-tech {
  color: var(--text-muted);
  font-size: 0.8rem;
}

.heart {
  color: #dc2626;
  display: inline-block;
  animation: heartbeat 1.5s ease-in-out infinite;
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}
</style>
