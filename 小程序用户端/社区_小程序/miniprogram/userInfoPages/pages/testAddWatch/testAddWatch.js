// userInfoPages/pages/testAddWatch/testAddWatch.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    caozuo:"",
    name:null,
    phone:null,
    addWatch:'',
    canWatch:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(this.data.canWatch)
    {
      this.setData(
        {
          caozuo:'连接好了!'
        }
      )
      this.data.addWatch=wx.cloud.database().collection('personalInfo').watch({
        onChange: function(snapshot) {
          console.log('snapshot', snapshot)
        },
        onError: function(err) {
          console.error('the watch closed because of error', err)
        }
      })
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
  addOne:function(){
    wx.cloud.database().collection("personalInfo").add(
      {
        data:
        {userName:this.data.name,
        userPhone:this.data.phone}
      }
    ).then((res)=>{
      console.log('成功添加!')
    }).catch((err)=>{
      console.log(err)
    })
   
  },
  closeWatcher:function(){
    this.data.addWatch.close();
    console.log('关闭了监听者!')
  }
})