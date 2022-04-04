<template>
  <div>
    <el-header class="display-flex ai-center">
      <div @click="$router.back()" class="nav"><i class="el-icon-back"></i>我的练习记录</div>
    </el-header>
    <div class="container">
      <div class="tab">
        <div :class="{active: tabIndex === 0}" @click="activeTab(0)">习题练习</div>
        <div :class="{active: tabIndex === 1}" @click="activeTab(1)">考试</div>
      </div>
      <div v-show="tabIndex === 0">
        <div class="display-flex fw-wrap">
          <div class="exam" v-for="(item, index) in this.historyList" :key="index">
            <div class="rate">
              <div class="category">
                <div>类别：{{ item.specialityName }}</div>
                <div>正确率 {{ item.precision }}</div>
              </div>
              <div style="position: relative;width: 86px;height: 86px">
                <el-progress type="circle" :percentage="parseInt(item.precision)" :width="86" :show-text="false" color="#09BBA1"></el-progress>
                <div class="ratio">
                  <div><span>{{ item.doneCount }}</span>/{{ item.totalCount }}</div>
                  <div>已做/总题</div>
                </div>
              </div>
            </div>
            <div>
              <div class="card">
                <div><span>答题卡</span>（点击题序可查看题目）</div>
                <div>共{{ item.totalCount }}题 <i class="el-icon-caret-bottom fs-14" @click="showAll(item)" v-if="!item.showAll"></i><i class="el-icon-caret-top fs-14" @click="showOne(item)" v-else></i></div>
              </div>
              <div class="display-flex mb-16">
                <div class="display-flex ai-center">
                  <p class="tip warning margin-0"></p>
                  <span class="fs-12 color-info ml-6 mr-20">未做</span>
                </div>
                <div class="display-flex ai-center">
                  <p class="tip success margin-0"></p>
                  <span class="fs-12 color-info ml-6 mr-20">正确</span>
                </div>
                <div class="display-flex ai-center">
                  <p class="tip error margin-0"></p>
                  <span class="fs-12 color-info ml-6 mr-20">错误</span>
                </div>
              </div>
              <div class="list">
                <div :class="getItemColor(item, index)" @click="showExam(item, index)"  v-for="(subItem,index) in item.showNum" :key="index">{{index+1}}</div>
              </div>
              <div class="button" style="width: 100%" @click="$router.push(`/home/exercise?id=${item.exerciseId}`)">重新练习</div>
            </div>
          </div>
        </div>
        <el-pagination
          class="float-right mt-10 mb-10"
          @current-change="(val) => {getHistoryList(val)}"
          :current-page="historyQuery.pageNum"
          :page-size="historyQuery.pageSize"
          background
          layout="total, prev, pager, next, jumper"
          :total="historyRes.total">
        </el-pagination>
      </div>
      <div v-show="tabIndex === 1">
        <div class="display-flex fw-wrap">
          <div class="text" v-for="(item, index) in this.examList" :key="index">
            <div class="score" :style="{color: item.score>=60 ? '#60CA46' : '#FF1517'}">{{ item.score }}<span>分</span></div>
            <div class="name">{{ item.examTitle }}</div>
            <el-tag>{{ item.specialityName }}</el-tag>
            <div class="mb-20">试卷分数：{{ item.totalScore }}｜考试时长：{{ item.examTime }}分钟</div>
            <div class="display-flex">
              <div class="button mr-8" @click="$router.push(`/home/exam?id=${item.examId}`)">重新考试</div>
              <div class="button-plain" @click="$router.push(`/home/exam-detail?id=${item.id}`)">查看试卷</div>
            </div>
          </div>
        </div>
        <el-pagination
          class="float-right mt-10 mb-10"
          @current-change="(val) => {getExamList(val)}"
          :current-page="examQuery.pageNum"
          :page-size="examQuery.pageSize"
          background
          layout="total, prev, pager, next, jumper"
          :total="examRes.total">
        </el-pagination>
      </div>
      <el-dialog
        :title="`第${selectIndex + 1}题`"
        :visible.sync="showDialog"
        width="800px">
        <div class="inner">
          <div class="question">
            <div class="mb-30">{{selectIndex + 1}}、{{selectItem.title}}</div>
            <template v-if="['single', 'trueOrFalse'].includes(selectItem.type)">
              <el-radio-group class="ml-12" v-model="selectItem.selectAnswer" disabled>
                <el-radio class="display-block mb-10 ml-10" v-for="(_item) in selectItem.option" :key="_item.value" :label="_item.value">
                  {{_item.label}}
                  <img src="@/assets/images/right.png" v-if="selectItem.answer==_item.value"><img src="@/assets/images/wrong.png" v-else>
                </el-radio>
              </el-radio-group>
            </template>
            <template v-else-if="selectItem.type === 'multiple'">
              <el-checkbox-group class="ml-12" v-model="selectItem.selectAnswer" disabled>
                <el-checkbox class="display-block mb-10 ml-10" v-for="_item in selectItem.option" :key="_item.value" :label="_item.value">
                  {{_item.label}}
                  <img src="@/assets/images/right.png" v-if="checkMultiAnswer(selectItem.answer, _item.value)"><img src="@/assets/images/wrong.png" v-else>
                </el-checkbox>
              </el-checkbox-group>
            </template>
            <template v-else-if="selectItem.type === 'scale'">
              <el-radio-group class="ml-12" v-model="selectItem.selectAnswer" disabled>
                <el-radio class="ml-10" v-for="_item in selectItem.option" :key="_item.value" :label="_item.value">{{_item.label}}</el-radio>
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
                v-for="(_item, _index) in selectItem.option"
                :key="_index"
                v-model="selectItem.selectAnswer" disabled></el-input>
            </template>
          </div>
          <div class="answer">
            <div class="letter fs-14">正确答案</div>
            <div class="explain">【正确答案】</div>
            <div class="letter">选项 {{getTxtAnswer()}}</div>
            <div class="explain">【题目解析】</div>
            <div>{{selectItem.form.explain || '--'}}</div>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'ExerciseHistory',
  data () {
    return {
      radio: 3,
      showDialog: false,
      tabIndex: 0,
      username: this.$localStorage.get('userInfo').username,
      loading: false,
      searchForm: {
        title: '',
        page: 1,
        limit: 8
      },
      historyList: [],
      historyQuery: {
        pageNum: 1,
        pageSize: 8
      },
      historyRes: {
        total: 0
      },
      examList: [],
      examQuery: {
        pageNum: 1,
        pageSize: 8
      },
      examRes: {
        total: 0
      },
      selectItem: {
        form: {},
        answer: ''
      },
      selectIndex: 0
    }
  },
  watch: {
  },
  computed: {
  },
  methods: {
    getTxtAnswer () {
      if (Array.isArray(this.selectItem.answer)) {
        return this.selectItem.answer.join(',')
      }
      return this.selectItem.answer
    },
    getItemColor (item, i) {
      let className = ''
      if (!item.questionList[i].selectAnswer || item.questionList[i].selectAnswer.length === 0) {
        className = 'item'
      } else if ((Array.isArray(item.questionList[i].selectAnswer) && this.checkAllMultiAnswer(item.questionList[i].answer, item.questionList[i].selectAnswer)) ||
        (!Array.isArray(item.questionList[i].selectAnswer) && item.questionList[i].answer === item.questionList[i].selectAnswer)) {
        className = 'item right'
      } else {
        className = 'item wrong'
      }
      return className
    },
    showAll (item) {
      item.showNum = item.totalCount
      item.showAll = true
    },
    showOne (item) {
      item.showNum = item.totalCount > 8 ? 8 : item.totalCount
      item.showAll = false
    },
    showExam (item, index) {
      this.showDialog = true
      this.selectItem = item.questionList[index]
      this.selectIndex = index
    },
    activeTab (index) {
      this.tabIndex = index
    },
    // 获取习题
    getHistoryList (pageNum) {
      if (pageNum) {
        this.historyQuery.pageNum = pageNum
      }
      this.$api.exercise.exerciseHistoryList(this.historyQuery).then(res => {
        res.list.forEach(item => {
          this.showOne(item)
          item.questionList.forEach(child => {
            if (child.form.answer) {
              child.answer = child.type === 'multiple' ? child.form.answer : child.form.answer[0]
            }
            if (child.form.userAnswer) {
              child.selectAnswer = child.type === 'multiple' ? child.form.userAnswer : child.form.userAnswer[0]
            } else {
              child.selectAnswer = child.type === 'multiple' ? [] : null
            }
          })
        })
        this.historyRes = res
        this.historyList = res.list
      })
    },
    // 获取考试
    getExamList (pageNum) {
      if (pageNum) {
        this.examQuery.pageNum = pageNum
      }
      this.$api.exercise.exerciseExamList(this.examQuery).then(res => {
        this.examList = res.list
        this.examRes = res
      })
    },
    checkMultiAnswer (answer, value) {
      const result = answer.filter(item => {
        return item === value
      })
      if (result && result.length > 0) {
        return true
      }
      return false
    },
    checkAllMultiAnswer (rightAnswer, selectAnswer) {
      rightAnswer = _.cloneDeep(rightAnswer)
      selectAnswer = _.cloneDeep(selectAnswer)
      return _.isEqual(rightAnswer.sort(), selectAnswer.sort())
    }
  },
  created () {
  },
  mounted () {
    this.getHistoryList()
    this.getExamList()
    if (this.$route.query.tab) {
      this.tabIndex = parseInt(this.$route.query.tab)
    }
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
.tab {
  color: #666666;
  line-height: 16px;
  display: flex;
  margin-bottom: 24px;
  div {
    width: 72px;
    height: 62px;
    line-height: 62px;
    text-align: center;
    cursor: pointer;
    margin-right: 60px;
  }

  div:last-child {
    border: none;
  }

  .active {
    color: #333333;
    font-size: 18px;
    font-weight: 500;
    position: relative;
    &:after {
      content: ' ';
      position: absolute;
      width: 48px;
      height: 6px;
      bottom: 0;
      left: 12px;
      margin: 0 auto;
      background: #09BBA1;
      border-radius: 3px;
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
}
.exam{
  width: 280px;
  background: #FFFFFF;
  margin: 0 20px 20px 0;
  padding: 0 20px 20px 20px;
  border-radius: 6px;
  .rate{
    height: 123px;
    border-bottom: 1px dashed #DFDFDF;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;
    .category{
      color: #999999;
      font-size: 14px;
      :first-child{
        font-weight: 600;
        color: #333333;
        font-size: 18px;
        margin-bottom: 16px;
      }
    }
    .ratio{
      position: absolute;
      width: 60px;
      text-align: center;
      left:50% ;
      top:50%;
      transform:translate(-50%,-50%);
      color: #999999;
      font-size: 12px;
      span{
        font-weight: 500;
        color: #09BBA1;
        font-size: 20px;
      }
    }
  }
  .card{
    display: flex;
    justify-content: space-between;
    color: #666666;
    font-size: 12px;
    margin-bottom:18px;
    :first-child{
      color: #333333;
      span{
        font-weight: 600;
        font-size: 14px;
      }
    }
    i{
      cursor: pointer;
    }
  }
  .tip {
    width: 12px;
    height: 12px;
    border-radius: 2px;
  }
  .error {
    background: #FF1517 ;
  }
  .success {
    background: #60CA46;
  }
  .warning {
    background: #CCCCCC;
  }
  .list {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 12px;
    .item {
      background-color: #CCCCCC;
      cursor: pointer;
      color: #FFFFFF;
      width:28px;
      height:28px;
      border-radius:4px;
      margin: 0 8px 8px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      &:nth-child(8n){
        margin: 0 0 8px 0;
      }
    }
  }
}
.text {
  padding: 20px;
  text-align: center;
  color: #999999;
  font-size: 14px;
  width: 280px;
  height: 188px;
  background: #FFFFFF;
  border-radius: 6px;
  margin: 0 20px 20px 0;
  .score{
    font-weight: bold;
    font-size: 36px;
    margin-bottom: 10px;
    span{
      font-size: 12px;
      color: #999999;
      font-weight: 400;
    }
  }
  .el-tag{
    height: 22px;
    line-height: 20px;
    margin-bottom: 12px;
  }
  .name {
    font-weight: 600;
    color: #333333;
    font-size: 16px;
    margin-bottom: 10px;
  }
}
.button {
  cursor: pointer;
  width: 136px;
  height: 36px;
  line-height: 36px;
  background: #3BBBA1;
  border-radius: 8px;
  color: #FFFFFF;
  text-align: center;
  font-size: 14px;
}
.button-plain{
  cursor: pointer;
  width: 136px;
  height: 36px;
  line-height: 36px;
  border-radius: 8px;
  border: 1px solid #3BBBA1;
  color: #3BBBA1;
  text-align: center;
  font-size: 14px;
}
.button:hover,.button-plain:hover{
  background: #48D1CC;
  border-color: #48D1CC;
  color: #fff;
}
/deep/.el-dialog__body{
  padding-top:2px;
}
.inner{
  width: 761px;
  border-radius: 8px;
  border: 1px solid #DDDDDD;
  .question{
    padding: 24px;
    border-bottom: 1px solid #DDDDDD;
    div{
      color: #333333;
      font-size: 16px;
    }
    .el-radio,.el-checkbox{
      display: block;
      margin-bottom: 10px;
      img{
        margin-left: 38px;
      }
    }
  }
  .answer{
    padding:16px 20px 20px;
    color: #666666;
    font-size: 16px;
    .letter{
      margin-bottom: 20px;
      font-weight: 500;
      color: #333333;
    }
    .explain{
      font-weight: 500;
      color: #09BBA1;
      font-size: 14px;
      margin-bottom: 12px;
      margin-left: -6px;
    }
  }
}
/deep/ .is-checked .el-radio__label{
  color: #333333 ;
}
/deep/ .el-radio__input.is-checked .el-radio__inner {
  border-color: #09BBA1;
  background: #09BBA1;
}
.right{
  background-color: #60CA46 !important;
}
.wrong{
  background-color: #FF1517 !important;
}
</style>
