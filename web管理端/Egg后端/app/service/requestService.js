const { Service } = require('egg');

class requestService extends Service {
    //封装http请求方法
    async myRequest(baseUrl,method,params,data){
        //根据url中的参数写入url中
        let paramsCount=0;
        for(let i in params)
        {  
            if(++paramsCount<=1)
            {   
                baseUrl+="?";
            }
            else
            {
                baseUrl+="&";
            }
            baseUrl+=(i+"="+params[i]);
        }
        //发起请求
        return await this.ctx.curl(baseUrl,{
            method:method,
            data:data,
            dataType:'json',
        })
    }
   
    //传multipart/form-data类型的数据
    async myRequestZ(baseUrl,method,params,data){
        //根据url中的参数写入url中
        let paramsCount=0;
        for(let i in params)
        {  
            if(++paramsCount<=1)
            {   
                baseUrl+="?";
            }
            else
            {
                baseUrl+="&";
            }
            baseUrl+=(i+"="+params[i]);
        }
        //发起请求
        return await this.ctx.curl(baseUrl,{
            method:method,
            data:data,
            dataType:'json',
            headers:{
                'content-type':'multipart/form-data'
            }
        })
    }
    
 }
 
 module.exports = requestService;