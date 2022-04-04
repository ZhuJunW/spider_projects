<template>
  <div>
    <el-header class="display-flex ai-center">
      <div @click="$router.back()" class="nav"><i class="el-icon-back"></i>{{ $route.query.className}}</div>
    </el-header>
    <div class="container" v-loading="loading">
      <div class="display-flex fw-wrap"  v-if="courseList.length>0">
        <div class="course" v-for="course in courseList" :key="course.id" @click="handleClick(course)">
          <img :src="course.coverImageBase64" alt="" v-if="course.coverImageBase64">
          <img src="@/assets/images/train.png" v-else>
          <div class="course-title">
            <div class="text-overflow" :title="course.courseName">{{course.courseName}}</div>
            <div>共{{course.sectionSize}}个章节 | 共{{course.hour}}个小时</div>
          </div>
        </div>
      </div>
      <div class="nothing" v-else>
        <div>
          <img src="@/assets/images/null.png">
          <div>暂无课程</div>
        </div>
    </div>
  </div>
  </div>
</template>

<script>
export default {
  name: 'TrainList',
  data () {
    return {
      loading: false,
      courseList: [],
      total: null
    }
  },
  watch: {
  },
  computed: {
  },
  methods: {
    handleClick (data) {
      this.$router.push(`course-detail/${data.courseId}`)
    },
    // 获取课程列表
    getCourseList () {
      this.loading = true
      this.$api.class.getCourseList({ pageNum: 1, pageSize: 10, classesId: this.$route.query.id }).then(res => {
        this.courseList = res.list || []
        this.total = res.total
        this.$localStorage.set('finishCount', res.finishCount)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  },
  created () {

  },
  mounted () {
    // 获取课程列表
    this.getCourseList()
  }
}
</script>

<style lang="scss" scoped>
.el-header{
  background-color: #FFFFFF;
  border-top:1px solid #E6E6E6 ;
  margin-bottom: 20px;
  div{
    width: 1360px;
    margin: 0 auto;
  }
}
.nothing{
  padding: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  >div{
    text-align: center;
    color: #999999;
    font-size: 14px;
  }
}
  .course {
    margin: 0 20px 20px 0;
    width: 250px;
    background:rgba(255,255,255,1);
    border-radius:4px;
    border:1px solid rgba(204,204,204,0.5);
    cursor: pointer;
    img {
      width: 100%;
      height:140px;
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
</style>
