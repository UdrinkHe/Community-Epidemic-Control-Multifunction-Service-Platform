/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1649949192954_854';

  // add your middleware config here
  config.middleware = [];

  //设置模板引擎
  config.view={
    defaultViewEngine:'nunjucks'
  }
  config.cors={
    origin:"*",
    allowMethods:'GET,HEAD,PUT,POST,DELETE,PATCH'
  }
  //请求类型默认设置
  config.httpclient={
    dataType:"json"
  }
  //跨域请求
  config.security={
    csrf:{
      enable:false,
    }
  }
  config.jwt = {
    secret: '22256695',
  };
  //file读取方式
  config.multipart = {
    mode: 'file'
  };
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
