//药品模块的控制器
'use strict';

const Controller = require('egg').Controller;
const  fs = require('fs')
const path = require('path')

class drugDataController extends Controller {
  
    //根据社区id获取所有药品
    async getCommunityDrugType()
   {
    const { ctx } = this;
    let communityId=ctx.request.body.communityId;//参数:社区id
    let drugInfo=await ctx.service.drugData.getCommunityDrugType(communityId);
    ctx.body=drugInfo;
   }
   //向社区中添加限购药物
   async addADrug()
   {
       const { ctx }=this;
       //药物名称 药物描述 药物类型 限购状态 限购数量 图片存储地址 社区id
       let {drugName,content,drugType,status,limitNum,drugImg,communityId}=ctx.request.body;
       let result=await ctx.service.drugData.addADrug(drugName,content,drugType,status,limitNum,drugImg,communityId);
       ctx.body=result;
   }
   //修改药物信息
   //后台接受药物图片参数并存入云存储中
   async getDrugImg()
   {
    let { ctx }=this;
    let file=ctx.request.files[0];
    let filename=file.filename;
    let filestream = fs.readFileSync(file.filepath) //files[0]表示获取第一个文件，若前端上传多个文件则可以遍历这个数组对象
     // 将文件存到指定位置
    let result=await ctx.service.drugData.getDrugImg(filestream,filename);//将文件流传入
    this.ctx.body = result;
   }
   //管理员查看社区内所有购药记录
   async selectAllDrugRecord()
   {
       const { ctx }=this;
       const communityId=ctx.request.body.communityId;
       let result=await ctx.service.drugData.selectAllDrugRecord(communityId);
       ctx.body=result;
   }
   //根据场所id查询详情购药结果
   async showMainDrugRecord()
   {
       const { ctx }=this;
       const entranceId=ctx.request.body.entranceId;
       let result=await ctx.service.drugData.showMainDrugRecord(entranceId);
       ctx.body=result;
   }
   //审核购药记录
   async setDrugRecordStatus()
   {
     const { ctx }=this;
     const entranceId=ctx.request.body.entranceId;
     let result=await ctx.service.drugData.setDrugRecordStatus(entranceId);
     ctx.body=result;
   }
}


module.exports = drugDataController;