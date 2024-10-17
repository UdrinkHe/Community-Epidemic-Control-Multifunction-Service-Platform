// volunteerPages/pages/packageWriteDown/packageWriteDown.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //提示框数据
    tipMsgShow:'',
    tipMsgType:99,
    //提交和显示的数据
    content:'',//相关备注 
    postName:'',//收件人备注名
    address:'',//收件地址(看)
    placeId:'',//地址id
    communityId:'',//收件社区
    communityName:'',//社区名(看)
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData(
      {
        placeId:options.placeId
      }
    );
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
  //以下是自定义方法
  //加载页面信息
  dataInit:function(){
    //根据地点id 查询出社区id和社区名和地点名
    this._wxLoading('查询场所信息中');
    wx.cloud.callFunction(
      {
        name:'placeInfoDataModule',
        data:{
          type:'selectPlaceAndCommunityInfo',
          queryData:{
            placeId:this.data.placeId
          }
        }
      }
    ).then(res=>{
      if(res.result.msg=='地点和社区信息查询成功')
      {
        console.log(res);
         this.setData(
          {
            address:res.result.placeInfo['address'],
            communityId:res.result.communityInfo['_id'],//收件社区
            communityName:res.result.communityInfo['name'],//社区名(看)
          }
        )
        this._wxHideLoading()
        this._tipShow('查询存点信息成功',1)
      }
    })
  },
  //提交录入信息
  submitPackageInfo:function()
  {
    console.log('点击了时间按钮')
    console.log(this.data.postName);
    console.log(this.data.content);
    if(!this.data.postName||!this.data.content)
    {
      this._tipShow('请确认所有填写信息栏位不为空',0)
    }
    else
    {
      this._wxLoading('正在提交存件信息中')
      wx.cloud.callFunction(
        {
          name:'packageDataModule',
          data:{
            type:'submitPackageInfo',
            queryData:{
              communityId:this.data.communityId,
              placeId:this.data.placeId,
              workerId:getApp().globalData.openid,
              content:this.data.content,
              postName:this.data.postName
            }
          }
        }
      ).then(res=>{
        if(res.result.msg=='收件人备注名不存在')
        {
          this._wxHideLoading();
          this._tipShow("收件人备注名不存在！",-1)
        }
        else if(res.result.msg=='存件成功!')
        {
          this._wxHideLoading();
          this._tipShow("存件信息录入成功!",1);
          wx.navigateTo({
            url: '/pages/tipPage/tipPage?MsgInfoEvent=packageWriteSuccess',
          })
        }
      })
    }
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