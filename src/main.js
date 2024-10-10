import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import JsonCSV from 'vue-json-csv'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';


createApp(App).component('downloadCSV', JsonCSV).use(PrimeVue, {
    theme: {
        preset: Aura
    }
}).use(store).use(router).mount('#app')
