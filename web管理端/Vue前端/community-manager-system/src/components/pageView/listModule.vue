<template>
  <div>
  <div>
  <div class="contentPage">
    <!--一管理信息搜索框-->
   <!-- <el-form class="searchForm" ref="formInput"  label-width="80px">
    <el-form-item label="类型选择">
      <el-select v-model="searchType" placeholder="请选择" @change="toSearch()">
      <el-option
      v-for="item in drugChooseOption"
      :key="item.value"
      :label="item.label"
      :value="item.value">
      </el-option>
     </el-select>
    </el-form-item>
    <el-form-item label="药品名">
    <el-input v-model="drugNameForSearch"></el-input>
    </el-form-item>
     <el-button type="primary" icon="el-icon-search" style="height:35px" @click="searchData()">搜索</el-button>
   </el-form> -->
   <!--二 表内容-->
    <!--操作按钮组-->
    <div class="tableContent" >
      <div class="operationBar">
        <div>共 {{dataTotal}}条</div>
        <div class="buttonGroup">
          <el-button type="primary" icon="el-icon-plus" @click="showEditBlock()">添加</el-button>
          <el-button type="primary" icon="el-icon-refresh-left" @click="toDataInit()">刷新</el-button>
        </div>
      </div>

        <el-table
        :data="tableList.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize)"
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}"
        style="width: 100%;"
        :max-height="528"
        v-loading='loading'
        >
        <el-table-column
        label="操作"
        fixed="right"
        width="200"
        >
        <template slot-scope="scope">
            <div style="display:flex;width:100%">
              <!--信息操作-->
              <el-button icon="el-icon-edit" @click="[自定义方法]" style="width:40%"></el-button>
              <!--快捷状态操作-->
              <el-dropdown  style="width:60%">
              <el-button type="primary" style="width:100%">
              状态操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="setStatus(scope.$index,scope.row,1)">状态操作1</el-dropdown-item>
              <el-dropdown-item @click.native="setStatus(scope.$index,scope.row,2)">状态操作2</el-dropdown-item>
              </el-dropdown-menu>
              </el-dropdown>
            </div>
        </template>
        </el-table-column>
    </el-table>
    </div>

<!--分页-->
  <div class="pageSwitcher">
    <div>
      <el-pagination
      @current-change="handleCurrentChange"
      :page-size="pageSize"
      :pager-count="11"
      :current-page="currentPage"
      layout="prev, pager, next"
      :total="dataTotal">
      </el-pagination>
    </div>
    <div class="pageSizeSelecter">
      每页
      <select v-model="pageSize">
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
      </select>
      条
    </div>
  </div>
  </div>
</div>

 
  </div>
</template>

<script>
    // import x from ''
    export default {
    name:'placesDataPage',
        components: {

        },
        data() {
            return {
              //筛选栏数据
              options: [{
              value: 1,
              label: '社区报备点'
               }, 
               {
              value: 2,
              label: '社区购药点'
              }, 
              {
              value: 3,
              label: '物品存放点'
              }, 
              ],
            loading:true,
            pageSize:10,//每页几条数据
            dataTotal:null,//可显示的数据总数
            currentPage:1,//当前页
            //表单中的数据（下列数据为测试数据）
            tableList:null,
            //查询的所有结果
            dataList:[
              {
               type:1,
               address:'你好商店',
               status:1,
               applyTime:199902213,
               lastUpdateTime:199902213
              }
            ],
            value:'',
              }
            },
        computed: {

        },
        watch: {
         //展示列表更新
         tableList(newVal,oldVal){
            this.dataTotal=newVal.length;
          },
          //总数发生改变的时候，currentPage也不会发生改变，需要手动配置
          dataTotal(newVal,oldVal)
          {
            if(this.pageSize*(this.currentPage-1)>=newVal)
            {
              this.currentPage=Math.ceil(newVal/this.pageSize)
            }
          },
          //分页发生改变的时候，currentPage不会发生改变，需要手动配置
          pageSize(newVal,oldVal)
          {
            //前一页的数据就已经等于或者大于所有数据项时，返回可用的最大页面
            if(newVal*(this.currentPage-1)>=this.dataTotal)
            {
              this.currentPage=Math.ceil(this.dataTotal/newVal) 
            } 
          }
        },
        mounted() {
            this.dataInit();
        },
        methods: {
          //处理分页栏的点击事件
         handleCurrentChange:function(val)
         {
           this.currentPage=val;
         },
         //更新列表数据
         dataInit:function()
         {
           //post后端数据
           this.tableList=JSON.parse(JSON.stringify(this.dataList));
           this.loading=false;
         },
         //手动更新列表
         toDataInit:function()
         {
           this.loading=true;
           this.dataInit();
         }
        }
    }
</script>
<style>
.el-table{
  width: auto !important;
}
.el-pagination{
  width: auto;
  display: flexbox !important;
}
</style>
<style scoped>
.contentPage{
  height: 600px;
  width: 96%;
  margin: 0 auto;
}
/*表格上的按钮组*/
/*操作组*/
.operationBar{
 display: flex;
 justify-content: space-between;
}

.searchForm{
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-bottom: 10px;
}
.el-form-item
{
margin-bottom: 0;
}
/*表格容器*/
.tableContent{
  width: 100%;
}
/*表格状态样式*/
/*审核中*/

/*页面选择*/
.pageSwitcher
{
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
}
</style>