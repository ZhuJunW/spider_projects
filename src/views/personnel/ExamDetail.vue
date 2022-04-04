<template>
  <div class="exam" :key="$route.path">
    <header>
      <div class="container display-flex ai-center jc-space-between">
        <p class="cursor-pointer" @click="$router.back()"><i class="el-icon-arrow-left"></i> 返回</p>
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
            <el-radio-group class="ml-12" v-model="item.answer" disabled>
              <el-radio class="display-block mb-10 ml-10" v-for="_item in item.option" :key="_item.value" :label="_item.value">{{_item.label}}</el-radio>
            </el-radio-group>
          </template>
          <template v-else-if="item.type === 'multiple'">
            <el-checkbox-group class="ml-12" v-model="item.answer" disabled>
              <el-checkbox class="display-block mb-10 ml-10" v-for="_item in item.option" :key="_item.value" :label="_item.value">{{_item.label}}</el-checkbox>
            </el-checkbox-group>
          </template>
          <template v-else-if="item.type === 'scale'">
            <el-radio-group class="ml-12" v-model="item.answer" disabled>
              <el-radio class="ml-10" v-for="_item in item.option" :key="_item.value" :label="_item.value">{{_item.label}}</el-radio>
            </el-radio-group>
            <p class="fs-14 color-info display-flex ai-center jc-space-between ml-20" style="width: 390px;">
              <span>非常满意</span>
              <span>非常不满意</span>
            </p>
          </template>
          <template v-else>
            <el-input
              disabled
              class="ml-20"
              style="width: 400px;"
              size="mini"
              v-for="(_item, _index) in item.option"
              :key="_index"
              v-model="item.answer"></el-input>
          </template>
          <div class="explain mb-20" v-if="item.form.answerResult !== 0">
            <p>【正确答案】：<span class="color-success">选项{{item.type === 'multiple' ? item.form.answer.join('、') : item.form.answer[0]}}</span></p>
            <p>【答案解析】：<span class="color-info">{{item.form.explain || '--'}}</span></p>
          </div>
        </div>
      </el-scrollbar>
      <div class="right">
        <div class="margin-16">
          <div class="display-flex ai-center jc-space-between">
            <p class="margin-0">考试得分</p>
            <p class="margin-0">
              <span class="fs-24" :class="userScoreState === '2' ? 'color-info' : 'color-success'">{{userScore}}</span>分
            </p>
          </div>
          <el-divider class="mt-16 mb-16"></el-divider>
          <div class="display-flex jc-center ai-center">
            <div class="display-flex ai-center">
              <p class="tip error margin-0"></p>
              <span class="fs-12 color-info ml-10 mr-10">答错</span>
            </div>
            <div class="display-flex ai-center">
              <p class="tip success margin-0"></p>
              <span class="fs-12 color-info ml-10 mr-10">答对</span>
            </div>
            <div class="display-flex ai-center">
              <p class="tip warning margin-0"></p>
              <span class="fs-12 color-info ml-10">半对</span>
            </div>
          </div>
          <div class="list">
            <div
              @click="$refs[`question${index}`][0].scrollIntoView()"
              class="item"
              :class="answerClass(item)"
              v-for="(item, index) in questionList"
              :key="index">{{index + 1}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Exam',
  data () {
    return {
      userScore: '', // 考试得分
      userScoreState: '', // 2不及格 3及格
      examTime: null, // 考试时间转换成时间戳
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
    this.getScoreDetail()
  },
  destroyed () {
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
