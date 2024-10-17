//购药模块服务
const { Service } = require('egg');

class drugInfoService extends Service {
  //获取社区药物信息
  //需要的参数 社区id
  async getCommunityDrugType(communityId) {
    return await this.ctx.service.cloudService.getCloudData('drugDataModule',{
      type:"selectAllDrugByCommunityId",
      queryData:{
        communityId:communityId
      } 
    })
  }
  //上传一张图片到云存储中
  async getDrugImg(filestream,filename){
    return await this.ctx.service.cloudService.uploadToCloud(filestream,filename);
  }
  //添加药品信息
  async addADrug(drugName,content,drugType,status,limitNum,drugImg,communityId)
  {
    return await this.ctx.service.cloudService.getCloudData('drugDataModule',{
      type:"addADrug",
      queryData:{
        drugName:drugName,
        content:content,
        drugType:drugType,
        status:status,
        limitNum:limitNum,
        drugImg:drugImg,
        communityId:communityId
      }
    })
  }
  //查询社区内所有购药记录
  async selectAllDrugRecord(communityId)
  {
    return await this.ctx.service.cloudService.getCloudData('drugDataModule',{
      type:'selectAllDrugRecord',
      queryData:{
        communityId:communityId
      }
    })
  }
  //根据一条购药记录查看购药详情信息
  async showMainDrugRecord(entranceId)
  {
    return await this.ctx.service.cloudService.getCloudData('drugDataModule',{
      type:'showMainDrugRecord',
      queryData:{
        recordId:entranceId
      }
    })
  }
  //设置购药记录的状态
  async setDrugRecordStatus(entranceId)
  {
    return await this.ctx.service.cloudService.getCloudData('drugDataModule',{
      type:'setDrugRecordStatus',
      queryData:{
        entranceId:entranceId
      }
    })
  }
 }
 
 module.exports = drugInfoService;