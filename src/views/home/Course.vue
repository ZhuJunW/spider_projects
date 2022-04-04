<template>
    <div class="container">
      <div class="total">共{{ total }}个课程</div>
      <div class="display-flex fw-wrap" v-loading="loading">
        <div class="course" v-for="course in courseList" :key="course.id" @click="handleClick(course)">
          <img :src="`${baseURL}/course/cover?coverImageId=${course.coverImageId}&token=${$localStorage.get('token')}`" alt="">
          <div class="course-title">
            <div class="text-overflow" :title="course.title">{{course.title}}</div>
            <div>共{{course.sectionTotal}}个章节 | 共{{course.courseHour}}个小时</div>
          </div>
        </div>
      </div>
      <el-pagination
        hide-on-single-page
        class="float-right mt-10 mb-10"
        @current-change="(val) => {getCourseList(val)}"
        :current-page="courseQuery.pageNum"
        background
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
</template>

<script>
import { baseURL } from '@/utils/Methods'
export default {
  name: 'Course',
  data () {
    return {
      baseURL: baseURL(),
      loading: false,
      courseList: [],
      courseQuery: {
        pageNum: 1,
        pageSize: 10,
        open: 1
      },
      total: null
    }
  },
  watch: {
  },
  computed: {
  },
  methods: {
    handleClick (data) {
      this.$router.push(`course-detail/${data.id}`)
    },
    // 获取课程列表
    getCourseList (pageNum) {
      this.loading = true
      if (pageNum) {
        this.courseQuery.pageNum = pageNum
      }
      this.$api.course.getCourseManageList(this.courseQuery).then(res => {
        this.courseList = res.list || []
        this.total = res.total
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
.total{
  color: #666666;
  font-size: 14px;
  height: 54px;
  line-height: 54px;
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
        width: 100%;
        font-weight: 500;
        color: #333333;
        font-size: 16px;
        margin-bottom: 10px;
      }
    }
  }
</style>
