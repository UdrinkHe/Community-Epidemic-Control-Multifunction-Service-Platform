// pages/tipPage/tipPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topType:"success",
    topMsg:"成功!",
    mainMsg:"这里是成功信息",
    footerMsg:"Copyright © 2021-2023 社区防疫小程序",
    //提示栏高度
    mainHeight:0,
    //传递的提示信息显示参数，以及参数对应的数据
    MsgInfoIndex:-1,
    MsgInfos:{
      //基本信息绑定成功 
      baseInfoSuccess:{
        topType:"success",
        topMsg:"成功",
        mainMsg:"用户绑定基本信息成功!请扫描社区地点报备码完成个人资料填写",
      },
      //等待个人报备信息审核 
      PersonalInfoApply:{
        topType:"waiting",
        topMsg:"等待",
        mainMsg:"用户申报信息已经上传!请等待社区管理员审核信息",
      },
      //购药登记成功 
      drugAddSuccess:{
        topType:"success",
        topMsg:"成功",
        mainMsg:"添加购药信息成功，近期可能会有社区人员询问购药情况，请积极配合，感谢您对社区工作的理解与支持!"
      },
      //居民取件成功 
      takePackageSuccess:{
        topType:"success",
        topMsg:"成功",
        mainMsg:"取出物件成功，感谢您对社区开展工作的支持与配合!"
      },
      //社区工作者存件成功
      packageWriteSuccess:{
        topType:"info",
        topMsg:"成功",
        mainMsg:"存件信息登记成功，请联系居民取件"
      },
      //社区工作者报备地点成功
      placeWriteSuccess:{
        topType:"info",
        topMsg:"成功",
        mainMsg:"地点上报成功，等待审核"
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //自适应屏幕高度
    this.setData(
      {
        mainHeight:wx.getSystemInfoSync().windowHeight+"px"
      }
    )
    if(options.MsgInfoEvent) //有信息编号
    {
      let idx=options.MsgInfoEvent;
      this.setData(
        {
          MsgInfoEvent:idx,
          topType:this.data.MsgInfos[idx].topType,
          topMsg:this.data.MsgInfos[idx].topMsg,
          mainMsg:this.data.MsgInfos[idx].mainMsg
        }
      )
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
  //以下是页面自定义方法
  //1.点击按钮跳转页面
  tapTonavigator:function(){
    console.log(this.data.MsgInfoEvent)
    if(this.data.MsgInfoEvent=="baseInfoSuccess"||this.data.MsgInfoEvent=="PersonalInfoApply"||this.data.MsgInfoEvent=="drugAddSuccess")
    {
      //返回两页
      wx.navigateBack(
        {
          delta:2
        }
      )
    }
    else if(this.data.MsgInfoEvent=='takePackageSuccess')
    {
      wx.navigateBack(
        {
          delta:2
        }
      )
    } 
    else if(this.data.MsgInfoEvent=="packageWriteSuccess"||this.data.MsgInfoEvent=="placeWriteSuccess")
    {
      wx.navigateBack(
        {
          delta:4
        }
      )
    } 
  }
  
})