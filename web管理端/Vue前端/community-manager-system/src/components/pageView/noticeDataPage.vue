<template>
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
        label="发布日期"
        width="180"
        sortable
        prop="createTime"
        >
            <template slot-scope="scope">
                {{scope.row.createTime | myTimeMaker}}
            </template>
        </el-table-column>
        <el-table-column
        label="文章编号"
        prop="noticeId"
        width="180"
        ></el-table-column>
         <el-table-column
        label="文章标题"
        prop="noticeTitle"
        width="180"
        ></el-table-column>
        <el-table-column
        label="发布者编号"
        prop="noticeManId"
        width="180"
        ></el-table-column>
        <el-table-column
        label="发布者名"
        prop="noticeMan"
        width="180"
        ></el-table-column>
        <el-table-column
        label="截止日期"
        width="180"
        >
            <template slot-scope="scope">
                {{scope.row.lastTime | myTimeMaker}}
            </template>
        </el-table-column>
        <el-table-column
        label="操作"
        fixed="right"
        width="200"
        >
        <template slot-scope="scope">
            <div style="display:flex;width:100%">
              <!--信息操作-->
              <el-button icon="el-icon-edit" @click="showReadRecord(scope.row)" style="width:60%;margin:0 auto">阅读记录</el-button>
              <!--快捷状态操作-->
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
 <el-dialog 
  title="阅读详情"
  width="1000px"
  id="myDialog"
  :visible.sync="dialogShow">
    <el-row>
      <el-col class="DescriptionItem" :span="22">
        <div style="display:flex"><h4>文章编号:</h4><div style="line-height:60px">{{chooseId}}</div></div>
      </el-col>
    </el-row>
    <span>阅读完成量:{{hasRead}}/{{totalMan}}</span>
    <el-table
            :data="record_tableList"
            style="width: 100%;"
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            :max-height="500"
            >    
             <el-table-column
              label="居民编号"
              prop="readerId"
              width="180"
              ></el-table-column>
              <el-table-column
              label="居民姓名"
              prop="readerName"
              width="180"
              ></el-table-column>
              <el-table-column
              label="手机号"
              prop="phone"
              width="180"
              ></el-table-column>
              <el-table-column
              label="阅读情况"
              width="180"
              >
                <template slot-scope="scope">
                    {{scope.row.isRecord | isRecordStr}}
                </template>
              </el-table-column>
              <el-table-column
              label="记录编号"
              prop="recordId"
              width="180"
              ></el-table-column>
              <el-table-column
              label="阅读时间"
              width="180"
              >
                <template slot-scope="scope">
                    {{scope.row.recordTime | myTimeMaker}}
                </template>
              </el-table-column>
            </el-table>
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogShow = false">确 定</el-button>
    <el-button @click="dialogShow = false">取 消</el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script>
    import { Loading } from "element-ui";
    export default {
    name:'noticeDataPage',
        components: {

        },
        data() {
            return {
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
            pageSize:20,//每页几条数据
            dataTotal:null,//可显示的数据总数
            currentPage:1,//当前页
            //表单中的数据（下列数据为测试数据）
            tableList:[],
            //查询的所有结果
            dataList:[
              {
              
              }
            ],
            //对话框参数
            dialogShow:false,
            chooseId:null,//被选中的文章id
            hasRead:1,//已阅读人数
            totalMan:10,//社区总人数
            record_tableList:[],//阅读记录表的数据
            }
        },
        computed: {

        },
        watch: {
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
        filters:{
            isRecordStr:function(val)
            {
                if(typeof val!='number'||(!val&&val!=0)) return val;
                else
                {
                    const thisStr=['未阅读','已阅读'];
                    return thisStr[val]
                }
            }
        },
        methods: {
        handleCurrentChange:function(val)
         {
           this.currentPage=val;
         },
         //更新列表数据
         dataInit:function()
         {
           //post后端数据
           this.$axios(
               {
                   method:'post',
                   url:'api/getAllCommunityNotice',
                   data:{
                       username:'1148370650'
                   }
               }
           ).then(res=>{
               if(res.data.msg='查询当前可见社区信息成功!')
               {
                   this.dataList=res.data.queryResult;
                   this.tableList=JSON.parse(JSON.stringify(this.dataList));
                   this.$message.success("社区文章数据更新成功!");
                   this.loading=false;
               }
           })
         },
         //手动更新列表
         toDataInit:function()
         {
           this.loading=true;
           this.dataInit();
         },
         //查看详情阅读记录
         showReadRecord:function(val){
           let loadingTest=Loading.service(
             {
               target:"#myDialog",
               text:"查询详细记录中"
             }
           )
            this.dialogShow=true;
            this.chooseId=val.noticeId;
            this.$axios(
                {
                    method:'post',
                    url:'api/selectHasReadMan',
                    data:{
                        noticeId:this.chooseId
                    }
                }
            ).then(res=>{
                if(res.data.msg=='查询社区阅读情况成功！')
                {
                    this.record_tableList=res.data.queryResult;
                    this.totalMan=this.record_tableList.length;
                    this.hasRead=res.data.hasRead;
                    this.$message.success('文章阅读情况查询成功!')
                    this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    loadingTest.close();
                });
                }
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