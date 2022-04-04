<template>
  <div class="main">
    <header>
      <h5 class="fs-16 mb-20 mt-0">{{$route.name}} — 课程基本信息</h5>
    </header>
    <el-form class="mt-20 width-percent-50" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px">
      <el-form-item label="课程名称" prop="className">
        <el-input placeholder="请输入课程名称" v-model="ruleForm.className"></el-input>
      </el-form-item>
      <el-form-item label="学时" prop="hour">
        <el-input placeholder="学时" v-model="ruleForm.hour"></el-input>
      </el-form-item>
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
        courseName: '',
        hour: ''
      },
      rules: {
        courseName: [
          { required: true, message: '请输入课程名称', trigger: 'change' }
        ],
        hour: [
          { required: true, message: '请输入学时', trigger: 'change' }
        ]

      }

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
              classesId: this.$route.params.id,
              courseName: this.ruleForm.courseName, // 班次名
              hour: this.ruleForm.hour
            }
            this.$api.class.updateCourse(data).then(res => {
              this.$message.success('编辑成功')
              this.$router.back()
            })
          } else {
            // 调用add接口
            const data = {
              classesId: this.$route.params.id,
              courseName: this.ruleForm.courseName, // 班次名
              hour: this.ruleForm.hour
            }
            this.$api.class.createCourse(data).then(res => {
              this.$message.success('新增成功')
              this.$router.back()
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
    console.log(this.$route.params.id)
    console.log(this.$route.query.id)
    console.log(this.$route.query.courseName)
    console.log(this.$route.query.hour)
    if (this.$route.query.id) {
      this.ruleForm = {
        courseName: this.$route.query.courseName,
        hour: this.$route.query.hour
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  header {
    border-bottom: 1px solid #E6E6E6;
  }
</style>
<template>
  <div class="main">
    <header>
      <h5 class="fs-16 mb-20 mt-0">{{$route.name}} — 课程基本信息</h5>
    </header>
    <el-form class="mt-20 width-percent-50" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px">
      <el-form-item label="课程名称" prop="className">
        <el-input placeholder="请输入课程名称" v-model="ruleForm.className"></el-input>
      </el-form-item>
      <el-form-item label="学时" prop="className">
        <el-input placeholder="学时" v-model="ruleForm.className"></el-input>
      </el-form-item>
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
        courseName: '',
        hour: ''
      },
      rules: {
        courseName: [
          { required: true, message: '请输入课程名称', trigger: 'change' }
        ],
        hour: [
          { required: true, message: '请输入学时', trigger: 'change' }
        ]

      }

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
              classesId: this.$route.params.id,
              courseName: this.ruleForm.courseName, // 班次名
              hour: this.ruleForm.hour
            }
            this.$api.class.updateCourse(data).then(res => {
              this.$message.success('编辑成功')
              this.$router.back()
            })
          } else {
            // 调用add接口
            const data = {
              classesId: this.$route.params.id,
              courseName: this.ruleForm.courseName, // 班次名
              hour: this.ruleForm.hour
            }
            this.$api.class.createCourse(data).then(res => {
              this.$message.success('新增成功')
              this.$router.back()
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
    console.log(this.$route.params.id)
    console.log(this.$route.query.id)
    console.log(this.$route.query.courseName)
    console.log(this.$route.query.hour)
    // 在编辑时  根据id获取班次基本信息将其展示在框里
    if (this.$route.query.id) {
      this.ruleForm  = {
        courseName: this.$route.query.courseName,
        hour: this.$route.query.hour
      }
     }
  }
}
</script>

<style lang="scss" scoped>
  header {
    border-bottom: 1px solid #E6E6E6;
  }
</style>
