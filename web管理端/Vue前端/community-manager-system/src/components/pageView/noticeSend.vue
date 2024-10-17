<template>
    <div>
    <div class="baseInfo">
        <div style="line-height:40px;margin-left:10px">标题</div>
        <el-input placeholder="请输入标题" style="width:20%;min-width:100px;margin-left:20px"  v-model="titleValue"/>
        <div style="margin-left:50px">通知截止日期
         <!-- <el-date-picker
        
         dateType="time"
          v-model="lastTimeValue" style="margin-left:20px"
          
          >
          </el-date-picker> -->
          <el-date-picker
            v-model="lastTimeValue"
            type="datetime"
            placeholder="选择日期时间"
            value-format="timestamp"
            dateType="datetime"
           :picker-options="pickerOptions"
            >
          </el-date-picker>
        </div>
    </div>
  
    <mavon-editor v-model="editorValue" ref="md"/>
    <div class="buttonContainer">
        <el-button id="submitButton" type="primary" @click="submitText">发布通知</el-button>
    </div>
    </div>
</template>

<script>
    // import x from ''
    import {getLocalTimeString} from '../../utils/myTimeMaker'
    export default {
    name:'noticeSend',
        components: {

        },
        data() {
            return {
                 pickerOptions: { //日期选择器的禁用选项
                    disabledDate(time) {
                    return time.getTime() < Date.now();
                     },
                    },           //禁用日期（小于当前时间的）
            titleValue:'',//文章的标题（提交）
            editorValue:'',//编辑的文本信息(提交html格式)
            lastTimeValue:'',//时间值(截止时间)
            }
        },
        computed: {

        },
        watch: {

        },
        mounted() {
        
        },
        methods: {
        submitText:function()
        {   
        this.$confirm(`确认填写无误并发送通知？`,"提示",{iconClass: "el-icon-question",//自定义图标样式
        confirmButtonText: "确认",//确认按钮文字更换cancelButtonText: "取消",//取消按钮文字更换
        showClose: true,//是否显示右上角关闭按钮type: "info",//提示类型  success/info/warning/error
           }).then(()=>{ 
        console.log(this.editorValue+","+this.lastTimeValue+","+this.titleValue)       
        if(!this.editorValue||!this.lastTimeValue||!this.titleValue)
        { this.$message.error('填写信息不能有空!');return }//用axios发送请求到后端，存入通知信息
        if(this.lastTimeValue<new Date().getTime())//截止时间小于当前时间
        {this.$message.error('截止日期不能小于当前时间!');return}
         this.$axios({ method:'post',//请求类型
                   url:'/api/addANotice',
            data:{ communityId:"114115", noticeManId:"1148370650",//社区id，作者id
            createTime:new Date().getTime(),noticeContent:this.$refs.md.d_render,//创建日期 //通知内容（html格式）
            titleValue:this.titleValue,lastTime:this.lastTimeValue}//通知标题 //截止时间
               }).then(res=>{
                   if(res.data.msg=='添加文章成功')
                   {   this.$message.success('通知发布成功');this.titleValue=''
            this.lastTimeValue='';this.editorValue=''
                   }
               })
           })     
        }
        }
    }
</script>
<style scoped>
.baseInfo{
    height: 100px;
    display: flex;
}
.buttonContainer
{
    width: 100%;
    display: flex;
    justify-content: center;
}
#submitButton{
    width: 200px;
    margin-top: 10px;
}
</style>