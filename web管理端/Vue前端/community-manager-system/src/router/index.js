import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      name:'homeDefault',
      redirect:'/login'
    },
    {
      path:'/login',
      name:'loginPage',
      component:()=>import ('../components/mainView/login.vue')
    },
    {
      path: '/home',
      name: 'home',
      redirect:'/home/indexPage',
      component:()=>import ('../components/mainView/layoutView.vue'),
      children:[
        {
          path:'indexPage',  //首页
          name:'indexPage',
          meta:{
            needLoginToken:false
          },
          component:()=>import ('../components/pageView/indexPage.vue')
        },
        {
          path:'userInfoManager',//用户信息管理
          name:'userInfoManager',
          meta:{
            needLoginToken:false
          },
          component:()=>import ('../components/pageView/userDataPage.vue')
        },
        {
          path:'placesInfoManager',//场所信息管理
          name:'placesInfoManager',
          meta:{
            needLoginToken:true,
          },
          component:()=>import ('../components/pageView/placesDataPage.vue'),
        },
        {
          path:'drugInfoManager',//药品信息管理
          name:'drugInfoManager',
          component:()=>import ('../components/pageView/drugDataPage.vue'),
          meta:{
            needLoginToken:false
          }
        },
        {
          path:'drugRecordManager',//购药记录管理
          name:'drugRecordManager',
          component:()=>import ('../components/pageView/drugRecordPage.vue'),
          meta:{
            needLoginToken:false
          }
        },
        {
          path:'packageInfoManager',//包裹记录管理
          name:'packageInfoManager',
          component:()=>import ('../components/pageView/packageDataPage.vue'),
          meta:{
            needLoginToken:false
          }
        },
        {
          path:'noticeInfoManager',//社区通知管理界面
          name:"noticeInfoManager",
          component:()=>import ('../components/pageView/noticeDataPage.vue'),
          meta:{
            needLoginToken:false
          }
        },
        {
          path:'noticeSend',
          name:'noticeSend',
          component:()=>import ('../components/pageView/noticeSend.vue'),
          meta:{
            needLoginToken:false
          }
        },
        { //管理列表模板
          path:'listModule',
          name:'listModule',
          component:()=>import('../components/pageView/listModule.vue')
        }
      ]
    }
  ]
})

