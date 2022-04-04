<template>
  <div class="container" v-loading="loading">
    <div class="tab">
      <div :class="{active: tabIndex === 0}" @click="activeTab(0)">线上培训班</div>
      <div :class="{active: tabIndex === 1}" @click="activeTab(1)">线下培训班</div>
    </div>
    <div v-if="tabIndex === 0">
    <div class="title">
      <div>共{{ total }}个培训班次</div>
    </div>
    <div class="display-flex jc-space-between fw-wrap">
      <div class="train" v-for="item in classList" :key="item.id">
        <div class="class-bg">
          <img :src="`${baseURL}/course/cover?coverImageId=${item.coverImageId}&token=${$localStorage.get('token')}`" v-if="item.coverImageId" class="class-img">
          <img src="@/assets/images/train.png" v-else>
        </div>
        <div class="text">
          <div class="class-name">{{ item.className }}</div>
          <div class="mb-10">开课时间：{{ item.classStartDate }} —— {{ item.classEndDate }}</div>
          <div class="mb-20"> 培训单位：{{ item.companyName }}</div>
          <div class="display-flex">
            <div class="button" @click="$router.push(`/home/sign-up?id=${item.id}`)" v-if="item.state==0">报名</div>
            <div class="button" @click="$router.push(`/home/train-list?id=${item.id}&className=${item.className}`)" v-if="item.state==1">去学习</div>
            <div class="button" @click="$router.push(`/home/personal-record?id=${item.id}&className=${item.className}`)" v-if="item.state==2">学习记录</div>
          </div>
        </div>
        <img src="@/assets/images/unStart.png" class="startImg" v-if="item.state==0">
        <img src="@/assets/images/start.png" class="startImg" v-if="item.state==1">
        <img src="@/assets/images/end.png" class="startImg" v-if="item.state==2">
      </div>
    </div>
      <el-pagination
        hide-on-single-page
        class="float-right mt-10 mb-10"
        @current-change="(val) => {getClassList(val)}"
        :current-page="onLineQuery.pageNum"
        :page-size="onLineQuery.pageSize"
        background
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
  </div>
    <div v-if="tabIndex === 1">
      <div class="title">
        <div>共{{ total }}个培训班次</div>
      </div>
      <div class="display-flex jc-space-between fw-wrap">
        <div class="train" v-for="item in classList" :key="item.id">
          <div class="class-bg">
            <img :src="`${baseURL}/course/cover?coverImageId=${item.coverImageId}&token=${$localStorage.get('token')}`" v-if="item.coverImageId" class="class-img">
            <img src="@/assets/images/train.png" v-else>
          </div>
          <div class="text">
            <div class="class-name">{{ item.className }}</div>
            <div class="mb-10">开课时间：{{ item.classStartDate }} —— {{ item.classEndDate }}</div>
            <div class="mb-20"> 培训单位：{{ item.companyName }}</div>
            <div class="display-flex">
              <div class="button" @click="$router.push(`/home/sign-up?id=${item.id}`)" v-if="item.state==0">报名</div>
              <div class="button" @click="download(item.offlineDocumentUrl + '?token=' + $localStorage.get('token'))" v-if="item.offlineDocumentUrl">下载资料</div>
            </div>
          </div>
          <img src="@/assets/images/unStart.png" class="startImg" v-if="item.state==0">
          <img src="@/assets/images/start.png" class="startImg" v-if="item.state==1">
          <img src="@/assets/images/end.png" class="startImg" v-if="item.state==2">
        </div>
      </div>
      <el-pagination
        hide-on-single-page
        class="float-right mt-10 mb-10"
        @current-change="(val) => {getClassList(val)}"
        :current-page="offLineQuery.pageNum"
        :page-size="offLineQuery.pageSize"
        background
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { baseURL } from '@/utils/Methods'
export default {
  name: 'HomePage',
  data () {
    return {
      baseURL: baseURL(),
      onLineQuery: {
        pageNum: 1,
        pageSize: 6,
        type: 0
      },
      offLineQuery: {
        pageNum: 1,
        pageSize: 6,
        type: 1
      },
      tabIndex: 0,
      username: this.$localStorage.get('userInfo').username,
      loading: false,
      classList: [],
      total: 0
    }
  },
  watch: {
  },
  computed: {
  },
  methods: {
    download (url) {
      window.location.href = url
    },
    activeTab (index) {
      this.tabIndex = index
      this.getClassList()
    },
    // 获取课程列表
    getClassList (pageNum) {
      this.loading = true
      let data = null
      if (this.tabIndex === 0) {
        data = this.onLineQuery
      } else data = this.offLineQuery
      if (pageNum) {
        data.pageNum = pageNum
      }
      this.$api.class.getClassList(data).then(res => {
        this.total = res.total
        this.classList = res.list || []
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  },
  created () {
  },
  mounted () {
    this.getClassList()
  }
}
</script>

<style lang="scss" scoped>
.tab {
  color: #666666;
  line-height: 16px;
  display: flex;
  div {
    height: 62px;
    line-height: 62px;
    text-align: center;
    cursor: pointer;
    margin-right: 60px;
  }

  div:last-child {
    border: none;
  }

  .active {
    color: #333333;
    font-size: 18px;
    font-weight: 500;
    position: relative;
    &:after {
      content: ' ';
      position: absolute;
      width: 48px;
      height: 6px;
      bottom: 0;
      left: 18px;
      background: #09BBA1;
      border-radius: 3px;
    }
  }
}

.title {
  height: 92px;
  line-height: 92px;
  display: flex;
  justify-content: space-between;
  font-weight: 500;
  color: #333333;
  font-size: 24px;
}

.train {
  position: relative;
  width: 670px;
  height: 171px;
  background: #FFFFFF;
  border-radius: 8px;
  display: flex;
  margin-bottom: 20px;
  overflow: hidden;
  .class-bg{
    width: 293px;
    height: 100%;
    position: relative;
    .class-img{
      width: 100%;
      height: 100%;
    }
  }
  .startImg {
    position: absolute;
    right: 0;
    top: 16px;
  }
}
.text {
  padding: 20px 0 0 20px;
  color: #999999;
  font-size: 14px;
  .class-name {
    font-weight: 500;
    color: #333333;
    font-size: 20px;
    margin-bottom: 20px;
  }
}
</style>
