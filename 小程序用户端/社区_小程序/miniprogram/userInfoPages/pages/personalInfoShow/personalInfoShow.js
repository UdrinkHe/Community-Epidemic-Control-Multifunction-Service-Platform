// userInfoPages/pages/personalInfoShow/personalInfoShow.js
const myTimeMaker=require('../../../until/getTimeString')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //居民和社区信息
    personalInfo:{
        //基本信息
        // baseInfo:{
        //   identityCardId: "XXXXXXXXXXXXXXX1",
        //   identityCardType: "居民身份证",
        //   inhabitantSex: "男",
        //   name: "何智",
        //   phone: "13825427942"
        // },
        // //社区申报信息
        // address:"广东省深圳市罗湖区东湖街道西湖路90号金边花园2区8栋306",
        // personalInfoStatus:4,
        // applyingTime:1652146737620,
        // communityInfo:{name:'翠西社区'},
        // postName:"小何",
        // workPlaceName:"深圳动力公司",
        // workRegion:["广东省","深圳市","罗湖区","东门街道"],
        // workType:"其他",
        // lastUpdateTime:1652146737620,
      },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  this.personalInfoInit();
    
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
  //1.更新个人信息
  personalInfoInit:function(){
    wx.showLoading({
      title: '正在获取用户信息',
    })
    wx.cloud.callFunction(
      {
        name:"userInfoDataModule",
        data:{
          type:"selectPersonalInfo",
          queryData:{
            openId:getApp().globalData.openid
          }
        },
      }
    ).then(res=>{
      if(res.result.msg=='查询个人信息成功')
      {
        console.log(res.result.queryResult)
        let personalInfo=res.result.queryResult;
        personalInfo.applyingTime=myTimeMaker.getTimeString(personalInfo.applyTime);
        personalInfo.lastUpdateTime=myTimeMaker.getTimeString(personalInfo.lastUpdateTime);
        let CommunityStatus=['居民','社区工作者'];
        personalInfo.personalInfoStatus=CommunityStatus[personalInfo.personalInfoStatus-3];
        let workRegionStr="";
        for(let i=0;i<personalInfo.workRegion.length;i++)
        {
          workRegionStr+=personalInfo.workRegion[i]
        }
        personalInfo.workRegion=workRegionStr;
        this.setData(
          {
            personalInfo:res.result.queryResult
          }
        )
      }
      wx.hideLoading({
        success: (res) => {},
      })
    }).catch(err=>{
      console.log(err)
      wx.hideLoading({
        success: (res) => {},
      })
    })
  },
  
})