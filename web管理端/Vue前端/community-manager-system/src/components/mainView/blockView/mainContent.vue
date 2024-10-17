<template>
  <div class="mainContent">
    <el-tabs class="" v-model="editableTabsValue" type="card" @tab-remove="removeTab" @tab-click="handleClick">
      <el-tab-pane
        v-for="(item) in navBarData"
        :key="item.name"
        :label="item.title"
        :name="item.name"
        :closable="!item.disClosable"
      >
      </el-tab-pane>
    </el-tabs>
    <keep-alive>
      <router-view class="contentShow"/>
    </keep-alive>
  </div>
</template>

<script>
    // import x from ''
    export default {
    name:'mainContent',
        components: {

        },
        props:['f_navBarData','f_editableTabsValue'],
        data() {
            return {
              navBarData:null,
              editableTabsValue:null,
            }
        },
        computed: {

        },
        watch: {
          f_navBarData(newVal,oldVal)
          { 
            this.navBarData=newVal
          },
          f_editableTabsValue(newVal,oldVal)
          {
            this.editableTabsValue=newVal
          },
          //导航栏内容集合变化时，让父组件中存储的也一起变化(子传父)
          navBarData(newVal,oldVal)
          {
            this.$emit('navBarData',newVal)
          },
          editableTabsValue(newVal,oldVal)
          {
            this.$emit('editableTabsValue',newVal)
          }
        },
        mounted() {
          this.navBarData=this.f_navBarData;
          this.editableTabsValue=this.f_editableTabsValue;
        },
        methods: {
          //更换标签卡内容
          handleClick:function(tab)
          {
            this.$router.replace(this.navBarData[tab.index]['routerName'])
          },
          //删除标签卡的内容
          removeTab(targetName) {
          let tabs = this.navBarData;
          let activeName = this.editableTabsValue;//当前预览的编号
          if(targetName=='1')
          {
            alert('首页不可删除!')
            return
          }
          if (activeName === targetName) {//如果当前页被删除
            tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];//下一页或者上一页
              //将路由变为变化页的路由
              this.$router.replace(nextTab.routerName)
              if (nextTab) { //如果存在的活，激活页面就是当前选中页面的编号
                activeName = nextTab.name;
              }
            }
            });
         }
        this.editableTabsValue = activeName;
        this.navBarData = tabs.filter(tab => tab.name !== targetName);//把集合中目标标签去掉
      }
        }
    }
</script>
<style scoped>
.contentShow{
height:calc(100% - 56px);
width: 100%;
overflow-y: scroll;
}
</style>