<template>
  <div>
  <div class="contentPage">
    <!--管理信息搜索框-->
   <el-form class="searchForm" ref="formInput" :model="formInput" label-width="80px">
    <el-form-item label="类型选择">
      <el-select v-model="chooseType" placeholder="请选择">
      <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
      </el-option>
     </el-select>
    </el-form-item>
    <el-form-item label="地址">
    <el-input v-model="formInput.address"></el-input>
    </el-form-item>
     <el-button type="primary" icon="el-icon-search" style="height:35px" @click="searchData">搜索</el-button>
   </el-form>
   <!--表内容-->
    <div class="tableContent" >
      <div class="operationBar">
        <div>共 {{dataTotal}}条</div>
        <div class="buttonGroup">
          <el-button type="primary" @click="dataInit()">刷新</el-button>
        </div>
      </div>
      <el-table
      :data="tableData.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize)"
      style="width: 100%;"
      :max-height="528"
      v-loading='loading'
       :default-sort="{ prop: 'applyTime', order: 'descending' }"
      >
      <el-table-column
        label="上报日期"
        prop="applyTime"
        sortable
        width="180">
        <template slot-scope="scope">
          {{scope.row.applyTime | myTimeMaker}}
        </template>
      </el-table-column>
          <el-table-column
        prop="address"
        label="地址名"
        width="300">
      </el-table-column>
        <el-table-column
        label="类型"
        width="180">
        <template slot-scope="scope">
          {{scope.row.type | getTypeStr}}
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        width="180">
         <template slot-scope="scope">
            {{scope.row.status | getStatusStr}}
          </template>
      </el-table-column>
        <el-table-column
        label="修改时间"
        width="180">
          <template slot-scope="scope">
            {{scope.row.lastUpdateTime | myTimeMaker}}
          </template>
      </el-table-column>
        <el-table-column
        label="操作"
        fixed="right"
        width="180"
        >
        <template slot-scope="scope">
            <el-dropdown>
            <el-button type="primary">
            场所状态操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="setStatus(scope.$index,scope.row,1)">设为通过</el-dropdown-item>
            <el-dropdown-item @click.native="setStatus(scope.$index,scope.row,0)">设为审核中</el-dropdown-item>
            <el-dropdown-item @click.native="setStatus(scope.$index,scope.row,-1)">设为未通过</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        </template>
        </el-table-column>
    </el-table>
    </div>

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
</template>

<script>
    // import x from ''
    export default {
    name:'placesDataPage',
        components: {

        },
        data() {
            return {
        chooseType:0,
              options: [
        {
          value: 0,
          label: '全部'
        },
        {
          value: 1,
          label: '社区报备点'
        }, {
          value: 2,
          label: '社区购药点'
        }, {
          value: 3,
          label: '物品存放点'
        }, ],
              loading:false,
            //搜索表单数据
            formInput:{
              address:'',//地址
              type:'',//类型
            },
            pageSize:20,//每页几条数据
            dataTotal:null,//可显示的数据总数
            currentPage:1,//当前页
            //表单中的数据（下列数据为测试数据）
            tableData:null,
          //查询的所有结果
           
            value:'',
              }
            },
        computed: {

        },
        watch: {
           tableData(newVal,oldVal){
            this.dataTotal=newVal.length;
          },
          //总数发生改变的时候，currentPage也不会发生改变啊，需要手动配置
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
        filters:{
          getTypeStr:function(type)
          {
            if(typeof type!='number'||!type) return type;
            else
            {
              let str=['社区报备码','药店码','取物码']
              return str[type-1];
            }
          },
          getStatusStr:function(status)
          {
             let str=['未通过','审核中','已通过'];
             return str[status+1];
          }
        },
        methods: {
          //处理分页栏的点击事件
         handleCurrentChange:function(val)
         {
           this.currentPage=val;
         },
         dataInit:function()
         {
           this.$axios(
              {
                method:'post',
                url:'/api/selectAllPlaces',
                data:
                {
                  communityId:'114115'
                }
              }
            ).then(res=>{
              this.tableData=res.data.queryResult;
            })
         },
         //设置状态
         setStatus:function(index,val,thisStatus)
         {
           let nameCall=['未通过','审核中','已通过']
           this.$confirm(`是否将该地点的状态设置为${nameCall[thisStatus+1]}?`,"提示",{
           iconClass: "el-icon-question",//自定义图标样式
           confirmButtonText: "确认",//确认按钮文字更换
            cancelButtonText: "取消",//取消按钮文字更换
            showClose: true,//是否显示右上角关闭按钮
            type: "warning",//提示类型  success/info/warning/error
           }).then(res=>{
                 if(val.status==thisStatus)
                 {
                   this.$message.error('设置状态与当前地点信息等级一致，无法修改!');
                 }
                 else
                 {
                       this.$axios(
                        {
                          method:'post',
                          url:'/api/setPlaceStauts',
                          data:{
                            placeId:val._id,
                            status:thisStatus
                          }
                        }
                      ).then(res=>{
                        if(res.status==200&&res.data.msg=='设置地点状态成功')
                        {
                          this.$message.success('设置地点成功！');
                          let item=JSON.parse(JSON.stringify(this.tableData[index]));//一定要用深拷贝的方式，不然无法监听到数值变化！
                          item.lastUpdateTime=new Date().getTime();
                          item.status=thisStatus;//改变状态
                          this.tableData.splice(index,1,item);
                        }
                      })
                 }
               }
           ).catch(err=>{
             console.log('取消了操作')
           })
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
/*操作组*/
.operationBar{
 display: flex;
 justify-content: space-between;
}
/*表格状态样式*/

/*页面选择*/
.pageSwitcher
{
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
}
</style>