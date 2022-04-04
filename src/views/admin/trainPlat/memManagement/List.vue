<template>
  <!--  报名人员-->
  <div class="main">
    <el-row>
      <el-col :span="4">
        <el-form :inline="true" size="small">
          <el-form-item>
            <el-button @click="$router.push('/admin/mem-add')" icon="el-icon-plus" type="primary">新增报名人员</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="20">
        <!-- 搜索栏 -->
        <el-form class="float-right" :inline="true" size="small" v-model="searchForm">
          <!--              <el-form-item  label="培训班次">-->
          <!--                <el-input  v-model="searchForm.companyName"></el-input>-->
          <!--          </el-form-item>-->

          <el-form-item class="width-140">
            <el-select v-model="searchForm.classesId" clearable placeholder="请选择培训班次">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.className"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="width-140">
            <el-select clearable v-model="searchForm.eduType" placeholder="培训类型">
              <el-option label="安全管理员" :value='1'></el-option>
              <el-option label="主要负责人" :value='2'></el-option>
              <el-option label="班组长" :value='3'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="width-140">
            <el-select clearable v-model="searchForm.eduProject" placeholder="培训项目">
              <el-option label="安全初训" :value='1'></el-option>
              <el-option label="安全复训" :value='2'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="width-150">
            <el-input placeholder="姓名/手机号/身份证" clearable v-model="searchForm.keyWord"></el-input>
          </el-form-item>
          <el-form-item class="mr-0">
            <el-button type="primary" @click="getTableData">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 数据列表展示 -->
    <el-table :data="tableData" border>
      <el-table-column width="120" prop="name" align="center" label="姓名"></el-table-column>
      <el-table-column prop="companyName" align="center" label="单位名称"></el-table-column>
      <el-table-column prop="className" align="center" label="培训班次"></el-table-column>
      <el-table-column width="120" prop="eduType" align="center" label="培训类型">
        <template slot-scope="scope">
          <span v-if="scope.row.eduType === 1">安全管理员</span>
          <span v-if="scope.row.eduType === 2">主要负责人</span>
          <span v-if="scope.row.eduType === 3">班组长</span>
        </template>
      </el-table-column>
      <el-table-column width="120" prop="eduProject" align="center" label="培训项目">
        <template slot-scope="scope">
          <span v-if="scope.row.eduProject === 1">安全初训</span>
          <span v-else>安全复训</span>
        </template>
      </el-table-column>
      <el-table-column width="180" prop="trainStatus" align="center" label="培训状态">
        <template slot-scope="scope">
          <span v-if="scope.row.trainStatus === 1">预报名</span>
          <span v-if="scope.row.trainStatus === 2">已审核</span>
          <span v-if="scope.row.trainStatus === 3" class="color-danger">作废</span>
        </template>
      </el-table-column>

      <el-table-column align="center" width="180px" label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.trainStatus ===1" type="text" size="small" @click="addLeader(scope.row)">审核
          </el-button>
          <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button
            class="color-danger"
            size="mini"
            type="text"
            @click="deleteExam(scope.row)"
          >删除
          </el-button>

        </template>
      </el-table-column>
    </el-table>
    <div class="mt-20 display-flex fd-row-reverse">
      <!-- 表格数据的分页的功能 -->
      <el-pagination
        hide-on-single-page
        @current-change="(val) => {searchForm.page = val}"
        :current-page="searchForm.page"
        background
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <!--审核弹框-->
    <el-dialog
      width="800px"
      :title="leaderDialog.title"
      :visible.sync="leaderDialog.show">
      <el-form :model="leaderDialog.form" ref="leaderForm" label-width="80px">

        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input disabled v-model="leaderDialog.form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="sex">
              <el-select v-model="leaderDialog.form.sex" disabled>
                <el-option label="男" :value='0'></el-option>
                <el-option label="女" :value='1'></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phone">
              <el-input disabled v-model="leaderDialog.form.phone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位名称" prop="companyName">
              <el-input disabled v-model="leaderDialog.form.companyName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="培训类型" prop="eduType">
              <el-select v-model="leaderDialog.form.eduType" disabled>
                <el-option label="安全管理员" :value='1'></el-option>
                <el-option label="主要负责人" :value='2'></el-option>
                <el-option label="班组长" :value='3'></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="培训项目" prop="eduProject">
              <el-select v-model="leaderDialog.form.eduProject" disabled>
                <el-option label="安全初训" :value='1'></el-option>
                <el-option label="安全复训" :value='2'></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="最高学历" prop="education">
              <el-input disabled v-model="leaderDialog.form.education"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号码" prop="idCard">
              <el-input v-model="leaderDialog.form.idCard" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="leaderDialog.form.email" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="微信号" prop="wx">
              <el-input v-model="leaderDialog.form.wx" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="培训班次" prop="className">
              <el-input v-model="leaderDialog.form.className" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报名时间">
              <el-date-picker
                disabled
                v-model="leaderDialog.form.gmtCreate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <span slot="footer">
          <el-button type="primary" @click="SuccSubmit()">审核通过</el-button>
          <el-button @click="faultSubmit()" class="color-danger">作废</el-button>
        <el-button @click="leaderDialog.show = false">取 消</el-button>

      </span>
    </el-dialog>
    <!--报名人员编辑弹框-->
    <el-dialog
      style="height: 100%"
      width="600px"
      :title="stuDialog.title"
      :visible.sync="stuDialog.show">

      <div class="scrollbar">
        <el-scrollbar style="height: 400px">
          <el-form :model="stuDialog.form" ref="leaderForm" label-width="80px">
            <el-form-item label="学员姓名" prop="name">
              <el-input placeholder="请输入学员姓名" v-model="stuDialog.form.name"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-select class="width-percent-100" v-model="stuDialog.form.sex" placeholder="请选择性别">
                <el-option label="男" :value='0'></el-option>
                <el-option label="女" :value='1'></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="单位名称" prop="companyName">
              <el-input placeholder="请输入单位名称" v-model="stuDialog.form.companyName"></el-input>
            </el-form-item>
            <el-form-item label="职称" prop="jobName">
              <el-input placeholder="请输入职称" v-model="stuDialog.form.jobName"></el-input>
            </el-form-item>
            <el-form-item label="班次" prop="classesId">
              <el-select class="width-percent-100" v-model="stuDialog.form.classesId" placeholder="请选择班次">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.className"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="培训项目" prop="eduProject">
              <el-select class="width-percent-100" v-model="stuDialog.form.eduProject" placeholder="请选择培训项目">
                <el-option label="安全初训" :value='1'></el-option>
                <el-option label="安全复训" :value='2'></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="培训类型" prop="eduType">
              <el-select class="width-percent-100" v-model="stuDialog.form.eduType" placeholder="请选择培训类型">
                <el-option label="安全管理员" :value='1'></el-option>
                <el-option label="主要负责人" :value='2'></el-option>
                <el-option label="班组长" :value='3'></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="学历" prop="education">
              <el-input placeholder="请输入学历" v-model="stuDialog.form.education"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="phone">
              <el-input placeholder="请输入联系电话" v-model="stuDialog.form.phone"></el-input>
            </el-form-item>
            <el-form-item label="身份证号" prop="idCard">
              <el-input placeholder="请输入身份证号" v-model="stuDialog.form.idCard"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input placeholder="请输入邮箱" v-model="stuDialog.form.email"></el-input>
            </el-form-item>
            <el-form-item label="微信号" prop="wx">
              <el-input placeholder="请输入微信号" v-model="stuDialog.form.wx"></el-input>
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
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
      options: [], // 班次
      // 报名人员编辑弹框
      stuDialog: {
        title: '',
        show: false,
        id: null,
        form: {
          id: '',
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
        }
      },

      // 审核弹框
      leaderDialog: {
        title: '',
        show: false,
        stuid: null,
        form: {
          time: '',
          cerId: '', // 证书编号
          companyId: '123',
          companyName: '安胜达',
          eduType: null,
          education: '',
          eduProject: '',
          email: '',
          wx: '',
          className: '',
          idCard: '',
          jobName: '',
          name: '',
          sex: null,
          phone: '',
          gmtCreate: '',
          studentId: ''// 学员id
        }
      },
      // 搜索框
      searchForm: {
        classesId: '',
        companyName: '江苏安胜达安全科技有限公司',
        eduProject: '',
        eduType: '',
        name: '',
        keyWord: '',
        trainStatus: 1,
        page: 1,
        limit: 10
      },
      tableData: [],
      total: null,
      // 课程专业类别
      courseProfessionalOption: [],
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
    // 报名人员编辑按钮
    edit (row) {
      console.log(row)
      this.stuDialog.title = '报名人员编辑'
      this.stuDialog.show = true
      console.log(this.stuDialog.show)
      this.stuDialog.form = {
        id: row.id,
        jobName: row.jobName,
        companyName: row.companyName, // 证书编号
        classesId: row.classesId,
        eduType: row.eduType,
        education: row.education,
        eduProject: row.eduProject,
        email: row.email,
        wx: row.wx,
        className: row.className,
        idCard: row.idCard,
        name: row.name,
        sex: row.sex,
        phone: row.phone

      }
    },
    // 报名人员编辑按钮提交
    addstuSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = {
            id: this.stuDialog.form.id,
            jobName: this.stuDialog.form.jobName,
            companyName: this.stuDialog.form.companyName, // 证书编号
            classesId: this.stuDialog.form.classesId,
            eduType: this.stuDialog.form.eduType,
            education: this.stuDialog.form.education,
            eduProject: this.stuDialog.form.eduProject,
            email: this.stuDialog.form.email,
            wx: this.stuDialog.form.wx,
            className: this.stuDialog.form.className,
            idCard: this.stuDialog.form.idCard,
            name: this.stuDialog.form.name,
            sex: this.stuDialog.form.sex,
            phone: this.stuDialog.form.phone
          }
          console.log(data)
          this.$api.class.updateStatus(data).then(res => {
            console.log(res);
            this.stuDialog.show = false
            this.$message.success('编辑人员成功')
            this.getTableData()
          })
        }
      });
    },
    // 审核按钮
    addLeader (row) {
      console.log(5555)
      console.log(row)
      this.leaderDialog.title = '人员审核'
      this.leaderDialog.show = true
      console.log(row)
      this.leaderDialog.form = {
        cerId: row.cerId, // 证书编号
        companyId: row.companyId,
        companyName: row.companyName,
        // eduType: row.eduType ? '2' : '1',
        eduType: row.eduType,
        education: row.education,
        eduProject: row.eduProject,
        email: row.email,
        wx: row.wx,
        className: row.className,
        idCard: row.idCard,
        jobName: row.jobName,
        name: row.name,
        sex: row.sex,
        phone: row.phone,
        studentId: row.id,
        gmtCreate: row.gmtCreate

      }
    },
    // 审核通过
    SuccSubmit () {
      const data = {
        id: this.leaderDialog.form.studentId,
        trainStatus: 2
      }
      this.$api.class.updateMem(data).then(res => {
        this.$message.success('审核通过')
        this.leaderDialog.show = false
        // 获取最新
        this.getTableData()
      })
    },
    // 作废
    faultSubmit () {
      const data = {
        id: this.leaderDialog.form.studentId,
        trainStatus: 3
      }
      this.$api.class.updateMem(data).then(res => {
        this.$message.success('已作废')
        this.leaderDialog.show = false
        // 获取最新
        this.getTableData()
      })
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
        this.$api.class.deleteMem(data).then(res => {
          this.$message.success('删除成功')
          // 获取最新
          this.getTableData()
        })
      }).catch(() => {
      });
    },
    exerciseManage (row) {
      this.$router.push({
        path: 'question-manage',
        query: {
          id: row.id
        }
      })
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
        console.log(this.options)
      })
    },
    // 获取报名人员列表
    getTableData () {
      const data = {
        classesId: this.searchForm.classesId,
        eduType: this.searchForm.eduType,
        eduProject: this.searchForm.eduProject,
        pageNum: this.searchForm.page,
        pageSize: this.searchForm.limit,
        keyWord: this.searchForm.keyWord
      }
      this.$api.class.getMemList(data).then(res => {
        console.log(res)
        this.tableData = res.list
        this.total = res.total
      })
    }

  },
  created () {
  },
  mounted () {
    // 获取报名人员列表
    this.getTableData()
    // 获取班次
    this.getClass()
    // 获取课程专业
    // this.getCourseProfessional();
  }
};
</script>

<style lang="scss" scoped>
</style>
