// components/threeTypeTips/threeTypeTips.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //传入的类型和显示的信息
    msgType:Number,//1成功 -1失败 0提示
    msgShow:String,//要显示的信息
  },
  observers:{
    'msgType':function(msgType)
    {
      if(msgType==1)
      {
        this.setData(
          {
            successMsg:this.data.msgShow,
            successMsgShow:true
          }
        )
      }
      else if(msgType==-1)
      {
        this.setData(
          {
            errMsg:this.data.msgShow,
            errMsgShow:true
          }
        )
      }
      else if(msgType==0)
      {
        this.setData(
          {
            infoMsg:this.data.msgShow,
            infoMsgShow:true
          }
        )
      }
      else
      {
        console.log('扣扣赛!')
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    //成功显示
    successMsg:null,
    successMsgShow:false,
    //失败显示
    errMsg:null,
    errMsgShow:false,
    //提示显示
    infoMsg:null,
    infoMsgShow:false,
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
