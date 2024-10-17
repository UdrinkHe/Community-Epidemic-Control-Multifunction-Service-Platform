// pages/mainPage/mainPage.js
const myTimeMaker=require('../../until/getTimeString')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tipMsgShow:null,
      tipMsgType:99,
    articleList:[
    ]//能够获取到的文章信息列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   //自动适应屏幕最大宽度
   this.setData(
    {
      maxHeight:wx.getSystemInfoSync().windowHeight+"px"
    }
  )
  this.dataGet();
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
    this.dataGet();
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
  naviToMainArticle:function(e)
  {
    console.log(e.currentTarget.dataset.noticeid);
    wx.navigateTo({
      url: '/userInfoPages/pages/noticeMain/noticeMain?noticeId='+e.currentTarget.dataset.noticeid
    })
  },
  //获取所有可读文章
  dataGet:function()
  {
    this._wxLoading('加载通知中..')
    wx.cloud.callFunction(
      {
        name:'messageModule',
        data:{
          type:'getAllCommunityNoticeByUser',
          queryData:{
            openId:getApp().globalData.openid
          }
        }
      }).then(res=>{
        let newData=res.result.queryResult.map(item=>{
          item.lastDate=myTimeMaker.getTimeString(item.lastTime);
          item.createDate=myTimeMaker.getTimeString(item.createTime);
          return item;
        })
        this.setData(
          {
            articleList:newData
          }
        )
        this._wxHideLoading();
        this._tipShow('数据获取成功',1)
      }) 
  },
  //页面显示函数
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
})