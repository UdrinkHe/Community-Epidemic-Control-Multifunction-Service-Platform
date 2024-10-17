<template>
  <div class="header">
    <span><h1>{{communityName}}-社区管理后台</h1></span>
    <el-popover
    placement="bottom"
    width="200"
    trigger="hover">
    <div>管理员:{{username}}</div>
    <div class="profileContainer" slot="reference">
        <img style="width:100%;border-radius: 15px;" src="../../../assets/managerProfile.jpg">
    </div>
</el-popover>
     
  </div>
</template>

<script>
    // import x from ''
    export default {
    name:'header',
        components: {

        },
        data() {
            return {
                communityName:'翠西社区'
            }
        },
        computed: {

        },
        watch: {

        },
        created(){
            this.username=window.sessionStorage.getItem('username');
        },

        mounted() {
        
        },
        methods: {

        }
    }
</script>
<style scoped>
.header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgb(65,65,65);
}
.profileContainer{
    width: 60px;
    height: 60px;
    background: green;
    margin-right: 30px;
    border-radius: 15px;
}
h1{
color: white;
}
</style>