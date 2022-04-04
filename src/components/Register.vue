<template>
  <el-dialog
    title="注册"
    :before-close="hideDialog"
    :visible.sync="showDialog"
    width="500px">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="用户名" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="ruleForm.phone" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="ruleForm.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input type="password" v-model="ruleForm.confirmPassword" placeholder="确认密码"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="hideDialog">取 消</el-button>
      <el-button type="primary" @click="submitDialog">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'Register',
  data () {
    const validatePass = (rule, value, callback) => {
      if (!value.trim()) {
        callback(new Error('请输入密码'));
      } else {
        if (value.length < 6) {
          callback(new Error('密码不能少于6位'));
        } else if (this.ruleForm.confirmPassword !== '') {
          this.$refs.ruleForm.validateField('confirmPassword');
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        name: '',
        phone: '',
        password: '',
        confirmPassword: ''
      },
      rules: {
        password: [
          { required: true, validator: validatePass, trigger: 'change' }
        ],
        confirmPassword: [
          { required: true, validator: validatePass2, trigger: 'change' }
        ],
        name: [
          { required: true, message: '请填写用户名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请填写手机号', trigger: 'blur' }
        ]
      }
    }
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  watch: {},
  computed: {},
  methods: {
    hideDialog () {
      this.$emit('hideDialog')
    },
    submitDialog () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const data = {
            mobile: this.ruleForm.phone,
            password: this.ruleForm.confirmPassword,
            username: this.ruleForm.name
          }
          this.$api.user.register(data).then(res => {
            this.$message.success('注册成功')
            this.$emit('submitDialog', data)
          })
        }
      });
    }
  },
  created () {

  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>

</style>
