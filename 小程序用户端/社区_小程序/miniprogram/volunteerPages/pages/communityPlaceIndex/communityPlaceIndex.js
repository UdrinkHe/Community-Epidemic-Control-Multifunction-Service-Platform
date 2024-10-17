// volunteerPages/pages/communityPlaceIndex/communityPlaceIndex.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /*页面渲染参数*/
    //1.菜单列表
    communityIndexs:[
      {
        key:"sumbitPlaceInfo",
        name:"上报场所码",
        navigateTo:"/volunteerPages/pages/communityPlaceSubmit/communityPlaceSubmit"
      },
      {
        key:"lookMyPlaceInfo",
        name:"我申报的场所码",
        navigateTo:"/volunteerPages/pages/myPlacesInfo/myPlacesInfo"
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
  //以下是自定义方法
  //跳转到其他页面
  navigateTo:function(e){
    wx.navigateTo({
      url: e.target.dataset.navurl,
    })
  }
  
})