// 云函数入口文件
const cloud = require('wx-server-sdk')
const packageDatabase=require('./packageDatabase/packageDatabase')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
 switch(event.type)
 {
   case 'submitPackageInfo':
      return packageDatabase.submitPackageInfo(event.queryData);
   //查询一个用户的所有包裹信息
   case 'selectAUserPackage':
      return packageDatabase.selectAUserPackage(event.queryData);
   //查询一个包裹记录的存放点信息
   case 'selectPackageRecordAddressInfo':
      return packageDatabase.selectPackageRecordAddressInfo(event.queryData);
   //扫居民的取件码,判断是否可以更改取件码信息
   case 'toScanPackageCode':
     return packageDatabase.toScanPackageCode(event.queryData);
  //查询社区内的所有取件记录
   case "selectAllPackageRecord":
     return packageDatabase.selectAllPackageRecord(event.queryData);
 }
}