//社区模块的控制器
'use strict';

const Controller = require('egg').Controller;

class communityInfoController extends Controller {
  //登录
  async login()
  {
    const {ctx,app}=this;
    //获取登录账号密码
    let {username,password}=ctx.request.body;
    //查询云函数中是否存在这个用户的账号密码
    let queryResult=await ctx.service.communityInfo.managerLogin(username,password);
    if(queryResult.msg=='登录成功!')
    {let token=app.jwt.sign({'username': username, }, app.config.jwt.secret);//需要存储的 token 数据
    ctx.body={msg:'登录成功',header:token,username:username}}
    else
    {
      ctx.body={msg:'登录失败'}
    }
    //如果存在则将用户名使用jwt加密后传给前端
    ;
  }
 //1.获取社区内所有人员的信息（通过）
  async getAllPersonalInfo()
  {
    const {ctx} =this;
    let managerId=ctx.request.body.managerId;//获取请求中的社区信息
    let queryResult=await ctx.service.communityInfo.getAllPersonalInfo(managerId);
    ctx.body=queryResult;
  }
  //2.管理员设置某一居民的信息等级
  async setUserStatusById()
  {

    const {ctx}=this;
    let userId=ctx.request.body.userId;
    let level=ctx.request.body.level;
    if(typeof level==='string')
    {
      level=parseInt(level);
    }
    let queryResult=await ctx.service.communityInfo.setUserStatusById(userId,level);
    ctx.body=queryResult;
  }

 //3. 获取社区内所有场所的信息
 async selectAllPlaces()
 {
   const {ctx}=this;
   let communityId=ctx.request.body.communityId;
   let queryResult=await ctx.service.communityInfo.selectAllPlaces(communityId)
   ctx.body=queryResult;
 }
 //4. 设置某场所信息的状态
 async setPlaceInfoStatus()
 {
   const {ctx}=this;
   let placeId=ctx.request.body.placeId;
   let status=ctx.request.body.status;
   let queryResult=await ctx.service.communityInfo.setPlaceStauts(placeId,status);
   ctx.body=queryResult;
 }
 //5.中间件测试
 async testJwt()
 {
   this.ctx.body='nice';
 }
 
}


module.exports = communityInfoController;