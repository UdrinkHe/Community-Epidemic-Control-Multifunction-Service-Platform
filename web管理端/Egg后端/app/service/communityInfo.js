//社区信息模块服务
const { Service } = require('egg');

class communityInfoService extends Service {
    //用户登录
    async managerLogin(username,password)
    {
      return await this.ctx.service.cloudService.getCloudData('userInfoDataModule',{
        type:'managerLogin',
        queryData:{ username:username,password:password }})
    }
    //获取社区所有人员的信息
    async getAllPersonalInfo(managerId) {
        //调用封装好的云接口方法  
        return await this.ctx.service.cloudService.getCloudData('userInfoDataModule',{
          type:"selectAllPersonalInfo",
          queryData:{
            managerId:managerId
          } 
        })
      }
    //根据用户id设置居民的信息等级
    async setUserStatusById(userId,level)
    {
        return await this.ctx.service.cloudService.getCloudData('userInfoDataModule',{
            type:'setUserStatusById',
            queryData:{
                openid:userId,
                setLevel:level
            }
        })
    }
    //查询所有场所的信息
    async selectAllPlaces(communityId)
    {
      return await this.ctx.service.cloudService.getCloudData('placeInfoDataModule',{
        type:'selectAllPlaces',
        queryData:{
          communityId:communityId
        }
      })
    }
    //设置地点状态
    async setPlaceStauts(placeId,status)
    {
      return await this.ctx.service.cloudService.getCloudData('placeInfoDataModule',{
        type:'setPlaceInfoStatus',
        queryData:{
          placeId:placeId,
          status:status
        }
      })
    }    
 }
 
 module.exports = communityInfoService;