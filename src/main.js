import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import {router} from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import '../src/assets/custom-bootstrap.scss'
import { Tickets, PiggyBank,Banknote,ChevronUp,ChevronDown,Users,Mail} from 'lucide-vue-next';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
const pinia =createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(VueSweetalert2);
app.component('Tickets',Tickets)
app.component('PiggyBank',PiggyBank)
app.component('Banknote',Banknote)
app.component('ChevronUp', ChevronUp);
app.component('ChevronDown', ChevronDown);
app.component('Users', Users);
app.component('Mail', Mail);
app.mount('#app')
