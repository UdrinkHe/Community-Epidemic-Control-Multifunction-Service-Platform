// app.js
App({
  onLaunch: function () {
 
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'hyj-yunkaifa-4gu6ljl6bd8b40b2',
        traceUser: true,
      });
    }

    console.log('小程序打开了!');
    wx.checkSession().then(
      ()=>{
        //未过期
        console.log('登录状态未过期')
        this.globalData.isCheck=true;
        //调用云函数获取个人openid并初始化数据
        if(this.globalData.iscloudOpen)
        {
          console.log('云函数已开启!')
          wx.cloud.callFunction(
            {
              name:'loginFunction',
              data:{
                type:'loginUserOpenIdGet',
                type_2nd:'getOpenId'
              }
            }
          ).then((res)=>{
            this.globalData.openid=res.result;
            this.globalData.isLogin=1;
          }).catch((err)=>{
            console.log(err)
          })
        }
       
      }
    ).catch(()=>{
    //已过期
      console.log('登录状态过期')
      this.globalData.isCheck=true;
      this.globalData.isLogin=-1;
      //跳转到登录页
    })
    this.globalData = {
      openid:'',//账号的加密过的个人openid
      isLogin:0,//这个账号的登录状态 0未确定 1已经登录 -1未登陆
      isCheck:false, //是否确认过登录态了
      notCheckPage:null,//未确认登录数据时打开的第一个页面
      iscloudOpen:true,//是否开启云函数功能(写页面模板时请关闭)
      personalInfoLevel:-1//个人信息完善等级 -1系统未检查情况 0未认证 1完成基本认证 2基本资料审核中 3个人信息已完善(居民) 4信息完善(工作者)
    };
  }
});
