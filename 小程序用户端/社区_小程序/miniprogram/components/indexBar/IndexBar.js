// components/indexBar/IndexBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    navDataInfo:Array
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    navigateTo:function(e)
    {
      let pageUrl=e.currentTarget.dataset.navurl;
      wx.navigateTo({
        url: pageUrl,
      })
    }
  }
})
