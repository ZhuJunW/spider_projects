<template>
  <div class="personnel">
    <header>
      <div class="container display-flex ai-center jc-space-between">
        <div class="logo color-green">
          <div>{{logoName}}</div>
          <div class="sub-title">-安胜达安全科技-</div>
        </div>
        <el-menu style="width: calc(100% - 600px);margin-top: 10px" mode="horizontal"  text-color="#333333"
              active-text-color="#3BBBA1" @select="handleSelect" :default-active="$route.path">
          <el-menu-item index="/home/index">
            首页
          </el-menu-item>
          <el-menu-item index="/home/exam-exercise">
            习题考试
          </el-menu-item>
          <el-menu-item index="/home/train">
            培训开课
          </el-menu-item>
          <el-menu-item index="/home/course">
            公开课程
          </el-menu-item>
          <el-menu-item index="/home/certificate">
            证书查询
          </el-menu-item>
        </el-menu>
        <el-input
          placeholder="请输入关键字搜索"
          v-model="fuzzy"
          style="width:300px;"  @keyup.enter.native="search()">
          <i slot="suffix" class="el-input__icon el-icon-search cursor-pointer" @click="search"></i>
        </el-input>
        <div class="user">
          <el-avatar :size="30" :src="avatar"></el-avatar>
          <el-dropdown>
            <div class="display-flex ai-center">
              <span class="color-black cursor-pointer ml-10 fs-14">
              {{username}}<i class="el-icon-caret-bottom el-icon--right"></i>
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
      courseList: [],
      fuzzy: '',
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
    search () {
      if (this.fuzzy) {
        this.$router.push(`/home/search?fuzzy=${this.fuzzy}`)
      } else return this.$message.warning('请输入关键字')
    },
    loginOut () {
      this.$localStorage.set('historyUrl', '')
      this.$localStorage.set('token', '')
      this.$router.push('/')
    },
    handleSelect (key, keyPath) {
      this.$router.replace(key)
    }
  },
  created () {
  },
  mounted () {
    this.fuzzy = this.$route.query.fuzzy
  }
}
</script>

<style lang="scss" scoped>
  .personnel {
    padding-bottom: 80px;
    header {
      height: 70px;
      background: #FFFFFF;
      .el-icon-search{
        color: #09BBA1;
      }
      .logo {
        font-weight: 500;
        font-size: 18px;

        .sub-title {
          font-weight: 400;
          text-align: center;
          font-size: 12px;
          color: #999999;
          margin-top: 4px;
        }
      }

      .user {
        display: flex;
        align-items: center;
      }
    }
    .el-menu.el-menu--horizontal{
      border-bottom:none
    }
    }

</style>
