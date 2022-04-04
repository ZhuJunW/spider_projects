<template>
  <div class="main">
    <header>
      <h5 class="fs-16 mb-20 mt-0">{{$route.name}}</h5>
    </header>
    <el-form class="mt-20 width-percent-50" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px">
      <p>基本信息</p>
      <el-form-item label="企业名称" prop="companyName">
        <el-input v-model="ruleForm.companyName" placeholder="请输入企业名称"></el-input>
      </el-form-item>
       <el-form-item label="选择地区" prop="areaCode" >
         <el-cascader
            filterable
            @change="ruleForm.streetCode = null"
            class="width-percent-100"
            v-model="ruleForm.areaCode"
            placeholder="请选择地区"
            :options="areaOption"
            :props="areaOptionProps"
           ></el-cascader>

      </el-form-item>
       <el-form-item label="选择街道"  prop="streetCode">
         <el-select  class="width-percent-100" :disabled="!ruleForm.areaCode.length" v-model="ruleForm.streetCode" placeholder="请选择街道">
          <el-option
            v-for="item in streetOption"
            :key="item.streetCode"
            :label="item.streetName"
            :value="item.streetCode">
          </el-option>
        </el-select>
      </el-form-item>
       <el-form-item label="详细地址" prop="address">
        <el-input  class="width-percent-100" placeholder="请输入详细地址" v-model="ruleForm.address"></el-input>
      </el-form-item>
       <el-form-item label="统一社会信用代码" prop="creditCode">
        <el-input v-model="ruleForm.creditCode" placeholder="请输入统一社会信用代码"></el-input>
      </el-form-item>
       <el-form-item label="行业分类" prop="industryId" >
         <el-select  class="width-percent-100" v-model="ruleForm.industryId" placeholder="请选择行业类别">
          <el-option
            v-for="item in professionalOption"
            :key="item.id"
            :label="item.industryName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    <p>联系人信息</p>
       <el-form-item label="联系人" prop="contacts">
        <el-input v-model="ruleForm.contacts" placeholder="请输入联系人名称"></el-input>
      </el-form-item>
       <el-form-item label="手机号" prop="mobile">
        <el-input v-model="ruleForm.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
       <el-form-item label="部门" prop="deptName">
        <el-input v-model="ruleForm.deptName" placeholder="请输入部门名称"></el-input>
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
  name: 'Edit',
  data () {
    return {
      areaOption: [], // 选择地区
      areaOptionProps: {
        value: 'code',
        label: 'name',
        children: 'childList'
      },
      streetOption: [], // 选择街道
      professionalOption: [], // 企业的行业类别
      ruleForm: {
        companyName: null, // 企业名称
        areaCode: [], // 选择地区
        industryId: null, // 行业类别
        streetCode: null, // 选择街道
        address: null, // 详细地址
        creditCode: null, // 统一社会信用代码
        contacts: null, // 联系人
        mobile: null, // 手机号
        deptName: null // 部门
      },
      rules: {
        companyName: [
          { required: true, message: '请输入企业名', trigger: 'blur' }
        ],
        industryId: [
          { required: true, message: '请选择行业类别', trigger: 'change' }
        ],
        streetCode: [
          { required: true, message: '请选择街道', trigger: 'change' }
        ],
        areaCode: [
          { required: true, message: '请选择地区', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ],
        creditCode: [
          { required: true, message: '请输入统一社会信用代码', trigger: 'blur' }
        ],
        contacts: [
          { required: true, message: '请输入联系人名字', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        deptName: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ]

      }
    }
  },
  watch: {
    // 监听市区变化时  街道变化
    'ruleForm.areaCode': function () {
      this.getStreetList()
    }
  },
  computed: {},
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = {
            address: this.ruleForm.address,
            cityCode: this.ruleForm.areaCode[0],
            areaCode: this.ruleForm.areaCode[1],
            companyName: this.ruleForm.companyName,
            contactName: this.ruleForm.contacts,
            creditCode: this.ruleForm.creditCode,
            deptName: this.ruleForm.deptName,
            industryId: this.ruleForm.industryId,
            contactMobile: this.ruleForm.mobile,
            streetCode: this.ruleForm.streetCode
          }
          if (this.$route.params.id) {
            // 调用修改接口
            data.id = this.$route.params.id
            this.$api.enterprise.updateEnterprise(data).then(res => {
              this.$message.success('编辑成功')
              this.$router.back()
            })
          } else {
            // 调用add接口
            this.$api.enterprise.createEnterprise(data).then(res => {
              this.$message.success('新增成功')
              this.$router.back()
            })
          }
        }
      })
    },
    // 获取市区
    getAreaList () {
      this.$api.common.getAreaList().then(res => {
        this.areaOption = res;
      })
    },
    // 获取街道
    getStreetList () {
      this.streetOption = []
      this.$api.common.getStreetList(this.ruleForm.areaCode[1]).then(res => {
        this.streetOption = res;
      })
    },
    // 获取企业行业类别
    getProfessional () {
      this.$api.enterprise.getProfessional().then(res => {
        this.professionalOption = res;
      })
    }
  },
  created () {

  },
  mounted () {
    // 获取企业的行业类别
    this.getProfessional();
    this.getAreaList();
    // 编辑企业时的详情数据展示
    if (this.$route.params.id) {
      this.$api.enterprise.getEnterpriseDetail(this.$route.params.id).then(res => {
        this.ruleForm = {
          companyName: res.companyName, // 企业名称
          areaCode: [res.cityCode, res.areaCode], // 选择地区
          industryId: res.industryId, // 行业类别
          streetCode: res.streetCode, // 选择街道
          address: res.address, // 详细地址
          creditCode: res.creditCode, // 统一社会信用代码
          contacts: res.contactName, // 联系人
          mobile: res.contactMobile, // 手机号
          deptName: res.deptName // 部门
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
