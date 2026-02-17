import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import router from './router'
import App from './App.vue'

// Styles
import './assets/styles/main.css'
import 'primevue/resources/themes/lara-light-amber/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

// PrimeVue Components
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Card from 'primevue/card'
import Dialog from 'primevue/dialog'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import ConfirmDialog from 'primevue/confirmdialog'
import ConfirmationService from 'primevue/confirmationservice'
import FileUpload from 'primevue/fileupload'
import Dropdown from 'primevue/dropdown'
import Tag from 'primevue/tag'

const app = createApp(App)
const pinia = createPinia()

// PrimeVue
app.use(PrimeVue, { ripple: true })
app.use(ToastService)
app.use(ConfirmationService)

// PrimeVue Components
app.component('Button', Button)
app.component('InputText', InputText)
app.component('Textarea', Textarea)
app.component('Card', Card)
app.component('Dialog', Dialog)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('ConfirmDialog', ConfirmDialog)
app.component('Toast', Toast)
app.component('FileUpload', FileUpload)
app.component('Dropdown', Dropdown)
app.component('Tag', Tag)

app.use(pinia)
app.use(router)

app.mount('#app')
