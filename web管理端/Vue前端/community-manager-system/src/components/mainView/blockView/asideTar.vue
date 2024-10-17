<template>
<div class="asideTar">
    <el-menu
      :collapse="isCollapse"
      mode="vertical"
      default-active="2"
      class="el-menu-vertical-demo"
      :class="isCollapse?'':'myMenuItem'"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
     <el-menu-item index="0" @click="setCollapse"  :class="isCollapse?'':'myMenuItem'">
        <i class="el-icon-menu"></i>
      </el-menu-item>
      <template v-for="(itemA) in tarBarValue">
        <!--如果有子元素，则为submenu菜单-->
        <el-submenu :key="itemA.index" v-if="itemA.children" :index="itemA.index" :class="isCollapse?'':'myMenuItem'">
          <template slot="title" :class="isCollapse?'':'myMenuItem'">
            <i v-if="itemA.icon" :class="itemA.icon"></i>
            <span>{{itemA.textValue}}</span>
          </template>
          <template v-for="(itemB) in itemA.children">
            <el-menu-item :key="itemB.index" :class="isCollapse?'':'myMenuItem'" :index="itemB.index" @click="itemB.isActive?turnPage(itemB):null">
              <i v-if="itemB.icon" :class="itemB.icon"></i>
              <span>{{itemB.textValue}}</span>
            </el-menu-item>
          </template>
       </el-submenu>
       <!--如果没有子元素，返回普通菜单-->
       <el-menu-item :key="itemA.index" v-else :class="isCollapse?'':'myMenuItem'" :index="itemA.index" @click="itemA.isActive?turnPage(itemA):null">
            <i v-if="itemA.icon" :class="itemA.icon"></i>
            <span>{{itemA.textValue}}</span>
       </el-menu-item>
      </template>
    </el-menu>
</div>
</template>

<script>
export default {
  name: 'asideTar',
  props:['f_navBarData','f_editableTabsValue'],
  data () {
    return {
      isCollapse:true,
      //侧边导航栏的选项们
      tarBarValue:[
        {
          index:'1',
          icon:'el-icon-office-building',
          textValue:'社区信息',
          children:[
            {
              index:'1-1',
              icon:'el-icon-user',
              textValue:'用户管理',
              isActive:true,
              routerName:'userInfoManager'
            },
            {
              index:'1-2',
              textValue:'场所管理',
              icon:'el-icon-location',
              isActive:true,
              routerName:'placesInfoManager'
            }
          ]
        },
        {
              index:'2',
              icon:'el-icon-document-add',
              textValue:'购药管理',
              children:[
                {
                  index:'2-1',
                  icon:'el-icon-collection',
                  textValue:'药品管理',
                  isActive:true,
                  routerName:'drugInfoManager'
                },
                {
                  index:'2-2',
                  icon:'el-icon-document',
                  textValue:'购药记录',
                  isActive:true,
                  routerName:'drugRecordManager'
                }
              ]
        },
        {
              index:'3',
              icon:'el-icon-box',
              textValue:'包裹记录',
              isActive:true,
              routerName:'packageInfoManager'
        },
        {
            index:'4',
            icon:'el-icon-message',
            textValue:'社区通知',
             children:[
                {
                  index:'4-1',
                  icon:'el-icon-collection',
                  textValue:'通知管理',
                  isActive:true,
                  routerName:'noticeInfoManager'
                },
                {
                  index:'4-2',
                  icon:'el-icon-document',
                  textValue:'发布通知',
                  isActive:true,
                  routerName:'noticeSend'
                }
              ]
        }
      ],
      //内容页横向导航栏的参数
      navBarData:null,
      editableTabsValue:null,//导航栏当前页面编号
      tabIndex:1,//用于新增导航栏
      listData:["123","345","567"]
    }
  },
  watch:{
    //监听外部变化
    f_navBarData(newVal,oldVal){
      this.navBarData=newVal
    },
    f_editableTabsValue(newVal,oldVal){
      this.editableTabsValue=newVal
    },
    //自身发生变化时
     navBarData(newVal,oldVal)
     {
        this.$emit('navBarData',newVal)
     },
      editableTabsValue(newVal,oldVal)
     {
        this.$emit('editableTabsValue',newVal)
      }
  },
  mounted(){
    //请求后端接口
          this.navBarData=this.f_navBarData;
          this.editableTabsValue=this.f_editableTabsValue;
  
  },
  methods:{
    //跳转页面并查看导航栏中是否已经存在这个页面了，如果不存在，则添加一个导航栏，存在则只是跳转
    turnPage:function(item)
    { 
      console.log('选择的子元素是')
      console.log(item);
      let routerName=item.routerName
      console.log('路由跳转')
      this.$router.replace(routerName)
      //将导航栏中没有的值加入
      let hasNav=false;
      for(let i =0;i<this.navBarData.length;i++)
      {
        if(this.navBarData[i].routerName==routerName)//如果存在这个路由的导航页
        {
          hasNav=true;
          this.editableTabsValue=this.navBarData[i].name
        }
      }
      if(!hasNav)//不存在则要新增
      {
        console.log('新增一个导航栏!')
        let editIndex=++this.tabIndex+'';//导航栏已选中编号，同时是新导航栏的编号
        let title=item.textValue;
        this.navBarData.push(
          {
            title:title,
            name:editIndex,
            routerName:routerName
          }
        );
        this.editableTabsValue=editIndex;
      }
    },
    setCollapse:function(){
      this.isCollapse=!this.isCollapse;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.el-menu{
border: none !important;
}
.el-submenu__title{
padding:0 !important;
text-align: center;
}
</style>
<style scoped>
.myMenuItem{
 width: 100%;
 margin: 0px;
 text-align: center;
 min-width: 220px;
 padding: 0px !important;
}
</style>

