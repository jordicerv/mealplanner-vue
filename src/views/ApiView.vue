<script setup>
import { ref, computed, onMounted } from 'vue'

const receptes = ref([])
const carregant = ref(true)
const errorMsg = ref('')
const searchQuery = ref('chicken')
const searchInput = ref('chicken')

// ═══ Recipe Detail Modal ═══
const selectedRecipe = ref(null)
const loadingDetail = ref(false)

const openRecipe = async (meal) => {
  loadingDetail.value = true
  selectedRecipe.value = meal // show immediately with basic data
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
    const data = await res.json()
    if (data.meals && data.meals.length > 0) {
      selectedRecipe.value = data.meals[0]
    }
  } catch (err) {
    console.error('Error carregant detall de la recepta:', err)
  } finally {
    loadingDetail.value = false
  }
}

const closeRecipe = () => {
  selectedRecipe.value = null
}

// ═══ Extract ingredients from the meal object ═══
const ingredients = computed(() => {
  if (!selectedRecipe.value) return []
  const list = []
  for (let i = 1; i <= 20; i++) {
    const ingredient = selectedRecipe.value[`strIngredient${i}`]
    const measure = selectedRecipe.value[`strMeasure${i}`]
    if (ingredient && ingredient.trim()) {
      list.push({
        ingredient: ingredient.trim(),
        measure: measure ? measure.trim() : ''
      })
    }
  }
  return list
})

// ═══ Extract YouTube embed URL ═══
const youtubeEmbedUrl = computed(() => {
  if (!selectedRecipe.value || !selectedRecipe.value.strYoutube) return null
  const url = selectedRecipe.value.strYoutube
  const match = url.match(/[?&]v=([^&]+)/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : null
})

// ═══ Format instructions into paragraphs ═══
const formattedInstructions = computed(() => {
  if (!selectedRecipe.value || !selectedRecipe.value.strInstructions) return []
  return selectedRecipe.value.strInstructions
    .split(/\r?\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0)
})

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
        :style="{ animationDelay: `${index * 0.06}s` }" @click="openRecipe(plat)">
        <div class="targeta-img-wrap">
          <img :src="plat.strMealThumb" :alt="plat.strMeal" loading="lazy" />
          <div class="targeta-overlay">
            <span class="overlay-btn overlay-btn-recipe">📖 Veure Recepta</span>
            <a v-if="plat.strYoutube" :href="plat.strYoutube" target="_blank" rel="noopener noreferrer"
              class="overlay-btn overlay-btn-video" @click.stop>
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

    <!-- ═══ Recipe Detail Modal ═══ -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="selectedRecipe" class="modal-backdrop" @click.self="closeRecipe" id="recipe-modal">
          <div class="modal-container">
            <button class="modal-close" @click="closeRecipe" aria-label="Tancar">✕</button>

            <!-- Hero Image -->
            <div class="modal-hero">
              <img :src="selectedRecipe.strMealThumb" :alt="selectedRecipe.strMeal" />
              <div class="modal-hero-overlay">
                <h2 class="modal-title">{{ selectedRecipe.strMeal }}</h2>
                <div class="modal-tags">
                  <span class="modal-tag modal-tag-category">{{ selectedRecipe.strCategory }}</span>
                  <span class="modal-tag modal-tag-area">{{ selectedRecipe.strArea }}</span>
                  <span v-if="selectedRecipe.strTags" class="modal-tag modal-tag-extra"
                    v-for="tag in selectedRecipe.strTags.split(',')" :key="tag">{{ tag.trim() }}</span>
                </div>
              </div>
            </div>

            <div class="modal-content" v-if="!loadingDetail">
              <!-- Ingredients Section -->
              <section class="modal-section" v-if="ingredients.length > 0">
                <h3 class="section-title"><span class="section-icon">🥘</span> Ingredients</h3>
                <div class="ingredients-grid">
                  <div v-for="(item, i) in ingredients" :key="i" class="ingredient-item">
                    <img :src="`https://www.themealdb.com/images/ingredients/${item.ingredient}-Small.png`"
                      :alt="item.ingredient" class="ingredient-img" loading="lazy" />
                    <div class="ingredient-text">
                      <span class="ingredient-name">{{ item.ingredient }}</span>
                      <span class="ingredient-measure">{{ item.measure }}</span>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Instructions Section -->
              <section class="modal-section" v-if="formattedInstructions.length > 0">
                <h3 class="section-title"><span class="section-icon">📝</span> Instruccions</h3>
                <div class="instructions-body">
                  <p v-for="(step, i) in formattedInstructions" :key="i" class="instruction-step">
                    {{ step }}
                  </p>
                </div>
              </section>

              <!-- Video Section -->
              <section class="modal-section" v-if="youtubeEmbedUrl">
                <h3 class="section-title"><span class="section-icon">🎬</span> Vídeo</h3>
                <div class="video-container">
                  <iframe :src="youtubeEmbedUrl" frameborder="0" allowfullscreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture">
                  </iframe>
                </div>
              </section>

              <!-- Source link -->
              <div class="modal-source" v-if="selectedRecipe.strSource">
                <a :href="selectedRecipe.strSource" target="_blank" rel="noopener noreferrer" class="source-link">
                  🔗 Font original de la recepta
                </a>
              </div>
            </div>

            <div v-else class="modal-loading">
              <div class="spinner"></div>
              <p>Carregant recepta completa...</p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
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
  animation: cardIn 0.5s ease both; box-shadow: var(--shadow-sm); cursor: pointer;
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
  position: absolute; inset: 0; background: rgba(0,0,0,0.5);
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;
  opacity: 0; transition: opacity var(--transition-fast);
}
.targeta:hover .targeta-overlay { opacity: 1; }
.overlay-btn {
  padding: 10px 20px; backdrop-filter: blur(8px);
  color: white; border-radius: var(--radius-sm); text-decoration: none;
  font-weight: 600; font-size: 0.85rem; transition: all var(--transition-fast);
  cursor: pointer;
}
.overlay-btn-recipe {
  background: rgba(217,119,6,0.7);
}
.overlay-btn-recipe:hover { background: rgba(217,119,6,0.9); }
.overlay-btn-video {
  background: rgba(255,255,255,0.2);
}
.overlay-btn-video:hover { background: rgba(255,255,255,0.3); }
.targeta-body { padding: 18px; }
.targeta-title { font-size: 1.05rem; font-weight: 700; margin-bottom: 10px; line-height: 1.3; }
.targeta-tags { display: flex; gap: 8px; flex-wrap: wrap; }
.tag { padding: 4px 12px; border-radius: 50px; font-size: 0.75rem; font-weight: 600; }
.tag-category { background: rgba(217,119,6,0.1); color: var(--accent-primary); }
.tag-area { background: rgba(5,150,105,0.1); color: var(--accent-secondary); }
.result-count { text-align: center; margin-top: 32px; padding: 12px; color: var(--text-muted); font-size: 0.85rem; }

/* ═══════════════════════════════════════════════
   RECIPE DETAIL MODAL
   ═══════════════════════════════════════════════ */

/* Transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-from .modal-container,
.modal-fade-leave-to .modal-container {
  transform: translateY(30px) scale(0.96);
}

.modal-backdrop {
  position: fixed; inset: 0; z-index: 10000;
  background: rgba(0,0,0,0.6); backdrop-filter: blur(6px);
  display: flex; align-items: flex-start; justify-content: center;
  padding: 40px 20px; overflow-y: auto;
}

.modal-container {
  position: relative;
  width: 100%; max-width: 800px;
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  box-shadow: 0 25px 60px rgba(0,0,0,0.25);
  overflow: hidden;
  animation: modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  transition: transform 0.3s ease;
}

@keyframes modalSlideUp {
  from { opacity: 0; transform: translateY(40px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.modal-close {
  position: absolute; top: 16px; right: 16px; z-index: 10;
  width: 40px; height: 40px;
  background: rgba(0,0,0,0.5); backdrop-filter: blur(10px);
  color: white; border: none; border-radius: 50%;
  font-size: 1.1rem; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all var(--transition-fast);
}
.modal-close:hover { background: rgba(0,0,0,0.7); transform: scale(1.1); }

/* ═══ Hero Image ═══ */
.modal-hero {
  position: relative; width: 100%; aspect-ratio: 16/9; overflow: hidden;
}
.modal-hero img {
  width: 100%; height: 100%; object-fit: cover;
}
.modal-hero-overlay {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 60px 32px 28px;
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%);
}
.modal-title {
  font-size: clamp(1.4rem, 3.5vw, 2rem);
  font-weight: 800; color: white; margin-bottom: 10px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.3);
}
.modal-tags { display: flex; gap: 8px; flex-wrap: wrap; }
.modal-tag {
  padding: 5px 14px; border-radius: 50px;
  font-size: 0.75rem; font-weight: 600; backdrop-filter: blur(6px);
}
.modal-tag-category { background: rgba(217,119,6,0.8); color: white; }
.modal-tag-area { background: rgba(5,150,105,0.8); color: white; }
.modal-tag-extra { background: rgba(255,255,255,0.2); color: white; }

/* ═══ Content ═══ */
.modal-content {
  padding: 32px;
}

.modal-section {
  margin-bottom: 32px;
}
.modal-section:last-child { margin-bottom: 0; }

.section-title {
  font-size: 1.15rem; font-weight: 700;
  margin-bottom: 18px; display: flex; align-items: center; gap: 8px;
  padding-bottom: 10px; border-bottom: 2px solid rgba(217,119,6,0.15);
  color: var(--text-primary);
}
.section-icon { font-size: 1.2em; }

/* ═══ Ingredients Grid ═══ */
.ingredients-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}
.ingredient-item {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 14px;
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-subtle);
  transition: all var(--transition-fast);
}
.ingredient-item:hover {
  border-color: rgba(217,119,6,0.2);
  box-shadow: 0 2px 8px rgba(217,119,6,0.08);
}
.ingredient-img {
  width: 40px; height: 40px; object-fit: contain; flex-shrink: 0;
  border-radius: 6px;
}
.ingredient-text { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.ingredient-name {
  font-weight: 600; font-size: 0.88rem; color: var(--text-primary);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.ingredient-measure { font-size: 0.78rem; color: var(--text-muted); }

/* ═══ Instructions ═══ */
.instructions-body {
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  padding: 24px;
  border: 1px solid var(--border-subtle);
}
.instruction-step {
  font-size: 0.93rem; line-height: 1.75;
  color: var(--text-secondary);
  margin-bottom: 12px;
}
.instruction-step:last-child { margin-bottom: 0; }

/* ═══ Video ═══ */
.video-container {
  position: relative; width: 100%;
  padding-top: 56.25%; /* 16:9 */
  border-radius: var(--radius-md); overflow: hidden;
  box-shadow: var(--shadow-md);
}
.video-container iframe {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  border-radius: var(--radius-md);
}

/* ═══ Source ═══ */
.modal-source {
  text-align: center; padding-top: 20px;
  border-top: 1px solid var(--border-subtle); margin-top: 24px;
}
.source-link {
  display: inline-flex; align-items: center; gap: 6px;
  color: var(--accent-primary); font-weight: 600; font-size: 0.9rem;
  text-decoration: none; padding: 10px 20px;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}
.source-link:hover {
  background: rgba(217,119,6,0.06);
  text-decoration: underline;
}

/* ═══ Modal Loading ═══ */
.modal-loading {
  padding: 60px 20px; text-align: center;
  color: var(--text-secondary);
}

/* ═══ Responsive ═══ */
@media (max-width: 768px) {
  .search-bar { flex-direction: column; }
  .graella { grid-template-columns: 1fr; }
  .modal-backdrop { padding: 20px 12px; }
  .modal-content { padding: 20px; }
  .ingredients-grid { grid-template-columns: 1fr; }
  .modal-hero-overlay { padding: 40px 20px 20px; }
}
</style>
