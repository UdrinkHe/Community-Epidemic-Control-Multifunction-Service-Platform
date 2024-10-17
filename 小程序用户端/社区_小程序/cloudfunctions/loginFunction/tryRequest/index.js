const cloud = require('wx-server-sdk')
const rp=require('request-promise')
cloud.init()

exports.main=async(event,context)=>
{
  let url='https://www.baidu.com/';
  return await rp(url).then((res)=>{
    return 'res';
  }).catch((err)=>{
    return err;
  })
}