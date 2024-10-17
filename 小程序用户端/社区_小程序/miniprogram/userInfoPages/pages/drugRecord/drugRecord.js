// userInfoPages/pages/drugRecord/drugRecord.js
const myTimeMaker=require('../../../until/getTimeString')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //页面的最大高度
    maxHeight:'500',
    //提示信息参数
    tipMsgShow:false,
    tipMsgType:99,
    //显示到页面的参数
    drugRecordList:[
    // {
    //   addressName:'你好商店',
    //   recordTime:1222222222222222,
    //   communityName:'提供数据的社区名称',
    // },
    // {
    //   addressName:'你好商店',
    //   recordTime:1222222222222222,
    //   communityName:'提供数据的社区名称',
    // }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //更新数据 
    //自适应最大高度
     //1.自适应最高屏幕宽度
     this.setData(
      {
        maxHeight:wx.getSystemInfoSync().windowHeight+"px"
      }
    ),
    this.dataInit();
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
  //自定义的方法
  dataInit:function(){
    //根据用户openid获取所有购药记录
    console.log(getApp().globalData.openid);
    this._wxLoading('数据加载中')
    wx.cloud.callFunction(
      {
        name:'drugDataModule',
        data:
        {
          type:'selectSelfdrugRecord',
          queryData:{
            userId:getApp().globalData.openid
          }
        }
      }
    ).then(res=>{
      if(res.result.msg=='查询用户购药记录成功')
      {
        console.log(res.result.queryResult)
        let newList=res.result.queryResult.map((item)=>{
          return {communityName:item.communityInfo[0].name,entranceId:item._id,
            addressName:item.placeInfo[0].address,recordTime:myTimeMaker.getTimeString(item.createTime)}
        })
        this.setData(
          {
            drugRecordList:newList
          }
        )
        this._wxHideLoading();
        this._tipShow('数据已更新!',1)
      }
    })
  },
  //跳转到主要购药记录信息页面
  toMainRecordPage:function(e)
  {
    wx.navigateTo({
      url: '/userInfoPages/pages/mainDrugRecord/mainDrugRecord?recordId='+e.currentTarget.dataset.entranceid,
    })
  },
  //提示栏信息
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