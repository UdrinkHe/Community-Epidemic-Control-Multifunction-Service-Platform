'use strict';

const Controller = require('egg').Controller;

class packageDataController extends Controller {
    async selectAllPackageRecord() {
      const {ctx} =this;
      let managerId=ctx.request.body.managerId;
      let result=await ctx.service.packageData.selectAllPackageRecord(managerId);
      ctx.body=result;
    }
}

module.exports = packageDataController;