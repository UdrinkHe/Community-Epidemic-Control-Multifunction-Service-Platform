// volunteerPages/pages/myPlacesInfo/myPlacesInfo.js
const myTimeMaker=require('../../../until/getTimeString')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /*
      选择器显示参数
    */
    typeName:"社区报备点",
    typeValue:1,//用于查询当前地点
    selectDisplay:"none",
    selectItems:[
      {
        key:"one",
        value:1,
        name:"社区报备点",
        isChoose:true
      },
      {
        key:"two",
        value:2,
        name:"购药登记点",
        isChoose:false
      },
      {
        key:"three",
        value:3,
        name:"物品存放点",
        isChoose:false
      }
    ],
    /*查询到的数据*/
    agreePlace:[],
    disagreePlace:[],
    applyingPlace:[],
    communityName:null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //载入时查询数据 社区报备点
    this.pageDataInit()
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
  /*
  *下面是自定义函数
   */
  //在选择下拉菜单或打开页面时根据当前地点类型查询数据
  pageDataInit:function(){
    //进入页面时显示数据加载
    wx.showLoading({title: '查询数据中',})
    wx.cloud.callFunction(
      //name为调用的云函数名称 data为请求参数
      {name:"placeInfoDataModule",data:{type:"selectPlacesForOneVolunteer",queryData:{
             type:this.data.typeValue,//查询选中下拉菜单中站点类型的值，默认是社区报表点
            openId:getApp().globalData.openid//全局数据中的用户账号信息
          }}}
    ).then(res=>{
      console.log(res)
      //日期格式化转换
      let agreePlace=res.result.agreePlace.map((item)=>{
        item.applyTime=myTimeMaker.getTimeString(item.applyTime)
        return item
      });
      let disagreePlace=res.result.disagreePlace.map((item)=>{
        item.applyTime=myTimeMaker.getTimeString(item.applyTime)
        return item
      })
      let applyingPlace=res.result.applyingPlace.map((item)=>{
        item.applyTime=myTimeMaker.getTimeString(item.applyTime)
        return item
      })
      this.setData(
        {
          agreePlace:agreePlace,
          disagreePlace:disagreePlace,
          applyingPlace:applyingPlace,
          communityName:res.result.communityName
        }
      )
      this._closeLoading()
    }).catch(err=>{
      console.log(err)
      this._closeLoading()
    })
  },

  //1.打开或关闭下拉菜单
  showOrhideSelectBar:function()
  {
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
  //2.选择并查询这个地点类型的数据
  selectThisTypePlaces:function(e)
  {
    let queryType=e.target.dataset.queryvalue;//地点类型
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
    //调用云函数查询相关站点
    this.pageDataInit();
  },
  //关闭加载条并显示相关信息
  _closeLoading:function(msg,msgType)
  {
    wx.hideLoading({
      success: (res) => {console.log(res)},
    })
    if(msg&&msgType)
    {
      console.log('可以使用信息提示!')
    }
  },
   //点击跳转到具体场所页面
   navTo:function(e){
    if([1,2].includes(this.data.typeValue))
    {
      wx.navigateTo({
        url: '/volunteerPages/pages/placeInfoShow/placeInfoShow?placeId='+e.currentTarget.dataset.placeid,
      })
    }
    else if(this.data.typeValue==3)
    {
      wx.navigateTo({
        url: '/volunteerPages/pages/packageWriteDown/packageWriteDown?placeId='+e.currentTarget.dataset.placeid,
      })
    }
  }
})