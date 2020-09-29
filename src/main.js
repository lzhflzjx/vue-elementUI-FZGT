import Vue from 'vue';
import axios from './router/axios';
import VueAxios from 'vue-axios';
import requrestAxios from 'axios';
import App from './App';
import './permission' // 权限
import './errorLog' // 错误日志
import router from './router/router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import {
  loadStyle
} from './util/util'
import * as urls from '@/config/env';
import {
  iconfontUrl,
  iconfontVersion
} from '@/config/env';
import './assets/icon.css'
import * as filters from './filters' // 全局filter
import './styles/common.scss';
import AVUE from '../packages/index.js';
import { get, post, etlGet, etlPost, bqcmGet, bqcmPost} from '@/router/axios'
import methods from './components/js/comFunction'
import echarts from 'echarts'
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)
Vue.use(ElementUI)
Vue.use(VueAxios, axios)
Vue.prototype.$echarts=echarts;
Vue.prototype.methods=methods;
Vue.prototype.$requrestAxios = requrestAxios;
Vue.prototype.$post=post;
Vue.prototype.$get=get;
Vue.prototype.$etlPost=etlPost;
Vue.prototype.$etlGet=etlGet;
Vue.prototype.$bqcmGet = bqcmGet;
Vue.prototype.$bqcmPost = bqcmPost;

Object.keys(urls).forEach(key => {
  Vue.prototype[key] = urls[key];
})

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

iconfontVersion.forEach(ele => {
  loadStyle(iconfontUrl.replace('$key', ele));
})

Vue.config.productionTip = false;


export function createApp() {
  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })
  return {
    app,
    router,
    store
  }
}
