//导入的子函数
const loginUserOpenIdGet=require('./LoginUserOpenIdGet/index')
const tryRequest=require('./tryRequest/index')
const getUserLoginInfo=require('./getUserLoginInfo/getUserLoginInfo')

// 云函数入口函数
exports.main = async (event, context) => {
  switch(event.type)
  {
    case 'loginUserOpenIdGet':
      return loginUserOpenIdGet.main(event,context);
    case 'tryRequest':
      return  tryRequest.main(event,context);
    case 'getUserLoginInfo':
      return getUserLoginInfo.getUserLoginInfo(event.queryData);
  }
}