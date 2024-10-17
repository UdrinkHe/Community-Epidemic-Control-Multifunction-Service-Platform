const cloud = require('wx-server-sdk')
cloud.init(
  {
    env:'hyj-yunkaifa-4gu6ljl6bd8b40b2'
  }
)
let db=cloud.database();
let _=db.command;
//根据用户的open_id获取用户个人信息的登记状态
exports.selectPersonalInfoById=async function(queryData)
{  
 let result=await db.collection("personalInfo").doc(queryData.openid).get().then(res=>{
    let dataResult=0;
    if(res.data) //有这个记录
    dataResult=res.data.personalInfoStatus;
    return {data:{personalStatus:dataResult},msg:"获取用户登记信息状态成功!"}
  }).catch(err=>{
    if(err.errCode==-1)//不存在这个主键就会返回-1的错误码,但是可以作为未登记状态返回
    {
      return {err:err,data:{personalStatus:0},msg:"获取用户登记信息状态成功!"}
    }
    else
    {
      return {err:err,msg:"获取用户登记信息状态失败!"}
    }
  })
  return result;
}

//验证信息正确输入之后 添加一条用户个人基本信息
exports.addOnePersonalInfo=async(queryData)=>{
  let time=new Date().getTime();
  let result=await db.collection("personalInfo").where(
    {
      open_id:queryData.openid
    }
  ).get().then(res=>{
    if(res.data.length==0)//不存在记录
    {
      //向云数据库中添加用户基本信息并返回操作结果
      let addResult=db.collection("personalInfo").add(
        { data:{
            _id:queryData.openid,
            baseInfo:queryData.baseInfo,
            baseUpdateTime:time,
            personalInfoStatus:1}
        }
      ).then(res=>{
        return {msg:"添加个人信息成功!",queryResult:res}})
        .catch(err=>{
        return {msg:"个人信息添加失败!"}
      })
      return addResult;
     }
     else //存在记录
     {
       return {msg:'已经存在该用户的注册记录了!'}
     }
   }).catch(err=>{
     return {msg:"用户个人信息表读取失败!"}
   })
  return result;
}

//添加一条用户工作和住址信息 等待管理员审核
exports.updatePersonalAddressInfo=async(queryData)=>{

 let result=
 //data中的数据：居民上报地址、申请时间、工作类型、工作区域、单位名称、用户信息状态、社区id
 await db.collection("personalInfo").doc(queryData.openid).update({data:{
  address:_.set(queryData.homeAddress),applyTime:_.set(new Date().getTime()),
  workType:_.set(queryData.occupationType),workRegion:_.set(queryData.workRegion),
  workPlaceName:_.set(queryData.workPlaceName),personalInfoStatus:2,communityId:_.set(queryData.communityId),extraAddress:_.set(queryData.extraAddress),postName:_.set(queryData.postName),relativeAddressId:_.set(queryData.placeId)}})
  .then((res)=> {return {msg:"个人信息补全成功",queryResult:res}}).
  catch(err=>{
  return {msg:"补全个人信息失败",err:err}
})
return result;
}

//管理员设置该用户的权限
exports.setUserStatusById=async(queryData)=>{
  let result=
  await db.collection("personalInfo").doc(queryData.openid).update({data:{
      personalInfoStatus:queryData.setLevel,//设置用户信息等级 更新操作时间
      lastUpdateTime:_.set(new Date().getTime())
  }
})
  .then(res=>{
    return {msg:"设置用户权限成功",queryResult:res}
  }).catch(err=>{
    return {msg:"设置用户权限失败",err:err}
  })
  return result;
}

//根据open_id查询个人信息和社区名称
exports.selectPersonalInfo=async(queryData)=>{
  //连表查询 个人表连接社区信息表和地点信息表
  let result=await db.collection("personalInfo").aggregate().match(
    {
      _id:queryData.openId
    }
  ).project(
    {
      _id:true,
      applyTime:true,
      baseInfo:true,
      communityId:true,
      extraAddress:true,
      lastUpdateTime:true,
      relativeAddressId:true,
      personalInfoStatus:true,
      postName:true,
      workPlaceName:true,
      workRegion:true,
      workType:true
    }
  ).lookup(
    {
      from:"placeInfo",
      localField:"relativeAddressId",
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
  ).end();
  let queryResult=result.list[0];
  let communityRegion=queryResult.communityInfo[0].region;
  let newAddressStr="";
  for(let i=0;i<communityRegion.length;i++)
  {
    newAddressStr+=communityRegion[i]
  }
  newAddressStr+=queryResult.placeInfo[0].address;
  queryResult.address=newAddressStr+queryResult.extraAddress
  return {msg:'查询个人信息成功',queryResult:queryResult};
  // let personalInfo=await db.collection("personalInfo").doc(queryData.openId).get().then(res=>res.data)
  // let communityName=await db.collection("communityInfo").doc(personalInfo.communityId).get().then(res=>res.data.name)
  // return {msg:"查询个人信息成功!",personalInfo:personalInfo,communityName:communityName}
}
//根据管理员id查询本社区所有个人信息状态为(2,3,4的所有个人信息)
exports.selectAllPersonalInfo=async(queryData)=>
{
  //查询管理员所在社区id
  let communityId=await db.collection("managerInfo").where({
   username:queryData.managerId
  }).get().then(res=>{
    return res.data[0].communityId;
  })
  //查询所有社区用户信息(聚合查询)
  let result=await db.collection("personalInfo").aggregate().match(
    {
      communityId:communityId
    }
  ).project(
    {
      _id:true,
      applyTime:true,
      baseInfo:true,
      communityId:true,
      extraAddress:true,
      lastUpdateTime:true,
      relativeAddressId:true,
      personalInfoStatus:true,
      postName:true,
      workPlaceName:true,
      workRegion:true,
      workType:true
    }
  ).lookup(
    {
      from:"placeInfo",
      localField:"relativeAddressId",
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
  ).end();
  console.log(111)
  let queryResult=result.list.map(item=>{
    let newItem=item;
    let communityRegion=newItem.communityInfo[0].region;
    let newAddressStr="";
    for(let i=0;i<communityRegion.length;i++)
    {
      newAddressStr+=communityRegion[i]
    }
  newAddressStr+=newItem.placeInfo[0].address;
  newItem.address=newAddressStr+newItem.extraAddress;
  return newItem
  })
 return {msg:"查询信息成功！",queryResult:queryResult}
//   //查询时间，总数  
//    let selectTime=new Date().getTime();let totalData=await db.collection('personalInfo').where(
//      { personalInfoStatus:_.in([2,3,4]), communityId:queryData.communityId, applyTime:_.lt(selectTime)}
//    ).count();
   
//   //云函数有单次查询上限100条的限制，需要循环查询所有用户的信息
//   //totalNum是用查询到的满足下面搜索条件的用户总数
//  let totalNum=totalData.total;  let resultData=[];
//   for(let i=0;i<totalNum;i+=100)
//   {let queryResult=await db.collection('personalInfo').where(
//       {personalInfoStatus:_.in([2,3,4]),communityId:queryData.communityId,applyTime:_.lt(selectTime)}
//     ).skip(i).get(); resultData=resultData.concat(queryResult.data)//skip可以跳过设定数目的记录查找后面的数据
//   } return {msg:"查询信息成功！",queryResult:resultData}
  将整合的结果输出
}

exports.managerLogin=async(queryData)=>{
  let {username,password}=queryData;
  let queryResult=db.collection('managerInfo').where(
  {
    username:username,password:password
  }
  ).get().then(res=>{
    if(res.data.length!=0)
    {return {msg:'登录成功!'}}
    else
    {return {msg:'登录失败！'}}
  })
  return queryResult;
}