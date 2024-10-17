const Subscription = require('egg').Subscription;
class UpdateCache extends Subscription {
  static get schedule() {// 通过 schedule 属性来设置定时任务的执行间隔等配置
    return {
      interval: '1h', // 1小时更新一次
      type: 'all', // 指定所有的 worker都需要执行
      immediate:true,//在服务器加载完毕后立即启动一次
    };
  }
  async subscribe() {// subscribe 是真正定时任务执行时被运行的函数
    await this.ctx.service.cloudService.getCloudAceessToken();//获取云凭证
  }
}
module.exports = UpdateCache;