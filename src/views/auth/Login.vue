<template>
  <div class="login-container">
    <div class="welcome">欢迎使用在线培训平台！</div>
    <div class="center">
      <div class="edu">
        <div class="gif-container">
            <img src="@/assets/images/edu.gif"/>
        </div>
      </div>
      <div class="login">
        <div class="mb-30 ta-center">
          <img src="@/assets/images/logo2.png"/>
        </div>
        <div class="title">用户登录</div>
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" autocomplete="on" label-position="left">
          <el-form-item prop="username">
            <el-input
              clearable
              ref="username"
              v-model="loginForm.username"
              placeholder="请输入手机号"
              type="text"
              tabindex="2"
              @keyup.enter.native="handleLogin"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              clearable
              @keyup.enter.native="handleLogin"
              ref="password"
              v-model="loginForm.password"
              type="password"
              show-password
              placeholder="请输入密码"
              tabindex="2"
            />
          </el-form-item>
          <div class="display-flex ai-center jc-space-between">
            <el-checkbox v-model="checked">记住密码</el-checkbox>
          </div>
          <el-button class="width-percent-100 mt-20" :loading="loading" type="primary" @click.native.prevent="handleLogin">登录</el-button>
          <div @click="dialogRegister = true" class="register">去注册</div>
<!--          <el-link class="mt-20" :underline="false" @click="changeLogin">-->
<!--            {{activeName === '管理员' ? '普通用户' : '管理员'}}账号登录-->
<!--          </el-link>-->
        </el-form>
      </div>
    </div>
    <register v-if="dialogRegister" :show-dialog="dialogRegister" @hideDialog="dialogRegister = false" @submitDialog="submitRegister"></register>
  </div>
</template>

<script>
// import { filterAsyncRouter } from '@/utils/Methods'
// import router from '@/router/index'
import { encode, decode } from 'js-base64';
import Register from '@/components/Register';
export default {
  name: 'Login',
  components: { Register },
  data () {
    return {
      // activeName: this.$localStorage.get('loginType') || '普通用户',
      checked: false, // 是否记住密码
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      loading: false,
      dialogRegister: false
    }
  },
  watch: {
  },
  created () {

  },
  mounted () {
    if (this.$localStorage.get('loginusername') && this.$localStorage.get('loginpassword')) {
      this.loginForm.username = this.$localStorage.get('loginusername')
      this.loginForm.password = decode(this.$localStorage.get('loginpassword'))
      this.checked = true
    }
    this.$localStorage.set('menuList', [])
  },
  methods: {
    // 确认注册
    submitRegister (e) {
      this.dialogRegister = false
      this.loginForm.username = e.mobile
      this.loginForm.password = e.password
      // this.activeName = '普通用户'
    },
    // changeLogin () {
    //   if (this.activeName === '普通用户') {
    //     this.activeName = '管理员'
    //   } else {
    //     this.activeName = '普通用户'
    //   }
    // },
    // 登录
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // this.$localStorage.set('loginType', this.activeName)
          if (this.checked) {
            this.$localStorage.set('loginusername', this.loginForm.username)
            this.$localStorage.set('loginpassword', encode(this.loginForm.password))
          }
          const data = {
            mobile: this.loginForm.username,
            password: this.loginForm.password
          }
          this.$api.user.login(data).then(res => {
            this.$localStorage.set('token', res.token)
            this.$store.commit('setToken', res.token)
          }).then(() => {
            this.$api.user.getUserInfo({ token: this.$localStorage.get('token') }).then(_res => {
              this.$localStorage.set('userInfo', _res)
              this.$api.menu.getUserMenu().then(__res => {
                this.$localStorage.set('menuList', __res || [])
                if (_res.roleCode !== 'administrator') {
                  this.$router.push('/home/index')
                } else {
                  this.$router.push(__res[0].childList[0].url)
                }
              })
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .login-container {
    background: url("~@/assets/images/loginBg.png") center center;
    background-size: 100% 100%;
    min-height: 100%;
    width: 100%;
    overflow: hidden;
    .welcome{
      font-size: 44px;
      font-weight: bold;
      color: #FFFFFF;
      text-align: center;
      margin-top: 5%;
      margin-bottom: 3%;
    }
    .center{
      width: 65%;
      display: flex;
      margin: 0 auto;
      .edu{
        width: 70%;
        background: url("~@/assets/images/eduBg.png") center center;
        background-size: 100% 100%;
      }
      .login {
        width: 30%;
        background: #FFFFFF;
        border-radius: 0px 10px 10px 0px;
        padding: 70px 60px;
        .title{
          font-size: 20px;
          font-weight: bold;
          color: #337DF7;
          text-align: center;
          margin-bottom: 30px;
        }
        .register{
          font-size: 16px;
          font-weight: 500;
          color: #337DF7;
          text-align: center;
          margin-top: 20px;
          cursor: pointer;
        }
      }
    }
  }
  .gif-container {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    img {
      max-width: 100%;
      max-height: 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
    }
  }
</style>
