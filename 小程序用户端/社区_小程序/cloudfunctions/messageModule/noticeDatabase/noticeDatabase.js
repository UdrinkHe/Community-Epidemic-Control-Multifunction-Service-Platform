const cloud = require('wx-server-sdk')
cloud.init(
  {
    env:'hyj-yunkaifa-4gu6ljl6bd8b40b2'
  }
)
let db=cloud.database();
let _=db.command;
let $=db.command.aggregate;//聚合查询符号

//添加一篇文章
exports.addANotice=async function(queryData)
{
  let queryResult=await db.collection("noticeInfo").add(
    {//需要添加 文章内容 文章发布者id 文章发布时间 文章截止时间 文章标题
      data:{
        communityId:queryData.communityId,
        noticeContent:queryData.noticeContent,
        noticeManId:queryData.noticeWriter,
        createTime:queryData.createTime,
        lastTime:queryData.lastTime,
        noticeTitle:queryData.noticeTitle,
      }
    }
  ).then(res=>{
    return {msg:'添加文章成功',queryResult:res}
  })
  return queryResult
}
//用户查看文章和关于它的阅读记录
exports.getNoticeContentAndSelfRecord=async function(queryData)
{
  //传入参数为文章id
  let articleResult=await db.collection('noticeInfo').doc(queryData.noticeId).get(
  ).then(res=>{
    return res.data;
  })
  let isRecord=await db.collection("readRecord").where({
    readerId:queryData.readerId,
    noticeId:queryData.noticeId
  }).get().then(res=>{
    if(res.data.length!=0)
    {
      return true
    }
    else
    {
      return false
    }
  })
  //返回 文章信息 是否阅读
  return {msg:'查询文章信息成功',articleResult:articleResult,isRecord:isRecord};
}
//添加阅读记录
exports.addANoticeRecord=async function(queryData)
{
  console.log('进入函数')
  let result=await db.collection('readRecord').where(
    {
      readerId:queryData.readerId,
      noticeId:queryData.noticeId
    }
  ).get().then(res=>{
    console.log(res);
    if(res.data.length==0)//不存在记录
    {//添加一条阅读记录
      return  db.collection("readRecord").add(
        {
          data:{
            readerId:queryData.readerId,
            noticeId:queryData.noticeId,
            createTime:new Date().getTime()
          }
        }
      ).then(res=>{
        return {msg:"添加阅读记录成功",queryResult:res}
      })
    }
  })
  return result;
}

//管理员查看所有社区通知
exports.getAllCommunityNotice=async function(queryData)
{  
  //社区id
  let communityId=await db.collection("managerInfo").where(
    {
      username:queryData.username
    }
  ).get()
  .then(res=>{
    return res.data[0].communityId;
  })
  let queryResult=await db.collection("noticeInfo").aggregate().lookup(
    {
      from:'managerInfo',localField:'noticeManId',foreignField:'username',as:'noticeMan'
    }
  ).match({communityId:communityId,lastTime:_.gt(new Date().getTime())}).end().then(res=>res.list);
  queryResult=queryResult.map(item=>{
    return {createTime:item.createTime,lastTime:item.lastTime,noticeId:item._id,noticeMan:item.noticeMan[0].Name,noticeManId:item.noticeMan[0].username,noticeTitle:item.noticeTitle}
  })
  return {msg:'查询当前可见社区信息成功!',queryResult:queryResult};
};

//连接社区通知文章和通知人的id
exports.getAllCommunityNoticeByUser=async function(queryData)
{
  //根据用户id查询所在社区id
  let communityId=await db.collection("personalInfo").doc(queryData.openId).get()
  .then(res=>{
    return res.data.communityId;
  })
  let queryResult=await db.collection("noticeInfo").aggregate().lookup(
    {
      from:'managerInfo',localField:'noticeManId',foreignField:'username',as:'noticeMan'
    }
  ).match({communityId:communityId,lastTime:_.gt(new Date().getTime())}).end().then(res=>res.list);
  queryResult=queryResult.map(item=>{
    return {createTime:item.createTime,lastTime:item.lastTime,noticeId:item._id,noticeMan:item.noticeMan[0].Name,noticeTitle:item.noticeTitle}
  })
  return {msg:'查询当前可见社区信息成功!',queryResult:queryResult};
  //
}
//根据通知id查询所有已读用户和未读用户
exports.selectHasReadMan=async function(queryData)
{ 
  let noticeId=queryData.noticeId;
  let communityId=await db.collection("noticeInfo").doc(noticeId).get().then(res=>{
    return res.data.communityId;
  })
  //返回的聚合列表中的数据
  let dataResult=await db.collection("personalInfo").aggregate().match({
  communityId:communityId  //这个社区内的所有居民
}
  )
  .project(
    {
      baseInfo:1  //限定输出字段
    }
  )
  .lookup({
    from:'readRecord',
    let:{
      readerId:'$_id'
    },
    pipeline:$.pipeline()
    .match(_.expr($.and([
      $.eq(['$readerId', '$$readerId']),
      $.eq(['$noticeId',noticeId])
    ])))
    .done(),
    as:'readRecord'
  }).end().then(res=>{
    return res.list
  })
  let hasRead=0;//统计阅读量
  let queryResult=dataResult.map(item=>{
    let newItem={};
    newItem.readerName=item.baseInfo.name;
    newItem.phone=item.baseInfo.phone;
    newItem.readerId=item._id;
    if(item.readRecord.length==0)//没有阅读记录
    {
      newItem.isRecord=0;
      newItem.recordId=null;
      newItem.recordTime=null;
    }
    else
    {
      newItem.isRecord=1;
      newItem.recordId=item.readRecord[0]._id;
      newItem.recordTime=item.readRecord[0].createTime;
      hasRead++;
    }
   return newItem
  })
  return {msg:"查询社区阅读情况成功！",queryResult:queryResult,hasRead:hasRead};
}