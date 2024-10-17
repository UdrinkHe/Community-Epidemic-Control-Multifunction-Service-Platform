// userInfoPages/pages/noticeMain/noticeMain.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      //顶部提示信息参数
      tipMsgShow:null,
      tipMsgType:99,
    noticeId:null,//文章id
    textTitle:'社区通知',//文章标题
    nodeText:"测试通知内容",//结点内容
    isRead:true,//是否阅读过文章了
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData(
      {
       maxHeight:wx.getSystemInfoSync().windowHeight+"px"
      }
    )
    console.log(options.noticeId)
    //查询本文章的内容，同时查询用户是否有过点赞记录
    if(options.noticeId)
    {
     this.setData(
       {
         noticeId:options.noticeId
       }
     )
     this.dataInit();
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
  //查询文章内容和用户的阅读记录
  dataInit:function(){
    this._wxLoading('加载数据中。。。');
    wx.cloud.callFunction(
      {name:'messageModule',data:{
          type:"getNoticeContentAndSelfRecord",
          //根据用户openid 和文章id查询文章详情和阅读记录
          queryData:{ readerId:getApp().globalData.openid,noticeId:this.data.noticeId}} }
    ).then(res=>{
      if(res.result.msg=='查询文章信息成功')
      //查询成功之后，将页面中的富文本渲染组件绑定的node值更改为查询到的文章详情 同时更改标题 和阅读记录按钮的显示
      { this.setData({nodeText:res.result.articleResult.noticeContent,textTitle:res.result.articleResult.noticeTitle,
            isRead:res.result.isRecord}
        )
        this._wxHideLoading()
        this._tipShow('文章信息加载成功',1);
      }
    })
  },
  haveRead:function(){
    //云函数处理阅读结果
    this._wxLoading('添加阅读记录中');
    console.log('参数信息')
    console.log(getApp().globalData.openid)
    console.log(this.data.noticeId)
    wx.cloud.callFunction(
      {
        name:'messageModule',
        data:{
          type:'addANoticeRecord',
          queryData:{
            readerId:getApp().globalData.openid,
            noticeId:this.data.noticeId
          }
        }
      }
    ).then(res=>{
      console.log(res)
      if(res.result.msg=="添加阅读记录成功")
      {
        this._wxHideLoading();
        this._tipShow('感谢您对社区工作的支持!',1);
        this.setData(
          {
            isRead:true
          }
        )
      }
    })
  },
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