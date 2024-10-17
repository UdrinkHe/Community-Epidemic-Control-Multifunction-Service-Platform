<template>
  <div class="login" clearfix>
    <div id="titleText">
      <h1>社区管理员登录</h1>
    </div>
    <div class="login-wrap">
      <el-row type="flex">
        <el-form class="loginBlock" ref="loginForm" :model="loginFrom" :rules="rules" status-icon label-width="80px">
          <h3>登录</h3>
          <hr>
          <el-form-item prop="username" label="用户名">
            <el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon></el-input>
          </el-form-item>
          <el-form-item id="password" prop="password" label="密码">
            <el-input v-model="loginForm.password" show-password placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="margin-top:10px" icon="el-icon-upload" @click="toLogin()">登 录</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </div>
  </div>
</template>

<script>
    // import x from ''
    export default {
    name:'loginPage',
        components: {

        },
        data() {
            return {
                loginForm: {
                 username: "",
                 password: ""
                }  
            }
        },
        computed: {

        },
        watch: {

        },
        mounted() {
        
        },
        methods: {
      toLogin() {
      if (!this.loginForm.username) {
        this.$message.error("请输入用户名！");
        return;
      } else if (!this.loginForm.password) {
        this.$message.error("请输入密码！");
        return;
      } else {
         this.$axios.post("/api/login", {
            username: this.loginForm.username,//账号
            password: this.loginForm.password//密码
          }).then(res => {if (res.data.msg=='登录成功') {
              window.sessionStorage.setItem('usernameKey',res.data.header);//保存加密的请求头
              window.sessionStorage.setItem('username',res.data.username);
              this.$message.success('登录成功!')
              this.$router.push({ path: "/home" });//前往首页
            } else {
              this.$message.error('登录失败，请检查账号和密码是否输入正确')
            }
          });
       }
        }
        }
    }
</script>
<style scoped>

.login {
  width: 100%;
  height: 100%;
  background-size: cover;
  overflow: hidden;
  background:url('../../assets/backgroundImg.png');
  background-repeat: no-repeat;
  background-size: cover;
}
.login-wrap {
  background-size: cover;
  width: 400px;
  margin: 50px auto;
  overflow: hidden;
  padding-top: 10px;
  line-height: 40px;
}
#password {
  margin-bottom: 5px;
}
h3 {
  color: #0babeab8;
  font-size: 24px;
}
hr {
  background-color: #444;
  margin: 20px auto;
}
a {
  text-decoration: none;
  color: #aaa;
  font-size: 15px;
}
a:hover {
  color: coral;
}
.el-button {
  width: 80%;
  margin-left: -50px;
}
.loginBlock{
  background: #ffffff;
  padding: 50px ;
}
#titleText{
  margin-top:100px;
  text-align: center;
  color: #ffffff;
}

</style>