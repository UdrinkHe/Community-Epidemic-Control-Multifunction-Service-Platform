const cloud = require('wx-server-sdk')
cloud.init()
let db=cloud.database();
exports.getUserLoginInfo=async function(queryData)
{

  let result= await db.collection("userLoginInfo").where(
    {
      open_id:queryData.openid
    }
  ).orderBy("lastUpdateTime","desc").get().then(res=>{return {loginInfo:{nickName:res.data[0].nickName,touxiangUrl:res.data[0].touxiangUrl},resultInfo:"successGet"}}).catch(err=>{return {err:err,resultInfo:"errGet"}});
  return result;
  
}