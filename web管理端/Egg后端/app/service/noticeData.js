//通知信息服务
const { Service } = require('egg');

class noticeService extends Service {
   async addANotice(communityId,noticeContent,noticeWriter,createTime,
    lastTime,noticeTitle){
       return await this.ctx.service.cloudService.getCloudData('messageModule',
           {
               type:"addANotice",
               queryData:{
                communityId:communityId,
                noticeContent:noticeContent,
                noticeWriter:noticeWriter,
                createTime:createTime,
                lastTime:lastTime,
                noticeTitle:noticeTitle
               }
           }
       )
   }
   async getAllCommunityNotice(username){
       return await this.ctx.service.cloudService.getCloudData('messageModule',
       {
           type:"getAllCommunityNotice",
           queryData:{
               username:username
           }
       })
   }
  async selectHasReadMan(noticeId)
  {
      return await this.ctx.service.cloudService.getCloudData('messageModule',
      {
          type:"selectHasReadMan",
          queryData:{
              noticeId:noticeId
          }
      })
  }  
 }
 
 module.exports = noticeService;