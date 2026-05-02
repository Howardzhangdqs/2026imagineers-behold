import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

const baseUrl = import.meta.env.BASE_URL
console.log('[main] BASE_URL:', baseUrl)
const root = document.documentElement
root.style.setProperty('--bg-shop-clean', `url(${baseUrl}images/backgrounds/shop_clean.png)`)
root.style.setProperty('--bg-shop-slightly-messy', `url(${baseUrl}images/backgrounds/shop_slightly_messy.png)`)
root.style.setProperty('--bg-shop-digital', `url(${baseUrl}images/backgrounds/shop_digital.png)`)
root.style.setProperty('--bg-shop-car', `url(${baseUrl}images/backgrounds/shop_car.png)`)
root.style.setProperty('--bg-shop-warzone-car', `url(${baseUrl}images/backgrounds/shop_warzone_car.png)`)
root.style.setProperty('--bg-shop-ruin-car', `url(${baseUrl}images/backgrounds/shop_ruin_car.png)`)
root.style.setProperty('--bg-rust-overlay', `url(${baseUrl}images/effects/rust_overlay.png)`)

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
