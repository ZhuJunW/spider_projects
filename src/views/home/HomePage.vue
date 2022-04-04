<template>
  <div class="container" v-loading="loading">
    <div class="banner">
      <img src="@/assets/images/banner.png">
      <div class="info">
        <div class="avatar"></div>
        <div class="name">{{username}}</div>
        <div  class="tag">
          <div>公司</div>
          <div>企业人员</div>
        </div>
        <div class="study">截止目前已学习完{{finishCount}}个课程</div>
        <el-button @click="$router.push('/home/personal-record')">学习历史记录<i class="el-icon-arrow-right el-icon--right"></i></el-button>
      </div>
    </div>
    <div class="title">
      <div>培训开课</div>
      <div class="more" @click="$router.push('/home/train')">查看更多 <i class="el-icon-arrow-right"></i></div>
    </div>
    <div class="display-flex jc-space-between">
      <div class="train" v-for="item in classList" :key="item.id">
        <div class="class-bg">
          <img src="@/assets/images/onLine.png" class="train-img" v-if="item.type==0">
          <img src="@/assets/images/offLine.png" class="train-img" v-if="item.type==1">
          <img :src="`${baseURL}/course/cover?coverImageId=${item.coverImageId}&token=${$localStorage.get('token')}`" v-if="item.coverImageId" class="class-img">
          <img src="@/assets/images/train.png" v-else>
        </div>
        <div class="text">
          <div class="class-name">{{ item.className }}</div>
          <div class="mb-14">开课时间：{{ item.classStartDate }} —— {{ item.classEndDate }}</div>
          <div class="mb-20"> 培训单位：{{ item.companyName }}</div>
          <div class="display-flex">
            <div class="button" @click="$router.push(`/home/sign-up?id=${item.id}`)" v-if="item.state==0">报名</div>
            <div class="button" @click="$router.push(`/home/train-list?id=${item.id}&className=${item.className}`)" v-if="item.state==1&&item.type==0">去学习</div>
            <div class="button" @click="$router.push(`/home/personal-record?id=${item.id}&className=${item.className}`)" v-if="item.state==2&&item.type==0">学习记录</div>
            <div class="button" @click="download(item.offlineDocumentUrl + '?token=' + $localStorage.get('token'))" v-if="item.type==1&&item.offlineDocumentUrl">下载资料</div>
          </div>
        </div>
        <img src="@/assets/images/unStart.png" class="startImg" v-if="item.state==0">
        <img src="@/assets/images/start.png" class="startImg" v-if="item.state==1">
        <img src="@/assets/images/end.png" class="startImg" v-if="item.state==2">
      </div>
    </div>
    <div class="title">
      <div>公开课程</div>
      <div class="more" @click="$router.push('/home/course')">查看更多 <i class="el-icon-arrow-right"></i></div>
    </div>
    <div class="display-flex jc-space-between">
      <div class="course" v-for="course in courseList" :key="course.id" @click="handleClick(course)">
        <img :src="`${baseURL}/course/cover?coverImageId=${course.coverImageId}&token=${$localStorage.get('token')}`">
        <div class="course-title">
          <div class="text-overflow" :title="course.title">{{course.title}}</div>
          <div>共{{course.sectionTotal}}个章节 | 共{{course.courseHour}}个小时</div>
        </div>
      </div>
    </div>
    <div class="title">
      <div>推荐试卷</div>
      <div class="more" @click="$router.push('/home/exam-list')">查看更多 <i class="el-icon-arrow-right"></i></div>
    </div>
    <div class="exam">
      <div v-for="exam in examList" :key="exam.id">
        <img src="@/assets/images/finish.png" class="finish" v-if="exam.finished==1">
        <div class="paper">
          <img src="@/assets/images/paper.png">
          <div>{{ exam.categoryName }}</div>
        </div>
        <div class="paper-text">
          <div>{{ exam.title }}</div>
          <div>专业类别：{{ exam.categoryName }}｜创建时间：{{ exam.createTime }}｜创建人：{{ exam.creator }}</div>
          <div class="button" @click="$router.push(`/home/exam?id=${exam.id}`)">去考试</div>
        </div>
      </div>
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
      username: this.$localStorage.get('userInfo').username,
      loading: false,
      searchForm: {
        title: '',
        page: 1,
        limit: 8
      },
      courseList: [],
      classList: [],
      examList: [],
      total: null
    }
  },
  watch: {
  },
  computed: {
    finishCount () {
      return this.$localStorage.get('finishCount')
    }
  },
  methods: {
    download (url) {
      window.location.href = url
    },
    // 获取课程列表
    getCourseList () {
      return this.$api.course.getCourseManageList({ pageNum: 1, pageSize: 5, open: 1 }).then(res => {
        this.courseList = res.list || []
      })
    },
    // 获取试卷列表
    getExamManageList () {
      return this.$api.exam.getExamManageList({ pageNum: 1, pageSize: 4 }).then(res => {
        this.examList = res.list || []
      })
    },
    // 获取班次列表
    getClassList () {
      return this.$api.class.getClassList({ pageNum: 1, pageSize: 2 }).then(res => {
        this.classList = res.list || []
      })
    },
    handleClick (data) {
      this.$router.push(`course-detail/${data.id}`)
    }
  },
  created () {
  },
  mounted () {
    this.loading = true
    const arr = [this.getCourseList(), this.getClassList(), this.getExamManageList()]
    Promise.all(arr).then(() => {
      this.loading = false
    }).catch(() => {
      this.loading = false
    })
  }
}
</script>

<style lang="scss" scoped>

.banner {
  display: flex;
  margin-top: 20px;
  justify-content: space-between;

  .info {
    height: 280px;
    width: 260px;
    background: #F8F8F8;
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .avatar {
      height: 70px;
      width: 70px;
      margin: 26px 0 12px;
      background: url("~@/assets/images/avatar.png") center center;
    }

    .name {
      font-weight: 500;
      color: #333333;
      font-size: 16px;
      margin-bottom: 12px;
    }

    .tag {
      display: flex;
      margin-bottom: 16px;

      div:first-child {
        margin-right: 8px;
      }

      div {
        width: 68px;
        height: 19px;
        line-height: 19px;
        border-radius: 10px;
        border: 1px solid #C1E2DE;
        color: #09BBA1;
        text-align: center;
        font-size: 12px;
      }
    }

    .study {
      font-weight: 400;
      color: #999999;
      font-size: 14px;
      margin-bottom: 20px;
    }

    .el-button {
      cursor: pointer;
      border-radius: 6px;
      border-color: #3BBBA1;
      background-color: #3BBBA1;
      color: #FFFFFF;
      font-size: 12px;
      margin-bottom: 30px;
      &:hover{
        background: #48D1CC;
        border-color: #48D1CC;
        color: #fff;
      }
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

  .more {
    font-weight: 400;
    color: #666666;
    font-size: 16px;
    cursor: pointer;
  }
}

.train {
  position: relative;
  width: 670px;
  height: 171px;
  background: #FFFFFF;
  border-radius: 8px;
  display: flex;
  overflow: hidden;
  .class-bg{
   width: 293px;
    height: 100%;
    position: relative;
    .train-img{
      position: absolute;
      left: 0;
      top: 0;
    }
    .class-img{
      width: 100%;
      height: 100%;
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
  .startImg {
    position: absolute;
    right: 0;
    top: 16px;
  }
}
.course {
  width: 255px;
  background: #FFFFFF;
  border-radius: 8px;
  cursor: pointer;
  img {
    width: 100%;
    height: 140px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    vertical-align:bottom
  }

  .course-title {
    padding: 16px;
    color: #999999;
    font-size: 14px;

    :first-child {
      font-weight: 500;
      color: #333333;
      font-size: 16px;
      width: 100%;
      margin-bottom: 10px;
    }
  }
}

.exam {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  > div {
    position: relative;
    width: 630px;
    height: 100px;
    padding: 20px;
    margin-bottom: 20px;
    background: #FFFFFF;
    border-radius: 8px;
    display: flex;
    .finish{
      position: absolute;
      top: 0px;
      right: 0;
    }
    .paper{
      position: relative;
      font-weight: 500;
      color: #ED501C;
      font-size: 14px;
      img{
        background: #FFFFFF;
        box-shadow: 0px 4px 8px 0px rgba(220, 220, 220, 0.5);
      }
      div{
        width: 80px;
        text-align: center;
        position: absolute;
        top:16px;
        left: 0px;
      }
    }
    .paper-text {
      padding-left: 20px;
      color: #999999;
      font-size: 14px;

      :first-child {
        font-weight: 500;
        color: #333333;
        font-size: 18px;
        margin-bottom: 16px;
        margin-top: 6px;
      }

      :nth-child(2) {
        margin-bottom: 15px;
      }
    }
  }
}
</style>
