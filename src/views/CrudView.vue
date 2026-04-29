<script setup>
import { ref, computed, watch, onMounted } from 'vue'

// ═══ localStorage helpers ═══
const STORAGE_KEY = 'mealplanner-menus'

const loadMenus = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch (e) {
    console.error('Error carregant menús:', e)
  }
  return []
}

const saveMenus = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Error guardant menús:', e)
  }
}

// ═══ State ═══
const menus = ref(loadMenus())
const nouDia = ref('Dilluns')
const nouPlat = ref('')
const dies = ['Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte', 'Diumenge']

// Persist on every change
watch(menus, (val) => saveMenus(val), { deep: true })

// ═══ Autocomplete State ═══
const suggestions = ref([])
const showSuggestions = ref(false)
const isSearching = ref(false)
let debounceTimer = null

watch(nouPlat, (newVal) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  if (newVal.trim().length < 2) {
    suggestions.value = []
    showSuggestions.value = false
    return
  }
  isSearching.value = true
  debounceTimer = setTimeout(async () => {
    try {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${newVal.trim()}`)
      const data = await res.json()
      suggestions.value = data.meals || []
      showSuggestions.value = suggestions.value.length > 0
    } catch (err) {
      console.error('Error cercant receptes:', err)
      suggestions.value = []
    } finally {
      isSearching.value = false
    }
  }, 350)
})

const selectedMeal = ref(null)

const selectSuggestion = (meal) => {
  nouPlat.value = meal.strMeal
  selectedMeal.value = meal
  showSuggestions.value = false
}

const closeSuggestions = () => {
  setTimeout(() => { showSuggestions.value = false }, 200)
}

// ═══ CRUD Operations ═══
const afegirMenu = () => {
  if (nouPlat.value.trim() === '') return
  menus.value.push({
    id: Date.now(),
    dia: nouDia.value,
    plat: nouPlat.value,
    thumb: selectedMeal.value ? selectedMeal.value.strMealThumb : null,
    mealId: selectedMeal.value ? selectedMeal.value.idMeal : null
  })
  nouPlat.value = ''
  selectedMeal.value = null
  suggestions.value = []
}

const esborrarMenu = (id) => {
  menus.value = menus.value.filter(m => m.id !== id)
}

// ═══ Grouped by day ═══
const menusPerDia = computed(() => {
  const grouped = {}
  dies.forEach(dia => { grouped[dia] = menus.value.filter(m => m.dia === dia) })
  return grouped
})

const diesAmbMenus = computed(() => dies.filter(dia => menusPerDia.value[dia].length > 0))

const getMealUrl = (mealId) => `https://www.themealdb.com/meal/${mealId}`
</script>

<template>
  <div class="crud-page" id="crud-page">
    <div class="page-header">
      <h1 class="page-title">
        <span class="title-icon">📅</span>
        Planificador <span class="gradient-text">Setmanal</span>
      </h1>
      <p class="page-subtitle">Organitza els teus àpats de la setmana amb receptes de TheMealDB</p>
    </div>

    <!-- Add Form -->
    <div class="form-card" id="form-add-menu">
      <div class="form-header">
        <span class="form-header-icon">➕</span>
        <h2>Afegir Àpat</h2>
      </div>
      <div class="form-body">
        <div class="form-row">
          <div class="form-group">
            <label for="select-dia" class="form-label">Dia de la setmana</label>
            <select v-model="nouDia" id="select-dia" class="form-select">
              <option v-for="dia in dies" :key="dia" :value="dia">{{ dia }}</option>
            </select>
          </div>
          <div class="form-group form-group-grow">
            <label for="input-plat" class="form-label">Nom del plat</label>
            <div class="autocomplete-wrap">
              <input v-model="nouPlat" id="input-plat" type="text" placeholder="Escriu per cercar receptes..."
                @keyup.enter="afegirMenu" @focus="showSuggestions = suggestions.length > 0"
                @blur="closeSuggestions" class="form-input" autocomplete="off" />
              <div v-if="isSearching" class="autocomplete-spinner"></div>
              <div v-if="showSuggestions" class="suggestions-dropdown" id="suggestions-list">
                <div v-for="meal in suggestions.slice(0, 8)" :key="meal.idMeal" class="suggestion-item"
                  @mousedown.prevent="selectSuggestion(meal)">
                  <img :src="meal.strMealThumb + '/preview'" :alt="meal.strMeal" class="suggestion-thumb" />
                  <div class="suggestion-info">
                    <span class="suggestion-name">{{ meal.strMeal }}</span>
                    <span class="suggestion-meta">{{ meal.strCategory }} · {{ meal.strArea }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="selectedMeal" class="selected-preview">
              <img :src="selectedMeal.strMealThumb + '/preview'" :alt="selectedMeal.strMeal" class="selected-thumb" />
              <span class="selected-name">{{ selectedMeal.strMeal }}</span>
              <button @click="selectedMeal = null; nouPlat = ''" class="selected-clear" aria-label="Esborrar selecció">✕</button>
            </div>
          </div>
        </div>
        <button @click="afegirMenu" class="btn-afegir" id="btn-add-menu">
          <span>➕</span> Afegir al menú
        </button>
      </div>
    </div>

    <!-- Weekly Planner -->
    <div class="planner" id="weekly-planner">
      <div v-if="diesAmbMenus.length === 0" class="empty-state">
        <span class="empty-icon">🍽️</span>
        <h3>Cap àpat planificat</h3>
        <p>Utilitza el formulari de dalt per començar a planificar la teva setmana!</p>
      </div>
      <div v-for="dia in diesAmbMenus" :key="dia" class="day-section">
        <div class="day-header">
          <span class="day-dot"></span>
          <h3 class="day-name">{{ dia }}</h3>
          <span class="day-count">{{ menusPerDia[dia].length }} àpat{{ menusPerDia[dia].length > 1 ? 's' : '' }}</span>
        </div>
        <div class="day-meals">
          <div v-for="menu in menusPerDia[dia]" :key="menu.id" class="meal-card">
            <div class="meal-visual">
              <img v-if="menu.thumb" :src="menu.thumb + '/preview'" :alt="menu.plat" class="meal-thumb" />
              <div v-else class="meal-thumb-placeholder"><span>🍴</span></div>
            </div>
            <div class="meal-info">
              <span class="meal-name">{{ menu.plat }}</span>
              <a v-if="menu.mealId" :href="getMealUrl(menu.mealId)" target="_blank" rel="noopener noreferrer" class="meal-link">
                🔗 Veure recepta completa
              </a>
              <span v-else class="meal-custom">Recepta personalitzada</span>
            </div>
            <button @click="esborrarMenu(menu.id)" class="btn-esborrar" :id="'btn-delete-' + menu.id" aria-label="Eliminar àpat">
              <span class="delete-icon">🗑️</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.crud-page { animation: fadeIn 0.4s ease; }
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

/* ═══ Form Card — NO overflow:hidden so dropdown can escape ═══ */
.form-card {
  background: var(--bg-card); border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg); margin-bottom: 40px;
  box-shadow: var(--shadow-sm); position: relative;
}
.form-header {
  display: flex; align-items: center; gap: 10px; padding: 18px 24px;
  border-bottom: 1px solid var(--border-subtle); background: rgba(217,119,6,0.03);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}
.form-header-icon { font-size: 1.2rem; }
.form-header h2 { font-size: 1.1rem; font-weight: 700; }
.form-body { padding: 24px; }
.form-row { display: flex; gap: 16px; margin-bottom: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group-grow { flex: 1; }
.form-label {
  font-size: 0.8rem; font-weight: 600; color: var(--text-secondary);
  text-transform: uppercase; letter-spacing: 0.05em;
}
.form-select, .form-input {
  padding: 12px 16px; background: var(--bg-input); border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm); color: var(--text-primary); font-size: 0.95rem;
  font-family: 'Inter', sans-serif; transition: all var(--transition-fast);
}
.form-select:focus, .form-input:focus {
  outline: none; border-color: var(--border-focus);
  box-shadow: 0 0 0 3px rgba(217,119,6,0.12);
}
.form-input::placeholder { color: var(--text-muted); }
.form-select { cursor: pointer; min-width: 160px; }

/* ═══ Autocomplete — positioned absolutely, escapes parent ═══ */
.autocomplete-wrap { position: relative; z-index: 60; }
.autocomplete-spinner {
  position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
  width: 18px; height: 18px; border: 2px solid var(--border-subtle);
  border-top-color: var(--accent-primary); border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: translateY(-50%) rotate(360deg); } }
.suggestions-dropdown {
  position: absolute; top: calc(100% + 6px); left: 0; right: 0;
  background: var(--bg-card); border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md); box-shadow: var(--shadow-lg);
  z-index: 9999; max-height: 360px; overflow-y: auto; animation: dropIn 0.2s ease;
}
@keyframes dropIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}
.suggestion-item {
  display: flex; align-items: center; gap: 12px; padding: 10px 14px;
  cursor: pointer; transition: background var(--transition-fast);
  border-bottom: 1px solid var(--border-subtle);
}
.suggestion-item:last-child { border-bottom: none; }
.suggestion-item:hover { background: rgba(217,119,6,0.06); }
.suggestion-thumb { width: 44px; height: 44px; border-radius: var(--radius-sm); object-fit: cover; flex-shrink: 0; }
.suggestion-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.suggestion-name {
  font-weight: 600; font-size: 0.9rem; color: var(--text-primary);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.suggestion-meta { font-size: 0.75rem; color: var(--text-muted); }

/* ═══ Selected Preview ═══ */
.selected-preview {
  display: flex; align-items: center; gap: 10px; margin-top: 10px;
  padding: 8px 12px; background: rgba(5,150,105,0.06);
  border: 1px solid rgba(5,150,105,0.15); border-radius: var(--radius-sm);
}
.selected-thumb { width: 32px; height: 32px; border-radius: 6px; object-fit: cover; }
.selected-name { flex: 1; font-size: 0.85rem; font-weight: 600; color: var(--accent-secondary); }
.selected-clear {
  background: none; border: none; color: var(--text-muted); cursor: pointer;
  font-size: 1rem; padding: 4px; transition: color var(--transition-fast);
}
.selected-clear:hover { color: var(--danger); }

/* ═══ Add Button ═══ */
.btn-afegir {
  display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px;
  background: var(--accent-gradient); color: white; border: none;
  border-radius: var(--radius-sm); font-weight: 600; font-size: 0.9rem;
  font-family: 'Inter', sans-serif; cursor: pointer; transition: all var(--transition-fast);
  width: 100%; justify-content: center;
}
.btn-afegir:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(217,119,6,0.25); }

/* ═══ Planner ═══ */
.empty-state { text-align: center; padding: 60px 20px; }
.empty-icon { font-size: 3rem; display: block; margin-bottom: 12px; opacity: 0.6; }
.empty-state h3 { font-size: 1.2rem; font-weight: 700; margin-bottom: 8px; }
.empty-state p { color: var(--text-muted); font-size: 0.9rem; }

.day-section { margin-bottom: 28px; animation: fadeInUp 0.4s ease both; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
.day-header {
  display: flex; align-items: center; gap: 10px; margin-bottom: 12px;
  padding-bottom: 8px; border-bottom: 1px solid var(--border-subtle);
}
.day-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--accent-gradient); flex-shrink: 0; }
.day-name { font-size: 1.15rem; font-weight: 700; }
.day-count {
  margin-left: auto; font-size: 0.8rem; color: var(--text-muted);
  background: var(--bg-secondary); padding: 3px 10px; border-radius: 50px;
}
.day-meals { display: flex; flex-direction: column; gap: 10px; }

.meal-card {
  display: flex; align-items: center; gap: 14px; padding: 14px 16px;
  background: var(--bg-card); border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md); transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}
.meal-card:hover { border-color: rgba(217,119,6,0.15); box-shadow: var(--shadow-md); }
.meal-visual { flex-shrink: 0; }
.meal-thumb {
  width: 56px; height: 56px; border-radius: var(--radius-sm);
  object-fit: cover; transition: transform var(--transition-fast);
}
.meal-card:hover .meal-thumb { transform: scale(1.05); }
.meal-thumb-placeholder {
  width: 56px; height: 56px; border-radius: var(--radius-sm);
  background: rgba(217,119,6,0.06); display: flex; align-items: center;
  justify-content: center; font-size: 1.4rem;
}
.meal-info { flex: 1; display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.meal-name { font-weight: 600; font-size: 1rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.meal-link {
  font-size: 0.8rem; color: var(--accent-primary); text-decoration: none;
  font-weight: 500; transition: color var(--transition-fast);
}
.meal-link:hover { color: var(--accent-primary-hover); text-decoration: underline; }
.meal-custom { font-size: 0.8rem; color: var(--text-muted); font-style: italic; }
.btn-esborrar {
  background: none; border: 1px solid transparent; padding: 8px;
  border-radius: var(--radius-sm); cursor: pointer; transition: all var(--transition-fast); flex-shrink: 0;
}
.btn-esborrar:hover { background: rgba(220,38,38,0.06); border-color: rgba(220,38,38,0.15); }
.delete-icon { font-size: 1.1rem; }

@media (max-width: 768px) {
  .form-row { flex-direction: column; }
  .form-select { min-width: 100%; }
  .meal-card { flex-wrap: wrap; }
  .meal-info { flex-basis: calc(100% - 86px); }
  .btn-esborrar { margin-left: auto; }
}
</style>
