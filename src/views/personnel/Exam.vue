<template>
  <div class="exam" :key="$route.path">
    <header>
      <div class="container display-flex ai-center jc-space-between">
          <div class="display-flex">
            <p class="color-info mr-14">考试剩余时长</p>
            <div class="time-group display-flex ai-center">
              <div class="timeout display-flex ai-center jc-center color-danger">
                <p>{{timeout[0]}}</p>
              </div>
              <p class="ml-4 mr-4 color-info">:</p>
              <div class="timeout display-flex ai-center jc-center color-danger">
                <p>{{timeout[1]}}</p>
              </div>
              <p class="ml-4 mr-4 color-info">:</p>
              <div class="timeout display-flex ai-center jc-center color-danger">
                <p>{{timeout[2]}}</p>
              </div>
            </div>
          </div>
          <el-button type="primary" @click="submit">提交</el-button>
      </div>
    </header>
    <div class="main scrollbar">
      <el-scrollbar class="content">
        <div class="title">
          <p class="fs-18">{{title}}</p>
          <span class="fs-16 color-info">试卷分数：{{score}}</span>
          <span class="fs-16 color-info ml-20 pl-20">考试时长：{{time}}分钟</span>
        </div>
        <div v-for="(item, index) in questionList" :key="index" class="question-list" :ref="`question${index}`">
          <p class="mt-20">{{index + 1}}、{{item.title}}</p>
          <template v-if="['single', 'trueOrFalse'].includes(item.type)">
            <el-radio-group class="ml-12" v-model="item.answer">
              <el-radio class="display-block mb-10 ml-10" v-for="_item in item.option" :key="_item.value" :label="_item.value">{{_item.label}}</el-radio>
            </el-radio-group>
          </template>
          <template v-else-if="item.type === 'multiple'">
            <el-checkbox-group class="ml-12" v-model="item.answer">
              <el-checkbox class="display-block mb-10 ml-10" v-for="_item in item.option" :key="_item.value" :label="_item.value">{{_item.label}}</el-checkbox>
            </el-checkbox-group>
          </template>
          <template v-else-if="item.type === 'scale'">
            <el-radio-group class="ml-12" v-model="item.answer">
              <el-radio class="ml-10" v-for="_item in item.option" :key="_item.value" :label="_item.value">{{_item.label}}</el-radio>
            </el-radio-group>
            <p class="fs-14 color-info display-flex ai-center jc-space-between ml-20" style="width: 390px;">
              <span>非常满意</span>
              <span>非常不满意</span>
            </p>
          </template>
          <template v-else>
            <el-input
              class="ml-20"
              style="width: 400px;"
              size="mini"
              v-for="(_item, _index) in item.option"
              :key="_index"
              v-model="item.answer"></el-input>
          </template>
        </div>
      </el-scrollbar>
    </div>
    <el-dialog
      width="500px"
      :close-on-press-escape="false"
      :show-close="false"
      :visible.sync="dialogOvertime">
      <div class="display-flex ai-center fd-column">
        <el-image src="https://osha.asdsafe.cn/wechat/image/cry.png"></el-image>
        <p class="fs-16">考试时间已超时，请重做试卷</p>
        <el-button type="primary" class="width-percent-80" round @click="window.location.reload()">重做试卷</el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="500px"
      :close-on-press-escape="false"
      :show-close="false"
      :visible.sync="dialogScoreDetail">
      <div class="display-flex ai-center fd-column">
        <el-image :src="userScoreState === '2' ? 'https://osha.asdsafe.cn/wechat/image/cry.png' : 'https://osha.asdsafe.cn/wechat/image/smile.png'"></el-image>
        <p class="fs-16">{{userScoreState === '2' ? '很可惜' : '恭喜你'}}，你此次得分为</p>
        <span class=" mb-20 fs-32" :class="userScoreState === '2' ? 'color-error' : 'color-success'">{{userScore}}</span>
        <el-button type="success" class="width-percent-80" round @click="$router.replace(`/personnel/exam-detail/${$route.params.id}`)">查看得分详情</el-button>
        <el-button type="primary" class="width-percent-80 mt-20 ml-0" round @click="window.location.reload()">重做试卷</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Exam',
  data () {
    return {
      window,
      userExamId: null,
      dialogOvertime: false, // 超时警告
      dialogScoreDetail: false, // 得分详情
      userScore: '', // 考试得分
      userScoreState: '', // 2不及格 3及格
      setInterval: null, // 定时器实例
      timeout: [], // 显示的倒计时
      examTime: null, // 考试时间转换成时间戳
      differenceTime: null, // 时间差
      questionList: [], // 题目
      title: '', // 考试名称
      time: '', // 考试时间
      score: ''// 考试总分
    }
  },
  watch: {},
  computed: {},
  methods: {
    answerClass (item) {
      switch (item.form.answerResult) {
        case 0:
          return 'success'
        case 1:
          return 'warning'
        case 2:
          return 'error'
      }
    },
    // 提交
    submit () {
      clearInterval(this.setInterval)
      // 找到没填的
      let isSubmit = true
      for (let i = 0; i < this.questionList.length; i++) {
        if (!this.questionList[i].answer.length) {
          this.$refs[`question${i}`][0].style.border = '1px solid red'
          this.$refs[`question${i}`][0].style.borderRadius = '4px'
          this.$refs[`question${i}`][0].scrollIntoView()
          this.$message.warning(`请完成第${i + 1}题`)
          setTimeout(() => {
            this.$refs[`question${i}`][0].style.border = 'none'
            this.$refs[`question${i}`][0].style.borderRadius = '0'
          }, 1000)
          isSubmit = false
          return
        }
      }
      if (isSubmit) {
        const data = {
          userExamId: this.userExamId,
          option: this.questionList.map(item => {
            return {
              questionId: item.id,
              answer: typeof item.answer === 'object' ? item.answer : [item.answer]
            }
          })
        }
        this.$api.exam.submitExam(data).then(res => {
          this.dialogScoreDetail = true
          this.userScore = res.score
          this.userScoreState = res.status
        })
      } else {
        this.$message.warning('请完成所有题目')
      }
    },
    // 计时
    countDown () {
      this.differenceTime = this.examTime - this.$moment().unix()
      this.timeout = [
        Math.floor(this.differenceTime / 60 / 60 % 24),
        Math.floor(this.differenceTime / 60 % 60),
        Math.floor(this.differenceTime % 60)
      ]
    },
    // 获取题目
    getUserExamDetail () {
      this.$api.exam.getUserExamDetail({ CourseId: this.$route.params.id }).then(res => {
        this.userExamId = res.userExamId
        this.time = res.examTime
        this.title = res.title
        this.score = res.score
        this.questionList = res.questionList.map(item => {
          return {
            ...item,
            option: item.option.map(_item => {
              return {
                ..._item,
                value: _item.value ? String(_item.value) : ''
              }
            }),
            answer: []
          }
        })
        this.examTime = this.$moment().add(this.time, 'minutes').unix()
        this.countDown()
        this.setInterval = setInterval(() => {
          if (this.differenceTime > 0) {
            this.countDown()
          } else {
            this.dialogOvertime = true
            clearInterval(this.setInterval)
          }
        }, 1000)
      })
    },
    // 查看得分详情
    getScoreDetail () {
      this.$api.exam.getScoreDetail({ CourseId: this.$route.params.id }).then(res => {
        this.userScore = res.userCourseScore
        this.userScoreState = res.userCourseScoreResult
        this.time = res.examTime
        this.title = res.title
        this.score = res.score
        this.questionList = res.questionList.map(item => {
          return {
            ...item,
            option: item.option.map(_item => {
              return {
                ..._item,
                value: String(_item.value)
              }
            }),
            answer: item.type === 'multiple' ? item.form.userAnswer : item.form.userAnswer[0]
          }
        })
      })
    }
  },
  created () {

  },
  mounted () {
    if (this.$route.path.includes('/exam/')) {
      this.getUserExamDetail()
    } else {
      this.getScoreDetail()
    }
  },
  destroyed () {
    clearInterval(this.setInterval)
  }
}
</script>

<style lang="scss" scoped>
  .exam {
    header {
      height:60px;
      background:rgba(235,235,235,1);
      .timeout {
        width:32px;
        height:32px;
        background:rgba(255,255,255,1);
        border-radius:2px;
        border:1px solid rgba(204,204,204,1);
      }
    }
    .main {
      width: 1360px;
      margin: 14px auto;
      display: flex;
      justify-content: space-between;
      .content {
        width: 100%;
        margin-right: 14px;
        height: calc(100vh - 130px);
        background:rgba(255,255,255,1);
        .title {
          margin: 20px 40px;
          border-bottom: 2px solid #54A4F4;
          padding-bottom: 20px;
        }
        .question-list {
          margin: 0 40px;
        }
        .explain {
          border: 1px solid #D9D9D9;
          padding: 0 10px;
          span {
            line-height: 1.5;
          }
        }
      }
      .right {
        width:260px;
        background:rgba(255,255,255,1);
        .tip {
          width: 12px;
          height: 12px;
          border-radius: 2px;
        }
        .error {
          background: #FB7E7E;
        }
        .success {
          background: #66CC5A;
        }
        .warning {
          background: linear-gradient(to bottom right, #66CC5A , #C7F1C2);
        }
        .list {
          display: flex;
          flex-wrap: wrap;
          margin-top: 10px;
          .item {
            cursor: pointer;
            color: #ffffff;
            width:32px;
            height:32px;
            border-radius:2px;
            margin: 2px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }
  }
</style>
