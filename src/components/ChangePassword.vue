<template>
  <el-dialog
    title="提示"
    :before-close="hideDialog"
    :visible.sync="showDialog"
    width="500px">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input type="password" v-model="ruleForm.oldPassword"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input type="password" v-model="ruleForm.newPassword"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input type="password" v-model="ruleForm.confirmPassword"></el-input>
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
  name: 'ChangePassword',
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.confirmPassword !== '') {
          this.$refs.ruleForm.validateField('confirmPassword');
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        newPassword: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ],
        oldPassword: [
          { required: true, message: '请填写旧密码', trigger: 'blur' }
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
          this.$api.user.changePassword(this.ruleForm).then(res => {
            window.location.href = '/'
            this.$emit('submitDialog')
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
