<template>
  <div class="personnel">
    <header>
      <div class="container display-flex ai-center jc-space-between color-white">
        <div class="logo">{{logoName}}</div>
        <div class="user">
          <el-dropdown>
            <div class="display-flex ai-center">
              <el-avatar :size="30" :src="avatar"></el-avatar>
              <span class="color-white cursor-pointer ml-14 fs-14">
              {{username}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="$localStorage.get('userInfo').roleCode === 'administrator'">
                <span @click="$router.replace('/admin/enterprise-list')">后台管理</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <span @click="showPassword = true">修改密码</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <span @click="loginOut">退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </header>
    <div class="learning-records">
      <div class="container display-flex ai-center jc-space-between">
        <div class="info display-flex">
          <el-avatar :size="70" :src="avatar"></el-avatar>
          <p class="display-flex fd-column jc-space-between color-white margin-12 ml-20">
            <b class="fs-16">{{username}}【{{$localStorage.get('userInfo').deptName}}/{{$localStorage.get('userInfo').position}}】</b>
            <span class="fs-14">截止当前已学习完{{finishCount}}个课程</span>
          </p>
        </div>
        <div class="history" @click="$router.push('/personnel/course-history')">
          <i class="el-icon-tickets"></i>
          <span>学习历史记录</span>
          <i class="el-icon-arrow-right"></i>
        </div>
      </div>
    </div>
    <router-view/>
    <change-password :show-dialog="showPassword" @hideDialog="showPassword = false" @submitDialog="showPassword = false"></change-password>
  </div>
</template>

<script>
import ChangePassword from '../../components/ChangePassword';
export default {
  name: 'Index',
  components: { ChangePassword },
  data () {
    return {
      showPassword: false,
      logoName: '在线教育平台',
      username: this.$localStorage.get('userInfo').username,
      avatar: this.$localStorage.get('userInfo').avatarUrl
    }
  },
  watch: {},
  computed: {
    finishCount () {
      return this.$localStorage.get('finishCount')
    }
  },
  methods: {
    loginOut () {
      this.$localStorage.set('historyUrl', '')
      this.$localStorage.set('token', '')
      this.$router.push('/')
    }
  },
  created () {

  },
  mounted () {

  }
}
</script>

<style lang="scss" scoped>
  .personnel {
    header {
      height: 60px;
      background: rgba(44, 49, 60, 1);
    }

    .learning-records {
      height: 130px;
      background: url("~@/assets/images/learning-records-bg.png") center center;

      .history {
        width: 146px;
        height: 44px;
        background: linear-gradient(90deg, rgba(255, 236, 234, 1) 0%, rgba(255, 207, 84, 1) 0%, rgba(244, 255, 180, 1) 100%);
        border-radius: 22px;
        padding: 0 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;

        span {
          margin: 0 8px;
        }
      }
    }
  }
</style>
