// userInfoPages/pages/showPersonalCode/showPersonalCode.js
let drawQrCode=require("../../../miniprogram_npm/weapp-qrcode-master/dist/weapp.qrcode.min")
let myCryptoJS=require("../../../until/myCrypto")
let  recordWatcher=null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //提示栏参数
    tipMsgShow:'',
    tipMsgType:99,
    mainHeight:null,
    recordId:null,//记录编号
    placeName:null,//存放点名称
    communityName:null,//地址名称
    codeShowerWidth:0,//二维码宽度
    recordWatch:null,//记录监听
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData(
      {
        mainHeight:wx.getSystemInfoSync().windowHeight+"px"
      }
    )
    //获取存储编号id
    this.setData(
      {
        recordId:options.recordId
      }
    )
     //2.获取canvas宽度,然后获取最终内容板块的高度
     let query=wx.createSelectorQuery();
    query.select('#codeShower').boundingClientRect(rect=>{
      let width=rect.width;
      this.setData(
        {
          codeShowerWidth:width
        }
      )
      //获取场所数据
      this.dataInit();
    }).exec();
    //根据当前存储编号展示二维码
    
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
  //根据存件码编号获取相关显示数据
  dataInit:function(){
    this._wxLoading('查询数据中...')
    wx.cloud.callFunction(
      {
        name:"packageDataModule",
        data:{
          type:"selectPackageRecordAddressInfo",
          queryData:{
            recordId:this.data.recordId
          }
        }
      }
    ).then(res=>{
      if(res.result.msg=='查询存件的地址信息成功!')
      {
        console.log('查询到的信息')
        console.log(res)
        this.setData(
          {
            placeName:res.result.queryResult.placeName,
            communityName:res.result.queryResult.communityName
          }
        )
        this._wxHideLoading();
        //封装物件编号信息
        let qrData={recordId:this.data.recordId,type:3};
        qrData=myCryptoJS.encrypted(JSON.stringify(qrData));
        //生成二维码
        drawQrCode( {width: this.data.codeShowerWidth,height: this.data.codeShowerWidth,canvasId: 'codeShower',text:qrData}
        );
        //增加取件监听
        let that=this;
        //设置对包裹记录集合中被修改记录的数据库监听
        recordWatcher=wx.cloud.database().collection("packageRecord").doc(this.data.recordId).watch({
          onChange:function(res){//集合更新 且更新字段为 物件记录的取出状态
            if(res.docChanges[0].dataType=='update'&&res.docChanges[0].updatedFields.status==1)//记录被更新为状态1
            {
              that._tipShow('取件成功!',1)
              that.turnToSuccessPage();//跳转到取件成功提示页面
            }
          },
          onError: function(err) {
            console.error('监听器断开', err)
          }
        })
      }
    })
  },
  //跳转到成功取件的提示页面
  turnToSuccessPage:function()
  {
    recordWatcher.close();
    wx.navigateTo({
      url: '/pages/tipPage/tipPage?MsgInfoEvent=takePackageSuccess'
    })
  },
  //提示栏
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