import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Styles
import 'primeicons/primeicons.css';
import 'primevue/resources/primevue.min.css';
import 'primevue/resources/themes/lara-light-amber/theme.css';
import './assets/styles/main.css';

// PrimeVue Components
import Button from 'primevue/button';
import Card from 'primevue/card';
import Column from 'primevue/column';
import ConfirmationService from 'primevue/confirmationservice';
import ConfirmDialog from 'primevue/confirmdialog';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import FileUpload from 'primevue/fileupload';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';
import Textarea from 'primevue/textarea';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';

const app = createApp(App);
const pinia = createPinia();

// PrimeVue
app.use(PrimeVue, { ripple: true });
app.use(ToastService);
app.use(ConfirmationService);

// PrimeVue Components
app.component('Button', Button);
app.component('InputText', InputText);
app.component('Textarea', Textarea);
app.component('Card', Card);
app.component('Dialog', Dialog);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('ConfirmDialog', ConfirmDialog);
app.component('Toast', Toast);
app.component('FileUpload', FileUpload);
app.component('Dropdown', Dropdown);
app.component('Tag', Tag);

app.use(pinia);
app.use(router);

app.mount('#app');
