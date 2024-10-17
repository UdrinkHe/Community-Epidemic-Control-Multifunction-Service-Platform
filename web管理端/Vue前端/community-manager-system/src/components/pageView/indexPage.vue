<template>
  <div>
    <div id="titleText">社区疫情防控多功能服务平台</div>
    <el-row class="blockShow">
        <el-col :span="15">
            <el-card class="cardBox">
            <div slot="header">
            <span class="sontitleText">项目简介</span>
            </div>
              <el-card class="cardBoxIn">
                <div class="sontitleText" slot="header">作者信息</div>
                <div class="containText">
                    <div>作者:何郁钧</div>
                    <div>学院:计算机科学与工程学院</div>
                    <div>专业:18软件工程3班</div>
                    <div>指导教师:王明安</div>
                </div>
              </el-card>
               <el-card class="cardBoxIn"">
                <div class="sontitleText" slot="header">项目模块</div>
                <div class="containText">
                    <div>一、社区基本信息管理模块</div>
                    <div>二、社区通知信息管理模块</div>
                    <div>三、社区购药登记模块</div>
                    <div>四、社区入区物品登记模块</div>
                </div>
              </el-card>
            </el-card>
        </el-col>
        <el-col :span="9">
             <el-card class="cardBox">
                <div slot="header">
                <span class="sontitleText">开发技术简介</span>
                </div>
                <div>
                    <div><span>小程序用户端</span>
                        <div>1) WXML+WXSS+JavaScript</div>
                        <div>2) weapp-qrcode</div>
                        <div>3) WeUI框架</div>
                        <div>4) 云开发技术</div>
                    </div>
                    <div>Web管理端
                        <div>1) HTML+CSS+JavaScript</div>
                        <div>2) Vue.js</div>
                        <div>3) Egg.js</div>
                        <div>4) ElementUI</div>
                        <div>5) 云开发HTTP API</div>
                    </div>
                </div>
            </el-card>
        </el-col>
    </el-row>
  </div>
</template>

<script>
    // import x from ''
    export default {
    name:'indexPage',
        components: {

        },
        data() {
            return {

            }
        },
        computed: {

        },
        watch: {

        },
        mounted() {
        
        },
        methods: {

        }
    }
</script>
<style scoped>
#titleText{
    font-size: 50px;
    font-weight: 900;
    text-align: center;
}
.blockShow
{   
    width: 95%;
    margin: 0 auto;
}
.cardBox{
    width: 90%;
    margin-top: 20px;
    margin-left: 5%;
}
.sontitleText{
    font-size: 20px;
    font-weight: 900;
}
.containText
{
    line-height: 30px;
}
.cardBoxIn
{
    width: 100%;
   margin-top:10px
}
</style>