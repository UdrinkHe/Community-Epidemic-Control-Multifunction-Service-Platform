//此处为居民信息数据库功能入口
const cloud = require('wx-server-sdk')
cloud.init()
let db=cloud.database();
let _=db.command;
//根据用户输入的姓名和身份证查询是否存在这个人
exports.selectInhabitantExist=async (queryData)=>
{ 
  let isExist=await db.collection("inhabitantInfo").where(
      {
        inhabitantIdentityCardId:queryData.identityCardId,
        identityCardType:queryData.identityCardType
      }
    ).get().then(
    (res)=>{
      if(res.data[0].inhabitantName==queryData.baseName)
      return {msg:"验证成功",resultData:res.data[0]}; //返回查询结果
      else
      return {msg:"验证失败"};
    }
  ).catch((err)=>
  {
    return {msg:"查询的时候出现错误!"};
  })
  return isExist;
}

