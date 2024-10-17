// userInfoPages/pages/drugWriteDown/drugWriteDown.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //统一图片(false关闭时可以访问存储的图片)
    isImgSimple:true,
    simpleImgUrl:'../../../images/OIP-C.jpg',
    //顶部提示信息参数
    tipMsgShow:null,
    tipMsgType:99,
    //商品选择页和商品详情(1商品选择 其余为详情)
    pageShow:1,
    //药物类型（选项卡）
    switchTab:[
      {
        key:"1",
        name:"退热药物",
        value:1
      },
      {
        key:"2",
        name:"止咳药物",
        value:2
      },
      {
        key:"3",
        name:"抗感染药物",
        value:3
      }
    ],
    isSwitch:1,//被选中的选项卡值，同时也是商品的类型值
    isdrugCarShow:false,//购物车显示，
    drugTypeNum:0,//已选类型
    //药物内容 包含(限购数量 名称 药物id 药物url)
    drugContent:[
      [
        {
          drugName:'三九感冒灵',//名称
          drugId:'xxxxxxxxxxx1',//id
          limitNum:2,//限购数量
          drugImgUrl:'cloud://hyj-yunkaifa-4gu6ljl6bd8b40b2.6879-hyj-yunkaifa-4gu6ljl6bd8b40b2-1309475014/drug/C114115T1I1.png',//药品的图片地址
          chooseNum:0,//用户选择的数量
          isChoose:false,//是否被选择

        },
        {
          drugName:'gg思密达胶囊',
          drugId:'xxxxxxxxxxx2',
          limitNum:2,
          drugImgUrl:'../../../images/OIP-C.jpg',
          chooseNum:0,
          isChoose:false
        }
      ],
      [
        {
          drugName:'小柴胡颗粒',
          drugId:'xxxxxxxxxxx3',
          limitNum:2,
          drugImgUrl:'../../../images/OIP-C.jpg',
          chooseNum:0,
          isChoose:false
        },
        {
          drugName:'gg思密达胶囊',
          drugId:'xxxxxxxxxxx4',
          limitNum:2,
          drugImgUrl:'../../../images/OIP-C.jpg',
          chooseNum:0,
          isChoose:false
        }
      ]
    ],
    //地址码id
    placeId:null,
    communityId:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //导入传入的社区id
    if(options.communityId)
    {
      this.setData(
        {
          communityId:options.communityId
        }
      )
    }
    //导入传入的地址id
    if(options.placeId)
    {
      this.setData(
        {
          placeId:options.placeId
        }
      )
    }
    this._cloud_DrugDataInit();
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
  /**更换选项卡 */
  changeSwitchTab:function(e){
    let switchValue=e.currentTarget.dataset.value;
    this.setData(
      {
        isSwitch:switchValue
      }
    )
  },
  //添加药类
  addItem:function(e)
  {
    let drugIndex=e.currentTarget.dataset.itemindex; 
    let typeIndex=0;
    if(e.currentTarget.dataset.typeindex!=null)//购物车里面操作需要药品类型索引
    {
      console.log('购物车类型')
      typeIndex=e.currentTarget.dataset.typeindex;
      console.log(typeIndex)
    }
    else
    {
      typeIndex=this.data.isSwitch-1;
    }
    if(this.data.drugContent[typeIndex][drugIndex].chooseNum+1>this.data.drugContent[typeIndex][drugIndex].lessTime)
    {
      this._tipShow("不能超过社区限定购买数量!",-1);
      return 0
    }
    if(this.data.drugContent[typeIndex][drugIndex].chooseNum+1>this.data.drugContent[typeIndex][drugIndex].limitNum)
    {
      this._tipShow("不能超过社区限定购买数量!",-1)
      return 0
    }
    //利用局部添加
    this.setData(
      { 
        ['drugContent['+typeIndex+']['+drugIndex+'].chooseNum']:this.data.drugContent[typeIndex][drugIndex].chooseNum+1
      }
    )
    //刚好添加到1 更新购物车
    if(this.data.drugContent[typeIndex][drugIndex].chooseNum==1)
    {
      this.setData(
        {
          ['drugContent['+typeIndex+']['+drugIndex+'].isChoose']:true,
          drugTypeNum:this.data.drugTypeNum+1
        }
      )
    }
  },
  //删减药类
  decreaseItem:function(e)
  {
    console.log(e.currentTarget.dataset)
    let drugIndex=e.currentTarget.dataset.itemindex;
    let typeIndex=0;
    if(e.currentTarget.dataset.typeindex!=null)//购物车里面操作需要药品类型索引
    {
      typeIndex=e.currentTarget.dataset.typeindex;
    }
    else
    {
      typeIndex=this.data.isSwitch-1;
    }
    //数量为0时不可用
    if(this.data.drugContent[typeIndex][drugIndex].chooseNum==0)
    {
      this._tipShow("该商品数量已经为0",0)
      return 0
    }
    //利用局部删减
    this.setData(
      { 
        ['drugContent['+typeIndex+']['+drugIndex+'].chooseNum']:this.data.drugContent[typeIndex][drugIndex].chooseNum-1
      }
    )
    //刚好删减到0 清除购物车
    if(this.data.drugContent[typeIndex][drugIndex].chooseNum==0)
    {
      this.setData(
        {
          ['drugContent['+typeIndex+']['+drugIndex+'].isChoose']:false,
          drugTypeNum:this.data.drugTypeNum-1
        }
      )
    }
  },
  //打开清单
  openCar:function()
  {
    this.setData(
      {
        isdrugCarShow:true
      }
    )
  },
  //提交清单
  submitDrugForm:function()
  {
    if(!this.data.drugTypeNum)//药品种类为0
    {
      this._tipShow("不能提交空列表！",-1)
    }
    else
    {
      wx.showModal({
        title:"提交本次购药信息",
        content:"确认购买商品填写无误并提交信息？",
        cancelText:"否",
        confirmText:"是"
      }).then(res=>{
        if(res.confirm)
        {
         let chooseDrugInfo=this._chooseDrugGet();
         //接下来云函数提交购买药物
         this._cloud_submitDrugInfo(chooseDrugInfo)
        }
       
      }).catch(err=>{
        console.log(err)
      })
    }
  },
  //用于筛选出购买的药物
  _chooseDrugGet:function()
  {
    let chooseDrug=[];
    for(let i=0;i<this.data.drugContent.length;i++)
    for(let j=0;j<this.data.drugContent[i].length;j++)
    {
      if(this.data.drugContent[i][j].isChoose)
      {
        let thisDrugItem={
          typeId:i,
          itemId:j,
          drugId:this.data.drugContent[i][j]._id,
          drugName:this.data.drugContent[i][j].drugName,
          limitNum:this.data.drugContent[i][j].limitNum,
          chooseNum:this.data.drugContent[i][j].chooseNum
        }
        chooseDrug.push(thisDrugItem);
      }
    }
    return chooseDrug;
  },
  //用于提示药物剩余购买次数
  //参数 两个编号，一个剩余次数
  _setDrugTip:function(typeId,itemId,lessTime)
  {
    console.log('这个商品限购!')
    console.log(typeId,itemId,lessTime)
    this.setData(
      {
        ['drugContent['+typeId+']['+itemId+'].lessTime']:lessTime
      }
    )
    console.log(this.data.drugContent[typeId][itemId])
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
  //云函数调用列表
  //1.获取社区可购药品信息
  _cloud_DrugDataInit:function()
  {
    this._wxLoading("数据加载中...")
    wx.cloud.callFunction(
      {
        name:"drugDataModule",
        data:{
          type:"selectAllDrugByCommunityId",
          queryData:{
            communityId:this.data.communityId
          }
        }
      }
    ).then(res=>{
      if(res.result.msg=="查询社区药物成功")
      {
        //药品分类
        let typeOneDrug=res.result.queryResult.filter((item)=>{
          return item.drugType==1
        });
        let typeTwoDrug=res.result.queryResult.filter((item)=>{
          return item.drugType==2
        });
        let typeThreeDrug=res.result.queryResult.filter((item)=>{
          return item.drugType==3
        });
        for(let i=0;i<typeOneDrug.length;i++)
        {
          typeOneDrug[i].isChoose=false;
          typeOneDrug[i].chooseNum=0;
        }
        for(let i=0;i<typeTwoDrug.length;i++)
        {
          typeTwoDrug[i].isChoose=false;
          typeTwoDrug[i].chooseNum=0;
        }
        for(let i=0;i<typeThreeDrug.length;i++)
        {
          typeThreeDrug[i].isChoose=false;
          typeThreeDrug[i].chooseNum=0;
        }
        let dataArr=[];
        dataArr.push(typeOneDrug);
        dataArr.push(typeTwoDrug);
        dataArr.push(typeThreeDrug);
        this.setData(
          {
            drugContent:dataArr
          }
        );
        console.log('最终查询药品为')
        console.log(this.data.drugContent)
      this._wxHideLoading();
      this._tipShow("数据加载成功!",1)
      }
    }).catch(err=>{
      this._wxHideLoading();
      this._tipShow("发生了未知的错误，请刷新页面重新加载!",-1)
      console.log(err)
    })
  },
  //2.提交购药信息
  _cloud_submitDrugInfo:function(chooseDrugInfo)
  {
    this._wxLoading("正在提交信息中...")
    console.log(chooseDrugInfo);
    wx.cloud.callFunction(
      {
        name:"drugDataModule",
        data:
        {
          type:"submitDrugRecord",
          queryData:{
            drugList:chooseDrugInfo,
            openId:getApp().globalData.openid,
            communityId:this.data.communityId,
            placeId:this.data.placeId
          }
        }
      }
    ).then(res=>{
      console.log('提交结果为')
      console.log(res)
      if(res.result.msg=="没有此地点的打卡记录")
      {
        this._wxHideLoading();
        this._tipShow("您在该场所的打卡信息失效，请重新扫描场所码",-1)
      }
      else if(res.result.msg=="存在超过限购数量的购买商品")
      {
        this._wxHideLoading();
        wx.showModal({
          title:"购药提示",
          content:"根据社区限购药品登记，您选择的药品中有超过限购的部分，请根据列表提示选择数量",
          cancelText:"否",
          confirmText:"是"
        }).then(res=>{})
        let canNotAddList=res.result.canNotAddList;
        for(let i=0;i<canNotAddList.length;i++)
        {
          this._setDrugTip(canNotAddList[i].typeId,canNotAddList[i].itemId,canNotAddList[i].lostNum)
        }
      }
      else if(res.result.msg=="添加购药记录成功")
      {
        this._wxHideLoading();
        //跳转到成功添加页面
        wx.navigateTo({
          url: '/pages/tipPage/tipPage?MsgInfoEvent=drugAddSuccess',
        })
      }
    })
    this._wxHideLoading()
  }
})