<template>
  <div>
    <el-header class="display-flex ai-center">
      <div @click="$router.back()" class="nav"><i class="el-icon-back"></i>全部试卷</div>
    </el-header>
    <div class="container">
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
      <el-pagination
        hide-on-single-page
        class="float-right mt-10 mb-10"
        @current-change="(val) => {getExamManageList(val)}"
        :current-page="examQuery.pageNum"
        background
        layout="total, prev, pager, next, jumper"
        :total="examRes.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExamList',
  data () {
    return {
      examList: [],
      examQuery: {
        pageNum: 1,
        pageSize: 8
      },
      examRes: {
        total: 0
      }
    }
  },
  watch: {
  },
  computed: {
  },
  methods: {
    // 获取试卷列表
    getExamManageList (pageNum) {
      if (pageNum) {
        this.examQuery.pageNum = pageNum
      }
      this.$api.exam.getExamManageList(this.examQuery).then(res => {
        this.examList = res.list || []
        this.examRes = res
      })
    }
  },
  created () {
  },
  mounted () {
    this.getExamManageList()
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
