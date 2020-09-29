// 引入axios以及element ui中的loading和message组件
import axios from 'axios'
import store from '../store'
import router from '../router/router';
import { getToken, setToken, removeToken } from '@/util/auth';
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
// 请求参数为对象

axios.defaults.timeout = 60000;
//跨域请求，允许保存cookie
// axios.defaults.withCredentials = true;
NProgress.configure({ showSpinner: false })// NProgress Configuration
let cfg, msg;
msg = '服务器君开小差了，请稍后再试';
//HTTPrequest拦截
axios.interceptors.request.use(config => {
    if (localStorage.getItem('token')) {
        config.headers['x-access-token'] = localStorage.getItem('token');
    }
	NProgress.start() // start progress bar
	return config
}, error => {
	console.log('err' + error)// for debug
	return Promise.reject(error)
})
//HTTPresponse拦截
axios.interceptors.response.use(response => {
    NProgress.done();
	return response
}, error => {
    NProgress.done();
    if (error.response.status) {
        switch (error.response.status) {
            case 401:
                if (localStorage.getItem('userInfo')) {
                    localStorage.removeItem('userInfo');
                    router.replace({
                        path: '/login',
                        // query: { redirect: router.currentRoute.fullPath }
                    });
                    Vue.prototype.$message.warning('当前用户信息已失效,请重新登录')
                }
                break;
        }
        return Promise.reject(error.response);
    }
})

export function get(url, params){
    return new Promise((resolve, reject) =>{
        axios.get('/br'+url, {
            params: params
        })
        .then(res => {
            resolve(res.data);
        })
        .catch(err => {
          reject(err.data)
        })
    });
}
export function post(url, params) {
    return new Promise((resolve, reject) => {
        axios.post('/br'+url,params)
        .then(res => {
            resolve(res.data);
        })
        .catch(err => {
            reject(err.data)
        })
    });
}
export function bqcmGet(url, params) {
    return new Promise((resolve, reject) => {
        axios.get('/cm' + url, {
            params: params
        })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}
export function bqcmPost(url, params) {
    return new Promise((resolve, reject) => {
        axios.post('/cm' + url, params)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}
export function etlGet(url, params){
    return new Promise((resolve, reject) =>{
        axios.get('/etl'+url, {
            params: params
        })
        .then(res => {
            resolve(res.data);
        })
        .catch(err => {
          reject(err.data)
        })
    });
}
export function etlPost(url, params) {
    return new Promise((resolve, reject) => {
        axios.post('/etl'+url,params)
        .then(res => {
            resolve(res.data);
        })
        .catch(err => {
            reject(err.data)
        })
    });
}
export default axios