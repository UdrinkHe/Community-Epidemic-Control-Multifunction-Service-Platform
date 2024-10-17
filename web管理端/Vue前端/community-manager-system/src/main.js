// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import elementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'echarts'
import Echarts from 'vue-echarts'
import axios from 'axios'
import cookie from '../src/utils/myCookie'
Vue.prototype.$axios=axios
Vue.component('echarts',Echarts)
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
Vue.use(mavonEditor)

axios.defaults.headers.post['Content-Type'] = 'application/json';
import { Loading } from 'element-ui';

Vue.use(elementUI)
Vue.config.productionTip = false

/* eslint-disable no-new */
//路由拦截器
router.beforeEach((to, from, next) => {
  //判断要去的路由有没有requiresAuth
  if (to.meta.needLoginToken) {
   let username = window.sessionStorage.getItem('usernameKey') //需要有username这个字段的值
   if (username) {
    next();
   } else {
    next({
     path: '/login'
    });
   }
  } else {
   next(); //无需验证
  }
 })

//创建Vue实例之前创建全局过滤器
//过滤器1 将时间戳传化为本地的时间字符串
Vue.filter('myTimeMaker',function(timeNumber){
  if(!timeNumber)return ''
  if(typeof timeNumber!='number')
  {
    return timeNumber
  }
    let time=new Date(timeNumber);
    let hourNumber=time.getHours();
    let secondNumber=time.getSeconds();
    let minuteNumber=time.getMinutes();
    if(hourNumber<10)
    {
      hourNumber="0"+hourNumber;
    }
    if(secondNumber<10)
    {
      secondNumber="0"+secondNumber;
    }
    if(minuteNumber<10)
    {
      minuteNumber="0"+minuteNumber;
    }
    return (time.getFullYear()+"年"+(time.getMonth()+1)+"月"+time.getDate()+"日"+" "+hourNumber+":"+minuteNumber+":"+secondNumber)
})

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
//axios请求封装
axios.interceptors.request.use(
  config => {
   let token = window.sessionStorage.getItem('usernameKey');//获取存储的session
   if (token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
    config.headers.username = `${token}`;
   }
   return config;
  },
  err => {
   return Promise.reject(err);
  });
  
 // http 相应封装 拦截器
 axios.interceptors.response.use(
  response => {
   return response;
  },
  error => {
   if (error.response) {
    switch (error.response.status) {
     case 40000:
      // 返回 401 清除token信息并跳转到登录页面
      router.replace({
       path: '/login'
      });
    }
   }
   return Promise.reject(error.response.data);  // 返回接口返回的错误信息
  });
 Vue.prototype.$http = axios;

