// components/swiperScrollShow/swiperScrollShow.js
Component({
  /**
   * 组件的设置
   */
  options:{
    styleIsolation:'isolated',//样式隔离
    pureDataPattern:/^_/, //纯数据字段
    multipleSlots:true,//多插槽
  },
  /**
   * 组件的属性列表
   */
  properties: {
    pageType:{
      type:Number,
      value:null
    },//组件用于哪种类型的页面 1:placeInfo 2:testInfo 3:packageInfo 4:drugInfo
  },

  /**
   * 组件的初始数据
   */
  data: {
    count:0,
    canIUse:true,
    navData:[
      //申报场所的选项卡
      [
        {
            text: '已通过'
        },
        {
            text: '审核中'
        },
        {
            text:"未通过"
        }
      ]
    ],
    currentTab: 0,//swipr栏停留在第几个
    navScrollLeft: 0,//scroll-view左偏移的距离
    windowWidth:0,//屏幕的宽度，
    scrollHeight:null,//数据展示滑块应该有的高度
  },
  /**组件的生命周期方法 */
  created:function()
    {
      //首先获取页面总宽度和高度
      let allWidth=wx.getSystemInfoSync().windowWidth
      this.setData(
        {
          windowWidth:allWidth,
        }
      )
    },
  /**
   * 组件的方法列表
   */
  methods: {
    //组件加入节点树时触发
    

    switchNav(event){
      let cur = event.currentTarget.dataset.current; 
      //每个tab选项宽度占1/5
      let singleNavWidth = this.data.windowWidth / 2;
      //tab选项居中                            
      this.setData({
          navScrollLeft: (cur-0.5)*singleNavWidth
      }) 
           
      if (this.data.currentTab == cur) {
          return false;
      } else {
          this.setData({
              currentTab: cur
          })
      }
  },
  switchTab(event){
      var cur = event.detail.current;
      var singleNavWidth = this.data.windowWidth / 2;
      this.setData({
          currentTab: cur,
          navScrollLeft: (cur - 0.5) * singleNavWidth
      });
  }
  }
})
