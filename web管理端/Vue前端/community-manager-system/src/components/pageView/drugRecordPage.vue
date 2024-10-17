<template>
  <div>
  <div>
  <div class="contentPage">

    <!--一管理信息搜索框-->
   <el-form class="searchForm" ref="formInput"  label-width="80px">
    <el-form-item label="类型选择">
      <el-select v-model="searchType" placeholder="请选择" @change="toSearch()">
      <el-option
      v-for="item in recordChooseOption"
      :key="item.value"
      :label="item.label"
      :value="item.value">
      </el-option>
     </el-select>
    </el-form-item>
   </el-form>
   <!--二 表内容-->
    <!--操作按钮组-->
    <div class="tableContent" >
      <div class="operationBar">
        <div>共 {{dataTotal}}条</div>
        <div class="buttonGroup">
          <!-- <el-button type="primary" icon="el-icon-plus" @click="showEditBlock()">添加</el-button> -->
          <el-button type="primary" icon="el-icon-refresh-left" @click="toDataInit()">刷新</el-button>
        </div>
      </div>

        <el-table
        :data="tableList.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize)"
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}"
        :default-sort="{ prop: 'createTime', order: 'descending' }"
        style="width: 100%;"
        :max-height="528"
        v-loading='loading'
        >
        <el-table-column
        prop="_id"
        label="记录编号"
        width="180"
        ></el-table-column>
        <el-table-column
        prop="userId"
        label="购买人编号"
        width="180"
        ></el-table-column>
        <el-table-column
        prop="placeId"
        label="场所编号"
        width="180"
        ></el-table-column>
        <el-table-column
        label="扫码时间"
        prop="createTime"
        sortable
        width="180"
        >
          <template slot-scope="scope">
            {{scope.row.createTime | myTimeMaker}}
          </template>
        </el-table-column>
        <el-table-column
        label="记录状态"
        width="180"
        >  
        <template slot-scope="scope">
            {{scope.row.status | drugRecordStatusStr}}
        </template>
        </el-table-column>
        <el-table-column
        label="更改时间"
        width="180"
        >
          <template slot-scope="scope">
            {{scope.row.lastUpdateTime | myTimeMaker}}
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
              <el-button icon="el-icon-edit" @click="showMainRecord(scope.row)" style="margin:0 auto">详情</el-button>
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
  <!--记录详情对话框-->
  <el-dialog 
  title="购药详情"
  width="800px"
  id="myDialog"
  :visible.sync="dialogShow">
    <el-row>
      <el-col class="DescriptionItem" :span="22">
        <div style="display:flex"><h4>记录编号:</h4><div style="line-height:60px">{{chooseId}}</div></div>
      </el-col>
    </el-row>
    <el-row>
      <el-col class="DescriptionItem" :span="22">
        <el-descriptions title="用户信息">
          <el-descriptions-item label="居民姓名">{{recordForm_name}}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{recordForm_phone}}</el-descriptions-item>
          <el-descriptions-item label="购买时间">{{recordForm_buyTime | myTimeMaker}}</el-descriptions-item>
          <el-descriptions-item label="药店名称">{{recordForm_drugStore}}</el-descriptions-item>
          <el-descriptions-item label="居民住址">{{recordForm_userAddress}}</el-descriptions-item>
        </el-descriptions>
            <el-table
            :data="recordDrugList"
            style="width: 100%;"
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            >
              <el-table-column
              label="药品名"
              prop="drugName"
              width="180"
              ></el-table-column>
              <el-table-column
              label="药品类型"
              prop="drugType"
              width="180"
              ></el-table-column>
              <el-table-column
              label="药品描述"
              prop="content"
              width="180"
              ></el-table-column>
              <el-table-column
              label="限购数量"
              prop="limitNum"
              width="180"
              ></el-table-column>
              <el-table-column
              label="购买数量"
              prop="buyNum"
              width="180"
              ></el-table-column>
            </el-table>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
    <el-button v-if="!chooseIsCheck" type="primary" @click="toCheck">核实</el-button>
    <el-button v-else type="info" disabled>已核实</el-button>
    <el-button @click="dialogShow = false">取 消</el-button>
    </span>
  </el-dialog>
  </div>
</div>

 
  </div>
</template>

<script>
import { Loading } from "element-ui";

    // import x from ''
    export default {
    name:'drugRecordPage',
        components: {

        },
        data() {
            return {
              //记录框显示与显示的id
              dialogShow:false,
              chooseId:null,
              chooseIsCheck:null,
              //记录表中的基本信息
              recordForm_name:'何大帅',//用户姓名
              recordForm_phone:"13825427942",//用户电话
              recordForm_userAddress:"广东省深圳市罗湖区东湖街道你好路鹏鹏花园10栋101",//用户住址
              recordForm_buyTime:1651362728026,//购买时间
              recordForm_drugStore:"南苑大药房",//购买商店名
              recordDrugList:[
                {
                  buyNum:1,
                  limitNum:2,
                  content:'用于治疗感冒',
                  drugName:'三九感冒了',
                  drugType:1,
                },
                {
                  buyNum:1,
                  limitNum:2,
                  content:'用于治疗感冒',
                  drugName:'三九感冒了',
                  drugType:1,
                }
              ],//购买记录中的药品信息
              //筛选栏数据
              searchType:0,
              recordChooseOption: [
              {
              value:0,
              label: '全部'
               }, 
              {
              value: 1,
              label: '未核实'
               }, 
               {
              value: 2,
              label: '已核实'
              }, 
              ],
            loading:true,
            pageSize:20,//每页几条数据
            dataTotal:null,//可显示的数据总数
            currentPage:1,//当前页
            //表单中的数据（下列数据为测试数据）
            tableList:null,
            //查询的所有结果
            dataList:[
              {
               _id:'8f75309d626dcba100e410837cb0f467',
               placeId:'f1dedd58625eda46009d5b6675c37bb1',
               status:1,
               createTime:1651362721729,
               lastUpdateTime:1651365721729,
               userId:'oQyxP405-yJng4dguUliI2g-boIA'
              }
            ],
            
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
        filters:{
          drugRecordStatusStr:function(val)
          {
            if(typeof val!='number'||!val) return val;
            else
            {
              const statusStr=['未核实','已核实']; return statusStr[val-1];
            }
          }
        },
        methods: {
          //对话框是否显示
          dialogShow:false,
          getImg:function(file)
          {
            console.log(file)
          },
          //处理分页栏的点击事件
         handleCurrentChange:function(val)
         {
           this.currentPage=val;
         },
         //更新列表数据
         dataInit:function()
         { 
           this.searchType=0;
           //post后端数据
           this.$axios({
             method:'post',
             url:'/api/selectAllDrugRecord',
             data:
             {
               communityId:'114115'
             }
           }).then(res=>{
             this.dataList=res.data.queryResult;
             this.tableList=JSON.parse(JSON.stringify(this.dataList));
             this.loading=false;
           })  
         },
         //手动更新列表
         toDataInit:function()
         {
           this.loading=true;
           this.dataInit();
         },
         //展示详情记录
         showMainRecord:function(val){
           let loadingTest=Loading.service(
             {
               target:"#myDialog",
               text:"查询详细记录中"
             }
           )
          this.dialogShow=true;
          this.chooseIsCheck=val.status==2?true:false;//是否可以审核
          this.chooseId=val._id;
          //查询这条记录的详细购买信息
          this.$axios({
            method:'post',
            url:'api/showMainDrugRecord',
            data:{
              entranceId:this.chooseId
            }
          }).then(res=>{
            let queryResult=res.data.queryResult;
            console.log("查询到的信息是")
            console.log(queryResult);
            //获取基本信息
              this.recordForm_name=queryResult.buyerInfo.name;//用户姓名
              this.recordForm_phone=queryResult.buyerInfo.phone;//用户电话
              this.recordForm_userAddress=queryResult.buyerInfo.address;//用户住址
              this.recordForm_buyTime=queryResult.buyTime;//购买时间
              this.recordForm_drugStore=queryResult.placeName;//购买商店名
              this.recordDrugList=queryResult.buyRecord.map(item=>{
                let newItem={};
                if(item.drugInfo)
                {
                newItem.buyNum=item.buyNum;
                newItem.limitNum=item.drugInfo.limitNum;
                newItem.content=item.drugInfo.content;
                newItem.drugName=item.drugInfo.drugName;
                newItem.drugType=item.drugInfo.drugType;
                }
                return newItem;
              })
              this.$message.success('查询详细记录成功!');
              this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                  loadingTest.close();
                });
          })
         },
         //确认核实情况
         toCheck:function()
         {
           this.$confirm(`是否已经核实该居民的健康情况`,"提示",{
           iconClass: "el-icon-question",//自定义图标样式
           confirmButtonText: "确认",//确认按钮文字更换
            cancelButtonText: "取消",//取消按钮文字更换
            showClose: true,//是否显示右上角关闭按钮
            type: "warning",//提示类型  success/info/warning/error
           }).then(res=>{
             //网络请求修改状态
             this.$axios(
               {
                 method:'post',
                 url:'api/setDrugRecordStatus',
                 data:{
                   entranceId:this.chooseId
                 }
               }
             ).then(res=>{
               console.log(res.data)
               if(res.data.msg=='审核购药记录成功')
               {
                  for(let i=0;i<this.dataList.length;i++)
                  {
                  if(this.dataList[i]._id==this.chooseId)
                  {
                    let newItem=JSON.parse(JSON.stringify(this.dataList[i]));
                    newItem.status=2;
                    newItem.lastUpdateTime=new Date().getTime();
                    this.dataList.splice(i,1,newItem);
                    this.$message.success('核实信息成功!')
                    this.dialogShow=false;
                    this.tableList=JSON.parse(JSON.stringify(this.dataList))
                    break
                    }
                  }
                  this.$message.success('信息核实成功!');
               }
             })
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
.DescriptionItem
{
  float: none;
  margin: 0 auto;
}
</style>