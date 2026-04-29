<script setup>
import { ref, onMounted } from 'vue'

const receptes = ref([])
const carregant = ref(true)
const errorMsg = ref('')
const searchQuery = ref('chicken')
const searchInput = ref('chicken')

const fetchRecipes = async (query) => {
  carregant.value = true
  errorMsg.value = ''
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
    const data = await res.json()
    receptes.value = data.meals || []
    if (receptes.value.length === 0) errorMsg.value = `No s'han trobat receptes per "${query}"`
  } catch (error) {
    console.error("Error carregant les dades de la API", error)
    errorMsg.value = 'Error de connexió amb el servidor de receptes.'
  } finally {
    carregant.value = false
  }
}
const cercar = () => {
  if (searchInput.value.trim()) {
    searchQuery.value = searchInput.value.trim()
    fetchRecipes(searchQuery.value)
  }
}
onMounted(() => fetchRecipes(searchQuery.value))
</script>

<template>
  <div class="api-page" id="api-page">
    <div class="page-header">
      <h1 class="page-title">
        <span class="title-icon">🍽️</span>
        Catàleg de <span class="gradient-text">Receptes</span>
      </h1>
      <p class="page-subtitle">Dades obtingudes en temps real des de l'API de TheMealDB</p>
    </div>
    <div class="search-bar" id="search-bar">
      <div class="search-input-wrap">
        <span class="search-icon">🔍</span>
        <input v-model="searchInput" type="text" placeholder="Cerca receptes... (ex: pasta, beef, dessert)"
          @keyup.enter="cercar" class="search-input" id="search-input" />
      </div>
      <button @click="cercar" class="search-btn" id="btn-search">Cercar</button>
    </div>
    <div v-if="carregant" class="loading-state">
      <div class="spinner"></div>
      <p>Connectant amb el servidor de receptes...</p>
    </div>
    <div v-else-if="errorMsg" class="error-state">
      <span class="error-icon">😕</span>
      <p>{{ errorMsg }}</p>
    </div>
    <div v-else class="graella">
      <div v-for="(plat, index) in receptes" :key="plat.idMeal" class="targeta"
        :style="{ animationDelay: `${index * 0.06}s` }">
        <div class="targeta-img-wrap">
          <img :src="plat.strMealThumb" :alt="plat.strMeal" loading="lazy" />
          <div class="targeta-overlay">
            <a v-if="plat.strYoutube" :href="plat.strYoutube" target="_blank" rel="noopener noreferrer" class="overlay-btn">
              ▶ Veure Vídeo
            </a>
          </div>
        </div>
        <div class="targeta-body">
          <h3 class="targeta-title">{{ plat.strMeal }}</h3>
          <div class="targeta-tags">
            <span class="tag tag-category">{{ plat.strCategory }}</span>
            <span class="tag tag-area">{{ plat.strArea }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!carregant && !errorMsg && receptes.length > 0" class="result-count">
      <p>{{ receptes.length }} receptes trobades per "<strong>{{ searchQuery }}</strong>"</p>
    </div>
  </div>
</template>

<style scoped>
.api-page { animation: fadeIn 0.4s ease; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.page-header { text-align: center; margin-bottom: 32px; }
.page-title {
  font-size: clamp(1.6rem, 4vw, 2.4rem); font-weight: 800; margin-bottom: 8px;
  display: flex; align-items: center; justify-content: center; gap: 12px;
}
.title-icon { font-size: 1.4em; }
.gradient-text {
  background: var(--accent-gradient); -webkit-background-clip: text;
  -webkit-text-fill-color: transparent; background-clip: text;
}
.page-subtitle { color: var(--text-secondary); font-size: 1rem; }
.search-bar { display: flex; gap: 12px; max-width: 600px; margin: 0 auto 40px; }
.search-input-wrap { flex: 1; position: relative; }
.search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 1rem; pointer-events: none; }
.search-input {
  width: 100%; padding: 14px 14px 14px 42px; background: var(--bg-input);
  border: 1px solid var(--border-subtle); border-radius: var(--radius-md);
  color: var(--text-primary); font-size: 0.95rem; font-family: 'Inter', sans-serif;
  transition: all var(--transition-fast);
}
.search-input:focus { outline: none; border-color: var(--border-focus); box-shadow: 0 0 0 3px rgba(217,119,6,0.12); }
.search-input::placeholder { color: var(--text-muted); }
.search-btn {
  padding: 14px 24px; background: var(--accent-gradient); color: white; border: none;
  border-radius: var(--radius-md); font-weight: 600; font-size: 0.9rem;
  font-family: 'Inter', sans-serif; cursor: pointer; transition: all var(--transition-fast); white-space: nowrap;
}
.search-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(217,119,6,0.25); }
.loading-state { text-align: center; padding: 60px 20px; color: var(--text-secondary); }
.spinner {
  width: 40px; height: 40px; border: 3px solid var(--border-subtle);
  border-top-color: var(--accent-primary); border-radius: 50%;
  animation: spin 0.8s linear infinite; margin: 0 auto 16px;
}
@keyframes spin { to { transform: rotate(360deg); } }
.error-state { text-align: center; padding: 60px 20px; color: var(--text-secondary); }
.error-icon { font-size: 3rem; display: block; margin-bottom: 12px; }
.graella { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 24px; }
.targeta {
  background: var(--bg-card); border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg); overflow: hidden; transition: all var(--transition-smooth);
  animation: cardIn 0.5s ease both; box-shadow: var(--shadow-sm);
}
@keyframes cardIn {
  from { opacity: 0; transform: translateY(20px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.targeta:hover {
  transform: translateY(-6px); border-color: rgba(217,119,6,0.15);
  box-shadow: var(--shadow-glow);
}
.targeta-img-wrap { position: relative; overflow: hidden; aspect-ratio: 4/3; }
.targeta-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
.targeta:hover .targeta-img-wrap img { transform: scale(1.08); }
.targeta-overlay {
  position: absolute; inset: 0; background: rgba(0,0,0,0.45);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity var(--transition-fast);
}
.targeta:hover .targeta-overlay { opacity: 1; }
.overlay-btn {
  padding: 10px 20px; background: rgba(255,255,255,0.2); backdrop-filter: blur(8px);
  color: white; border-radius: var(--radius-sm); text-decoration: none;
  font-weight: 600; font-size: 0.85rem; transition: background var(--transition-fast);
}
.overlay-btn:hover { background: rgba(255,255,255,0.3); }
.targeta-body { padding: 18px; }
.targeta-title { font-size: 1.05rem; font-weight: 700; margin-bottom: 10px; line-height: 1.3; }
.targeta-tags { display: flex; gap: 8px; flex-wrap: wrap; }
.tag { padding: 4px 12px; border-radius: 50px; font-size: 0.75rem; font-weight: 600; }
.tag-category { background: rgba(217,119,6,0.1); color: var(--accent-primary); }
.tag-area { background: rgba(5,150,105,0.1); color: var(--accent-secondary); }
.result-count { text-align: center; margin-top: 32px; padding: 12px; color: var(--text-muted); font-size: 0.85rem; }
@media (max-width: 768px) {
  .search-bar { flex-direction: column; }
  .graella { grid-template-columns: 1fr; }
}
</style>
