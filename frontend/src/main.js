import Aura from '@primevue/themes/aura';
import { createPinia } from 'pinia';
import 'primeicons/primeicons.css';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.js';
import './style.css';

// Public PrimeVue Components
import Badge from 'primevue/badge';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Carousel from 'primevue/carousel';
import Divider from 'primevue/divider';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import TabPanel from 'primevue/tabpanel';
import TabView from 'primevue/tabview';
import Tag from 'primevue/tag';
import Textarea from 'primevue/textarea';
import Toast from 'primevue/toast';

// Admin PrimeVue Components
import Column from 'primevue/column';
import ConfirmDialog from 'primevue/confirmdialog';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import FileUpload from 'primevue/fileupload';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.dark-mode',
    },
  },
});
app.use(ToastService);
app.use(ConfirmationService);
app.directive('tooltip', Tooltip);

// Public components (P-prefixed)
app.component('PButton', Button);
app.component('PCard', Card);
app.component('PCarousel', Carousel);
app.component('PInputText', InputText);
app.component('PTextarea', Textarea);
app.component('PToast', Toast);
app.component('PTabView', TabView);
app.component('PTabPanel', TabPanel);
app.component('PTag', Tag);
app.component('PBadge', Badge);
app.component('PDivider', Divider);
app.component('PSelect', Select);

// Admin components (also registered globally for use in admin views)
app.component('Button', Button);
app.component('InputText', InputText);
app.component('Textarea', Textarea);
app.component('Select', Select);
app.component('Tag', Tag);
app.component('Toast', Toast);
app.component('Dialog', Dialog);
app.component('ConfirmDialog', ConfirmDialog);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('FileUpload', FileUpload);

app.mount('#app');
