// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const drugTypeDatabase=require('./drugTypeDatabase/drugTypeDatabase')

// 云函数入口函数
exports.main = async (event, context) => {
switch(event.type)
{
  //查询本社区所有限购药品信息
  case 'selectAllDrugByCommunityId':
  return drugTypeDatabase.selectAllDrugByCommunityId(event.queryData);
  //管理员添加药品信息
   case 'addADrug':
    return drugTypeDatabase.addADrug(event.queryData);
  //管理员修改药品信息
  
  //提交购药信息并查询是否可以完成购买
  case 'submitDrugRecord':
    return drugTypeDatabase.submitDrugRecord(event.queryData);
 //根据用户的openid查询购药记录
 case 'selectSelfdrugRecord':
  return drugTypeDatabase.selectSelfdrugRecord(event.queryData);
  //管理员查询社区内所有购药记录
  case 'selectAllDrugRecord':
    return drugTypeDatabase.selectAllDrugRecord(event.queryData);
   //查询详细购药结果
   case 'showMainDrugRecord':
     return drugTypeDatabase.showMainDrugRecord(event.queryData);
   //设置购药记录状态
   case 'setDrugRecordStatus':
       return drugTypeDatabase.setDrugRecordStatus(event.queryData); 
  case 'ddd':
    return drugTypeDatabase.ddd(event.queryData);
}
}