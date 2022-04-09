import { createApp } from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import VueCookies from 'vue-cookies'

const app = createApp(App)

app.config.globalProperties.apiURL = "http://localhost:1337/api/"

app.use(router)
app.use(VueCookies)

app.$cookies.config('2d')

app.mount('#app')