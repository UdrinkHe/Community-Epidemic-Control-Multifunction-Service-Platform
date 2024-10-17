<template>
    <div class="layoutView">
        <headerContent id="headerContent"></headerContent>
        <!--侧边栏和右侧内容--> 
        <div id="sideBarAndContent">
            <div>
                <aside-tar :f_navBarData="navBarData" :f_editableTabsValue="editableTabsValue"  @navBarData="getSonNavBarData" @editableTabsValue="getSonNavEditValue"></aside-tar>
            </div>
            <div id="mainContent">
                <main-content :f_navBarData="navBarData" :f_editableTabsValue="editableTabsValue" @navBarData="getSonNavBarData" @editableTabsValue="getSonNavEditValue"></main-content>
            </div>
        </div>
    </div>
</template>

<script>
    // import x from ''
    import Vue from 'vue' //可以定义vue原型变量与方法
    import headerContent from './blockView/header.vue'
    import asideTar from './blockView/asideTar.vue'
    import mainContent from './blockView/mainContent.vue'
    import footerView from './blockView/footerView.vue'
    export default {
    name:'layoutView',
        components: {
            headerContent,
            asideTar,
            mainContent,
            footerView
        },
        data() {
            return {
                navBarData:[
                   {
                     title: '首页',
                     name: '1',
                     routerName:'indexPage',
                     disClosable:true//不可关闭 
                   }, 
                ],
                editableTabsValue:'1',
            }
        },
        computed: {

        },
        watch: {
       
        },
        created(){
            Vue.prototype.$isCloudOpen=true;//全局属性：云函数是否开启
        },
        mounted() {
        console.log('123')
        //是否开启云函数接口
        

        },
        methods: {
            //收到子的选中导航栏编号更改
            getSonNavEditValue:function(item)
            {
                this.editableTabsValue=item
            },
            //获取子组件中导航栏数值的变化
            getSonNavBarData:function(item){
                this.navBarData=item
            }
        }
    }
</script>
<style scoped>
.layoutView{
height: 100%;
}
#headerContent{
height: 10%;
}
#sideBarAndContent{
display: flex;
height: 90%;
background: rgb(84, 92, 100);
}
#mainContent
{
background: rgb(255, 255, 255);
flex-grow: 1;
min-width: 1000px;
height: 100%;
}

</style>