<template>
  <div>
    <div class="examination">
      <h5 class="fs-16 margin-0">创建习题练习</h5>
      <div class="display-flex ai-center cursor-pointer" @click="$router.push(`/admin/basket/?id=${$route.query.id}`)">
        <img src="@/assets/images/basket.png">
        <span class="fs-14 ml-8 color-black">试题篮</span>
      </div>
    </div>
    <el-container>
      <el-aside width="180px">
        <el-input placeholder="请输入关键词搜索"  clearable v-model="examQuery.fuzzy" @input="getTableData()"></el-input>
        <div class="fs-12 color-gray" style="margin: 20px 0 12px 20px">选择试卷</div>
        <div class="exam-title" v-for="item in examOptions" :key="item.id" @click="getExamList(item.id)" :class="{itemActive: item.id === selectedId}">{{item.title}}</div>
        <el-pagination
          hide-on-single-page
          class="mt-16 ml-16"
          @current-change="(val) => {getTableData(val)}"
          :current-page="examQuery.pageNum"
          background
          layout="total, prev, next"
          :total="examRes.total">
        </el-pagination>
      </el-aside>
      <div style="width: 100%">
        <div v-if="examList.length==0" class="none">暂无题目</div>
        <div class="exam" v-for="(item,index) in examList" :key="index" v-else>
          <div class="question">
            <div>
              <div class="fs-16 color-black mb-16">
                {{index+1}}. {{item.title}}
              </div>
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
            </div>
          </div>
          <div class="padding-20 fs-14 color-black">
            <div class="answer">
              <div class="color-gray">{{ item.typeName }}  ｜  分数：{{item.form.score}}分</div>
              <div class="display-flex ai-center">
                <div @click="item.showAnswer = !item.showAnswer" style="cursor: pointer;margin-right: 20px">正确答案</div>
                <el-button type="primary" size="mini" v-if="item.inBasket==0" @click="saveQuestion(item.id)">加入试题篮</el-button>
                <el-button type="info" size="mini" v-else @click="deleteQuestion(item.id)">移出试题篮</el-button>
              </div>
            </div>
            <div v-if="item.showAnswer">
              <div class="explain">【正确答案】</div>
              <div class="letter">选项 {{item.type === 'multiple' ? item.form.answer.join('，') : item.form.answer[0]}}</div>
              <div class="explain">【题目解析】</div>
              <div>{{item.form.explain || '--'}}</div>
            </div>
          </div>
        </div>
      </div>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'QuestionManage',
  data () {
    return {
      examOptions: [],
      examList: [],
      examQuery: {
        pageNum: 1,
        pageSize: 10,
        fuzzy: null
      },
      examRes: {
        total: 0
      },
      selectedId: null
    }
  },
  created () {

  },
  mounted () {
    this.getTableData()
  },
  watch: {},
  filters: {},
  computed: {},
  methods: {
    saveQuestion (examQuestionId) {
      this.$api.exercise.saveQuestion({ exerciseId: this.$route.query.id, examQuestionId: examQuestionId }).then(res => {
        this.$message.success('加入成功')
        this.getExamList(this.selectedId)
      })
    },
    deleteQuestion (examQuestionId) {
      this.$api.exercise.deleteQuestion({ exerciseId: this.$route.query.id, examQuestionId: examQuestionId }).then(res => {
        this.$message.success('移出成功')
        this.getExamList(this.selectedId)
      })
    },
    // 获取试卷列表
    getTableData (pageNum) {
      if (pageNum) {
        this.examQuery.pageNum = pageNum
      }
      this.$api.exam.getExamManageList(this.examQuery).then(res => {
        this.examOptions = res.list || []
        this.examRes = res
        if (this.examOptions.length > 0) {
          this.getExamList(this.examOptions[0].id)
        }
      })
    },
    // 根据试卷id，获取相关题目
    getExamList (examId) {
      this.selectedId = examId
      this.$api.exercise.getExamList({ exerciseId: this.$route.query.id, examId: examId }).then(res => {
        this.examList = res.map(item => {
          return {
            ...item,
            answer: item.type === 'multiple' ? item.form.answer : item.form.answer[0],
            showAnswer: false
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.none{
  text-align: center;
  height: 200px;
  line-height: 200px;
  color: #666666;
}
.itemActive{
  background-color: #EDF6FF;
  font-weight: 500;
  color: #1990FF !important;
}
  .examination {
    border-radius: 4px;
    background-color: #fff;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .el-aside{
    background-color: #fff;
    border-radius: 4px;
    margin-right: 20px;
    .exam-title{
      height: 38px;
      line-height: 38px;
      color: #666666;
      font-size: 14px;
      padding-left: 20px;
      cursor: pointer;
      &:hover{
        background-color: #EDF6FF ;
        font-weight: 500;
        color: #1990FF;
      }
    }
  }
  .exam{
    background-color: #FFFFFF;
    border-radius: 4px;
    margin-bottom: 16px;
    .question{
      padding: 20px 20px 8px;
      border-bottom: 1px solid #E6E6E6;
      .el-radio-group{
        display: block;
        margin-bottom: 12px;
      }
    }
    .answer{
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #1990FF;
    }
    .letter{
      font-weight: 500;
      color: #333333;
    }
    .explain{
      font-weight: 500;
      color: #1990FF;
      font-size: 14px;
      margin:16px 0 10px -6px ;
    }
  }
</style>
