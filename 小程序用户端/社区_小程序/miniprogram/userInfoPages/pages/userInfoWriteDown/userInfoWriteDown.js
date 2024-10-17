// userInfoPages/pages/userInfoWriteDown/userInfoWriteDown.js
// import myPup from "../../../miniprogram_npm/pupCommunity/index"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //是否开启云函数
    iscloudDatabase:true,
    //toptips提示信息
    tipMsgShow:null,
    tipMsgType:99,
    //用户信息登记登记
    dataRecordLevel:0,
    //用户是否同意登记基本信息
    isUserAgree:false,
    //发送按钮的参数
    hasTouchButton:false,//这个参数用来判断用户是否点过发送验证码了
    sendButtonText:"发送验证码",//发送按钮的文本
    sendButtonTime:60,//倒计时的时间
    buttonCanTap:true,//能否触发按钮
    //条款确认按钮的参数
    queryCanUse:false,//确认按钮是否可用
    //表单的参数
    baseInfoName:null,
    baseInfoIdentityCardId:null,
    baseInfoPhone:null,
    identityCardType:"居民身份证",
    identityTypeShow:false,
    testCodeValue:null,//验证码值
    //可选择的证件类型
    identityCardTypeItems:[
       {
         name:"居民身份证",
         text:"居民身份证",
       },
       {
        name:"港澳居民来往内地通行证",
        text:"港澳居民来往内地通行证(回乡证)",
       },
       {
        name:"台湾居民来往内地通行证",
        text:"台湾居民来往内地通行证(台胞证)",
      },
      {
        name:"护照",
        text:"护照",
      },
      {
        name:"港澳台居民居住证",
        text:"港澳台居民居住证",
      },
      {
        name:"出生医学证明",
        text:"出生医学证明",
      },
    ],
    //可选择的职业类型
    occupationTypes:[
      {occupationName:"国家机关，党组织，企业和机构负责人"},
      {occupationName:"专业技术人员"},
      {occupationName:"办公室工作人员和相关人员"},
      {occupationName:"商业和服务人员"},
      {occupationName:"农林牧渔业和水利生产人员"},
      {occupationName:"生产和运输设备操作人员及相关人员"},
      {occupationName:"军事人员"},
      {occupationName:"其他"},
      {occupationName:"其他-无单位"},
    ],
    //被选中的证件类型值
    nowIdentityValue:"居民身份证",
    //证件类型的对话框的按钮组
    identityDialogButtons:[
      {text:'确定'},
      {text:'取消'}
    ],
    //2.修改个人资料中要用到的参数
    //地区
    postName:"",//备注名
    baseAddress:"",//基本地址
    extraAddress:"",//详细地址
    myCommunityName:"",//所在的社区
    myCommunityId:"",//所在社区id
    customItem: '全部',
    workRegion:["北京市","北京市","东城区","东华门街道"],//我的作地区
    myOccupation:'点击此处选择职业',//我的职业
    radioOccupation:'其他',//按钮组的职业
    occupationDialogButtons:[  //对话框的按钮组
       {text:"确定"},
       {text:"取消"}
     ],
    dialogShow:false,//对话框是否显示
    hasWorkAddress:true,//是否有单位地址
    workPlaceName:null,//单位名称

    //查询中寄存的数据
    inhabitantSex:null,//居民性别

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   //1.防止用户信息没有加载完毕
   const app=getApp();
   this.setData(
     {
       dataRecordLevel:app.globalData.personalInfoLevel
     }
   )
   if(!app.globalData.isCheck||app.globalData.isLogin==0||app.globalData.personalInfoLevel==-1)//未加载或者未确认登录完成或者个人信息登记登记未知
   {  
     console.log('没加载或没有登陆完成!');
     //登记数据未加载完毕时打开的页面
      app.globalData.notCheckPage='/userInfoPages/pages/userInfoWriteDown/userInfoWriteDown';
      wx.switchTab({
        url: '/pages/userPage/userPage',
      })
   }
   //用户信息加载完毕!
   else
   { 
     console.log(options)
     if(options.baseAddress)
     {
       console.log('读取了二维码')
      this.setData(
        {
          baseAddress:options.baseAddress,//基本地址
          myCommunityName:options.communityName,//所在的社区
          myCommunityId:options.communityId,//所在社区id
          myPlaceId:options.placeId//场所id
        }
      )
     }
      //获取用户信息登记等级并且显示相应的页面
      this.pageInit();

   }
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
    this.pageInit();
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
  
  /*以下是自定义方法*/
  //页面刷新 获取用户信息等级
  pageInit:function(){
    wx.showLoading({
      title: '查询用户信息中...',
    })
    let app=getApp();
    let openid=getApp().globalData.openid;
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
        console.log(res)
        if([0,1,2,3,4].includes(res.result.data.personalStatus))
        {
          //刷新全局的用户等级登记
          app.globalData.personalInfoLevel=res.result.data.personalStatus;
          this.setData(
            {
              dataRecordLevel:res.result.data.personalStatus
            }
          )
          console.log('用户的信息登记是!')
          console.log(this.data.dataRecordLevel)
          wx.hideLoading({
            success: (res) => {},
          })
        }
      }
    }).catch(err=>{
      wx.hideLoading({
        success: (res) => {},
      })
      this._tipShow("读取信息失败，请下拉刷新",-1)
    })
  },

  //1.点击发送验证码触发 -> 需要判断是否同意协议
  CheckAgreeAndSendCode:function(){
    if(this.data.isUserAgree)//用户同意条款
    {
      if(this.data.buttonCanTap)
      {
        //验证输入信息的完备性
        if(!this.data.baseInfoName||!this.data.baseInfoPhone||!this.data.baseInfoIdentityCardId)
        {
          this._tipShow("请确认所有填写信息栏位不为空",-1)
          return;
        }
        //发送手机验证码
        if(this.data.iscloudDatabase)
        {
          console.log('调用了云函数!')
          //验证输入信息是否正确
          wx.cloud.callFunction(
            {
              name:"userInfoDataModule",
              data:
              {
                type:'selectInhabitantExist',
                queryData:{
                  identityCardId:this.data.baseInfoIdentityCardId,
                  identityCardType:this.data.identityCardType,
                  baseName:this.data.baseInfoName
                }
              }
            }
          ).then((res)=>{
            if(res.result.msg=="验证成功")
            {
              console.log('存在这条居民信息')
              console.log(res.result.resultData);
              //居民性别
              let inhabitantSex=res.result.resultData.inhabitantSex;
              //接下来保存验证码信息并发送验证码
              let app=getApp();
              //保存验证码
              wx.cloud.callFunction(
                {
                  name:"userInfoDataModule",
                  data:{
                    type:"addTestCodeCreditCode",
                    queryData:{
                      openid:app.globalData.openid,
                      identityCardId:this.data.baseInfoIdentityCardId,
                      baseInfoName:this.data.baseInfoName,
                      baseInfoPhone:this.data.baseInfoPhone,
                      identityCardType:this.data.identityCardType,
                      inhabitantSex:inhabitantSex
                    }
                  }
                }
              ).then(res=>{
                //保存成功之后发送
                console.log(res);
                //发送的提示信息
                this._tipShow("验证码已发送！请留意填写手机号接收的短信！",0)
                //改变发送验证码按钮
                this.setData(
                  {
                    buttonCanTap:false
                  }
                )
                //开始按钮倒计时
                this.setData(
                  {
                    sendButtonText:this.data.sendButtonTime+"s"
                  }
                )
                const intervalOne=setInterval(()=>{
                  this.setData(
                    {
                      sendButtonTime:this.data.sendButtonTime-1,
                      sendButtonText:this.data.sendButtonTime+"s"
                    }
                  )
                  if(this.data.sendButtonTime==-1)
                  {
                    clearInterval(intervalOne);
                    this.setData(
                      {
                        buttonCanTap:true,
                        sendButtonText:'重新发送',
                        sendButtonTime:60
                      }
                    );
                  }
                },1000);
                //手机发送验证码
              }).catch(err=>{
                //验证码保存失败
                console.log(err)
                this._tipShow("验证信息保存失败，请检查网路连接!",-1);
              })
            }
            else
            {
              //提示居民信息验证错误信息
              this._tipShow("用户信息验证失败，请查看信息输入是否正确",-1);
            }
          }).catch((err)=>{
            this._tipShow("网络出了点问题，请检查网络连接并重新发送验证码",-1);
          })
         //手机接收验证码
        }
        
      }
      else
      {
        console.log('请求过于频繁，请稍后再发送!')
      }
    }
    else
    {
      wx.showToast({
        title:'请确认用户条款',
        icon:'error'
      })
      //获取子实例：用户条款
      const child=this.selectComponent('#userDetailA');
      child.setData(
        {
          show:true
        }
      )
      this.setData(
        {
          hasTouchButton:true
        }
      )
    }
  },
  //确认条款已读
  readQuery:function(){
    if(!this.data.isUserAgree)
    {
      this.setData(
        {
          isUserAgree:true
        }
      )
      //如果用户之前点过发送验证码的按钮，就不必再点一次了
      if(this.data.hasTouchButton)
      {
        this.CheckAgreeAndSendCode();
      }
    }
  },
  //点击提交表单并绑定个人信息
  bindPersonalInfo:function(){
    if(!this.data.baseInfoPhone||!this.data.baseInfoName||!this.data.baseInfoIdentityCardId||!this.data.identityCardType||!this.data.testCodeValue)
    {
      this._tipShow("表单信息不能有空!",-1);
    }
    else
    {
      //验证填写的表单是否正确并修改个人信息
      let app=getApp();
      wx.showLoading({
        title: '验证信息中...',
      })
      wx.cloud.callFunction(
        {
          name:"userInfoDataModule",
          data:{
            type:"checkTestInfo",
            queryData:{
              openid:app.globalData.openid,
              baseInfoName:this.data.baseInfoName,
              baseInfoPhone:this.data.baseInfoPhone,
              identityCardId:this.data.baseInfoIdentityCardId,
              identityCardType:this.data.identityCardType,
              testCodeValue:this.data.testCodeValue
            }
          }
          
        }
      ).then(res=>{
        console.log(res)
        if(res.result.msg=="验证码已过期，验证失败!")
        {
          this._tipShow("您的验证码已过期，请重新发送并提交",0)
          wx.hideLoading({
            success: (res) => {},
          })
        }
        else if(res.result.msg=="没有找到对应的验证码记录")
        {
          this._tipShow("没有找到对应的验证码，请确定所有信息填写无误!",-1)
          wx.hideLoading({
            success: (res) => {},
          })
        }
        else if(res.result.msg=="验证码未过期，验证成功!")
        {
          //验证码中的基本信息要取出来
          let baseInfo=res.result.queryResult.testCodeUserData;
          console.log(baseInfo);
          //开始把基本信息登记到用户信息中!
          wx.cloud.callFunction(
            {
              name:"userInfoDataModule",
              data:{
                type:"addOnePersonalInfo",
                queryData:{
                  openid:app.globalData.openid,
                  baseInfo:baseInfo
                }
              }
            }
          ).then(res=>{
            console.log(res);
            if(res.result.msg=="添加个人信息成功!")
            {
              this._tipShow("添加用户信息成功!",1)
              //将所有页面的用户信息等级设置为1
              app.globalData.personalInfoLevel=1;
              //跳转到提示页
              wx.navigateTo({
                url: '/pages/tipPage/tipPage?MsgInfoEvent=PersonalInfoApply',
              })
            }
            else if(res.result.msg=="已经存在该用户的注册记录了!")
            {
              this._tipShow("您已经登记过基本信息了!",-1)
            }
          }).catch(res=>{
            this._tipShow("添加用户信息失败，请检查网络连接",-1)
          })
        }
      }).catch(err=>{
        this._tipShow("提交信息失败，请检查网络连接!",-1)
      })
    }
  },

  //打开证件类型对话框
  IdendtitydialogShow:function()
  {
    this.setData(
      {
        identityTypeShow:true
      }
    )
  },
  //更改证件类型
  changeMyIdentityType:function(e)
  {
    this.setData(
      {
        nowIdentityValue:e.detail.value
      }
    )
  },
  //证件类型对话框选择按钮
  tapDialogIdentityButton:function(e){
    if(e.detail.item.text=="确定")
    {
      this.setData(
        {
          identityCardType:this.data.nowIdentityValue
        }
      )
    }
    this.setData(
      {
        identityTypeShow:false
      }
    )
  },
  //个人信息修改要用到的参数
  //1.改变地区的值 家/公司
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    console.log('被改变的拉条type:',e.target.dataset.type)
    if(e.target.dataset.type=='home')
    {
      this.setData({
        myRegion: e.detail.value
      })
    }
    else if(e.target.dataset.type=="work")
    {
      this.setData({
        workRegion: e.detail.value
      })
    }
  },
//在单选按钮组改变的时候更改个人职业信息
changeMyOccupation:function(e){
  this.setData(
    {
      radioOccupation:e.detail.value
    }
  )
},
//职业对话框的按钮被点击之后触发
tapDialogButton:function(e){
  if(e.detail.item.text=="确定")
  {
    this.setData(
      {
        dialogShow:false,
        myOccupation:this.data.radioOccupation
      }
    )
    if(this.data.myOccupation=="其他-无单位")
    {
      this.setData(
        {
          hasWorkAddress:false,
          workRegion:["","","",""],
          workPlaceName:null
        }
      )
    }
    else
    {
      if(!this.data.hasWorkAddress)//之前选择了无单位
      {
        this.setData(
          {
            workPlaceName:null,
            workRegion:["北京市","北京市","东城区","东华门街道"],
            hasWorkAddress:true
          }
        )
      }
    }
  }
  else
  {
    this.setData(
      {
        dialogShow:false,
      }
    )
  }  
},
showOccupationDialog:function()
{
  this.setData(
    {
      dialogShow:true
    }
  )
},
//点击按钮之后更改个人资料
ChangePersonalInfo:function(){
  let isMessageComplete=true;
  if(!this.data.extraAddress)
  isMessageComplete=false;
  //有工作单位就要填写
  if(this.data.hasWorkAddress)
  {
    //还没点击选择
    if(this.data.myOccupation=="点击此处选择职业")
    isMessageComplete=false;
    if(this.data.workRegion.length==0)
    {
      isMessageComplete=false;
    }
    for(let i=0;i<this.data.workRegion.length;i++)
    {
      if(!this.data.workRegion[i])
      {
        isMessageComplete=false;
        break;
      }
    }
    if(!this.data.workPlaceName)
    {
      isMessageComplete=false;
    }
  }
  if(!isMessageComplete)
  {
    this._tipShow("资料未填写完善，请补充完整",-1)
  }
  else
  {
    wx.showLoading({
      title: '提交信息中...',
    })
    wx.cloud.callFunction(
      {
        name:"userInfoDataModule",
        data:{
          type:"updatePersonalAddressInfo",
          queryData:{
            openid:getApp().globalData.openid,
            homeAddress:this.data.baseAddress+this.data.extraAddress,
            extraAddress:this.data.extraAddress,//当基本地址被修改时，需要用到额外地址
            occupationType:this.data.myOccupation,
            postName:this.data.postName,//快递备注名
            workRegion:this.data.workRegion,
            workPlaceName:this.data.workPlaceName,
            communityId:this.data.myCommunityId,
            placeId:this.data.myPlaceId
          }
        },
      }
    ).then(res=>{
      console.log(res);
      if(res.result.msg=="个人信息补全成功")
      {
        //显示成功信息
       wx.showToast({
         title: '提交成功!',
         type:"success"
       })
       wx.hideLoading({
         success: (res) => {},
       })
       //将全局的用户信息等级变更为2 同时跳转到提示页
       let app=getApp();
       app.globalData.personalInfoLevel=2;
       let MsgInfoEvent="PersonalInfoApply"
       wx.navigateTo({
         url: '/pages/tipPage/tipPage?MsgInfoEvent='+MsgInfoEvent,
       })
      }
    }).catch(err=>{
      this._tipShow("完善个人信息失败，请检查网络",-1)
      console.log(err);
      wx.hideLoading({
        success: (res) => {},
      })
    })
  }
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
}
})