const cloud = require('wx-server-sdk')
cloud.init()
let db=cloud.database();
let _=db.command;
//生成验证码 存入数据库中 发送验证码
exports.addTestCodeCreditCode=async (queryData)=>{
  let codeStr="";
  //生成验证码
  for(let i=0;i<6;i++)
{
    if(Math.floor(Math.random()*2))
    {
        codeStr+=Math.floor(Math.random()*10);//0~9
    }
    else
    {
        if(Math.floor(Math.random()*2))
        {
            codeStr+=String.fromCharCode(65+Math.floor(Math.random()*26));
        }
        else
        {
            codeStr+=String.fromCharCode(97+Math.floor(Math.random()*26));

        }
    }
  }
 
  //将验证码存入数据库中 如果存在记录就更新 如果不存在就存入
  let resultData=await db.collection("testCode").where(
    {
      testCodeUserId:queryData.openid
    }
  ).get().then(res=>{
    if(res.data.length==0)//不存在这个id的记录即添加
    {
      //存操作
        let addResult=db.collection("testCode").add(
        {
          data:{
            testCodeValue:codeStr,
            testCodeDate:new Date().getTime(),
            testCodeType:'createNewPersonalInfo',
            testCodeUserId:queryData.openid,
            testCodeUserData:
            {
              identityCardId:queryData.identityCardId,
              name:queryData.baseInfoName,
              phone:queryData.baseInfoPhone,
              identityCardType:queryData.identityCardType,
              inhabitantSex:queryData.inhabitantSex
            }
          }
        }
      ).then((res)=>{
        return {msg:"添加验证码成功!",queryResult:res}
      }).catch(err=>{
        return {msg:"添加验证码失败555"}
      })
      return addResult;
    }
    else//存在即修改
    {
      //修改操作
      let updateResult=db.collection("testCode").where(
        {
          testCodeUserId:queryData.openid
        }
      ).update(
        {
          data:{
            testCodeValue:codeStr,
            testCodeDate:new Date().getTime(),
            testCodeType:'createNewPersonalInfo',
            testCodeUserData:
            {
              identityCardId:queryData.identityCardId,
              name:queryData.baseInfoName,
              phone:queryData.baseInfoPhone,
              identityCardType:queryData.identityCardType,
              inhabitantSex:queryData.inhabitantSex
            }
          }
        }
      ).then(res=>{
        return {msg:"验证码修改操作成功!",queryResult:res}
      }).catch(err=>{
        return {msg:"验证码修改操作失败!"}
      })
      return updateResult;
    }
  }).catch(err=>{
    return {msg:"验证此id是否存在验证码失败!",queryResult:err}
  })
  return resultData;
}

exports.checkTestInfo=async (queryData)=>
{
  //根据输入的信息判断验证码的有效性
  let result=await db.collection("testCode").where(
   {
     testCodeUserId:queryData.openid,
     testCodeUserData:{
             name:queryData.baseInfoName,
             phone:queryData.baseInfoPhone,
             identityCardType:queryData.identityCardType,
             identityCardId:queryData.identityCardId
           },
      testCodeValue:queryData.testCodeValue,
      testCodeType:"createNewPersonalInfo"
   }
   ).get().then((res)=>{
    //查询到有这条记录
    if(res.data.length!=0)
    {
      //验证码是否过期
      let nowTimeA=new Date();//当前时间大于验证码时间加5分钟(300000)
      if(nowTimeA.getTime()<res.data[0].testCodeDate+300000)
      {
        return {msg:"验证码未过期，验证成功!",queryResult:res.data[0]}
      }
      else
      {
        return {msg:"验证码已过期，验证失败!",queryResult:res.data[0]}
      }
    }
    //没有查询到对应的记录
    else
    {
      return {msg:"没有找到对应的验证码记录"}
    }
  }).catch(err=>{
    return {msg:"对应验证码查询失败，请检查网络连接"}
  })
  return result;
}