import { createRouter, createWebHashHistory } from 'vue-router'
import GameView from '@/views/GameView.vue'
import Stage1View from '@/views/Stage1View.vue'
import Stage2View from '@/views/Stage2View.vue'
import Stage3View from '@/views/Stage3View.vue'
import Stage4View from '@/views/Stage4View.vue'
import Stage5View from '@/views/Stage5View.vue'
import Scene2to3View from '@/views/Scene2to3View.vue'
import Scene3to4View from '@/views/Scene3to4View.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: GameView,
      children: [
        { path: '', redirect: '/stage/1' },
        { path: 'stage/1', component: Stage1View },
        { path: 'stage/2', component: Stage2View },
        { path: 'scene/2to3', component: Scene2to3View },
        { path: 'stage/3', component: Stage3View },
        { path: 'scene/3to4', component: Scene3to4View },
        { path: 'stage/4', component: Stage4View },
        { path: 'stage/5', component: Stage5View },
      ],
    },
  ],
})

export default router
