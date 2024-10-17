const cloud = require('wx-server-sdk')
cloud.init()
let db=cloud.database();
let _=db.command;
//1.查询本社区所有限购药品信息(小程序居民、管理员)
exports.selectAllDrugByCommunityId=async function(queryData)
{
  let communityId=queryData.communityId;
 //定义查询时间
  let selectTime=new Date().getTime();
  //统计数量
  let drugTypeNum=await db.collection("drugType").where(
    {
      communityId:communityId,
      createTime:_.lt(selectTime)
    }
  ).count();
  let totalNum=drugTypeNum.total;
  let totalDataArr=[];
  //获取当前社区拥有的全部药品
  for(let i=0;i<totalNum;i+=100)
  {
    let queryResult=await db.collection("drugType").where(
      {
        communityId:communityId,
        createTime:_.lt(selectTime)
      }
    ).skip(i).get();
    totalDataArr=totalDataArr.concat(queryResult.data)
  }
  return {msg:"查询社区药物成功",queryResult:totalDataArr,totalNum:totalNum}
}
//2.提交订单信息，查询最近一次的场所记录并更改
exports.submitDrugRecord=async function(queryData)
{
  //记录当前购买时间
  let nowTime=new Date().getTime();//当前时间戳
  let lastBuyTime=nowTime-48*60*60*1000;//当前时间前的购买时间（48小时前）
  let placeRecordTime=nowTime-30*60*1000;//地点打卡记录（30分钟以内的）
  //1.查看该用户有没有30分钟内此场所的打卡记录
  let recentEntrancedId=await db.collection("entranceRecord").where(
    //参数为：扫码时间(大于30分钟前) 扫码用户id 地点类型（药店） 场所id 社区id 地点状态  //根据生成时间降序排序
    {createTime:_.gt(placeRecordTime),userId:queryData.openId, placeType:2,placeId:queryData.placeId,communityId:queryData.communityId, status:0}).orderBy("createTime","desc").get().then(res=>{if(res.data.length){return res.data[0]._id}//查询到信息则返回记录id
    else{return null}
  })

  if(recentEntrancedId)//存在最近一次的记录id则进行药品数量检查
  {//用于存储不能购买的药品 //用户提交的药品列表
    let canNotAddList=[];let drugList=queryData.drugList;
    for(let i=0;i<drugList.length;i++)
    {
      //先查出这个药物id限购数量 再查出近48小时购买的数量 
      let limitNum=null;
      let status=null;
      await db.collection("drugType").doc(drugList[i].drugId).get().then(res=>{
        limitNum=res.data.limitNum;
        status=res.data.status;
      })
      if(status==0)//不做总数量限制
      {
        console.log('无数量限制')
        break;
      }
      await db.collection("drugRecord").where(//查询48小时内购药信息记录
        {buyerId:queryData.openId,drugId:drugList[i].drugId,createTime:_.gt(lastBuyTime)}
      ).get().then(res=>{if(res.data.length!=0){for(let j=0;j<res.data.length;j++){
            limitNum=limitNum-res.data[j].purchaseNum}}})//限购数量-48小时内购买记录的数量=可购买数量
      if(limitNum<drugList[i].chooseNum)  //可购买数量小于已选数量
      {let limitTip={typeId:drugList[i].typeId,itemId:drugList[i].itemId,lostNum:(limitNum<0)?0:limitNum
        }
      canNotAddList.push(limitTip)//添加到限购列中
      }
    }
    //如果没有检查到的药品 则可以更新场所记录 并添加购药记录
    if(canNotAddList.length)//需要返回提示
    {
      //返回1
      return {msg:"存在超过限购数量的购买商品",canNotAddList:canNotAddList}
    }
    else
    {
      //更新近期打卡记录 并且添加购药记录
      db.collection("entranceRecord").doc(recentEntrancedId).update(
        {data:{status:1}})
      let addList=[];//将购药药品逐一添加到购药记录中
      for(let i=0;i<drugList.length;i++)
      //药品id 场所id 购买人id 社区id 购买时间 购买数量 关联的记录
      {let addItem={drugId:drugList[i].drugId,placeId:queryData.placeId,buyerId:queryData.openId,communityId:queryData.communityId,
          createTime:nowTime,purchaseNum:drugList[i].chooseNum,relativeRecord:recentEntrancedId 
        } 
        addList.push(addItem)}//将购药记录加入
      let addResult=await db.collection("drugRecord").add({data:addList})
        .then(res=>{
        //返回2
        return {msg:"添加购药记录成功",queryResult:res}
      })
      return addResult;
    }
  }
  else
  {
    //返回3
    return {msg:"没有此地点的打卡记录"}
  }
}
//3.居民查看自己的购药记录(查entrance)
exports.selectSelfdrugRecord=async function(queryData)
{
  let queryResult=await db.collection("entranceRecord").aggregate().match(
    {
      userId:queryData.userId,
      status:_.in([1,2]),
      placeType:2
    }
  ).lookup(
    {
      from:'placeInfo',
      localField:'placeId',
      foreignField:'_id',
      as:'placeInfo'
    }
  ).lookup(
    {
      from:'communityInfo',
      localField:'communityId',
      foreignField:'_id',
      as:'communityInfo'
    }
  ).end();
  return {msg:'查询用户购药记录成功',queryResult:queryResult.list};
}


//管理员查看社区内所有的购药记录 传入参数 社区id
exports.selectAllDrugRecord=async function(queryData)
{
  let total=await db.collection("entranceRecord").where(
    {
      communityId:queryData.communityId,
      placeType:2,
      status:_.in([1,2])
    }
  ).count();
  let resultData=[];
  for(let i=0;i<total.total;i+=100)
  {
    await db.collection("entranceRecord").where({
      communityId:queryData.communityId,
      placeType:2,
      status:_.in([1,2])
    }).get().then(res=>{
      resultData=resultData.concat(res.data)
    })
    return {msg:"查询社区内所有购药信息成功!",queryResult:resultData};
  }
}

//居民、管理员 根据某条出行记录查看详细药品登记信息 传入参数 场所记录id
exports.showMainDrugRecord=async function(queryData)
{
  //获取场所出入信息
  let entranceRecord=await db.collection("entranceRecord").doc(queryData.recordId).get().then(res=>{
    return res.data
  })
  //获取药店名称
  let placeName=await db.collection("placeInfo").doc(entranceRecord.placeId).get().then(res=>{
    return  res.data.address
  })
  //根据获取到的场所出入信息获取购买人信息
  // let buyerInfo=await db.collection("personalInfo").doc(entranceRecord.userId).get().then(res=>{
  //   return { name:res.data.baseInfo.name,phone:res.data.baseInfo.phone,address:res.data.address};
  // })
  //连表查询购买人信息
  let buyerResult=await db.collection("personalInfo").aggregate().match(
    {
      _id:entranceRecord.userId
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
      localField:'relativeAddressId',
      foreignField: '_id',
      as: 'placeInfo',
    }
  ).end()
  buyerResult=buyerResult.list[0];
  //拼接地址
  let mainAddress="";
  for(let i=0;i<buyerResult.communityInfo[0]['region'].length;i++)
  {
    mainAddress+=buyerResult.communityInfo[0]['region'][i]
  }
  mainAddress+=(buyerResult.placeInfo[0].address+buyerResult.extraAddress);
  let buyerInfo={
    name:buyerResult.baseInfo.name,phone:buyerResult.baseInfo.phone,address:mainAddress
  }
  //根据购药记录中的关联记录查询详细购药记录
  //聚合操作
  let drugRecordList=await db.collection("drugRecord").aggregate().lookup({from:'drugType',
      localField:'drugId',foreignField:'_id',as:'drugList' }).match({
      relativeRecord:queryData.recordId}).end().then(res=>{return res.list;})
  //将聚合查询的list中的数据取出
  let buyRecord=[];
  let buyTime=0;
  for(let i=0;i<drugRecordList.length;i++)
  { 
    //多条药品只用记录一次时间
    if(i==0)
    buyTime=drugRecordList[i].createTime;
    //数量 药品信息
    buyRecord.push({buyNum:drugRecordList[i].purchaseNum,drugInfo:drugRecordList[i].drugList[0]});
  }
  return {msg:"查询单次购药的详细记录成功!",queryResult:{buyTime:buyTime,placeName:placeName,buyerInfo:buyerInfo,buyRecord:buyRecord}};
}

//管理员添加药品信息
exports.addADrug=async function(queryData)
{
  let drugImg="cloud://hyj-yunkaifa-4gu6ljl6bd8b40b2.6879-hyj-yunkaifa-4gu6ljl6bd8b40b2-1309475014/"+queryData.drugImg;//图片云地址拼接
  let queryResult=await
  db.collection('drugType').where({ drugName:queryData.drugName,drugType:queryData.drugType,
  communityId:queryData.communityId}).get().then(res=>{if(res.data.length==0)//无同名同类型药品
    {return db.collection("drugType").add({ data:{//添加药品名、描述、图片地址、限购数量、药品类型、社区id
     drugType:queryData.drugType,drugName:queryData.drugName,drugImg:drugImg,
     status:queryData.status,limitNum:queryData.limitNum,
     communityId:queryData.communityId,content:queryData.content,createTime:new Date().getTime()}}).then(res=>{
       return {msg:"药品添加成功",res:res}
     })
    }
    else
    {
      return {msg:'已经存在该药品了'}
    }
  })
    return queryResult;
}

//管理员将居民购药记录状态设置为2(1是未确认的状态)
exports.setDrugRecordStatus=async function(queryData)
{
  let result=db.collection('entranceRecord').doc(queryData.entranceId).update(
    {
      data:{
        status:_.set(2),
        lastUpdateTime:_.set(new Date().getTime())
      }
    }
  ).then(res=>{
    return {msg:"审核购药记录成功",queryResult:res}
  })
  return result
}

exports.ddd=async function(queryData)
{
  return "123"
}