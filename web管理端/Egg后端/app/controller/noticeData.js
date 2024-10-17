'use strict';

const Controller = require('egg').Controller;

class noticeDataController extends Controller {
 //写入一条通知信息
async addANotice() {
    const{ctx}=this;
    let { communityId,noticeContent,noticeManId,createTime,
    lastTime,titleValue}=this.ctx.request.body;//六个参数一次请求。
    let result=await this.ctx.service.noticeData.addANotice(communityId,noticeContent,noticeManId,createTime,
        lastTime,titleValue);
        ctx.body=result;
}
//管理员获取社区内所有通知信息
async getAllCommunityNotice()
{
    const{ctx}=this;
    let {username}=ctx.request.body;
    let result=await this.ctx.service.noticeData.getAllCommunityNotice(username);
    ctx.body=result;
}
async selectHasReadMan()
{
    const{ctx}=this;
    let {noticeId}=ctx.request.body;
    let result=await this.ctx.service.noticeData.selectHasReadMan(noticeId);
    ctx.body=result;
}
}

module.exports = noticeDataController;