const cloud = require('wx-server-sdk')
cloud.init(
  {
    env:'hyj-yunkaifa-4gu6ljl6bd8b40b2'
  }
)
let db=cloud.database();
let _=db.command;
let $=db.command.aggregate;//聚合查询符号

//提交存件信息
exports.submitPackageInfo=async function(queryData)
{
  //先查询收件人备注名的用户账号信息
  let result=await db.collection('personalInfo').where({postName:queryData.postName}).get();
  if(!result.data.length){return {msg:"收件人备注名不存在"}}//未查询到对应记录
  else//查询到记录
  { //添加包裹记录
    return await db.collection('packageRecord').add(
  //添加收件人id、社区id、地点id、工作者id、存放时间、状态、备注内容
      { data:{ userId:result.data[0]._id,communityId:queryData.communityId,placeId:queryData.placeId,
        workerId:queryData.workerId,takeTime:new Date().getTime(), status:0,content:queryData.content}}
    ).then(res=>{
      return {msg:'存件成功!',queryResult:res}
    })
  }
}
//查询一个用户的所有包裹信息详情
exports.selectAUserPackage=async function(queryData)
{
  let userId=queryData.userId;//先拿到用户id 
  let result=await db.collection("packageRecord").aggregate().match(
    {
      userId:userId,
      status:queryData.status
    }
  ).lookup(
    {
      from: 'communityInfo',
      localField: 'communityId',
      foreignField: '_id',
      as: 'communityInfo',
    }
  ).lookup(
    {
      from: 'placeInfo',
      localField:'placeId',
      foreignField: '_id',
      as: 'placeInfo',
    }
  ).lookup(
    {
      from: 'personalInfo',
      localField:'workerId',
      foreignField: '_id',
      as: 'personalInfo',
    }
  ).end();
  let queryResult=result.list.map(item=>{
    let newItem={};
    newItem._id=item._id;//存放记录主键
    //要显示的信息有：
    newItem.createTime=item.takeTime;//存放时间
    newItem.workerName=item.personalInfo[0].baseInfo.name;//存放人姓名
    newItem.workerPhone=item.personalInfo[0].baseInfo.phone;//存放人手机
    newItem.communityName=item.communityInfo[0].name;//存放社区名
    let address="";
    for(let i=0;i<item.communityInfo[0].region.length;i++)
    {
      address+=item.communityInfo[0].region[i];
    }
    newItem.address=(address+item.placeInfo[0].address);
    newItem.content=item.content;
    if(item.status==1)//已取出的加多一个取件时间
    newItem.scanTime=item.scanTime;
    return newItem;
  })
  return {msg:"查询物件记录成功!",queryResult:queryResult};
}
//查询某个存放编号的社区名和存放点名(居民)
exports.selectPackageRecordAddressInfo=async function(queryData)
{
  let recordId=queryData.recordId;
  let result=await db.collection("packageRecord").aggregate().match(
    {
      _id:recordId
    }
  ).lookup(
    {
      from: 'communityInfo',
      localField: 'communityId',
      foreignField: '_id',
      as: 'communityInfo',
    }
  ).lookup(
    {
      from: 'placeInfo',
      localField:'placeId',
      foreignField: '_id',
      as: 'placeInfo',
    }
  ).end();
  let thisRecord=result.list[0];
  let queryResult={communityName:thisRecord.communityInfo[0].name,placeName:thisRecord.placeInfo[0].address}
  return {msg:'查询存件的地址信息成功!',queryResult:queryResult};
}

//扫居民的取件码并取出
exports.toScanPackageCode=async function(queryData)
{
  let recordId=queryData.recordId;//记录编号
  let scanManId=queryData.scanManId;//扫码人编号
  //先查询扫码人的权限
  let scanManLevel;let scanManCommunity;
  await db.collection('personalInfo').doc(scanManId).get().then(res=>{scanManLevel=res.data.personalInfoStatus;
    scanManCommunity=res.data.communityId;})
  //如果扫码人没有社区工作者权限，则扫码失败
  if(scanManLevel==4)
  {//判断物件是否为工作者同一社区的物件，且状态是否为未取出
    let result=await db.collection("packageRecord").where({_id:recordId,communityId:scanManCommunity,status:0}
    ).get();
    if(result.data.length)//存在该物件
    {  
      //确认扫码人为工作者且物件在管辖社区时将存件记录设置为已经取出状态
      let queryResult=await db.collection("packageRecord").doc(recordId).update(
        {data:{scanTime:_.set(new Date().getTime()),status:1}}
      ).then(res=>{
        return {msg:"扫码取出物件成功!",queryResult:res}})
      return queryResult;
    }
    else//不存在
    {
      return {msg:"该物件不在管理社区内或已经被取出"}
    }
  }
  else
  {
    return {msg:"您没有社区工作者权限"}
  }
}

//社区管理员查询所有入区物件存放记录
exports.selectAllPackageRecord=async function(queryData)
{
  let communityId=await db.collection("managerInfo").where(
    {
      username:queryData.managerId
    }
  ).get().then(res=>{
    return res.data[0].communityId
  })

  let result=await db.collection("packageRecord").aggregate().match(
    {
      communityId:communityId
    }
  ).lookup(
    {
      from:"placeInfo",
      localField:"placeId",
      foreignField:"_id",
      as:"placeInfo"
    }
  ).lookup(
    {
      from:"communityInfo",
      localField:"communityId",
      foreignField:"_id",
      as:"communityInfo"
    }
  ).lookup(
    {
      from:"personalInfo",
      localField:"workerId",
      foreignField:"_id",
      as:"workerInfo"
    }
  ).lookup(
    {
      from:"personalInfo",
      localField:"userId",
      foreignField:"_id",
      as:"userInfo"
    }
  ).end();
  let queryResult=result.list.map(item=>{
    let newItem={};
    let newAddressStr="";
    let communityRegion=item.communityInfo[0].region;
    for(let i=0;i<communityRegion.length;i++)
    {
      newAddressStr+=communityRegion[i];
    }
    newAddressStr+=item.placeInfo[0].address
    newItem.address=newAddressStr;//存放点位置
    newItem.userInfo={
      userId:item.userInfo[0]._id,
      name:item.userInfo[0].baseInfo.name,
      phone:item.userInfo[0].baseInfo.phone
    };
    newItem.workerInfo={
      workerId:item.workerInfo[0]._id,
      name:item.workerInfo[0].baseInfo.name,
      phone:item.workerInfo[0].baseInfo.phone
    };
    newItem.recordId=item._id;
    newItem.takeTime=item.takeTime;
    newItem.scanTime=item.scanTime;
    newItem.status=item.status;
    newItem.content=item.content;
    return newItem;
  })
  return {msg:"查询社区所有物件记录成功!",queryResult:queryResult}
}
