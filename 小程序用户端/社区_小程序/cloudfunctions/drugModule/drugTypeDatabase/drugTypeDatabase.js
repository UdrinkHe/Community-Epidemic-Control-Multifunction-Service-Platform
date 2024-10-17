const cloud = require('wx-server-sdk')
cloud.init()
let db=cloud.database();
let _=db.command;
//1.查询本社区所有限购药品信息(小程序居民管理员)
exports.selectAllDrugByCommunityId=async function(queryData)
{
  let communityId=queryData.communityId;
 //定义查询时间
  let selectTime=new Date().getTime();
  //统计数量
  let drugTypeNum=await db.collection("drugType").where(
    {
      communityId:communityId,
      createTime:_lt(selectTime)
    }
  ).count();
  let totalNum=drugTypeNum.total;
  //获取当前社区拥有的全部药品
  let queryResult=await db.collection("drugType").where(
    {
      communityId:communityId,
      createTime:_lt(selectTime)
    }
  ).get().then(res=>{
    return res.data
  })
  return {msg:"查询社区药物成功",queryResult:queryResult,totalNum:totalNum}
  //进行种类分类
  //返回数据
}