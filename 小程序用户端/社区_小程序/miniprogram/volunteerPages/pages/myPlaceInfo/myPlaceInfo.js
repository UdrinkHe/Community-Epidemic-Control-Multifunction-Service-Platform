// volunteerPages/pages/myPlaceInfo/myPlaceInfo.js
const timeMaker=require('../../../until/getTimeString')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /*页面参数*/
    //1.可供选择的场所码类型
    selectItems:[
      {
        key:"one",
        value:1,
        name:"社区报备点",
        isChoose:true
      },
      {
        key:"two",
        value:2,
        name:"购药登记点",
        isChoose:false
      },
      {
        key:"three",
        value:3,
        name:"物品存放点",
        isChoose:false
      },
    ],
    //2.下拉菜单显示
    selectDisplay:"none",
    //3.类型名和类型数值
    typeName:"社区报备点",
    typeValue:1,
    //4.屏幕最大高度
    maxHeight:"1000px",
    //滑动参数
    contentMargin:0,//内容的偏移(-750-0)
    tarMargin:0,//内容条的偏移
    startTime:null,//开始时间
    startX:null,//开始的位置
    endX:null,//结束的位置
    canMove:false,//需要为true才能滚动页面
    //查询到的地点数据
    //社区名称
    communityName:null,
    //已通过的
    placeInfoAgree:[
      
    ],
    //审核中的
    placeInfoApplying:[],
    //场所类型模板
    placeTypeNames:[
      "社区报备点","购药登记点","小区取物点"
    ],
    //状态模板
    status:["未通过","审核中","已通过"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     //自适应屏幕高度
     this.setData(
      {
        maxHeight:wx.getSystemInfoSync().windowHeight+"px"
      }
    )
    //初始化查询信息
    this.placeInfoGet();
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
  //自定义方法
  //1.打开或关闭下拉菜单
  showOrhideSelectBar:function()
  {
    if(this.data.selectDisplay=="none")
    {
      this.setData(
        {
          selectDisplay:'block'
        }
      )
    }
    else
    {
      this.setData(
        {
          selectDisplay:'none'
        }
      )
    }
  },
  //2.选择并查询这个地点类型的数据
  selectThisTypePlaces:function(e)
  {
    let queryType=e.target.dataset.queryvalue;//地点类型
    let openid=getApp().globalData.openid;//openid
    //先处理菜单显示
    let changeArr=this.data.selectItems;
    for(let i=0;i<changeArr.length;i++)
    {
      if(changeArr[i].value!=queryType)
      changeArr[i].isChoose=false;
      else
      {
        changeArr[i].isChoose=true;
        this.setData(
          {
            typeName:changeArr[i].name
          }
        )
      }
      
    }
    this.setData(
      {
        selectItems:changeArr,
        selectDisplay:"none"
      }
    )
    //调用云函数查询相关站点
  },
  //3.内容滑动处理
  //3.1滑动开始
  touchS:function(e)
  {
    console.log('滑动开始')
    this.setData(
      {
        startX:e.touches[0].pageX,
        startTime:new Date()
      }
    )
    console.log('开始的位置为')
    console.log(this.data.startX)
  },
  //3.2滑动时更新结束点位置
  touchM:function(e)
  {
    this.setData(
      {
        endX:e.touches[0].pageX,
        canMove:true
      }
    )
  },
  //3.3滑动结束
  touchE:function(e)
  {
    console.log('结束的位置为')
    console.log(this.data.endX)
    //位移差
    let locationX=this.data.endX-this.data.startX;
    //时间差
    let time=new Date().getTime()-this.data.startTime.getTime();
    console.log(locationX+","+time)
    if(time<300&&this.data.canMove)
    {
      //左移且内容还能够向左移时内容移动向左 移动条向右
      if(locationX<-100&&this.data.contentMargin==0)
      {
        //内容
        this.animate("#placeContent",[
          { translateX:"-150rpx"},
          { translateX:"-300rpx"},
          { translateX:"-450rpx"},
          { translateX:"-600rpx"},
          { translateX:"-750rpx"},
        ],200,function () {
          this.clearAnimation('#placeContent', { translateX: true}, function () {
            this.setData(
              {
                contentMargin:-750,
                canMove:false
              }
            )
          }.bind(this))
      }.bind(this))
      //移动条
      this.animate("#sonBar",[
        { translateX:"35rpx"},
        { translateX:"70rpx"},
        { translateX:"105rpx"},
        { translateX:"140rpx"},
        { translateX:"175rpx"},
      ],200,function () {
        this.clearAnimation('#sonBar', { translateX: true}, function () {
          this.setData(
            {
              tarMargin:175
            }
          )
        }.bind(this))
    }.bind(this))
      }
      else if(locationX>100&&this.data.contentMargin==-750)
      {
        //内容
        this.animate("#placeContent",[
          { translateX:"150rpx"},
          { translateX:"300rpx"},
          { translateX:"450rpx"},
          { translateX:"600rpx"},
          { translateX:"750rpx"},
        ],200,function () {
          this.clearAnimation('#placeContent', { translateX: true}, function () {
            this.setData(
              {
                contentMargin:0,
                canMove:false
              }
            )
          }.bind(this))
      }.bind(this))
      //移动条
      this.animate("#sonBar",[
        { translateX:"-35rpx"},
        { translateX:"-70rpx"},
        { translateX:"-105rpx"},
        { translateX:"-140rpx"},
        { translateX:"-175rpx"},
      ],200,function () {
        this.clearAnimation('#sonBar', { translateX: true}, function () {
          this.setData(
            {
              tarMargin:0
            }
          )
        }.bind(this))
    }.bind(this))
      }
    }
  },
  //点击跳转到具体场所页面
  navTo:function(e){
    wx.navigateTo({
      url: '/volunteerPages/pages/placeInfoShow/placeInfoShow?placeId='+e.currentTarget.dataset.navid,
    })
    // console.log(e.currentTarget.dataset.navid)
  },
  //查询该类型的所有站点
  placeInfoGet:function()
  { 
    wx.showLoading({
      title: '查询数据中',
    })
    wx.cloud.callFunction(
      {
        name:"placeInfoDataModule",
        data:
        {
          type:"selectPlacesForOneVolunteer",
          queryData:{
            openId:getApp().globalData.openid,
            type:this.data.typeValue
          }
        }
      }
    ).then(res=>{
      console.log(res)
      //格式化时间
      let agreePlace=res.result.agreePlace.map((item)=>{
        item.applyTime=timeMaker.getTimeString(item.applyTime);
        return item;
      })
      let applyingPlace=res.result.applyingPlace.map((item)=>{
        item.applyTime=timeMaker.getTimeString(item.applyTime);
        return item;
      })
      console.log(agreePlace)
      this.setData(
        {
          communityName:res.result.communityName,
          placeInfoAgree:agreePlace,
          placeInfoApplying:applyingPlace
        }
      )
      wx.hideLoading({
        success: (res) => {},
      })
    }).catch(err=>{
      console.log(err)
      wx.hideLoading({
        success: (res) => {},
      })
    })
  }
})