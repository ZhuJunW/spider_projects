<template>
  <el-container class="height-percent-100">
    <el-aside :width="!isCollapse ? '220px' : '65px'" class="aside scrollbar">
      <div class="logo" v-if="showLogo">
        <span v-if="!isCollapse">在线教育平台</span>
        <el-image style="width: 30px" v-else :src="logo"></el-image>
      </div>
      <div v-else class="logo"></div>
      <el-scrollbar style="height: calc(100vh - 60px)">
        <el-menu
          :default-active="$route.path"
          :collapse="isCollapse"
          class="menu"
          background-color="#304156"
          text-color="#fff"
          router
          :collapse-transition="false"
          active-text-color="#1990FF">
          <template v-for="(item, index) in menuList">
            <el-submenu v-if="item.childList.length" :index="item.url" :key="index">
              <template slot="title">
                <Item :icon="item.icon" :title="item.name"/>
              </template>
              <el-menu-item-group>
                <el-menu-item
                  v-for="(_item, _index) in item.childList"
                  :key="_index"
                  :index="_item.url">
                  <template slot="title">
                    <Item :icon="_item.icon" :title="_item.name"/>
                  </template>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item v-else :index="item.url" :key="index">
              <Item :icon="item.icon" :title="item.name"/>
            </el-menu-item>
          </template>
        </el-menu>
      </el-scrollbar>
    </el-aside>
    <el-container>
      <el-header class="display-flex ai-center jc-space-between header">
        <i class="cursor-pointer fs-20" @click="isCollapse = !isCollapse" :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
        <div class="user">
          <el-dropdown>
            <div class="display-flex ai-center">
              <el-avatar :size="30" :src="avatar"></el-avatar>
              <span class="cursor-pointer ml-14 fs-14">
                {{username}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="$localStorage.get('userInfo').roleCode === 'administrator'">
                <span @click="$router.replace('/personnel')">用户培训</span>
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
      </el-header>
      <el-main class="pt-16">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="mb-16">
          <el-breadcrumb-item
            v-for="(item, index) in breadcrumb"
            :key="index">
            <span
              class="cursor-pointer"
              @click="routerGo(index)"
              :style="{color: breadcrumb.length-1 === index ? '#1990FF' : '#999999'}">{{item}}</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
        <router-view :key="$route.fullPath"></router-view>
      </el-main>
    </el-container>
    <change-password :show-dialog="showPassword" @hideDialog="showPassword = false" @submitDialog="showPassword = false"></change-password>
  </el-container>
</template>

<script>
import Item from '@/components/Item'
import logo from '@/assets/images/logo-white.png'
import ChangePassword from '@/components/ChangePassword';
import { mapState } from 'vuex';
export default {
  name: 'Index',
  components: { ChangePassword, Item },
  data () {
    return {
      showLogo: true,
      logo,
      showPassword: false,
      isCollapse: this.$localStorage.get('isCollapse') || false,
      username: this.$localStorage.get('userInfo').username || '',
      screenWidth: null,
      avatar: this.$localStorage.get('userInfo').avatarUrl || '',
      menuList: this.$localStorage.get('menuList') || []
    }
  },
  watch: {
    screenWidth (newVal) {
      this.screenWidth = newVal
      this.isCollapse = this.screenWidth < 1560
      // 当浏览器尺寸大于1560时 侧边栏平铺展示，反之则做收缩展示
    },
    isCollapse (newVal) {
      this.$localStorage.set('isCollapse', newVal)
      this.showLogo = !this.showLogo
      setTimeout(() => {
        this.showLogo = !this.showLogo
      }, 100)
    }
  },
  computed: {
    ...mapState({
      breadcrumb: state => state.breadcrumb // 面包屑
    })
  },
  methods: {
    // /**
    //    *  监听窗口大小变化
    //    */
    // onWindowResize () {
    //   this.screenWidth = document.body.clientWidth
    //   this.isCollapse = this.screenWidth < 1560
    //   window.onresize = () => {
    //     return (() => {
    //       this.screenWidth = document.body.clientWidth
    //     })()
    //   }
    // },
    routerGo (index) {
      if (((index + 1) !== this.breadcrumb.length) && index !== 0) {
        this.$router.go((index + 1) - this.breadcrumb.length)
      }
    },
    loginOut () {
      this.$localStorage.set('historyUrl', '')
      this.$localStorage.set('token', '')
      this.$router.push('/')
    }
  },
  created () {

  },
  mounted () {
    // this.onWindowResize()
  }
}
</script>

<style lang="scss" scoped>
  /deep/.el-menu-item-group__title {
    display: none;
  }
  /deep/.el-menu-item.is-active {
    background-color: rgb(38,52,69) !important;
  }
  .aside {
    overflow: hidden;
    transition: width 0.25s;

    .logo {
      color: white;
      background-color: #021F3C;
      height: 60px;
      font-size: 18px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }

    .menu {
      width: 100%;
      height: calc(100vh - 60px);
    }
  }

  header {
    padding: 0;
    background-color: #fff;
    > i {
      padding: 20px;
      &:hover {
        background-color: rgb(244,244,244);
      }
    }
    .user {
      padding: 20px;
    }
  }
</style>
