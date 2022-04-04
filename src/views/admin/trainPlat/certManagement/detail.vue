<template>
  <div class="main">
    <header>
      <h5 class="fs-16 mb-20 mt-0">{{$route.name}} — 班次基本信息</h5>
    </header>
    <el-form class="mt-20 width-percent-50" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px">

      <el-row><el-col span="12">

      <el-form-item label="姓名" prop="className">
        <el-input placeholder="姓名" v-model="ruleForm.className"></el-input>
      </el-form-item>
      </el-col>
        <el-col span="12">
      <el-form-item label="性别" prop="className">
        <el-input placeholder="性别" v-model="ruleForm.className"></el-input>
      </el-form-item>

      </el-col></el-row>
      <el-row><el-col span="12">
      <el-form-item label="职称" prop="className">
        <el-input placeholder="职称" v-model="ruleForm.className"></el-input>
      </el-form-item>
      </el-col>
        <el-col span="12">
      <el-form-item label="单位名称" prop="className">
        <el-input placeholder="单位名称" v-model="ruleForm.className"></el-input>
      </el-form-item>
      </el-col></el-row>

      <el-row><el-col span="12">
        <el-form-item label="最高学历" prop="className">
          <el-input placeholder="最高学历" v-model="ruleForm.className"></el-input>
        </el-form-item>
      </el-col>
        <el-col span="12">
          <el-form-item label="身份证号码" prop="className">
            <el-input placeholder="身份证号码" v-model="ruleForm.className"></el-input>
          </el-form-item>
        </el-col></el-row>

      <el-row><el-col span="12">
        <el-form-item label="手机号码" prop="className">
          <el-input placeholder="手机号码" v-model="ruleForm.className"></el-input>
        </el-form-item>
      </el-col>
        <el-col span="12">
          <el-form-item label="微信号" prop="className">
            <el-input placeholder="微信号" v-model="ruleForm.className"></el-input>
          </el-form-item>
        </el-col></el-row>

      <el-row><el-col span="12">
        <el-form-item label="电子邮箱" prop="className">
          <el-input placeholder="电子邮箱" v-model="ruleForm.className"></el-input>
        </el-form-item>
      </el-col>
        <el-col span="12">
          <el-form-item label="证书编号" prop="className">
            <el-input placeholder="证书编号" v-model="ruleForm.className"></el-input>
          </el-form-item>
        </el-col></el-row>

      <el-row><el-col span="12">
        <el-form-item label="发证日期" prop="className">
          <el-input placeholder="发证日期" v-model="ruleForm.className"></el-input>
        </el-form-item>
      </el-col>
        <el-col span="12">
          <el-form-item label="有效期至" prop="className">
            <el-input placeholder="有效期至" v-model="ruleForm.className"></el-input>
          </el-form-item>
        </el-col></el-row>
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
        companyId: '123',
        className: '',
        classStartDate: '',
        classEndDate: '',
        courseIds: ''
      },
      rules: {
        className: [
          { required: true, message: '请输入班次名称', trigger: 'change' }
        ],
        classStartDate: [
          { required: true, message: '请输入班次开始日期', trigger: 'change' }
        ],
        classEndDate: [
          { required: true, message: '请输入班次结束日期', trigger: 'change' }
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
