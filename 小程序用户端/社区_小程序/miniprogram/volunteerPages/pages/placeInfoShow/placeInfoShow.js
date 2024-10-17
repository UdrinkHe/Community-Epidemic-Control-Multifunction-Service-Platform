// volunteerPages/pages/placeInfoShow/placeInfoShow.js
let drawQrCode=require("../../../miniprogram_npm/weapp-qrcode-master/dist/weapp.qrcode.min")
let myCryptoJS=require("../../../until/myCrypto")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //页面动态显示参数
    codeShowerWidth:0,//二维码的宽度
    mainHeight:0,//页面高度
    contentCenterPX:0,//让主要内容居中
    placeId:null,//地址码的id
    communityName:"",//社区名称
    placeType:"",//类型
    placeName:"",//场所名称
    tiptext:"",//提示语
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取进入该页面附带的地址_id
    this.setData(
      {
        placeId:options.placeId
      }
    )
    //1.自适应最高屏幕宽度
    this.setData(
      {
        mainHeight:wx.getSystemInfoSync().windowHeight+"px"
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
      this.getPlaceInfo();
    }).exec();
    //加载options项中的场所id，并将其通过云函数加密后返回生成二维码
    
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
  //以下为自定义方法
  //1.在初次加载或者刷新的时候更新二维码中的内容
  getPlaceInfo:function(){
    //参数中传入了地点码的_id
    console.log(this.data.placeId)
    if(this.data.placeId)
    {
      wx.showLoading({
        title: '数据获取中...',
      })
      wx.cloud.callFunction(
        {
          name:"placeInfoDataModule",
          data:
          {
            type:"selectPlaceAndCommunityInfo",
            queryData:{
              placeId:this.data.placeId
            }
          }
        }
      ).then(res=>{
        console.log(res) 
        let communityResult=res.result.communityInfo;
        let placeResult=res.result.placeInfo;
        //内容模板
        let pageContentModule=[
          {
            placeType:"社区报备点",
            tiptext:"请将此码出示给需要在该小区报备居住长期信息的居民"
          },
        {
            placeType:"购药登记码",
            tiptext:"请将此码出示给需要登记购药信息的居民"
          },
          {
            placeType:"小区存物站点",
            tiptext:"请将此码出示给需要在该站点存放居民物件的社区工作者进行信息登记"
          },
          
        ]; 
        //1.根据结果套模板更改页面内容
        this.setData(
          {
            communityName:communityResult.name,//社区名称
            placeType:pageContentModule[parseInt(placeResult["type"])-1].placeType,//类型名称
            placeName:placeResult["address"],
            tiptext:pageContentModule[parseInt(placeResult["type"])-1].tiptext//场所码说明
          }
        )
        //2.加密相关数据
        let qrData=null;
        console.log('测试社区')
        if([1,2,3].includes(placeResult.type))
        {let baseAddress="";

          for(let i=0;i<communityResult.region.length;i++)
          { baseAddress+=communityResult.region[i]}
          //需要封装的数据（场所id、地址、社区id、社区名、场所类型）
          qrData={placeId:placeResult["_id"],address:baseAddress+placeResult["address"],communityId:communityResult["_id"],
          communityName:communityResult.name,type:placeResult.type}
          //将封装的信息转换为字符串后加密（加密使用基于encrypted.js的方法）
          qrData=myCryptoJS.encrypted(JSON.stringify(qrData));
        }
        //生成相应二维码（需要引入weapp-qrcode，方法参数为显示宽度、高度、渲染的canvas对象id、二维码中的内容）
        drawQrCode( {width: this.data.codeShowerWidth,height: this.data.codeShowerWidth,canvasId: 'codeShower',text:qrData})
        //4.关闭加载
        wx.hideLoading({
          success: (res) => {},
        })
      })
    }
    else
    {
      console.log('咦?没有场所码编号信息喔!')
    }
  }
})