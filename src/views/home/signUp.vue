<template>
  <div>
    <el-header class="display-flex ai-center">
      <div @click="$router.back()" class="nav"><i class="el-icon-back"></i>培训报名：{{ $route.params.className}}</div>
    </el-header>
    <div class="container">
      <div class="register">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px">
          <el-form-item label="学员姓名" prop="name">
            <el-input placeholder="请输入学员姓名" v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="idCard">
            <el-input placeholder="请输入身份证号" v-model="ruleForm.idCard"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-select class="width-percent-100" v-model="ruleForm.sex" placeholder="请选择性别">
              <el-option label="男" :value='0'></el-option>
              <el-option label="女" :value='1'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单位名称" prop="companyName">
            <el-input placeholder="请输入单位名称" v-model="ruleForm.companyName"></el-input>
          </el-form-item>
          <el-form-item label="职称" prop="jobName">
            <el-input placeholder="请输入职称" v-model="ruleForm.jobName"></el-input>
          </el-form-item>
          <el-form-item label="学历" prop="education">
            <el-input placeholder="请输入学历" v-model="ruleForm.education"></el-input>
          </el-form-item>
          <el-form-item label="班次" prop="classesId">
            <el-select class="width-percent-100" v-model="ruleForm.classesId" placeholder="请选择班次">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.className"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="培训项目" prop="eduProject">
            <el-select class="width-percent-100" v-model="ruleForm.eduProject" placeholder="请选择培训项目">
              <el-option label="安全初训" :value='1'></el-option>
              <el-option label="安全复训" :value='2'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="培训类型" prop="eduType">
            <el-select class="width-percent-100" v-model="ruleForm.eduType" placeholder="请选择培训类型">
              <el-option label="安全管理员" :value='1'></el-option>
              <el-option label="主要负责人" :value='2'></el-option>
              <el-option label="班组长" :value='3'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone" >
            <el-input placeholder="请输入联系电话" v-model="ruleForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input placeholder="请输入邮箱" v-model="ruleForm.email"></el-input>
          </el-form-item>
          <el-form-item label="微信号" prop="wx">
            <el-input placeholder="请输入微信号" v-model="ruleForm.wx"></el-input>
          </el-form-item>
          <el-form-item class="float-right">
            <el-button type="green" @click="submitForm('ruleForm')">确定</el-button>
            <el-button @click="$router.back()">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'signUp',
  data () {
    return {
      options: [],
      ruleForm: {
        jobName: '',
        classesId: '',
        companyId: '',
        companyName: '',
        eduProject: null,
        eduType: null,
        education: '',
        email: '',
        idCard: '',
        name: '',
        phone: '',
        sex: null,
        wx: ''
      },
      rules: {
        phone: [
          { required: true, message: '请输入联系方式', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入11位手机号码', trigger: 'blur' },
          {
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            // pattern: /^1[3456789]\d{9}$/,
            message: '请输入正确的手机号码'
          }
        ],
        companyName: [
          { required: true, message: '请输入单位名称', trigger: 'change' }
        ],
        eduProject: [
          { required: true, message: '请选择培训项目', trigger: 'change' }
        ],
        email: [
          { required: true, message: '请输入邮箱号', trigger: 'change' }
        ],
        idCard: [
          { required: true, message: '请输入身份证号', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'change' }
        ],
        classesId: [
          { required: true, message: '请输入班次', trigger: 'change' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        eduType: [
          { required: true, message: '请选择培训类型', trigger: 'change' }
        ]
      }
    }
  },
  components: {
  },
  watch: {},
  computed: {},
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = {
            jobName: this.ruleForm.jobName, // 职称
            classesId: this.ruleForm.classesId,
            companyName: this.ruleForm.companyName,
            eduProject: this.ruleForm.eduProject,
            eduType: this.ruleForm.eduType,
            education: this.ruleForm.education,
            email: this.ruleForm.email,
            idCard: this.ruleForm.idCard,
            name: this.ruleForm.name,
            phone: this.ruleForm.phone,
            sex: this.ruleForm.sex,
            wx: this.ruleForm.wx,
            type: 2
          }
          this.$api.class.createMem(data).then(res => {
            this.$message.success('报名成功')
            this.$router.back()
          })
        }
      });
    },
    // 获取班次
    getClass () {
      this.$api.class.getClass().then(res => {
        this.options = res.map(item => {
          return {
            id: item.id,
            className: item.className
          }
        })
      })
    }
  },
  created () {
    this.ruleForm.classesId = this.$route.query.id
  },
  mounted () {
    this.getClass();
  }
}
</script>

<style lang="scss" scoped>
.el-header{
  background-color: #FFFFFF;
  border-top:1px solid #E6E6E6 ;
  margin-bottom: 20px;
  div{
    width: 1360px;
    margin: 0 auto;
  }
}
.register {
  background-color: #FFFFFF;
  width: 100%;
  padding: 40px 0 80px 0;

  .el-form {
    width: 50%;
    margin: 0 auto;

    .el-button--green {
      background-color: #09BBA1;
      color: #FFFFFF;

      &:hover {
        background: #48D1CC;
        border-color: #48D1CC;
      }
    }
  }
}
</style>
