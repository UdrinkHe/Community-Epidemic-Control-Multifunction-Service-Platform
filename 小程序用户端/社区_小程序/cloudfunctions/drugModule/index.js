// 云函数入口文件
const cloud = require('wx-server-sdk')
const drugTypeDatabase=require('./drugTypeDatabase/drugTypeDatabase')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  switch(event.type)
  {
    //查询本社区所有限购药品信息
    case 'selectAllDrugByCommunityId':
    return drugTypeDatabase.selectAllDrugByCommunityId(event.queryData);
    break;
  }
}