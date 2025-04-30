import { createApp } from 'vue'
import App from './App.vue'
import http from './plugins/http'
import primevue from './plugins/primevue'
import router from './router'
import ToastService from 'primevue/toastservice'

const app = createApp(App)

app.use(router)
app.use(primevue)
app.use(http)
app.use(ToastService)

app.mount('#app')
