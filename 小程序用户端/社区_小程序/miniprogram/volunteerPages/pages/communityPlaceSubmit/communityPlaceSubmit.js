// volunteerPages/pages/communityPlaceSubmit/communityPlaceSubmit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //toptips提示信息
    errMsg:null,
    errMsgShow:false,
    successMsg:null,
    successMsgShow:false,
    infoMsg:null,
    infoMsgShow:false,
    //社区地址名
    placeAddress:null,
    //社区站点类型 number 和 String值
    placeType:1,
    placeTypeName:"社区报备点",
    //社区类型更换对话框相关值
    dialogShow:false,
    extraInfo:null,
      //对话框按钮组
    placeTypeDialogButtons:[
      {text:"确定"},
       {text:"取消"}
    ],
    //预选值
    placeChangePreValue:{
      showValue:null,//显示的值
      value:null,//存入数据库的值
    },
      //站点类型可选择的值
    placeTypeValue:[
      {
        showValue:"社区报备点",
        value:1
      },
      {
        showValue:"社区购药登记点",
        value:2
      },
      {
        showValue:"社区物品存放点",
        value:3
      }
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

//页面的自定义方法
//1.操控按钮组更换地点类型
//1.1打开职业跟换对话框
openPlaceChangeDialog:function(){
  this.setData(
    {
      dialogShow:true
    }
  )
},
//1.2点击单选按钮组改变预备值
changeMyPlaceType:function(e){
  let index=e.detail.value;
  this.setData(
    {
      placeChangePreValue:{
        showValue:this.data.placeTypeValue[index].showValue,
        value:this.data.placeTypeValue[index].value
      }
    }
  )
},
//1.3点击对话框的按钮触发的值更换
tapDialogButton:function(e)
{
  if(e.detail.item.text=="确定")
  {
    //将预选值设置为页面参数
    this.setData(
      {
        placeType:this.data.placeChangePreValue.value,
        placeTypeName:this.data.placeChangePreValue.showValue,
      }
    )
  }
  //关闭对话框
    this.setData(
      {
        dialogShow:false
      }
    )
},
//提交站点
submitThisPlace:function(){
  //站点地址不为空
  if(this.data.placeAddress)
  {
    wx.showLoading({
      title: '正在上报地点中...',
    })
    //先进行定位
    wx.getLocation({type:'gcj02'}).then(res=>{
    const openId=getApp().globalData.openid; //调用云函数上报站点
    wx.cloud.callFunction( {name:"placeInfoDataModule",data:{type:"addOnePlaceInfo",queryData:{ type:this.data.placeType, address:this.data.placeAddress,extraInfo:this.data.extraInfo,longitude:res.longitude,latitude:res.latitude, openId:openId}}
    })
      .then(res=>{
        if(res.result.msg=="上报地点成功")
        {
          this.setData(
            {
              successMsg:"上报地点成功!",
              successMsgShow:true
            }
          )
          wx.hideLoading({
            success: (res) => {},
          })
          wx.navigateTo({
            url: '/pages/tipPage/tipPage?MsgInfoEvent=placeWriteSuccess',
          })
        }
      })
    }).catch(err=>{
      //关闭加载条
      wx.hideLoading({
        success: (res) => {},
      })
      //提示错误信息
      this.setData(
        {
          errMsg:"提交失败！请检查网络连接",
          errMsgShow:true
        }
      )
    })
  }
  // else
  // {
    
  // }
}
})