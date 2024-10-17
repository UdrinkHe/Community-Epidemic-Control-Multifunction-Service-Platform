// pages/userPage/userPage.js
//引入解密文件
let myCrypto=require("../../until/myCrypto")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin:false,//用来检测登陆状态
    firstLoading:true,//首次加载的时候
    userInfoLevel:-1,//用户信息等级
    levelShowStr:'未认证基本信息',//用于展示用户登记信息等级
    //顶部提示信息参数
     tipMsgShow:null,
     tipMsgType:99,
    //个人信息
      scanCodeImgUrl:"../../images/scanCode.png",//扫一扫图片
      touxiangUrl:null,//头像的地址
      userName:"无",
      userIdentity:"未认证",//用户身份
    //个人信息模块
    personalInfoNav:
    [
      {
        NavBarKey:'NavToPersonalInfo',
        NavBarName:'个人资料',
        NavBarFunction:'NavToPersonalInfo',
        iconPath:'../../images/personalInfo.png' 
      },
      {
        NavBarKey:'NavToDrugRecord',
        NavBarName:'购药记录',
        NavBarFunction:'NavToDrugRecord',
        iconPath:'../../images/drugRecord.png'
      },
      {
        NavBarKey:'NavToPackageRecord',
        NavBarName:'取物记录',
        NavBarFunction:'NavToPackageRecord',
        iconPath:'../../images/packageRecord.png'
      }
    ],
    //功能分区模块
    FunctionBlock:[
      {
        keyName:'communityService',
        name:'社区便民服务',
        functions:[
          {
            functionKey:'drugDocument',
            functionName:'购药登记',
            functionTap:'drugPage',
            allCanUse:true,
            functionImg:'../../images/drug.png'
          },
          {
            functionKey:'packageDocument',
            functionName:'包裹管理',
            functionTap:'PackagePage',
            allCanUse:true,
            functionImg:'../../images/package.png'
          },
          // {
          //   functionKey:'NucleicAcidTest',
          //   functionName:'核酸检测',
          //   functionTap:'NucleicAcidTest',
          //   allCanUse:true,
          //   functionImg:'../../images/NucleicAcidTest.png'
          // },
          {
            functionKey:'placeApply',
            functionName:'地点上报',
            functionTap:'placeApplyPage',
            allCanUse:false,
            functionImg:'../../images/place.png'
          }
        ]
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //等待数据检验完成
    const app=getApp();
    const that=this;
    console.log('页面启动！')
    if(this.data.firstLoading)
    {
      wx.showLoading(
        {
          title:'加载用户数据中',
          mask:true
        }
      )
    }
    function callBackToWaitCheck()
    {   
        let oneP=new Promise((resolve,reject)=>{
        if(app.globalData.isCheck&&app.globalData.isLogin!=0)
        resolve();
        else
        reject();
      })
      oneP.then(
        (()=>{
          console.log('验证完成!')
          that.setData(
            {
              isLogin:app.globalData.isLogin
            }
          )
          if(that.data.firstLoading)
          {
            wx.hideLoading({
              success: (res) => {},
            })
            that.setData(
              {
                'firstLoading':false
              }
            )
          }
          if(!app.globalData.isLogin)//登陆状态过期
          {
            that._tipShow("登陆状态过期，请重新登陆!",-1)
            app.globalData.notCheckPage=null;
          }
          else//登陆状态没过期
          {
            //把需要显示的用户信息获取了
            that.PageInfoInit();//页面信息刷新
            //如果有链接页面先跳转回连接页面
            if(app.globalData.notCheckPage)
            {
              wx.navigateTo({
              url:app.globalData.notCheckPage,
              })
              app.globalData.notCheckPage=null;
            }
          }
        
          
        }),
        (
          ()=>{
            setTimeout(()=>{
              callBackToWaitCheck();
              console.log('再等等...')
            },2000)  
          }
        )
      )
    }
    callBackToWaitCheck();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    if(this.data.isLogin==1)
    {
      this.PageInfoInit();
    }
    else
    {
      this._tipShow('您还没有登录!',-1)
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /*用户自定义方法*/
  //1.用户信息等级认证
  //通过使用小程序用户的openid查询该用户的信息登记等级
  personalInfoLevelGet:function(){
    let app=getApp();
    let openid=app.globalData.openid;
    wx.cloud.callFunction(
      {
        name:"userInfoDataModule",
        data:
        {
          type:"selectPersonalInfoById",
          queryData:{
            openid:openid
          }
        }
      }
    ).then(res=>{
      if(res.result.msg=="获取用户登记信息状态成功!")
      {
        app.globalData.personalInfoLevel=res.result.data.personalStatus;
        //本页面的用户身份同步
        let levelStr=['未认证','未申报','信息审核中','居民','社区工作者'];
        console.log('用户等级为')
        console.log(levelStr[res.result.data.personalStatus])
       this.setData(
         {
           levelShowStr:levelStr[res.result.data.personalStatus],
           userInfoLevel:res.result.data.personalStatus
         }
       )
       this._tipShow("用户信息获取成功",1)
      }
      wx.hideLoading({
        success: (res) => {},
      })
    }).catch(err=>{
      wx.hideLoading({
        success: (res) => {},
      });
      this._tipShow("用户信息获取失败，请下拉刷新!",-1)
    })
  },
  
  //2.页面信息刷新 ：用户登陆信息和个人信息完善等级
  PageInfoInit:function(){
    wx.showLoading({
      title: '获取用户信息中',
    })
    let app=getApp();
    let openid=app.globalData.openid;
    //调用云函数获取用户的昵称和头像
    wx.cloud.callFunction(
      {
        name:"loginFunction",
        data:{
          type:"getUserLoginInfo",
          queryData:{
          openid:openid
          }
        },
      }
    ).then(res=>{
      this.setData(
        {
          touxiangUrl:res.result.loginInfo.touxiangUrl,
          userName:res.result.loginInfo.nickName
        }
      );
      //获取用户信息登记状态
      this.personalInfoLevelGet();
    }).catch(err=>{
      wx.hideLoading({
        success: (res) => {},
      })
      this._tipShow("用户信息获取失败，请检查网络连接并下拉刷新！",-1)
    })
  },

  //登陆时获取用户的openid并保存session_key
  toLogin:function(touxiangUrl,nickName){
    let that=this;
    //微信登录操作 ，更新登录态
     wx.login({timeout: 2000, }).then((res)=>{
      //使用云函数将用户登陆信息的openid拿到,同时保存头像和昵称信息
     wx.cloud.callFunction({name:'loginFunction',
          data:{code:res.code,type:'loginUserOpenIdGet',type_2nd:'loginUserOpenIdGet',touxiangUrl:touxiangUrl,
           nickName:nickName
          },success:function(res){
            that.setData({isLogin:true})
            getApp().globalData.openid=res.result.openId;//将返回的openid加入到全局openid上
            that.personalInfoLevelGet();
          },
          fail:function(err)
          {
            console.log(err)
            wx.hideLoading({
              success: (res) => {},
            })
          },
          complete:function()
          {
            console.log('登陆的云函数调用完成!')
          }
        }
      )
    }).catch((err)=>{
      console.log(err)
    })
  },

  /*扫码跳转功能*/
  toScanCode:function(){
    //使用微信的扫码解析功能
    wx.scanCode({onlyFromCamera: false,//是否只能从相机拍照中获取图片
      success:(res)=>{ this._wxLoading('获取信息中')//先解密再判断应该前往那个页面
       let codeResult=JSON.parse(myCrypto.decrypted(res.result));this._wxHideLoading();
       console.log(codeResult)
       this._cloud_addEntranceRecord(codeResult);//添加场所码信息并进入页面
}})
  },

  //判断用户信息等级并跳转页面
  navigateTo:function(e){
    let app=getApp();
    let personalInfoLevel=app.globalData.personalInfoLevel;
    console.log(personalInfoLevel);
    //如果没有用户登录信息的话需要重新登录
    if(personalInfoLevel==-1)
        {
          this._tipShow("用户信息获取失败，请检查网络连接并下拉刷新！",-1)
        }
    //未填写基本信息或未完善信息
    else if(personalInfoLevel==0)
    {
      wx.showModal({
        title:"跳转提示",
        content:"使用功能需要绑定并填写相关个人信息，您还未绑定个人基本资料，是否前往绑定？",
        cancelText:"否",
        confirmText:"是"
      }).then(res=>{
        if(res.confirm)
        {
          wx.navigateTo({
            url: '/userInfoPages/pages/userInfoWriteDown/userInfoWriteDown',
          })
        }
        else
        {
          this._tipShow("请尽快填写资料以便正常使用哦",0)
        }
      }).catch(err=>{
        this._tipShow("请尽快填写资料以便正常使用哦",0)
      })
    }
    //需要完善个人信息
    else if(personalInfoLevel==1)
    {
      let that =this;
      wx.showModal({
        title:"跳转提示",
        content:"使用功能还需要完善个人所在社区相关信息，请扫所在小区的报备二维码填写相关信息以完善功能使用。",
        cancelText:"否",
        confirmText:"是"
      }).then(res=>{
      if(res.confirm)//确认
      {
        that.toScanCode();
      }
      else
      {
        this._tipShow("请尽快完善资料以便正常使用哦",0)
      }
      //  that.toScanCode();
      }).catch(err=>{
        this._tipShow("请尽快完善资料以便正常使用哦",0)
      })
    }
    //审核中
    else  if(personalInfoLevel==2)
    {
     this._tipShow("个人资料正在审核中，请稍后再来",0)
    }
    //居民或管理员账号
    else
    {
      switch(e.currentTarget.dataset.navurl)
      {
        //个人资料按钮
        case 'NavToPersonalInfo':
          wx.navigateTo(
            {
              url:'/userInfoPages/pages/personalInfoShow/personalInfoShow'
            }
          )
          break;
        //购药记录按钮
        case 'NavToDrugRecord':
          wx.navigateTo(
            {
              url:'/userInfoPages/pages/drugRecord/drugRecord'
            }
          )
          break;
        //取物记录按钮
        case 'NavToPackageRecord':
         wx.navigateTo(
            {
              url:'/userInfoPages/pages/packageRecord/packageRecord'
            }
          )
          break;
        //购药登记按钮
        case "drugPage":
          wx.navigateTo({
            url: '/pages/indexPage/indexPage?pageType=1',
          })
          break;
        //包裹管理按钮
        case "PackagePage":
           wx.navigateTo({
            url: '/pages/indexPage/indexPage?pageType=2',
          })
          break;
        //核酸检测按钮
        case "NucleicAcidTest":
          wx.navigateTo({
            url: '/pages/indexPage/indexPage?pageType=3',
          })
          break;
        //地点上报按钮
        case "placeApplyPage":
          wx.navigateTo({
            url: '/volunteerPages/pages/communityPlaceIndex/communityPlaceIndex',
          })
          break;
      }
    }
    
  },

  //点击登录按钮并获取用户的信息
  loginAndGetUserInfo:function(){
   //微信API 用来请求用户的头像和昵称授权
    wx.getUserProfile({  desc: '授权获取用户信息',}).then((res)=>{  //用户同意后执行登录方法
    this.setData({touxiangUrl:res.userInfo.avatarUrl, userName:res.userInfo.nickName})
      this.toLogin(this.data.touxiangUrl,this.data.userName)
      }
    ).catch(
      (err)=>{
        console.log(err)
        this._tipShow("用户授权登录操作失败，请检查网络是否连接！",-1)
      }
    )
  },
  //检查openid
  checkOpenId:function()
  {
    this._tipShow(getApp().globalData.openid,1);
  },
  //组件提示信息显示
  _tipShow:function(tipMsgShow,tipMsgType)
  {
    this.setData(
      {
        tipMsgShow:tipMsgShow,
        tipMsgType:tipMsgType
      }
    )
  },
    //显示加载
_wxLoading:function(text)
    {
      wx.showLoading({
        title: text,
      })
  },
    //隐藏加载
_wxHideLoading:function()
    {
      wx.hideLoading({
        success: (res) => {},
      })
  },
  //登记场所记录并跳转
  _cloud_addEntranceRecord:function(codeResult)
  {
   //如果是场所类型的需要添加扫码
   if([1,2].includes(codeResult.type))
   {
     this._wxLoading("信息登记中");
     wx.cloud.callFunction(//调用云函数添加场所扫码记录
      { name:"placeInfoDataModule",
        data:{type:"addEntranceRecord",queryData:
        {placeId:codeResult.placeId,communityId:codeResult.communityId,placeType:codeResult.type,userId:getApp().globalData.openid}}}
    ).then(res=>{this._wxHideLoading();
      if(codeResult.type==1)//场所码类型为1跳转到信息铁屑页面
      { wx.navigateTo({//将地点码中的地址、社区名、地点码id作为跳转页面的参数
         url: '/userInfoPages/pages/userInfoWriteDown/userInfoWriteDown?baseAddress='+codeResult.address+"&communityName="+
         codeResult.communityName+"&communityId="+codeResult.communityId+"&placeId="+codeResult.placeId})  }
      //购药登记类型
      else if(codeResult.type==2)
      {
       console.log('跳转到药店登记界面')
       wx.navigateTo({
         url: '/userInfoPages/pages/drugWriteDown/drugWriteDown?baseAddress='+codeResult.address+"&communityName="+codeResult.communityName+"&communityId="+codeResult.communityId+"&placeId="+codeResult.placeId,
       }) 
      } 
    })
   }
   //如果是个人取件码,则判断扫码人是否有权限
   else if(codeResult.type==3)
   {
    this._wxLoading('扫码取出中..')
    wx.cloud.callFunction(
      {
        name:"packageDataModule",
        data:{
          type:"toScanPackageCode",
          queryData:{
            scanManId:getApp().globalData.openid,
            recordId:codeResult.recordId
          }
        }
      }
    ).then(res=>{
      if(res.result.msg=='扫码取出物件成功!')
      {
        this._tipShow('扫码取出物件成功!',1)
        this._wxHideLoading();
      }
      else if(res.result.msg=='该物件不在管理社区内或已经被取出')
      {
        this._tipShow("该物件不在管理社区内或已经被取出",-1);
        this._wxHideLoading();
      }
      else if(res.result.msg=='您没有社区工作者权限')
      {
        this._tipShow("您不是社区工作者",-1);
        this._wxHideLoading();
      }
    })
   }
  }
})