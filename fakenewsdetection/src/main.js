import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'
import store from './store'
import Amplify from 'aws-amplify';
import aws_export from './aws-exports';
import locale from 'element-ui/lib/locale/lang/en';

Vue.config.productionTip = false
Vue.use(ElementUI, { locale })

Amplify.configure(aws_export);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')