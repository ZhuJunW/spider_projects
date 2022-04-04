<template>
    <el-container>
      <el-aside width="180px">
        <div class="subject">题目</div>
        <div class="fs-12 color-gray" style="margin: 16px"></div>
        <div class="list">
          <div class="item" v-for="(item,index) in exerciseInfo.questionList" :key="index"  @click="clickQuestion(item,index)">{{index+1}}</div>
        </div>
      </el-aside>
      <div class="content">
        <div class="title">
          <div>
            <div class="fs-18 color-black mb-16">{{ exerciseInfo.title }}</div>
            <span class="fs-12">共{{ exerciseInfo.questionCount }}道习题</span>
            <span class="fs-12 ml-20 pl-20">所属类别：{{ exerciseInfo.specialityName }}</span>
          </div>
          <div>
            <el-button type="info" size="mini" @click="$router.back()">取消</el-button>
            <el-button type="success" size="mini" @click="confirm">确定</el-button>
          </div>
        </div>
        <div class="question" v-for="(item,index) in exerciseList" :key="item.id" @click="selectItem(item.id)" :class="{active: item.id == selectedId}" :ref="`question${index}`">
            <div class="btnGroup">
              <span @click="up(index)">上移</span><span @click="down(index)">下移</span><span @click="deleteQuestion(item.id) ">删除</span>
            </div>
            <div class="mb-20 fs-16 color-black" >{{index+1}}. {{item.title}}</div>
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
    </el-container>
</template>

<script>
export default {
  name: 'Basket',
  data () {
    return {
      exerciseList: [],
      exerciseInfo: [],
      selectedId: null
    }
  },
  created () {

  },
  mounted () {
    this.getExerciseInfo()
  },
  watch: {},
  filters: {},
  computed: {},
  methods: {
    clickQuestion (item, index) {
      this.$refs[`question${index}`][0].scrollIntoView()
      this.selectedId = item.id
    },
    selectItem (id) {
      this.selectedId = id
    },
    up (index) {
      if (index === 0) return
      const temp = this.exerciseList[index];
      this.$set(this.exerciseList, index, this.exerciseList[index - 1])
      this.$set(this.exerciseList, index - 1, temp)
    },
    down (index) {
      if (index === this.exerciseList.length - 1) return
      const temp = this.exerciseList[index];
      this.$set(this.exerciseList, index, this.exerciseList[index + 1])
      this.$set(this.exerciseList, index + 1, temp)
    },
    deleteQuestion (id) {
      this.$api.exercise.deleteQuestion({ exerciseId: this.$route.query.id, examQuestionId: id }).then(res => {
        this.$message.success('删除成功')
        this.getExerciseInfo()
      })
    },
    getExerciseInfo () {
      this.$api.exercise.getExerciseInfo({ id: this.$route.query.id }).then(res => {
        this.exerciseInfo = res
        this.exerciseList = res.questionList.map(item => {
          return {
            ...item,
            answer: item.type === 'multiple' ? item.form.answer : item.form.answer[0]
          }
        })
      })
    },
    confirm () {
      this.exerciseInfo.questionList = this.exerciseList
      this.$api.exercise.questionSave(this.exerciseInfo).then(res => {
        this.$message.success('提交成功')
        this.$router.back()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-aside{
  background-color: #fff;
  border-radius: 4px;
  margin-right: 20px;
  .subject{
    height: 48px;
    line-height: 48px;
    text-align: center;
    color: #1990FF;
    font-size: 14px;
    border-bottom: 1px solid #EBEBEB;
  }
  .list {
    display: flex;
    flex-wrap: wrap;
    padding: 0 16px;
    .item {
      border: 1px solid #DDDDDD;
      cursor: pointer;
      color: #666666;
      font-size: 14px;
      width:28px;
      height:28px;
      border-radius:4px;
      margin: 0 8px 8px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      &:nth-child(4n){
        margin: 0 0 8px 0;
      }
    }
  }
}
.content{
  width: 100%;
  background-color: #FFFFFF;
  padding: 20px;
  .title {
    border-bottom: 2px solid #54A4F4;
    padding-bottom: 20px;
    color: #666666;
    margin-bottom: 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .question{
    position: relative;
    margin: 0 0 20px 20px;
    padding: 10px 10px 0 10px;
    cursor: pointer;
    border: 1px solid transparent;
  }
}
  .btnGroup {
    position: absolute;
    right: 0;
    margin-top: -44px;
    display: none;
    background: #1990FF;
    border-radius: 4px 4px 0px 0px;
    color: #FFFFFF;
    font-size: 12px;
    text-align: center;
    padding: 0 10px;
    span{
      padding: 10px;
      display: inline-block;
    }
  }
  .active {
    border: 1px solid #BADBF9  !important;
    .btnGroup {
      display: block;
    }
  }
</style>
