/* eslint vue/multi-word-component-names: 0 */
/* eslint vue/no-reserved-component-names: 0 */
import 'primeflex/primeflex.scss';
import './styles/themes/theme.scss';
// import './styles/themes/lara-light/theme.scss';
import 'primeicons/primeicons.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import PrimeVue from 'primevue/config';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Menubar from 'primevue/menubar';
import Panel from 'primevue/panel';
import DataTable from 'primevue/datatable';
import InputNumber from 'primevue/inputnumber';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import Checkbox from 'primevue/checkbox';
import TabView from 'primevue/tabview';
import ScrollPanel from 'primevue/scrollpanel';
import FileUpload from 'primevue/fileupload';
import ProgressSpinner from 'primevue/progressspinner';
import { useAuthStore } from '@/stores/auth.store';
import SelectButton from 'primevue/selectbutton';
import ToggleButton from 'primevue/togglebutton';
import Card from 'primevue/card';
import { useHandlersStore } from '@/stores/handlers.store';
import { useColorStore } from '@/stores/color.store';
import Chip from 'primevue/chip';
import Slider from 'primevue/slider';
import ToastService from 'primevue/toastservice';
import SetupInterceptors from '@/utils/fetchInterceptor';
import Toast from 'primevue/toast';

export const app = createApp(App);

app.use(router);
app.use(PrimeVue);
app.use(ToastService);
SetupInterceptors();

app.use(createPinia());
await useAuthStore().init();

app.component('Button', Button);
app.component('Card', Card);
app.component('Chip', Chip);
app.component('SelectButton', SelectButton);
app.component('ToggleButton', ToggleButton);
app.component('InputText', InputText);
app.component('InputNumber', InputNumber);
app.component('Menubar', Menubar);
app.component('Panel', Panel);
app.component('DataTable', DataTable);
app.component('Dialog', Dialog);
app.component('Dropdown', Dropdown);
app.component('Checkbox', Checkbox);
app.component('TabView', TabView);
app.component('ScrollPanel', ScrollPanel);
app.component('FileUpload', FileUpload);
app.component('Spinner', ProgressSpinner);
app.component('Slider', Slider);
app.component('Toast', Toast);

app.mount('#app');
