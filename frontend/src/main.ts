import './assets/main.css'
import '@aws-amplify/ui-vue/styles.css';

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import AmplifyVue from '@aws-amplify/ui-vue';

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(AmplifyVue)

app.mount('#app')
