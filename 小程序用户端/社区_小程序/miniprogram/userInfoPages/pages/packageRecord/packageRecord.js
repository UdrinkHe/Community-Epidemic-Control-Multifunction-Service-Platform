// userInfoPages/pages/packageRecord/packageRecord.js
const myTimeMaker=require('../../../until/getTimeString');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //页面提示信息
    tipMsgShow:'',
    tipMsgType:99,
    typeName:'存放中',
    typeValue:0,
    selectDisplay:'none',//下拉框显示状态
    maxHeight:null,//页面的最大高度
    selectItems:[
      {
        key:"one",
        value:0,
        name:"存放中",
        isChoose:true
      },
      {
        key:"two",
        value:1,
        name:"已取出",
        isChoose:false
      },
    ],
    recordList:[
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData(
      {
        maxHeight:wx.getSystemInfoSync().windowHeight+"px"
      }
    )
    this.dataSelect();
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
  //显示或隐藏下拉框
  showOrhideSelectBar:function(){
    if(this.data.selectDisplay=="none")
    {
      this.setData(
        {
          selectDisplay:'block'
        }
      )
    }
    else
    {
      this.setData(
        {
          selectDisplay:'none'
        }
      )
    }
  },
  //选择某个下拉框的数值
  selectThisTypeInfo:function(e){
    let queryType=e.target.dataset.queryvalue;//地点类型
    let openid=getApp().globalData.openid;//openid
    //先处理菜单显示
    let changeArr=this.data.selectItems;
    for(let i=0;i<changeArr.length;i++)
    {
      if(changeArr[i].value!=queryType)
      changeArr[i].isChoose=false;
      else
      {
        changeArr[i].isChoose=true;
        this.setData(
          {
            typeName:changeArr[i].name,
            typeValue:changeArr[i].value
          }
        )
      }
    }
    this.setData(
      {
        selectItems:changeArr,
        selectDisplay:"none"
      }
    )
    //查询当前状态的值
    this.dataSelect();
  },
  //根据页面的typeValue值查询相应状态的包裹信息
  dataSelect:function()
  {
    this._wxLoading('正在查询记录中..')
    wx.cloud.callFunction(
      {
        name:'packageDataModule',
        data:{
          type:'selectAUserPackage',
          queryData:{
            userId:getApp().globalData.openid,
            status:this.data.typeValue
          }
        }
      }
    ).then(res=>{
      let newArray=res.result.queryResult.map(item=>{
        let newItem=item;
        newItem.createTime=myTimeMaker.getTimeString(newItem.createTime);
        if(this.data.typeValue==1)newItem.scanTime=myTimeMaker.getTimeString(newItem.scanTime);
        return newItem
      })
      this.setData(
        {
          recordList:newArray
        }
      )
      this._tipShow('查询用户包裹信息成功!',1)
      this._wxHideLoading();
    })

  },
  showPackageCode:function(e)
  {
    wx.navigateTo({
      url: '/userInfoPages/pages/showPersonalCode/showPersonalCode?recordId='+e.currentTarget.dataset.recordid,
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