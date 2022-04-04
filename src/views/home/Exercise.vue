<template>
  <div>
    <el-header class="display-flex ai-center">
      <div @click="$router.back()" class="nav"><i class="el-icon-back"></i>习题练习</div>
    </el-header>
    <div class="container">
      <div class="top">
        <div>习题类别：{{ exerciseInfo.specialityName }}</div>
        <el-button type="green" icon="el-icon-check" @click="submit">提交</el-button>
      </div>
      <el-container>
        <el-aside width="224px">
            <div class="card">
              题序（共{{ exerciseInfo.questionCount }}道题）
            </div>
            <div class="display-flex mb-16">
              <div class="display-flex ai-center">
                <p class="tip warning margin-0"></p>
                <span class="fs-12 color-info ml-6 mr-18">未做</span>
              </div>
              <div class="display-flex ai-center">
                <p class="tip success margin-0"></p>
                <span class="fs-12 color-info ml-6 mr-18">正确</span>
              </div>
              <div class="display-flex ai-center">
                <p class="tip error margin-0"></p>
                <span class="fs-12 color-info ml-6 mr-18">错误</span>
              </div>
            </div>
            <div class="list">
              <div :class="getItemColor(index)" v-for="(item,index) in exerciseInfo.questionCount" :key="index" @click="chooseQuestion(index)">
                {{index+1}}
              </div>
            </div>
        </el-aside>
        <el-main>
          <div v-if="exerciseInfo.questionCount>0">
            <div class="num">第{{index+1}}题</div>
            <div class="inner">
              <div class="question">
                <div class="mb-30">{{index+1}}. {{item.title}}</div>
                <template v-if="['single', 'trueOrFalse'].includes(item.type)">
                  <el-radio-group class="ml-12" v-model="item.selectAnswer">
                    <el-radio class="display-block mb-10 ml-10" v-for="(_item) in item.option" :key="_item.value" :label="_item.value">
                      {{_item.label}}
                      <template v-if="item.selectAnswer != null"><img src="@/assets/images/right.png" v-if="item.answer==_item.value"><img src="@/assets/images/wrong.png" v-else></template>
                    </el-radio>
                  </el-radio-group>
                </template>
                <template v-else-if="item.type === 'multiple'">
                  <el-checkbox-group class="ml-12" v-model="item.selectAnswer">
                    <el-checkbox class="display-block mb-10 ml-10" v-for="_item in item.option" :key="_item.value" :label="_item.value">
                      {{_item.label}}
                      <template v-if="item.selectAnswer.length > 0"><img src="@/assets/images/right.png" v-if="checkMultiAnswer(item.answer, _item.value)"><img src="@/assets/images/wrong.png" v-else></template>
                    </el-checkbox>
                  </el-checkbox-group>
                </template>
                <template v-else-if="item.type === 'scale'">
                  <el-radio-group class="ml-12" v-model="item.selectAnswer">
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
                    v-model="item.selectAnswer"></el-input>
                </template>
              </div>
              <div class="answer">
                <div class="letter fs-14 display-flex ai-center jc-space-between">
                  <div @click="item.showAnswer = !item.showAnswer" style="cursor: pointer">正确答案</div>
                  <div>
                    <el-button icon="el-icon-back" class="green" size="mini" @click="prev">上一题</el-button>
                    <el-button icon="el-icon-right" class="green" size="mini" @click="next">下一题</el-button>
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
          <div v-else class="none">暂无习题</div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'Exercise',
  data () {
    return {
      exerciseList: [],
      exerciseInfo: [],
      index: 0,
      item: {}
    }
  },
  components: {
  },
  watch: {},
  computed: {},
  methods: {
    getItemColor (i) {
      let className = ''
      if (!this.exerciseList[i].selectAnswer || this.exerciseList[i].selectAnswer.length === 0) {
        className = 'item'
      } else if ((Array.isArray(this.exerciseList[i].selectAnswer) && this.checkAllMultiAnswer(this.exerciseList[i].answer, this.exerciseList[i].selectAnswer)) ||
        (!Array.isArray(this.exerciseList[i].selectAnswer) && this.exerciseList[i].answer === this.exerciseList[i].selectAnswer)) {
        className = 'item right'
      } else {
        className = 'item wrong'
      }
      if (this.index === i) {
        className += ' active'
      }
      return className
    },
    submit () {
      for (let i = 0; i < this.exerciseList.length; i++) {
        if ((Array.isArray(this.exerciseList[i].selectAnswer) && !this.exerciseList[i].selectAnswer.length) ||
          (!Array.isArray(this.exerciseList[i].selectAnswer) && !this.exerciseList[i].selectAnswer)) {
          this.$message.warning(`请完成第${i + 1}题`)
          return
        }
      }
      const data = { exerciseId: this.exerciseInfo.id }
      data.option = this.exerciseList.map(item => {
        return {
          answer: Array.isArray(item.selectAnswer) ? item.selectAnswer : [item.selectAnswer],
          questionId: item.id
        }
      })
      this.$api.exercise.exerciseSubmit(data).then(res => {
        this.$message.success('提交成功')
        this.$router.back()
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
    },
    chooseQuestion (index) {
      this.index = index
      this.item = this.exerciseList[this.index]
    },
    prev () {
      if (this.index === 0) {
        return this.$message.warning('已经是第一题了')
      }
      this.index--
      this.item = this.exerciseList[this.index]
    },
    next () {
      if (this.index === this.exerciseList.length - 1) {
        return this.$message.warning('已经是最后一题了')
      }
      this.index++
      this.item = this.exerciseList[this.index]
    }
  },
  created () {
  },
  mounted () {
    const data = { id: this.$route.query.id }
    this.$api.exercise.getExerciseInfo(data).then(res => {
      this.exerciseInfo = res
      this.exerciseList = res.questionList.map(item => {
        return {
          ...item,
          answer: item.type === 'multiple' ? item.form.answer : item.form.answer[0],
          showAnswer: false,
          selectAnswer: item.type === 'multiple' ? [] : null
        }
      })
      this.item = this.exerciseList[0]
    })
  }
}
</script>

<style lang="scss" scoped>
.green{
  border-color: #3BBBA1 ;
  color: #3BBBA1 ;
}
.right{
  background-color: #60CA46 !important;
}
.wrong{
  background-color: #FF1517 !important;
}
.active{
  border: 1px solid #09BBA1!important;
}
.none{
 text-align: center;
  height: 80px;
  line-height: 80px;
  color: #909399;
  font-size: 18px;
  font-weight: 500;
  margin-top: 20px;
}
.top{
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 68px;
  font-weight: 600;
  color: #333333;
  font-size: 20px;
  .el-button--green{
    background-color: #09BBA1;
    color: #FFFFFF;
    &:hover{
      background: #48D1CC;
      border-color: #48D1CC;
    }
  }
}
.el-header{
  background-color: #FFFFFF;
  border-top:1px solid #E6E6E6 ;
  div{
    width: 1360px;
    margin: 0 auto;
  }
}
.el-aside{
  background: #FFFFFF;
  border-radius: 8px;
  margin-right: 20px;
  padding: 20px;
  .card{
    font-weight: 500;
    color: #333333;
    font-size: 14px;
    margin-bottom:20px;
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
    margin-bottom: 20px;
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
      &:nth-child(5n){
        margin: 0 0 8px 0;
      }
    }
  }
}
.el-main{
  width: 1100px;
  background: #FFFFFF;
  border-radius: 8px;
  padding: 0 20px 20px 20px;
  .num{
    text-align: center;
    height: 48px;
    line-height: 48px;
    font-weight: 600;
    color: #333333;
    font-size: 16px;
  }
  .inner{
    width: 100%;
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
          vertical-align: bottom;
        }
      }
    }
    .answer{
      padding: 20px;
      color: #666666;
      font-size: 16px;
      .letter{
        font-weight: 500;
        color: #333333;
      }
      .explain{
        font-weight: 500;
        color: #09BBA1;
        font-size: 14px;
        margin:12px 0 10px -6px ;
      }
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
</style>
