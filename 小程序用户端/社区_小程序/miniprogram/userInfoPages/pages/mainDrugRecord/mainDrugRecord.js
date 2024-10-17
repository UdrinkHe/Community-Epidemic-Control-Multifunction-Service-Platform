// userInfoPages/pages/mainDrugRecord/mainDrugRecord.js
const myTimeMaker=require('../../../until/getTimeString')
Page({

  /**
   * 页面的初始数据
   */
  data: {
       //提示信息参数
       tipMsgShow:false,
       tipMsgType:99,
       //通用药品
       normalImg:"../../../images/OIP-C.jpg",
       //显示到页面的信息
       mainDrugRecord:{
        buyerName:'何大帅',//购买人名字
        buyerPhone:13825427942,//购买者电话
        address:'多对多多对多多多多多多多多多今日家园',//用户住址
        storePlace:'南苑大药房',//商店地址
        buyTime:'2019-20-11 16:30:21',//购买时间
       },
       drugList:[
         {
           buyNum:1,
           drugInfo:{
            drugName:'小柴胡颗粒',
            drugType:1
           }
         },
       ],
       typeName:['发热类','止咳类','抗感染类']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if(options.recordId)
    {
      this.getPageData(options.recordId)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  //根据传入的参数获取详情记录
  getPageData(recordId){
    this._wxLoading('获取数据中')
    wx.cloud.callFunction(
      {
        name:'drugDataModule',
        data:{
          type:"showMainDrugRecord",
          queryData:{
            recordId:recordId
          }
        }
      }
    ).then(res=>{
      let queryResult=res.result.queryResult;
      this.setData(
        {
          mainDrugRecord:{
            buyerName:queryResult.buyerInfo.name,//购买人名字
            buyerPhone:queryResult.buyerInfo.phone,//购买者电话
            address:queryResult.buyerInfo.address,//用户住址
            storePlace:queryResult.placeName,//商店地址
            buyTime:myTimeMaker.getTimeString(queryResult.buyTime),//购买时间
           },
           drugList:queryResult.buyRecord
        }
      )
      console.log('查询详细购药记录的药品信息为')
      console.log(this.data.drugList)
      this._wxHideLoading();
    })
  },
  //自定义的数据处理函数
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