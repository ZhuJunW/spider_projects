<template>
  <div class="main">
    <header>
      <h5 class="fs-16 mb-20 mt-0">{{$route.name}} — 试卷基本信息</h5>
    </header>
    <el-form class="mt-20 width-percent-50" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px">
      <el-form-item label="试卷标题" prop="title">
        <el-input placeholder="请输入试卷标题" v-model="ruleForm.title"></el-input>
      </el-form-item>
     <el-form-item label="专业类别" prop="courseProfessional">
        <el-select class="width-percent-100" v-model="ruleForm.courseProfessional" placeholder="请选择专业类别">
          <el-option v-for="item in courseProfessionalOption"
          :key="item.id"
          :label="item.name"
          :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="考试时长" prop="time">
        <el-input
          maxlength="3"
          @input="checkNum"
          placeholder="请输入考试时长"
          v-model="ruleForm.time">
          <span slot="suffix">分钟</span>
        </el-input>
      </el-form-item>
<!--      <el-form-item label="是否可以重复考试" prop="repeated">-->
<!--        <el-switch-->
<!--          v-model="ruleForm.repeated"></el-switch>-->
<!--      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data () {
    return {
      ruleForm: {
        title: '',
        courseProfessional: null,
        time: '',
        repeated: true
      },
      rules: {
        title: [
          { required: true, message: '请输入试卷标题', trigger: 'change' }
        ],
        courseProfessional: [
          { required: true, message: '请选择专业类别', trigger: 'change' }
        ],
        time: [
          { required: true, message: '考试时长', trigger: 'change' }
        ]
      },
      courseProfessionalOption: [
      ]
    }
  },
  watch: {},
  computed: {},
  methods: {
    /**
     * 限制只能输入正整数
     * @param num
     */
    checkNum (num) {
      if (num) {
        this.ruleForm.time = num.replace(/[^0-9]/g, '')
      }
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.$route.params.id) {
            // 调用修改接口

            const data = {
              id: this.$route.params.id,
              duration: this.ruleForm.time,
              repeatable: this.ruleForm.repeated, // 数据格式准换
              specialityId: this.ruleForm.courseProfessional,
              title: this.ruleForm.title
            }
            this.$api.exam.updateExam(data).then(res => {
              this.$message.success('编辑成功')
              this.$router.back()
            })
          } else {
            // 调用add接口
            const data = {
              duration: this.ruleForm.time,
              repeatable: this.ruleForm.repeated,
              specialityId: this.ruleForm.courseProfessional,
              title: this.ruleForm.title
            }
            this.$api.exam.createExam(data).then(res => {
              this.$message.success('新增成功')
              this.$router.push(`question-manage?id=${res}`)
            })
          }
        }
      });
    },
    // 获取课程专业类别
    getCourseProfessional () {
      this.$api.course.getProfessional().then(res => {
        this.courseProfessionalOption = res;
      })
    }
  },
  created () {

  },
  mounted () {
    // 获取课程专业
    this.getCourseProfessional();
    // 在编辑时  根据id获取试卷基本信息将其展示在框里
    if (this.$route.params.id) {
      const data = {
        id: this.$route.params.id
      }
      this.$api.exam.getExamDetail(data).then(res => {
        this.ruleForm = {
          title: res.title,
          courseProfessional: res.specialityid,
          time: res.duration,
          repeated: res.repeatable
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  header {
    border-bottom: 1px solid #E6E6E6;
  }
</style>
