// 云函数入口文件
const cloud = require('wx-server-sdk')
const noticeDataBase=require('./noticeDatabase/noticeDatabase')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
 switch(event.type)
 {//管理员添加一篇文章
   case 'addANotice':
     return noticeDataBase.addANotice(event.queryData);
    //管理员获取社区所有通知
     case 'getAllCommunityNotice':
       return noticeDataBase.getAllCommunityNotice(event.queryData);
   //用户获取一篇文章的文章信息和自己是否已经阅读
   case 'getNoticeContentAndSelfRecord':
     return noticeDataBase.getNoticeContentAndSelfRecord(event.queryData);
  //用户获取社区内所有可阅读的文章 信息
    case 'getAllCommunityNoticeByUser':
      return noticeDataBase.getAllCommunityNoticeByUser(event.queryData);
   //用户添加阅读记录
   case 'addANoticeRecord':
     return noticeDataBase.addANoticeRecord(event.queryData);
    //查询社区内的一篇文章 本社区人员的读取情况
      case 'selectHasReadMan':
      return noticeDataBase.selectHasReadMan(event.queryData);
 }
}