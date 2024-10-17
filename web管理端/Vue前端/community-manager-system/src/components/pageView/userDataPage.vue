<template>
<div>
  <div class="contentPage">
    <!--管理信息搜索框-->
   <el-form class="searchForm" ref="formInput" :model="formInput" label-width="80px">
    <el-form-item label="姓名">
    <el-input v-model="formInput.name"></el-input>
    </el-form-item>
    <el-form-item label="住址">
    <el-input v-model="formInput.address"></el-input>
    </el-form-item>
     <el-button type="primary" icon="el-icon-search" style="height:35px" @click="searchData">搜索</el-button>
   </el-form>
   <!--表内容-->
    <div class="tableContent" >
        <div class="operationBar">
        <div>共 {{dataTotal}}条</div>
        <div class="buttonGroup">
          <!-- <el-button type="primary" icon="el-icon-plus" @click="showEditBlock()">添加</el-button> -->
          <el-button type="primary" icon="el-icon-refresh-left" @click="toDataInit()">刷新</el-button>
        </div>
      </div>
      <el-table
      ref="as"
      :data="tableData.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize)"
      style="width: 100%;"
      :max-height="528"
      v-loading='loading'
      :default-sort="{ prop: 'applyTime', order: 'descending' }"
      >
      <el-table-column
        prop="applyTime"
        label="申请日期"
        fixed
        sortable
        width="180">
          <template slot-scope="scope">
            {{scope.row.applyTime | myTimeMaker}}
          </template>
      </el-table-column>
      <el-table-column
        prop="baseInfo.name"
        label="姓名"
        fixed
        width="80">
      </el-table-column>
       <el-table-column
        prop="baseInfo.inhabitantSex"
        label="性别"
        width="50">
      </el-table-column>
       <el-table-column
        prop="baseInfo.phone"
        label="手机号"
        width="120">
      </el-table-column>
      <el-table-column label="证件信息"
       >
        <el-table-column
        prop="baseInfo.identityCardType"
        label="证件类型"
        width="120"
        >
        </el-table-column>
        <el-table-column
        prop="baseInfo.identityCardId"
        label="证件号码"
        width="180"
        ></el-table-column>
    </el-table-column>
      <el-table-column
        prop="address"
        label="住址"
        width="400"
        >
      </el-table-column>
      <el-table-column label="工作信息"
       >
        <el-table-column
        prop="workType"
        label="职业类型"
        width="180"
        >
        </el-table-column>
        <el-table-column
        label="工作区域"
        width="180"
        >
          <template slot-scope="scope">
            {{scope.row.workRegion | getWorkRegion}}
          </template>
        </el-table-column>
        <el-table-column
        prop="workPlaceName"
        label="工作单位名"
        width="180"
        ></el-table-column>
    </el-table-column>
    <el-table-column
        prop="workPlaceName"
        label="工作单位名"
        width="180"
        ></el-table-column>
    <el-table-column
        label="更新时间"
        width="180"
        >
        <template slot-scope="scope">
          {{scope.row.lastUpdateTime | myTimeMaker}}
        </template>
        </el-table-column>
    <el-table-column
        label="信息等级"
        width="180"
        >
         <template slot-scope="scope">
          {{scope.row.personalInfoStatus | getInfoStatus}}
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
            信息登记操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="setStatus(scope.$index,scope.row,3)">设为居民</el-dropdown-item>
            <el-dropdown-item @click.native="setStatus(scope.$index,scope.row,4)">设为社区工作者</el-dropdown-item>
            <el-dropdown-item @click.native="setStatus(scope.$index,scope.row,2)">设为审核中状态</el-dropdown-item>
            <el-dropdown-item @click.native="setStatus(scope.$index,scope.row,1)">设为离区状态</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
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
</template>

<script>
    // import x from ''
    export default {
    name:'userDataPage',
        components: {

        },
        data() {
            return {
            //表单加载中
            loading:true,
            //搜索表单数据
            formInput:{
              name:'',
              address:'',
            },
            pageSize:20,//每页几条数据
            dataTotal:null,//可显示的数据总数
            currentPage:1,//当前页
            //表单中的数据（下列数据为测试数据）
            tableData:[
              {
  
              }
            ],
          //查询的所有结果
          resultData:[
           
            ],
            }
        },
        computed: {

        },
        watch: {
          //当可展示到表中的数据发生改变时，将表格的总数也改变 
          tableData(newVal,oldVal){
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
        created(){
        },
        mounted() {
          //this.tableData=this.resultData;
          //获取服务器中的所有用户数据
          if(this.$isCloudOpen)//云函数开启则可以获取所有用户信息
          {
            this.dataInit();
          }
         else
         {
           this.$message.error('云函数未开启')
         }
        },
        filters:{
          getWorkRegion:function(workRegion)//工作地区
          {   
              let newStr="";
              for(let i=0;i<workRegion.length;i++)
              {
                newStr+=workRegion[i];
              }
              return newStr;
          },
          getInfoStatus:function(val)//信息状态
          {
             if(typeof val!='number')
             {
              return val
             }
             let strArr=['信息验证中','社区居民','社区工作者']
             return strArr[val-2];
          }
          },
        methods: {
      //可以复用到列表项的部分
         //处理分页栏的点击事件
         handleCurrentChange:function(val)
         {
           this.currentPage=val;
         },
         //处理页面中行的显示
         tableRowClassName({row,rowIndex}){
           if(row.personalInfoStatus=="2")//审核中
           {
             return 'infoApplying'
           }
           //console.log('列索引',row)
         },
         /*
         需要更改的字段
         */
         //根据搜索框搜索相关结果(模糊匹配相关字段) (需要修改 form的字段)
         searchData:function()
         {
           this.tableData=this.resultData.filter((item)=>{
             let  nameReg= new RegExp(this.formInput.name,'i');
             let  placeReg= new RegExp(this.formInput.address,'i');
             return nameReg.test(item.baseInfo.name)&&placeReg.test(item.address)
           })
         },
         
         //更新页面数据
         dataInit:function()
         {
           this.$axios(
            {
              method:'post',
              url:"/api/getAllPersonalInfo",
              data:{
                managerId:"1148370650"
              }
            }
          ).then(res=>{
            console.log(res.data)
            this.resultData=res.data.queryResult;//查询结果
            this.tableData=this.resultData;
            this.loading=false;
            this.$message.success('用户信息查询成功!')
          })
         },
         //设置社区人员等级
         
         setStatus(index,val,level) 
         {
           console.log(index);
           let nameCall=['离区','未认证','居民','社区工作者']
           this.$confirm(`是否将该居民的用户状态设置为${nameCall[level-1]}?`,"提示",{
           iconClass: "el-icon-question",//自定义图标样式
           confirmButtonText: "确认",//确认按钮文字更换
            cancelButtonText: "取消",//取消按钮文字更换
            showClose: true,//是否显示右上角关闭按钮
            type: "warning",//提示类型  success/info/warning/error
           }).then(res=>{
             for(let i=0;i<this.tableData.length;i++)
             {
               if(this.tableData[i]._id==val._id)
               {
                 if(this.tableData[i].personalInfoStatus==level)
                 {
                   this.$message.error('设置等级与当前用户等级一致，无法修改!');
                 }
                 else
                 {
                   this.setPersonalLevel(index,val,this.tableData[i]._id,level);//修改用户等级的方法 前面两个参数为列表属性
                 }
               }
             }
           }).catch(err=>{
             console.log('取消了操作')
           })
           //获取到当前列的_id，进行具体操作
           console.log(val._id);
         },
         //修改用户等级
         setPersonalLevel:function(index,val,userId,level)
         {
           //调用后端接口修改指定用户的level
           this.$axios(
             {
               method:'post',
               url:'/api/setUserStatusById',
               data:{
                 userId:userId,
                 level:level
               }
             }
           ).then(res=>{
             if(res.status==200&&res.data.msg=='设置用户权限成功')
             {
               this.$message.success('设置用户权限成功！');
               let item=JSON.parse(JSON.stringify(this.tableData[index]));
               item.lastUpdateTime=new Date().getTime();
               item.personalInfoStatus=level;
               this.tableData.splice(index,1,item);
             }
           })
         },
         toDataInit:function()
         {
           this.dataInit();
         }
        }
    }
</script>
<style>
.operationBar{
 display: flex;
 justify-content: space-between;
}
.el-pagination{
  width: auto;
  display: flexbox !important;
}
.el-table__row.infoApplying{
  background: #fbecce !important;
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