import { createRouter, createWebHashHistory } from 'vue-router'
import Portada from '../views/Portada.vue'
import ApiView from '../views/ApiView.vue'
import CrudView from '../views/CrudView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'portada', component: Portada },
    { path: '/api', name: 'api', component: ApiView },
    { path: '/crud', name: 'crud', component: CrudView }
  ]
})
export default router
