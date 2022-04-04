<template>
  <div class="CourseList">
    <header>
      <!-- 搜索栏 -->
      <div class="container display-flex ai-center jc-space-between">
        <p>课程列表</p>
        <el-input
          clearable
          style="width: 260px;"
          placeholder="请输入你要搜索的课程"
          v-model="searchForm.title">
          <i slot="suffix" class="el-input__icon el-icon-search cursor-pointer" @click="getCourseList"></i>
        </el-input>
      </div>
    </header>

    <div class="container display-flex fw-wrap mt-10" v-loading="loading">
      <div class="course" v-for="course in courseList" :key="course.id">
        <img :src="course.coverImageBase64" alt="">
        <div class="padding-16 display-flex fd-column jc-space-between">
          <p class="fs-14 mt-0">{{course.courseName}}</p>
          <p class="fs-12 mt-0 color-info">共{{course.sectionSize}}个章节 | 共{{course.totalTime}}个小时</p>
          <el-button
            @click="handleClick(course)"
            size="small"
            type="primary"
            plain
            round>
            <i class="el-icon-video-play"></i>开始学习
          </el-button>
        </div>
      </div>
    </div>
    <div class="container mt-10">
      <el-pagination
        class="float-right"
        hide-on-single-page
        @current-change="(val) => {searchForm.page = val}"
        :current-page="searchForm.page"
        :page-size="searchForm.limit"
        background
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CourseList',
  data () {
    return {
      loading: false,
      searchForm: {
        title: '',
        page: 1,
        limit: 8
      },
      courseList: [],
      total: null
    }
  },
  watch: {
    _searchForm: {
      handler: function (newVal, oldVal) {
        if (newVal.page !== 1 && newVal.page === oldVal.page) {
          this.searchForm.page = 1;
        } else {
          this.getCourseList()
        }
      },
      deep: true
    }
  },
  computed: {
    /**
     * 监听复杂数据类型的变换
     */
    _searchForm () {
      return JSON.parse(JSON.stringify(this.searchForm));
    }
  },
  methods: {
    // 获取课程列表
    getCourseList () {
      this.loading = true
      const data = {
        keyword: this.searchForm.title,
        pageNum: this.searchForm.page,
        pageSize: this.searchForm.limit
      }
      this.$api.course.getCourseList(data).then(res => {
        this.courseList = res.list || []
        this.total = res.total
        this.$localStorage.set('finishCount', res.finishCount)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleClick (data) {
      this.$router.push(`course-detail/${data.id}`)
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
  .CourseList {
    header {
      height:60px;
      background:rgba(255,255,255,1);
      p {
        position: relative;
        text-indent: 16px;
        &:before {
          display: block;
          position: absolute;
          content: "";
          width:6px;
          height:20px;
          background:rgba(25,144,255,1);
        }
      }
    }
    .course {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin: 10px;
      width: 318px;
      height: 260px;
      background:rgba(255,255,255,1);
      border-radius:4px;
      border:1px solid rgba(204,204,204,0.5);
      img {
        width: 100%;
        height:140px;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
      }
      i {
        font-size: 14px;
        margin-right: 4px;
      }
    }
  }
</style>
