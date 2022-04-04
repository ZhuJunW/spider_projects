<template>
  <div class="main">
    <header class="display-flex ai-center jc-space-between mb-20">
<!--      <el-button    icon="el-icon-plus" type="primary">新增关联课程 </el-button>-->
      <div class="display-flex ai-center cursor-pointer" @click="$router.back()">
        <img width="18px" src="@/assets/images/back.png" alt="">
        <span class="fs-14 ml-10">返回学员管理</span>
      </div>
    </header>
    <!-- 数据列表展示 -->
    <el-table :data="tableData" border>
      <el-table-column  prop="courseName" align="center" label="课程名称"></el-table-column>
      <el-table-column  prop="hour" align="center" label="学时"></el-table-column>
      <el-table-column  prop="result" align="center" label="成绩"></el-table-column>
      <el-table-column  prop="remark" align="center" label="备注"></el-table-column>
      <el-table-column align="center" width="180px" label="操作">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
<!--          <el-button-->
<!--            class="color-danger"-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            @click="deleteExam(scope.row)"-->
<!--          >删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <!--学员详情弹框-->
    <el-dialog
      width="800px"
      :title="stuDialog.title"
      :visible.sync="stuDialog.show">
      <el-form :model="stuDialog.form" ref="leaderForm" label-width="80px">

        <el-row>
          <el-col :span="12">
            <el-form-item label="课程名称" prop="courseName" >
              <el-input  v-model="stuDialog.form.courseName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学时" prop="hour" >
              <el-input  v-model="stuDialog.form.hour" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="成绩" prop="result" >
              <el-input  v-model="stuDialog.form.result" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="remark" >
              <el-input  v-model="stuDialog.form.remark" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer">
        <el-button @click="stuDialog.show = false">取 消</el-button>
                <el-button type="primary" @click="addstuSubmit('leaderForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data () {
    return {
      searchForm: {
        page: 1,
        limit: 10
      },
      // 编辑课程录入弹框
      stuDialog: {
        title: '',
        show: false,
        id: null,
        form: {
          id: '',
          courseName: '',
          hour: '',
          result: '',
          remark: ''
        }
      },
      tableData: [],
      total: null,
      // 课程专业类别
      courseProfessionalOption: [
      ],
      categoryOption: []
    };
  },
  watch: {
    _searchForm: {
      handler: function (newVal, oldVal) {
        if (newVal.page !== 1 && newVal.page === oldVal.page) {
          this.searchForm.page = 1;
        } else {
          this.getTableData()
        }
      },
      deep: true
    }
  },
  computed: {
    /**
     * 监听复杂数据类型的变换
     */
    _searchForm () {
      return JSON.parse(JSON.stringify(this.searchForm));
    }
  },
  methods: {
    // 学员课程编辑按钮
    edit (row) {
      console.log(99)
      this.stuDialog.title = '课程编辑'
      this.stuDialog.show = true
      console.log(this.stuDialog.show)
      this.stuDialog.form = {
        id: row.id,
        remark: row.remark,
        courseName: row.courseName, // 课程名
        result: row.result,
        hour: row.hour

      }
    },
    // 学员课程编辑按钮提交
    addstuSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = {
            id: this.stuDialog.form.id,
            remark: this.stuDialog.form.remark,
            result: this.stuDialog.form.result,
            studentId: this.$route.params.id
          }
          console.log(data)
          this.$api.class.updateCour(data).then(res => {
            console.log(res);
            this.stuDialog.show = false
            this.$message.success('编辑课程成功')
            this.getTableData()
          })
        }
      });
    },
    deleteExam (row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          id: row.id
        }
        this.$api.exam.deleteExam(data).then(res => {
          this.$message.success('删除成功')
          // 获取最新考试咧白哦
          this.getTableData()
        })
      }).catch(() => {});
    },

    // 获取关联的课程列表
    getTableData () {
      this.$api.class.studentCourse(this.$route.params.id).then(res => {
        console.log(res)
        this.tableData = res
      })
    }

  },
  created () {},
  mounted () {
    console.log(this.$route.params.id)
    // 获取课程列表
    this.getTableData()
  }
};
</script>

<style lang="scss" scoped>
</style>
