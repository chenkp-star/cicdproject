import { createApp } from 'vue';
import App from './App.vue';
import { setupMonitoring } from './monitoring.js';

const app = createApp(App);
setupMonitoring(app);
app.mount('#app');
