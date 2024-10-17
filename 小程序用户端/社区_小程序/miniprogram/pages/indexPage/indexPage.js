// pages/indexPage/indexPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navDataInfo:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if(options.pageType)
    {
      switch(options.pageType)
      {
        case "1":           //购药登记
          wx.setNavigationBarTitle({
            title: '购药登记',
          })
          this.setData(
            {
              navDataInfo:[
                {
                  key:"drugRecord",
                  navBarName:"购药记录",
                  navBarUrl:"/userInfoPages/pages/drugRecord/drugRecord"
                },
                {
                  key:"drugKnow",
                  navBarName:"购药须知",
                  navBarUrl:"/pages/notice/notice?noticeType=1"
                }
              ]
            }
          )
          break
        case "2":           //包裹管理
        wx.setNavigationBarTitle({
          title: '包裹管理',
        })
        this.setData(
          {
            navDataInfo:[
              {
                key:"packageRecord",
                navBarName:"包裹记录",
                navBarUrl:"/userInfoPages/pages/packageRecord/packageRecord"
              },
              {
                key:"packageKnow",
                navBarName:"取物须知",
                navBarUrl:"/pages/notice/notice?noticeType=2"
              }
            ]
          }
         )
         break;
        case "3":           //核酸登记
        wx.setNavigationBarTitle({
          title: '核酸检测',
        })
        this.setData(
          {
            navDataInfo:[
              {
                key:"nucleicAcidTest",
                navBarName:"核酸记录",
                navBarUrl:"/userInfoPages/pages/nucleicAcidTest/nucleicAcidTest"
              },
              {
                key:"packageKnow",
                navBarName:"检测须知",
                navBarUrl:"/pages/notice/notice?noticeType=3"
              }
            ]
          }
         )
      }
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

  }
})