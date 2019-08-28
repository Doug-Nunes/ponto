import Vue from "vue";
import App from "./App.vue";

// Bootstrap Vue Import 
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

// axios
import axios from "axios";

// SmartTable
import SmartTable from 'vuejs-smart-table';

Vue.use(BootstrapVue);
Vue.use(SmartTable);

// Prototypes
Vue.prototype.$http = axios;

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
