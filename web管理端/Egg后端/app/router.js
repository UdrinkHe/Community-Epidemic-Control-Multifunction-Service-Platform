'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const jwtCheck=app.middleware.checkToken;
  router.post('/testJwt',controller.communityData.testJwt)
  router.get('/', controller.home.index);
  router.post('/test',controller.drugData.getCommunityDrugType);
  //验证登录信息，并生成JWT的token 并将用户username传过来
  router.post('/login',controller.communityData.login)
  //社区信息模块的方法
  //获取所有人员信息
  router.post('/getAllPersonalInfo',jwtCheck(),controller.communityData.getAllPersonalInfo);
  //管理员设置某一居民的信息等级
  router.post('/setUserStatusById',controller.communityData.setUserStatusById);
  //查询社区所有场所信息
  router.post('/selectAllPlaces',controller.communityData.selectAllPlaces);
  //设置场所信息状态
  router.post('/setPlaceStauts',controller.communityData.setPlaceInfoStatus)

  //购药模块的方法
  //获取所有药品信息
  router.post('/getCommunityDrug',controller.drugData.getCommunityDrugType);
  //上传药物图片
  router.post('/getDrugImg',controller.drugData.getDrugImg);
  //添加药品信息
  router.post('/addADrug',controller.drugData.addADrug);
  //更改药品信息
  //购药记录的方法
  //1.查看社区内所有的购药记录(需要传入 communityId)
  router.post('/selectAllDrugRecord',controller.drugData.selectAllDrugRecord);
  //2.查看单项的详情购药结果
  router.post('/showMainDrugRecord',controller.drugData.showMainDrugRecord);
  //3.设置购药调查状态
  router.post('/setDrugRecordStatus',controller.drugData.setDrugRecordStatus);
  //文章模块的方法
  //管理员查看所有文章信息
  router.post('/getAllCommunityNotice',controller.noticeData.getAllCommunityNotice);
  //查看社区内文章的阅读情况
  router.post('/selectHasReadMan',controller.noticeData.selectHasReadMan);
  //添加文章信息
  router.post('/addANotice',controller.noticeData.addANotice);
  //社区物件存放登记模块
  router.post('/selectAllPackageRecord',controller.packageData.selectAllPackageRecord);

  
 
};
