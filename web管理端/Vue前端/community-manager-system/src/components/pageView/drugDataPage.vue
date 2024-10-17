<template>
  <div>
  <div>
  <div class="contentPage">
    <!--管理信息搜索框-->
   <el-form class="searchForm" ref="formInput"  label-width="80px">
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
   </el-form>
   <!--表内容-->
    <!--操作按钮组-->
    <div class="tableContent" >
      <div class="operationBar">
        <div>共 {{dataTotal}}条</div>
        <div class="buttonGroup">
          <el-button type="primary" icon="el-icon-plus" @click="showEditBlock()">添加</el-button>
          <el-button type="primary" icon="el-icon-refresh-left" @click="dataInit()">刷新</el-button>
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
        fixed
        label="创建日期"
        prop="createTime"        
        sortable
        width="180">
          <template slot-scope="scope">
            {{scope.row.createTime | myTimeMaker}}
          </template>
      </el-table-column>
        <el-table-column
        fixed
        prop="drugName"
        label="药品名"
        width="140">
      </el-table-column>
        <el-table-column
        label="药品类型"
        width="100">
          <template slot-scope="scope">
            {{scope.row.drugType | getDrugTypeStr}}
          </template>
      </el-table-column>
        <el-table-column
        prop="content"
        label="药品描述"
        width="300"
        >
        </el-table-column>
        <el-table-column
        prop="limitNum"
        label="限购数量"
        width="180">
      </el-table-column>
       <el-table-column
        label="是否限购"
        width="90">
        <template slot-scope="scope">
          {{scope.row.status | isLimit}}
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
              <el-button icon="el-icon-edit" @click="showUpdate(scope.row)" style="width:60%;margin:0 auto">修改</el-button>
            </div>
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

<!--弹出框-->
  <el-dialog  :title="isAddOperation?'新增药品信息':'修改药品信息（_id:'+updateItemId+'）'" :visible.sync="editBlock_show" :close-on-click-modal='false'>
        <el-form :class="isAddOperation?'myForm':''">
          <el-row>
            <el-col :span="12">
              <el-form-item label="药品名:">
              <el-input style="width:calc(100% - 60px)" placeholder="请输入药品名" v-model="drugName_edit" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
            <el-row class="editItemBar">
              <el-col :span="8"> 
                药品类型:
               <el-select v-model="drugType_edit" placeholder="请选择" style="width:calc(100% - 100px)">
                    <el-option
                    v-for="item in drugTypeOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
              </el-col>
              <el-col :span="8"> 
                是否限购:
               <el-select v-model="status_edit" placeholder="请选择" style="width:calc(100% - 100px)">
                   <el-option
                    v-for="item in drugStatusOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-form-item label="限购数量：">
                <el-input style="width:calc(100% - 100px)" placeholder="请输入限购数量" v-model="limitNum_edit" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="editItemBar">
              <el-col :span="24">
                  <el-form-item label="药品描述:">
                    <el-input style="width:calc(100% - 100px)" placeholder="请输入药品描述" v-model="content_edit" autocomplete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-col :span="12" v-show="isAddOperation">
                请选择要添加的图片
                <input type="file" ref="imgFile" @change="getFileInfo"/>
                <el-button @click="submitImgToCloud">提交图片</el-button> 
                图片地址:{{imgCloudUrl}}
            </el-col>
            </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="sumbitEdit()">{{isAddOperation?'新 增':'修 改'}}</el-button>
            <el-button>取 消</el-button>
        </div>
        </el-dialog>
  </div>
</template>

<script>
    // import x from ''
    export default {
    name:'drugDataPage',
        components: {

        },
        data() {
            return {
                //列表配置
                loading:false,//是否显示在加载中
                //分页配置
                currentPage:1,//当前页
                dataTotal:0,//总数
                pageSize:20,//每页的数量
                //列表数据配置
                //用于筛选的列表
                drugChooseOption:[  //药品类型选项
                    {
                      label:'全部',
                      value:0
                    },
                    {
                        label:'发热类',
                        value:1
                    },
                     {
                        label:'止咳类',
                        value:2
                    },
                     {
                        label:'抗感染类',
                        value:3
                    }
                ],
                //药品列表
                dataList:[],//返回的所有值
                tableList:[],//用于显示的值
                drugTypeOption:[  //药品类型选项
                    {
                        label:'发热类',
                        value:1
                    },
                     {
                        label:'止咳类',
                        value:2
                    },
                     {
                        label:'抗感染类',
                        value:3
                    }
                ],
                drugStatusOption:[//药品状态选项
                  {
                    label:'是',
                    value:1
                  },
                  {
                    label:'否',
                    value:0
                  }
                ],
                //搜索绑定
                searchType:0,//用于搜索的属性
                lastSearchType:0,//上一次的选择类型
                drugNameForSearch:'',
                //编辑框框参数
                //辨识参数
                isAddOperation:true,//是否为添加操作
                updateItemId:'',//被修改的_id
                //填写参数
                status_edit:'',//是否为限购药品
                editBlock_show:false,
                drugName_edit:'',//编辑的药品名
                drugType_edit:1,//编辑框药品类型
                content_edit:'',//编辑框药品描述
                limitNum_edit:'',//编辑框限购数量
                //图片上传的参数
                //要添加的文件
                fileForAdd:null,
                imgCloudUrl:null,//图片最终的云地址
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
          //先加载数据
          this.dataInit();
        },
        //格式过滤器
        filters:{
          //药品类型格式
          getDrugTypeStr:function(val)
          {
            if(typeof val!='number'||!val) return val;
            else
            {
              const drugTypeStr=['发热类','止咳类','抗感染类'];
              return drugTypeStr[val-1];
            }
          },
          //限购格式
          isLimit:function(val)
          {
            if(typeof val!='number'||(!val&&val!=0)) return val;
            else{const limitStr=['否','是']; return limitStr[val]}
          }
        },
        methods: {
        //1.处理分页栏的点击事件
         handleCurrentChange:function(val)
         {
           this.currentPage=val;
         },
        //用下拉菜单筛选列表触发
        toSearch:function()
        { 
          if(this.searchType)
          {
             let newArray=this.dataList.filter(item=>{
              return item.drugType==this.searchType
              })
             //如果长度为0 不要渲染 会出现无法再渲染出数据的bug
             if(!newArray.length)
             {
               alert('找不到对应的项!')
               this.searchType=this.lastSearchType;//记录上一次的选择类型
             }
             else
             {
               this.tableList=JSON.parse(JSON.stringify(newArray));
               this.lastSearchType=this.searchType;//更新这一次的值
             }       
          }
          else //全部值
          {
            this.tableList=JSON.parse(JSON.stringify(this.dataList));
          }
        },
         //2.数据加载
         dataInit:function()
         {  
             //利用axios请求后端接口
             this.$axios({
               method:'post',
               url:'api/getCommunityDrug',
               data:{
                 communityId:'114115'
               }
             }).then(res=>{
               this.dataList=res.data.queryResult;
               this.$message.success('社区药品信息更新成功!');
               this.toSearch();
             })
            //  this.dataList=[{
            //             content:'用于治疗感冒',
            //             createTime:1650435286238,
            //             drugType:1,
            //             limitNum:2,
            //             drugName:'清热丸',
            //             status:1,
            //             _id:1
            //         },
            //         {
            //             content:'用于治疗感冒',
            //             createTime:1650435286238,
            //             drugType:2,
            //             limitNum:2,
            //             drugName:'百鬼丸',
            //             status:1,
            //             _id:2
            //         },
            //         {
            //             content:'能让你大笑',
            //             createTime:1650495286238,
            //             drugType:1,
            //             limitNum:2,
            //             drugName:'大笑丸',
            //             status:0,
            //             _id:3
            //         },
            //           {
            //             content:'能让你变得猖狂',
            //             createTime:1650485286238,
            //             drugType:1,
            //             limitNum:2,
            //             drugName:'猖狂丸',
            //             status:0,
            //             _id:4
            //         },
            //            {
            //             content:'能让永不疲劳',
            //             createTime:1650437286238,
            //             drugType:1,
            //             limitNum:2,
            //             drugName:'永夜丸',
            //             status:0,
            //             _id:5
            //         },
            //         //  {
            //         //     content:'能让永不疲劳',
            //         //     createTime:1650437286238,
            //         //     drugType:3,
            //         //     limitNum:2,
            //         //     drugName:'抗感染丸',
            //         //     status:0,
            //         //     _id:6
            //         // },
            //         ];
             //用tableList存储返回值
         },
         //添加数据
         //显示添加板(添加)
         showEditBlock:function()
         {
           this.editBlock_show=true;
           this.isAddOperation=true;//操作为增加信息
           //新增面板设为空
           this.content_edit='',
           this.drugType_edit=1,
           this.limitNum_edit=0,
           this.drugName_edit='',
           this.status_edit=1,
           this.imgCloudUrl=null
         },
         //添加编辑框中的数据(可以是编辑或者新增)
         sumbitEdit:function()
         {
          if(!this.content_edit||!this.drugType_edit||!this.limitNum_edit||!this.drugName_edit
             ||(!this.status_edit&&this.status_edit!=0)||(this.isAddOperation&&!this.imgCloudUrl))
             {
               this.$message.error('请验证输入是否完整!')
               return
             }

          //药品名、药品类型、药品数量、是否限购、药品描述
          if(this.isAddOperation)
          {
            //添加药物操作
            this.$axios(
              {
                method:'post',
                url:'api/addADrug',
                data:
                {
                        content:this.content_edit,
                        drugType:this.drugType_edit,
                        limitNum:this.limitNum_edit,
                        drugName:this.drugName_edit,
                        status:this.status_edit,
                        communityId:"114115",
                        drugImg:this.imgCloudUrl
                }
              }
            ).then(res=>{
              if(res.data.msg=='药品添加成功')
              {
                this.dataList.splice(0,0,{
                        content:this.content_edit,
                        createTime:new Date().getTime(),
                        drugType:this.drugType_edit,
                        limitNum:this.limitNum_edit,
                        drugName:this.drugName_edit,
                        status:this.status_edit
                    })
              this.$message.success('添加药品成功!');
              this.toSearch();
              this.editBlock_show=false;
              }
              else if(res.data.msg=='已经存在该药品了')
              {
                this.$message.error('已经存在该药品了！')
              }
            })
             
          }
          else
          {
            //改变对应_id的药品信息，并且
            for(let i=0;i<this.dataList.length;i++)
            {
              if(this.dataList[i]._id==this.updateItemId)//table的_id与被修改的一致
              {
                //数据库修改操作回调页面操作
                let newItem=JSON.parse(JSON.stringify(this.dataList[i]));
                newItem.drugName=this.drugName_edit;
                newItem.drugType=this.drugType_edit;
                newItem.content=this.content_edit;
                newItem.limitNum=this.limitNum_edit;
                newItem.status=this.status_edit;
                newItem.lastUpdateTime=new Date().getTime();
                this.dataList.splice(i,1,newItem);
                this.$message.success('修改药品成功!')
                this.toSearch();
                this.editBlock_show=false;
              }
            }
          }
         },
         //修改操作
         //打开修改面板
         showUpdate:function(val)
         {
           this.editBlock_show=true;
           this.isAddOperation=false;//操作为更改信息
           //将表单中的数据变成被修改项的数据
           this.updateItemId=val._id,
           this.content_edit=val.content,
           this.drugType_edit=val.drugType,
           this.limitNum_edit=val.limitNum,
           this.drugName_edit=val.drugName,
           this.status_edit=val.status
         },
        //变更添加图片
        getFileInfo:function()
        {

          this.fileForAdd=this.$refs.imgFile.files[0];
          console.log(this.fileForAdd);
        },
        submitImgToCloud:function()
        {  
           if(!this.fileForAdd)
           {
             this.$message.error('未选择图片!')
             return;
           }
           let formData=new FormData();
           formData.append('file',this.fileForAdd);
           this.$axios(
             {
               method:"post",
               url:'api/getDrugImg',
               data:formData
             }
           ).then(res=>{
             console.log(res)
            //  this.$refs.imgFile.files[0]=null;
             this.fileForAdd=null;
             //this.$refs.imgFile.files=null;
             this.$message.success('上传图片成功!')
             this.imgCloudUrl=res.data.pathUrl
           })  
        }
        },

    }
</script>
<style scoped>
.myForm{
  padding-bottom: 100px;
}
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
/*编辑框样式*/
.editItemBar{
  margin-top:30px;
}
</style>