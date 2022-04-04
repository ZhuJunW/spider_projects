<template>
  <div v-loading="loading">
    <el-header class="display-flex ai-center">
      <div @click="$router.back()" class="nav"><i class="el-icon-back"></i>搜索结果</div>
    </el-header>
    <div class="container">
        <el-menu :default-active="activeIndex"  mode="horizontal" @select="handleSelect" background-color="transparent">
          <el-menu-item index="1">全部</el-menu-item>
          <el-menu-item index="2">公开课程</el-menu-item>
          <el-menu-item index="3">培训班次</el-menu-item>
          <el-menu-item index="4">习题</el-menu-item>
          <el-menu-item index="5">考试</el-menu-item>
        </el-menu>
      <div v-show="activeIndex==1">
        <div class="title">
          <div><span>'{{ this.$route.query.fuzzy }}'</span>相关的公开课程</div>
        </div>
        <div class="display-flex fw-wrap" v-if="courseList.length>0">
          <div class="course" v-for="course in courseList" :key="course.id" @click="handleClick(course)">
            <img :src="`${baseURL}/course/cover?coverImageId=${course.coverImageId}&token=${$localStorage.get('token')}`">
            <div class="course-title">
              <div class="text-overflow" :title="course.title">{{course.title}}</div>
              <div>共{{course.sectionTotal}}个章节 | 共{{course.courseHour}}个小时</div>
            </div>
          </div>
        </div>
        <div v-else class="no-relative">暂无相关公开课程</div>
        <div class="title">
          <div><span>'{{ this.$route.query.fuzzy }}'</span>相关的培训班次</div>
        </div>
        <div class="display-flex jc-space-between" v-if="classList.length>0">
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
        <div v-else class="no-relative">暂无相关班次</div>
        <div class="title">
          <div><span>'{{ this.$route.query.fuzzy }}'</span>相关的习题</div>
        </div>
        <div class="display-flex fw-wrap" v-if="exerciseList.length>0">
          <div :class="getbg(index)" v-for="(exercise,index) in exerciseList" :key="exercise.id">
            <div class="display-flex">
              <img src="@/assets/images/icon1.png" v-if="index % 3 === 0">
              <img src="@/assets/images/icon2.png" v-if="index % 3 === 1">
              <img src="@/assets/images/icon3.png" v-if="index % 3 === 2">
              <div class="info">
                <div>{{ exercise.title}}</div>
                <div>共{{ exercise.questionCount }}题｜已做6题</div>
              </div>
            </div>
            <div :class="getcolor(index)" @click="$router.push('/home/exercise?id=' + exercise.id)">开始练习</div>
          </div>
        </div>
        <div v-else class="no-relative">暂无相关习题</div>
        <div class="title">
          <div><span>'{{ this.$route.query.fuzzy }}'</span>相关的试卷</div>
        </div>
        <div class="exam" v-if="examList.length>0">
          <div v-for="exam in examList" :key="exam.id">
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
        <div v-else class="no-relative">暂无相关试卷</div>
      </div>
      <div v-show="activeIndex == 2">
        <div class="title">
          <div><span>'{{ this.$route.query.fuzzy }}'</span>相关的公开课程</div>
        </div>
        <div v-if="fullCourseList.length>0">
          <div class="display-flex fw-wrap">
            <div class="course" v-for="course in fullCourseList" :key="course.id" @click="handleClick(course)">
              <img :src="`${baseURL}/course/cover?coverImageId=${course.coverImageId}&token=${$localStorage.get('token')}`">
              <div class="course-title">
                <div class="text-overflow" :title="course.title">{{course.title}}</div>
                <div>共{{course.sectionTotal}}个章节 | 共{{course.courseHour}}个小时</div>
              </div>
            </div>
          </div>
          <el-pagination
            class="float-right mt-10 mb-10"
            @current-change="(val) => {getCourseManageList(val)}"
            :current-page="courseForm.pageNum"
            :page-size="courseForm.pageSize"
            background
            layout="total, prev, pager, next, jumper"
            :total="courseRes.total">
          </el-pagination>
        </div>
        <div v-else class="no-relative">暂无相关公开课程</div>
      </div>
      <div v-show="activeIndex == 3">
        <div class="title">
          <div><span>'{{ this.$route.query.fuzzy }}'</span>相关的培训班次</div>
        </div>
        <div v-if="fullClassList.length>0">
          <div class="display-flex jc-space-between fw-wrap">
            <div class="train" v-for="item in fullClassList" :key="item.id">
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
          <el-pagination
            class="float-right mt-10 mb-10"
            @current-change="(val) => {getClassList(val)}"
            :current-page="classForm.pageNum"
            :page-size="classForm.pageSize"
            background
            layout="total, prev, pager, next, jumper"
            :total="classRes.total">
          </el-pagination>
        </div>
        <div v-else class="no-relative">暂无相关班次</div>
      </div>
      <div v-show="activeIndex == 4">
        <div class="title">
          <div><span>'{{ this.$route.query.fuzzy }}'</span>相关的习题</div>
        </div>
        <div v-if="fullExerciseList.length>0">
          <div class="display-flex fw-wrap">
            <div :class="getbg(index)" v-for="(exercise,index) in fullExerciseList" :key="exercise.id">
              <div class="display-flex">
                <img src="@/assets/images/icon1.png" v-if="index % 3 === 0">
                <img src="@/assets/images/icon2.png" v-if="index % 3 === 1">
                <img src="@/assets/images/icon3.png" v-if="index % 3 === 2">
                <div class="info">
                  <div>{{ exercise.title}}</div>
                  <div>共{{ exercise.questionCount }}题｜已做6题</div>
                </div>
              </div>
              <div :class="getcolor(index)" @click="$router.push('/home/exercise?id=' + exercise.id)">开始练习</div>
            </div>
          </div>
          <el-pagination
            class="float-right mt-10 mb-10"
            @current-change="(val) => {getExerciseManageList(val)}"
            :current-page="exerciseForm.pageNum"
            :page-size="exerciseForm.pageSize"
            background
            layout="total, prev, pager, next, jumper"
            :total="exerciseRes.total">
          </el-pagination>
        </div>
        <div v-else class="no-relative">暂无相关习题</div>
      </div>
      <div v-show="activeIndex == 5">
        <div class="title">
          <div><span>'{{ this.$route.query.fuzzy }}'</span>相关的试卷</div>
        </div>
        <div  v-if="fullExamList.length>0">
          <div class="exam">
            <div v-for="exam in fullExamList" :key="exam.id">
              <div class="paper">
                <img src="@/assets/images/paper.png">
                <div>{{ exam.categoryName }}</div>
              </div>
              <div class="paper-text">
                <div>{{ exam.title }}</div>
                <div>专业类别：{{ exam.categoryName }}｜创建时间：{{ exam.createTime }}｜创建人：{{ exam.creator }}</div>
                <div class="button" @click="$router.push(`/personnel/exam/${exam.id}`)">去考试</div>
              </div>
            </div>
          </div>
          <el-pagination
            class="float-right mt-10 mb-10"
            @current-change="(val) => {getExamManageList(val)}"
            :current-page="examForm.pageNum"
            :page-size="examForm.pageSize"
            background
            layout="total, prev, pager, next, jumper"
            :total="examRes.total">
          </el-pagination>
        </div>
        <div v-else class="no-relative">暂无相关试卷</div>
      </div>
      </div>
    </div>
</template>

<script>
import { baseURL } from '@/utils/Methods'
export default {
  name: 'Search',
  data () {
    return {
      baseURL: baseURL(),
      activeIndex: '1',
      username: this.$localStorage.get('userInfo').username,
      loading: false,
      courseForm: {
        pageNum: 1,
        pageSize: 10,
        keyWord: null,
        open: 1
      },
      courseRes: {
        total: 0
      },
      classForm: {
        pageNum: 1,
        pageSize: 6,
        className: null
      },
      classRes: {
        total: 0
      },
      exerciseForm: {
        pageNum: 1,
        pageSize: 9,
        isAddSubject: 2,
        fuzzy: null
      },
      exerciseRes: {
        total: 0
      },
      examForm: {
        pageNum: 1,
        pageSize: 6,
        fuzzy: null
      },
      examRes: {
        total: 0
      },
      fullCourseList: [],
      fullClassList: [],
      fullExamList: [],
      fullExerciseList: [],
      classList: [],
      examList: [],
      exerciseList: [],
      courseList: [],
      total: null
    }
  },
  watch: {
    $route () {
      this.searchAll()
    }
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
    getbg (index) {
      if (index % 3 === 0) {
        return 'exercise'
      } else if (index % 3 === 1) {
        return 'exercise bg2'
      } else {
        return 'exercise bg3'
      }
    },
    getcolor (index) {
      if (index % 3 === 0) {
        return 'start'
      } else if (index % 3 === 1) {
        return 'start green'
      } else {
        return 'start blue'
      }
    },
    handleSelect (key, keyPath) {
      this.activeIndex = key
    },
    // 获取课程列表
    getCourseManageList (pageNum) {
      if (pageNum) {
        this.courseForm.pageNum = pageNum
      }
      this.courseForm.keyWord = this.$route.query.fuzzy
      return this.$api.course.getCourseManageList(this.courseForm).then(res => {
        this.courseList = res.list || []
        this.courseRes = res
        this.fullCourseList = this.courseList.slice()
        if (this.courseList.length > 2) {
          this.courseList.length = 2;
        }
      })
    },
    // 获取试卷列表
    getExamManageList (pageNum) {
      if (pageNum) {
        this.examForm.pageNum = pageNum
      }
      this.examForm.fuzzy = this.$route.query.fuzzy
      return this.$api.exam.getExamManageList(this.examForm).then(res => {
        this.examList = res.list || []
        this.examRes = res
        this.fullExamList = this.examList.slice()
        if (this.examList.length > 4) {
          this.examList.length = 4;
        }
      })
    },
    // 获取班次列表
    getClassList (pageNum) {
      if (pageNum) {
        this.classForm.pageNum = pageNum
      }
      this.classForm.className = this.$route.query.fuzzy
      return this.$api.class.getClassList(this.classForm).then(res => {
        this.classList = res.list || []
        this.classRes = res
        this.fullClassList = this.classList.slice()
        if (this.classList.length > 1) {
          this.classList.length = 1;
        }
      })
    },
    getExerciseManageList (pageNum) {
      if (pageNum) {
        this.exerciseForm.pageNum = pageNum
      }
      this.exerciseForm.fuzzy = this.$route.query.fuzzy
      this.$api.exercise.getExerciseManageList(this.exerciseForm).then(res => {
        this.exerciseList = res.list || []
        this.exerciseRes = res
        this.fullExerciseList = this.exerciseList.slice()
        if (this.exerciseList.length > 2) {
          this.exerciseList.length = 2;
        }
      })
    },
    handleClick (data) {
      this.$router.push(`course-detail/${data.id}`)
    },
    searchAll () {
      this.loading = true
      const arr = [this.getCourseManageList(), this.getClassList(), this.getExamManageList(), this.getExerciseManageList()]
      Promise.all(arr).then(() => {
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  },
  created () {
  },
  mounted () {
    this.searchAll()
  }
}
</script>

<style lang="scss" scoped>
.el-header{
  background-color: #FFFFFF;
  border-top:1px solid #E6E6E6 ;
  div{
    width: 1360px;
    margin: 0 auto;
  }
}
.el-menu{
  margin-bottom: 40px;
}
.el-menu--horizontal>.el-menu-item.is-active {
  border-bottom: 2px solid #3BBBA1 ;
  background-color: transparent !important;
  color: #303133;
}
.el-menu-item:hover{
  background-color: transparent !important;
}
.title {
 margin-bottom: 20px;
  margin-top: 20px;
  font-weight: 500;
  color: #333333;
  font-size: 16px;
  span {
    color: #3BBBA1 ;
  }
}
.no-relative{
  text-align: center;
  height: 100px;
  line-height: 100px;
  font-size: 14px;
  color: #8f8f8f;
}
.train {
  position: relative;
  width: 670px;
  height: 171px;
  background: #FFFFFF;
  border-radius: 8px;
  display: flex;
  margin-bottom: 20px;
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
  margin:0  20px 20px 0;
  width: 250px;
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
      margin-bottom: 10px;
    }
  }
}
.bg2{
  background: url("~@/assets/images/bg2.png") center center !important;
}
.bg3{
  background: url("~@/assets/images/bg3.png") center center !important;
}
.green{
  color: #06C7D1 !important;
}
.blue{
  color: #30C3F6 !important;
}
.exercise {
  position: relative;
  width: 432px;
  height: 120px;
  margin: 0 20px 20px 0;
  background: url("~@/assets/images/bg1.png") center center;
  display: flex;
  justify-content: space-between;
  align-items: center;
  img{
    width: 52px;
    height: 52px;
    margin:0 20px 0 28px;
  }
  .info{
    color: #FFFFFF;
    font-size: 14px;
    :first-child{
      font-weight: 600;
      color: #FFFFFF;
      font-size: 20px;
      margin-bottom: 16px;
    }
  }
  .start{
    width: 88px;
    height: 32px;
    line-height: 32px;
    background: #FFFFFF;
    border-radius: 16px;
    opacity: 0.88;
    color: #4E99FF;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    margin-right:  28px;
  }
}
.exam {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  > div {
    width: 630px;
    height: 100px;
    padding: 20px;
    margin-bottom: 20px;
    background: #FFFFFF;
    border-radius: 8px;
    display: flex;
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
        font-size: 20px;
        margin-bottom: 16px;
      }

      :nth-child(2) {
        margin-bottom: 15px;
      }
    }
  }
}
</style>
