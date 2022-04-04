<template>
  <div>
    <el-header class="display-flex ai-center">
      <div @click="$router.back()" class="nav"><i class="el-icon-back"></i>全部习题</div>
    </el-header>
    <div class="container">
      <div class="display-flex fw-wrap">
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
      <el-pagination
        hide-on-single-page
        class="float-right mt-10 mb-10"
        @current-change="(val) => {getExerciseManageList(val)}"
        :current-page="exerciseQuery.pageNum"
        background
        layout="total, prev, pager, next, jumper"
        :total="exerciseRes.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExerciseList',
  data () {
    return {
      exerciseList: [],
      exerciseQuery: {
        pageNum: 1,
        pageSize: 9,
        isAddSubject: 2
      },
      exerciseRes: {
        total: 0
      }
    }
  },
  watch: {
  },
  computed: {
  },
  methods: {
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
    getExerciseManageList () {
      this.$api.exercise.getExerciseManageList(this.exerciseQuery).then(res => {
        this.exerciseList = res.list || []
        this.exerciseRes = res
      })
    }
  },
  created () {
  },
  mounted () {
    this.getExerciseManageList()
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
</style>
