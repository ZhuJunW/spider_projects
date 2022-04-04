<template>
  <div class="container">
    <div class="banner">
      <img src="@/assets/images/exam.png">
      <div class="done">
        <div>{{ exerciseCount }}</div>
        <div>已做习题(份)</div>
      </div>
      <div class="line"></div>
      <div class="done">
        <div>{{ examCount }}</div>
        <div>已做试卷(份)</div>
      </div>
      <div class="history" @click="$router.push('/home/exercise-history')">
        <span>我的练习记录</span>
        <i class="el-icon-arrow-right"></i>
      </div>
    </div>
    <div class="title">
      <div>习题练习</div>
      <div class="more" @click="$router.push('/home/exercise-list')">查看更多习题 <i class="el-icon-arrow-right"></i></div>
    </div>
    <div class="display-flex jc-space-between">
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
    <div class="title">
      <div>推荐试卷</div>
      <div class="more" @click="$router.push('/home/exam-list')">查看更多试卷 <i class="el-icon-arrow-right"></i></div>
    </div>
    <div class="exam">
      <div v-for="exam in examList" :key="exam.id">
        <img src="@/assets/images/finish.png" class="finish">
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
export default {
  name: 'ExamExercise',
  data () {
    return {
      examList: [],
      exerciseList: [],
      examCount: '',
      exerciseCount: ''
    }
  },
  watch: {
  },
  computed: {
  },
  methods: {
    getbg (index) {
      if (index % 3 === 0) {
        return 'train'
      } else if (index % 3 === 1) {
        return 'train bg2'
      } else {
        return 'train bg3'
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
    // 获取试卷列表
    getExamManageList () {
      this.$api.exam.getExamManageList({ pageNum: 1, pageSize: 8 }).then(res => {
        this.examList = res.list || []
        if (this.examList.length > 4) {
          this.examList.length = 4;
        }
      })
    },
    // 获取习题列表
    getExerciseManageList () {
      this.$api.exercise.getExerciseManageList({ pageNum: 1, pageSize: 9, isAddSubject: 2 }).then(res => {
        this.exerciseList = res.list || []
        if (this.exerciseList.length > 3) {
          this.exerciseList.length = 3;
        }
      })
    },
    // 练习记录数量统计
    getHistoryNum () {
      this.$api.exercise.getHistoryNum().then(res => {
        this.examCount = res.examCount
        this.exerciseCount = res.exerciseCount
      })
    }
  },
  created () {
  },
  mounted () {
    this.getExamManageList()
    this.getExerciseManageList()
    this.getHistoryNum()
  }
}
</script>

<style lang="scss" scoped>

.banner {
  display: flex;
  padding-right: 30px;
  margin-top: 20px;
  align-items: center;
  justify-content: space-between;
  background-color: #FFFFFF;
  height: 90px;
  border-radius: 8px;
  .done{
    width: 150px;
    text-align: center;
    :first-child{
      font-weight: bold;
      color: #333333;
      font-size: 24px;
      margin-bottom: 8px;
    }
    :nth-child(2){
      font-size: 12px;
      color: #666666;
    }
  }
  .line{
    width: 1px;
    height: 40px;
    background-color: #E6E6E6;
  }
  .history {
    width: 126px;
    height: 36px;
    line-height: 36px;
    background: linear-gradient(135deg, #FFC945 0%, #E0A23D 100%);
    border-radius: 18px;
    padding: 0 16px;
    cursor: pointer;
    text-align: center;
    span {
      margin: 0 8px;
      color: #FFFFFF;
      font-size: 14px;
      font-weight: 500;
    }
    i{
      color: #FFFFFF;
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

.bg2{
  background: url("~@/assets/images/bg2.png") no-repeat center center / cover !important;
}
.bg3{
  background: url("~@/assets/images/bg3.png") no-repeat center center / cover !important;
}
.green{
  color: #06C7D1 !important;
}
.blue{
  color: #30C3F6 !important;
}
.train {
  position: relative;
  width: 440px;
  height: 120px;
  background: url("~@/assets/images/bg1.png") no-repeat center center / cover;
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
