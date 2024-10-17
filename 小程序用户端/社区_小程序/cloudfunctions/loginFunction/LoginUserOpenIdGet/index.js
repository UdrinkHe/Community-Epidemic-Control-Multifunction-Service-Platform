// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp=require('request-promise')
cloud.init()

//用wx.login更新登录态时获取用户的openid和session_key
exports.main=async function(event,context)
{ 
  let db=cloud.database();
  switch(event.type_2nd)
    {
      //1.获取加密openid的操作 type_2nd:getOpenId
      case 'getOpenId':
        let {OPENID,APPID,UNIONID}=await cloud.getWXContext();
        return OPENID;
      //2.登记账号登陆状态的操作
      case 'loginUserOpenIdGet':
          let baseUrl='https://api.weixin.qq.com/sns/jscode2session?appid=wxce267caeee214006&secret=def13a64c9a60ffa5e3d050736ba1b91&js_code='+event.code+'&grant_type=authorization_code'
          let loginInfo=await rp(baseUrl).then(res=>{return res}).catch(err=>{return err});
       let userOpenId=JSON.parse(loginInfo).openid;
       let session_key=JSON.parse(loginInfo).session_key;
      //将openId和session_key保存至数据库中
       return await db.collection("userLoginInfo").where(
         {
          open_id:userOpenId
         }
       ).get().then(
         (res)=>{
           
             let result=
             //云函数：向登录信息集合中增加一条登录记录
             db.collection('userLoginInfo').add(
               //添加字段为 登录人openid 会话秘钥 更新时间 头像地址 昵称
               { data:{open_id:userOpenId,session_key:session_key,lastUpdateTime:new Date().getTime(),touxiangUrl:event.touxiangUrl,
                nickName:event.nickName}
               }
             ).then(res=>{
               return {msg:"登录记录登记成功",openId:userOpenId}
             }).catch(err=>{
               return err
             })
             return result;
           }
       ).catch(err=>{
         return err
       })
    }
    

}