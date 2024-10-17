//包裹相关服务
const { Service } = require('egg');

class packageService extends Service {
    async selectAllPackageRecord(managerId){
        return await this.ctx.service.cloudService.getCloudData('packageDataModule',
        {
            type:"selectAllPackageRecord",
            queryData:{
                managerId:managerId
            }
        })
    }
   
    
 }
 
 module.exports = packageService;