// app/service/cloudHttpApi
const { Service } = require('egg');
const myRequest=require('./requestService')
const rp=require('request-promise')

let  access_token=null
//小程序id和秘钥和云环境id
const appid='wxce267caeee214006'
const appSecret='def13a64c9a60ffa5e3d050736ba1b91'
const env_id='hyj-yunkaifa-4gu6ljl6bd8b40b2'


class cloudService extends Service {
   //获取云函数调用凭证access_token并且将其拼接到url中
   async getCloudAceessToken(){
    let result=await this.ctx.service.requestService.myRequest("https://api.weixin.qq.com/cgi-bin/token","GET",{
      grant_type:"client_credential",
      appid:appid,
      secret:appSecret
    },null);
    //请求成功
    if(result.status==200)
    {
     
      access_token=result.data.access_token;
      console.log('云调用凭证更新成功!');
    }
    return access_token;
   }

   //云函数数据的基本获取方法 函数名  传入的参数(queryData)
   async getCloudData(functionName,data)
   {
     let queryResult=await this.ctx.service.requestService.myRequest("https://api.weixin.qq.com/tcb/invokecloudfunction","POST",{
      access_token:access_token,
      env:env_id,
      name:functionName
     },JSON.stringify(data));
     //云获取成功的状态码
     if(queryResult.data.errcode==0)
     {
       return JSON.parse(queryResult.data.resp_data);
     }
     else
     {
       return `获取失败，状态码为：${queryResult.data.errcode},失败的详情为 ${queryResult.data}}`
     }
   }

   //云函数存储的操作方法 参数：传入的文件流
   async uploadToCloud(filestream,filename)
   {
     console.log('开始第一次请求')
     let nowPath=`drug/drugImg-${new Date().getTime()}-${filename}`;//根据时间生成地址

     console.log(nowPath);

     let queryData={
       env:env_id,
       path:nowPath
     }

     let firstResult=await this.ctx.service.requestService.myRequest("https://api.weixin.qq.com/tcb/uploadfile","POST",
     {access_token:access_token},JSON.stringify(queryData));

     console.log('第一次请求结果为');
     console.log(firstResult);

     if(firstResult.data.errcode==0)//请求成功
     {
       console.log('请求云上传地址成功!');
       let uploadUrl=firstResult.data.url;
       let authorization=firstResult.data.authorization;
       let token=firstResult.data.token;
       let cos_file_id =firstResult.data.cos_file_id ;
       //使用request-promise进行操作
       const params={
         method:'POST',
         url:uploadUrl,
         header:{
           'content-type':'multipart/form-data'
         },
         formData:{
           key:nowPath,
           Signature:authorization,
           'x-cos-security-token':token,
           'x-cos-meta-fileid':cos_file_id,
           file:filestream
         },
         json:true
       }
      let lastResult=await rp(params).then(res=>{
        return {msg:'图片保存成功!',pathUrl:nowPath};
      })
      console.log(lastResult)
      return lastResult
     }
   }

}

module.exports = cloudService;