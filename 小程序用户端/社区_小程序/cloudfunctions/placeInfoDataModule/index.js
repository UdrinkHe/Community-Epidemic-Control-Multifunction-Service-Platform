// 云函数入口文件
const cloud = require('wx-server-sdk')
const placeInfoDatabase=require("./placeInfoDatabase/placeInfoDatabase")
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  switch(event.type)
  {
    
    //工作者：添加一条场所码信息
    case 'addOnePlaceInfo':
      return placeInfoDatabase.addOnePlaceInfo(event.queryData);
    //管理员：通过一条场所码的使用
    //工作者：出示一条场所码的数据
    case "selectPlaceAndCommunityInfo":
      return placeInfoDatabase.selectPlaceAndCommunityInfo(event.queryData);
    case "selectPlacesForOneVolunteer":
      return placeInfoDatabase.selectPlacesForOneVolunteer(event.queryData);
    case "addEntranceRecord":
      return placeInfoDatabase.addEntranceRecord(event.queryData);

    //管理员
    //1.查询所有地点的信息 参数 社区id
    case "selectAllPlaces":
      return placeInfoDatabase.selectAllPlaces(event.queryData);
    //2.设置地点状态
    case "setPlaceInfoStatus":
      return placeInfoDatabase.setPlaceInfoStatus(event.queryData);
  }
}