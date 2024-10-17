//placeInfo数据库的方法
const cloud = require('wx-server-sdk')
cloud.init()
let db=cloud.database();
let _=db.command;
//1.添加一条待审核场所码数据(社区工作者)
exports.addOnePlaceInfo=async function(queryData)
{
  //查询管理员所在社区编号
  let communityId=await db.collection("personalInfo").doc(queryData.openId).get().then(res=>{return res.data.communityId})
   let time=new Date().getTime();//存储操作的时间戳
  //提交站点至待审核
  let result=await db.collection("placeInfo").add({data:{communityId:communityId,type:queryData.type,address:queryData.address,
  extraInfo:queryData.extraInfo,location:db.Geo.Point(queryData.longitude,queryData.latitude),status:0,applyTime:time,
  applyId:queryData.openId}})
  .then(res=>{
    return {msg:"上报地点成功"}
  }).catch(err=>{
    return {msg:"上报地点失败",err:err}
  })
  return result;
}
//2.打开场所码界面时返回相应数据(社区工作者)
exports.selectPlaceAndCommunityInfo=async function(queryData)
{
  //查询此条记录
  let placeInfo=await db.collection("placeInfo").doc(queryData.placeId).get().then(res=>{return res.data});
  //再查询这条记录所在的社区
  let communityInfo=await db.collection("communityInfo").doc(placeInfo["communityId"]).get().then(res=>{return res.data});
  //返回地点码和社区信息
  return {msg:"地点和社区信息查询成功",placeInfo:placeInfo,communityInfo:communityInfo};
}
//3.查询一个社区工作者提交的所有场所码信息（社区工作者）
exports.selectPlacesForOneVolunteer=async function(queryData)
{
    //查询管理员所在社区编号
    let communityId=await db.collection("personalInfo").doc(queryData.openId).get().then(res=>{
      return res.data.communityId
    })
    let communityName=await db.collection("communityInfo").doc(communityId).get().then(res=>{
      return res.data.name
    })
  //查询所有 不能查到新添加的记录
  let selectTime=new Date().getTime();//查询记录时的时间戳
  let count=await db.collection("placeInfo").where(
    {communityId:communityId,applyId:queryData.openId,applyTime:_.lt(selectTime),type:queryData.type}
  ).count();
  let totalNum=count.total;//查询符合条件的数据一共有几条
  let totalDataArr=[];//用来拼接每一次查询到的数据
  for(let i=0;i<totalNum;i+=100)//由于云函数一次只能查询100条数据，所以要循环查询所有数据
  {let resultArr=await db.collection("placeInfo").orderBy('applyTime','desc').where(
      {communityId:communityId,applyId:queryData.openId,applyTime:_.lt(selectTime),type:queryData.type}
    ).skip(i).get();
    totalDataArr=totalDataArr.concat(resultArr.data);
  }

  // //再将数据分类 最后输出 0申请中 1已通过 -1未通过
  let applyingPlace=totalDataArr.filter((item)=>{
    return item.status==0
  });
  let agreePlace=totalDataArr.filter((item)=>{
    return item.status==1
  });
  let disagreePlace=totalDataArr.filter((item)=>{
    return item.status==-1
  })
  return {totalNum:totalNum,applyingPlace:applyingPlace,agreePlace:agreePlace,disagreePlace:disagreePlace,communityName:communityName}
}
//4.用户扫码时记录场所码打卡记录
exports.addEntranceRecord=async function(queryData)
{
  let nowTime=new Date().getTime();
  //添加一条场所记录
  db.collection("entranceRecord").add(
    {
      data:{
        placeId:queryData.placeId,
        communityId:queryData.communityId,
        placeType:queryData.placeType,
        userId:queryData.userId,
        createTime:nowTime,
        status:0
      }
    }
  )
}

//5.管理员设置地点信息状态
exports.setPlaceInfoStatus=async function(queryData)
{
  // 操作时间 操作地点id 设置的状态
  let queryResult=await db.collection("placeInfo").doc(queryData.placeId).update(
     //更新数据：更新时间，状态
    { data:{ lastUpdateTime:_.set(new Date().getTime()),status:queryData.status}})
    .then(res=>{
      return {msg:"设置地点状态成功"}
    })
    return queryResult
}
//6.管理员通过communityId查询所有地点信息
exports.selectAllPlaces=async function(queryData)
{
  let total=await db.collection("placeInfo").where({
    communityId:queryData.communityId
  }).count();
  let result=[];
  for(let i=0;i<total.total;i+=100)
  {
    await db.collection("placeInfo").skip(i).get().then(res=>{
      result=result.concat(res.data)
    });
  }
 return {msg:"查询所有社区信息点成功",queryResult:result}
}