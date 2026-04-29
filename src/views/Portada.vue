<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="hero-section" id="hero-portada">
    <div class="hero-content">
      <div class="hero-badge">🎓 Projecte M9 — Implantació d'Aplicacions Web</div>
      <h1 class="hero-title">
        El teu <span class="gradient-text">Planificador</span><br>
        de Menús Setmanal
      </h1>
      <p class="hero-description">
        Explora un catàleg de receptes internacionals des d'una API externa 
        i organitza els teus àpats de tota la setmana amb el nostre planificador interactiu.
      </p>
      <div class="hero-actions">
        <RouterLink to="/api" class="btn btn-primary" id="btn-explore-recipes">
          <span>🍽️</span> Explorar Receptes
        </RouterLink>
        <RouterLink to="/crud" class="btn btn-secondary" id="btn-planner">
          <span>📅</span> Planificador
        </RouterLink>
      </div>
    </div>
    <div class="features-grid">
      <div class="feature-card" id="feature-api">
        <div class="feature-icon-wrap"><span class="feature-icon">🌍</span></div>
        <h3>API Externa</h3>
        <p>Connexió asíncrona amb TheMealDB per obtenir receptes de tot el món en temps real.</p>
      </div>
      <div class="feature-card" id="feature-crud">
        <div class="feature-icon-wrap"><span class="feature-icon">✏️</span></div>
        <h3>CRUD Complet</h3>
        <p>Crea, llegeix i elimina menús setmanals amb un sistema reactiu en memòria del navegador.</p>
      </div>
      <div class="feature-card" id="feature-spa">
        <div class="feature-icon-wrap"><span class="feature-icon">⚡</span></div>
        <h3>SPA amb Vue Router</h3>
        <p>Navegació fluida sense recàrregues gràcies a la renderització dinàmica de components.</p>
      </div>
    </div>
    <div class="tech-stack">
      <p class="tech-label">Tecnologies utilitzades</p>
      <div class="tech-badges">
        <span class="tech-badge vue">Vue.js 3</span>
        <span class="tech-badge vite">Vite</span>
        <span class="tech-badge router">Vue Router</span>
        <span class="tech-badge api">TheMealDB API</span>
        <span class="tech-badge css">CSS Grid</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-section { text-align: center; padding: 20px 0 40px; }
.hero-badge {
  display: inline-block; background: rgba(217,119,6,0.08); border: 1px solid rgba(217,119,6,0.18);
  color: var(--accent-primary); padding: 8px 20px; border-radius: 50px;
  font-size: 0.85rem; font-weight: 500; margin-bottom: 28px; animation: fadeInDown 0.6s ease;
}
.hero-title {
  font-size: clamp(2rem,5vw,3.2rem); font-weight: 800; line-height: 1.15;
  margin-bottom: 20px; letter-spacing: -0.02em; animation: fadeInDown 0.6s ease 0.1s both;
}
.gradient-text {
  background: var(--accent-gradient); -webkit-background-clip: text;
  -webkit-text-fill-color: transparent; background-clip: text;
}
.hero-description {
  max-width: 560px; margin: 0 auto 32px; color: var(--text-secondary);
  font-size: 1.1rem; line-height: 1.7; animation: fadeInDown 0.6s ease 0.2s both;
}
.hero-actions {
  display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;
  margin-bottom: 64px; animation: fadeInDown 0.6s ease 0.3s both;
}
.btn {
  display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px;
  border-radius: var(--radius-md); text-decoration: none; font-weight: 600;
  font-size: 0.95rem; transition: all var(--transition-fast); cursor: pointer;
}
.btn-primary {
  background: var(--accent-gradient); color: white;
  box-shadow: 0 4px 16px rgba(217,119,6,0.25);
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(217,119,6,0.35); }
.btn-secondary {
  background: var(--bg-card); color: var(--text-primary);
  border: 1px solid var(--border-subtle); box-shadow: var(--shadow-sm);
}
.btn-secondary:hover {
  transform: translateY(-2px); border-color: var(--accent-primary); box-shadow: var(--shadow-md);
}
.features-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px; margin-bottom: 64px;
}
.feature-card {
  background: var(--bg-card); border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg); padding: 32px 24px; text-align: center;
  transition: all var(--transition-smooth); animation: fadeInUp 0.5s ease both;
  box-shadow: var(--shadow-sm);
}
.feature-card:nth-child(1) { animation-delay: 0.4s; }
.feature-card:nth-child(2) { animation-delay: 0.5s; }
.feature-card:nth-child(3) { animation-delay: 0.6s; }
.feature-card:hover {
  transform: translateY(-6px); border-color: rgba(217,119,6,0.2);
  box-shadow: var(--shadow-glow);
}
.feature-icon-wrap {
  width: 60px; height: 60px; border-radius: var(--radius-md);
  background: rgba(217,119,6,0.08); display: flex; align-items: center;
  justify-content: center; margin: 0 auto 16px;
}
.feature-icon { font-size: 1.8rem; }
.feature-card h3 { font-size: 1.15rem; font-weight: 700; margin-bottom: 8px; }
.feature-card p { color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6; }
.tech-stack { animation: fadeInUp 0.5s ease 0.7s both; }
.tech-label {
  color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase;
  letter-spacing: 0.1em; font-weight: 600; margin-bottom: 16px;
}
.tech-badges { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.tech-badge { padding: 6px 16px; border-radius: 50px; font-size: 0.8rem; font-weight: 600; border: 1px solid; }
.tech-badge.vue { color: #16a34a; border-color: rgba(22,163,74,0.2); background: rgba(22,163,74,0.06); }
.tech-badge.vite { color: #7c3aed; border-color: rgba(124,58,237,0.2); background: rgba(124,58,237,0.06); }
.tech-badge.router { color: #16a34a; border-color: rgba(22,163,74,0.2); background: rgba(22,163,74,0.06); }
.tech-badge.api { color: #d97706; border-color: rgba(217,119,6,0.2); background: rgba(217,119,6,0.06); }
.tech-badge.css { color: #0284c7; border-color: rgba(2,132,199,0.2); background: rgba(2,132,199,0.06); }
@keyframes fadeInDown { from { opacity:0; transform:translateY(-20px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeInUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
@media (max-width: 768px) {
  .hero-title { font-size: 1.8rem; }
  .hero-description { font-size: 1rem; }
  .hero-actions { flex-direction: column; align-items: center; }
  .btn { width: 100%; max-width: 280px; justify-content: center; }
}
</style>
