import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

/**
 * 引用ElementUI 和 ElementUI的样式覆盖
 */
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

/**
 * 通用样式 和 默认样式
 */
import '@/assets/style/common.scss'
import 'normalize.css'
import Storage from 'store'
import * as Methods from '@/utils/Methods'
import Moment from 'moment'
import 'moment/locale/zh-cn'

/**
 * api
 */
import { Api } from '@/utils/Api.js'
// 引入Echarts
import Echarts from 'echarts'
// svg
import SvgIcon from '@/components/SvgIcon.vue'
// 全局注册icon-svg
Vue.component('SvgIcon', SvgIcon)
Vue.prototype.echarts = Echarts
Vue.use(Echarts)
Vue.prototype.$api = Api;
Vue.prototype.$localStorage = Storage;
Vue.prototype.$methods = Methods;
Vue.prototype.$moment = Moment;
Vue.use(ElementUI);
ElementUI.Dialog.props.closeOnClickModal.default = false
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
