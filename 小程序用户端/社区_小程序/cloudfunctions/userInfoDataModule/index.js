// 云函数入口文件
const cloud = require('wx-server-sdk')
const inhabitantInfoDatabase=require("./inhabitantInfoDatabase/inhabitantInfoDatabase")
const testCodeDatabase=require("./testCodeDatabase/testCodeDatabase")
const personalInfoDatabase=require("./personalInfoDatabase/personalInfoDatabase")
cloud.init(
  {
    env:'hyj-yunkaifa-4gu6ljl6bd8b40b2'
  }
)
//用户个人信息登记与修改模块的数据库操作集合

// 云函数入口函数
exports.main = async (event, context) => {
 switch(event.type)
 {
  //1.注册个人信息功能
  //1.1注册personal信息前验证身份证和姓名是否正确
  case 'selectInhabitantExist':
    return inhabitantInfoDatabase.selectInhabitantExist(event.queryData);
  //1.2验证身份正确时生成验证码并保存到数据库 发送给用户的手机
  case 'addTestCodeCreditCode':
    return testCodeDatabase.addTestCodeCreditCode(event.queryData);
    //发送给相应的手机号
  //1.3验证用户的个人信息登记情况
   case 'selectPersonalInfoById':
     return personalInfoDatabase.selectPersonalInfoById(event.queryData);
  //1.4验证用户验证码和对应信息是否输入正确
  case 'checkTestInfo':
    return testCodeDatabase.checkTestInfo(event.queryData);
  //1.5添加一条个人登记信息
  case 'addOnePersonalInfo':
    return personalInfoDatabase.addOnePersonalInfo(event.queryData);
  //1.6完善个人信息的住址和工作地址
  case "updatePersonalAddressInfo":
    return personalInfoDatabase.updatePersonalAddressInfo(event.queryData);
  //个人查询自己的信息
  case "selectPersonalInfo":
    return personalInfoDatabase.selectPersonalInfo(event.queryData);
    
  //管理员查询社区内所有登记过信息的人的信息
  case 'managerLogin'://管理员登录
    return personalInfoDatabase.managerLogin(event.queryData);
  case 'selectAllPersonalInfo':
    return personalInfoDatabase.selectAllPersonalInfo(event.queryData)
  //管理员修改用户信息等级
  case 'setUserStatusById':
     return personalInfoDatabase.setUserStatusById(event.queryData)
 }



}