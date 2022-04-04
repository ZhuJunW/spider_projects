<template>
  <div class="main">
    <header>
      <h5 class="fs-16 mb-20 mt-0">{{$route.name}} — 课程基本信息</h5>
    </header>
    <el-tabs v-model="activeName">
      <el-tab-pane label="线上课程" name="0" v-if="$route.query.type === '0'">
        <el-form class="mt-20 width-percent-50" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px">
          <el-form-item label="课程名称" prop="courseName">
            <el-input placeholder="请选择线上课程" v-model="ruleForm.courseName" @focus="showDialog=true"></el-input>
          </el-form-item>
          <el-form-item label="学时" prop="hour">
            <el-input placeholder="学时" v-model="ruleForm.hour"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
            <el-button @click="$router.back()">取消</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="线下课程" name="1" v-else>
        <el-form class="mt-20 width-percent-50" :model="secondRuleForm" :rules="rules" ref="secondRuleForm" label-width="150px">
          <el-form-item label="课程名称" prop="courseName">
            <el-input placeholder="请输入课程名称" v-model="secondRuleForm.courseName"></el-input>
          </el-form-item>
          <el-form-item label="学时" prop="hour">
            <el-input placeholder="学时" v-model="secondRuleForm.hour"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('secondRuleForm')">保存</el-button>
            <el-button @click="$router.back()">取消</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      title="选择线上课程"
      :visible.sync="showDialog"
      width="500px">
      <el-table :data="tableData" border @row-click="rowClick" row-class-name="cursor-pointer">
        <el-table-column show-overflow-tooltip prop="title" align="center" label="课程名字"></el-table-column>
        <el-table-column width="80" prop="courseHour" align="center" label="课时"></el-table-column>
      </el-table>
      <div class="mt-20 display-flex fd-row-reverse">
        <!-- 表格数据的分页的功能 -->
        <el-pagination
          hide-on-single-page
          background
          @current-change="(val) => {searchCourse(val)}"
          :current-page="courseForm.pageNum"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data () {
    return {
      courseForm: {
        pageNum: 1,
        pageSize: 10
      },
      total: '',
      tableData: [],
      activeName: '0',
      showDialog: false,
      ruleForm: {
        courseName: '',
        hour: '',
        courseId: ''
      },
      secondRuleForm: {
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
  computed: {},
  methods: {
    searchCourse (pageNum) {
      if (pageNum) {
        this.courseForm.pageNum = pageNum
      }
      this.$api.course.getCourseManageList(this.courseForm).then(res => {
        this.tableData = res.list
        this.total = res.total
      })
    },
    rowClick (row) {
      this.ruleForm.courseName = row.title
      this.ruleForm.hour = row.courseHour
      this.ruleForm.courseId = row.id
      this.showDialog = false;
    },
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
          // if (this.$route.params.id) {
          //   // 调用修改接口
          //   const data = {
          //     id: this.$route.params.id,
          //     classesId: this.$route.params.id,
          //     courseName: this.ruleForm.courseName, // 班次名
          //     hour: this.ruleForm.hour
          //   }
          //   this.$api.class.updateCourse(data).then(res => {
          //     this.$message.success('编辑成功')
          //     this.$router.back()
          //   })
          // } else {
          // 调用add接口
          let formData;
          if (this.$route.query.type === '0') {
            formData = this.ruleForm
          } else {
            formData = this.secondRuleForm
          }
          const data = {
            classesId: this.$route.params.id,
            courseName: formData.courseName, // 课程名
            hour: formData.hour
          }
          if (this.$route.query.type === '0') {
            data.courseId = formData.courseId
          }
          this.$api.class.createCourse(data).then(res => {
            this.$message.success('新增成功')
            this.$router.back()
          })
          // }
        }
      });
    }
  },
  created () {
    this.activeName = this.$route.query.type
  },
  mounted () {
    this.searchCourse()
    // console.log(this.$route.query.id)
    // console.log(this.$route.query.courseName)
    // console.log(this.$route.query.hour)
    // if (this.$route.query.id) {
    //   this.ruleForm = {
    //     courseName: this.$route.query.courseName,
    //     hour: this.$route.query.hour
    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>
/deep/.el-dialog__body{
  padding-top: 10px !important;
}
</style>
