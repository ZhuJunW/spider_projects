<template>
  <!--  学员管理-->
  <div class="main">
    <el-row>
      <el-col :span="24">
        <!-- 搜索栏 -->
        <el-form class="float-right" :inline="true" size="small" v-model="searchForm">
          <el-form-item>
            <el-select v-model="searchForm.classesId" clearable placeholder="请选择培训班次">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.className"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="width-120">
            <el-select clearable v-model="searchForm.eduType" placeholder="培训类型">
              <el-option label="安全管理员" :value='1'></el-option>
              <el-option label="主要负责人" :value='2'></el-option>
              <el-option label="班组长" :value='3'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="width-120">
            <el-select clearable v-model="searchForm.eduProject" placeholder="培训项目">
              <el-option label="安全初训" :value='1'></el-option>
              <el-option label="安全复训" :value='2'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="width-120">
            <el-select clearable v-model="searchForm.resultStatus" placeholder="成绩录入">
              <el-option label="完成" :value='1'></el-option>
              <el-option label="未完成" :value='0'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="width-120">
            <el-select clearable v-model="searchForm.certifStatus" placeholder="证书状态">
              <el-option label="颁发" :value='1'></el-option>
              <el-option label="未颁发" :value='0'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="width-120">
            <el-input placeholder="单位名称" clearable v-model="searchForm.companyName"></el-input>
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
      <el-table-column show-overflow-tooltip prop="companyName" align="center" label="单位名称"></el-table-column>
      <el-table-column show-overflow-tooltip prop="className" align="center" label="培训班次">
      </el-table-column>
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
      <el-table-column width="120" prop="resultStatus" align="center" label="成绩录入">
        <template slot-scope="scope">
          <span v-if="scope.row.resultStatus === 1">完成</span>
          <span v-else class="color-danger">未完成</span>
        </template>
      </el-table-column>
      <el-table-column width="120" prop="certifStatus" align="center" label="证书状态">
        <template slot-scope="scope">
          <span v-if="scope.row.certifStatus ===1">颁发</span>
          <span v-else class="color-danger">未颁发</span>
        </template>
      </el-table-column>
      <el-table-column width="300" align="center" label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.isCer" type="text" size="small" @click="editLeader(scope.row)">关联证书
          </el-button>
          <el-button type="text" size="small" @click="addLeader(scope.row)">颁发证书
          </el-button>
          <el-button @click="$router.push(`/admin/courseStudent-manage/${scope.row.id}`)" type="text" size="small">
            成绩录入
          </el-button>
          <el-button @click="detail(scope.row)" type="text" size="small">学员详情</el-button>
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
    <!--颁发证书弹框-->
    <el-dialog
      width="800px"
      :title="leaderDialog.title"
      :visible.sync="leaderDialog.show">
      <el-form :model="leaderDialog.form" ref="leaderForm" label-width="80px">

        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="leaderDialog.form.name" placeholder="请输入姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="sex">
              <el-select v-model="leaderDialog.form.sex" placeholder="请选择性别">
                <el-option label="男" :value='0'></el-option>
                <el-option label="女" :value='1'></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!--          <el-col :span="12">-->
          <!--            <el-form-item label="职称" prop="jobName" >-->
          <!--              <el-input v-model="leaderDialog.form.jobName" placeholder="请输入职称"></el-input>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <el-col :span="12">
            <el-form-item label="文化程度" prop="education">
              <el-input v-model="leaderDialog.form.education" placeholder="请输入文化程度"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="leaderDialog.form.idCard" placeholder="请输入身份证号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位名称" prop="companyName">
              <el-input v-model="leaderDialog.form.companyName" placeholder="请输入单位名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="培训类型" prop="eduType">
              <el-select v-model="leaderDialog.form.eduType" placeholder="请选择培训类型">
                <el-option label="安全管理员" :value='1'></el-option>
                <el-option label="主要负责人" :value='2'></el-option>
                <el-option label="班组长" :value='3'></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="证书编号" prop="cerId">
              <el-input v-model="leaderDialog.form.cerId" placeholder="请输入证书编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
          </el-col>
        </el-row>
        <el-row>

          <el-form-item label="有效期">
            <el-date-picker
              value-format="yyyy-MM-dd"
              style="width: 300px;"
              v-model="leaderDialog.form.time"
              type="daterange"
              range-separator="至"
              start-placeholder="有效开始日期"
              end-placeholder="有效结束日期"
            ></el-date-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              class="width-percent-80"
              label="证书附件"
              prop="file1">
              <el-upload
                ref="uploadFile1"
                action="#"
                :limit="10"
                :on-remove="handleRemove1"
                :http-request="clickUploadFile1"
                :on-exceed="() => {$message.warning('最多只能上传10个文件')}"
                accept=".png,.jpg">
                <el-button icon="el-icon-upload" size="small" type="primary">证书附件</el-button>
                <div slot="tip" class="el-upload__tip">支持扩展名：.png,.jpg</div>
              </el-upload>
            </el-form-item>

          </el-col>

        </el-row>
      </el-form>
      <span slot="footer">
        <el-button @click="leaderDialog.show = false">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="addLeaderSubmit('leaderForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!--关联证书弹框-->
    <el-dialog
      width="800px"
      :title="leaderDialog2.title"
      :visible.sync="leaderDialog2.show">
      <el-table :data="tableData2" border
                @row-click="getRowInfo"
      >
        <el-table-column align="center" label="">
          <template slot-scope="scope">
            <el-radio v-model="radio" :label="scope.row.id"></el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="cerId" align="center" label="证书编号"></el-table-column>
        <el-table-column prop="name" align="center" label="姓名"></el-table-column>
        <el-table-column prop="idCard" align="center" label="身份证号">
        </el-table-column>
        <el-table-column prop="startDate" align="center" label="有效期开始">
        </el-table-column>
        <el-table-column prop="endDate" align="center" label="有效期结束">
        </el-table-column>
      </el-table>
      <el-form :model="leaderDialog2.form" ref="leaderForm2" label-width="80px">
        <el-row>
          <el-col :span="12">

          </el-col>
        </el-row>
      </el-form>
      <span slot="footer">
        <el-button @click="leaderDialog2.show = false">取 消</el-button>
        <el-button type="primary" @click="addLeaderSubmit2('leaderForm2')">确 定</el-button>
      </span>
    </el-dialog>

    <!--学员详情弹框-->
    <el-dialog
      width="800px"
      :title="stuDialog.title"
      :visible.sync="stuDialog.show">
      <el-form :model="stuDialog.form" ref="leaderForm" label-width="80px">

        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input disabled v-model="stuDialog.form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="sex">
              <el-select disabled v-model="stuDialog.form.sex" placeholder="请选择性别">
                <el-option label="男" :value='0'></el-option>
                <el-option label="女" :value='1'></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phone">
              <el-input disabled v-model="stuDialog.form.phone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位名称" prop="companyName">
              <el-input disabled v-model="stuDialog.form.companyName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="培训类型" prop="eduType">
              <el-select disabled v-model="stuDialog.form.eduType">
                <el-option label="安全管理员" :value='1'></el-option>
                <el-option label="主要负责人" :value='2'></el-option>
                <el-option label="班组长" :value='3'></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="培训项目" prop="eduProject">
              <el-select disabled v-model="stuDialog.form.eduProject">
                <el-option label="安全初训" :value='1'></el-option>
                <el-option label="安全复训" :value='2'></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="最高学历" prop="education">
              <el-input disabled v-model="stuDialog.form.education"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号码" prop="idCard">
              <el-input disabled v-model="stuDialog.form.idCard"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="电子邮箱" prop="email">
              <el-input disabled v-model="stuDialog.form.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="微信号" prop="wx">
              <el-input disabled v-model="stuDialog.form.wx"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="培训班次" prop="className">
              <el-input disabled v-model="stuDialog.form.className"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报名时间" prop="gmtCreate">
              <el-input disabled v-model="stuDialog.form.gmtCreate"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer">
        <el-button @click="stuDialog.show = false">取 消</el-button>
        <!--        <el-button type="primary" @click="addstuSubmit('stuForm')">确 定</el-button>-->
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'Index',
  data () {
    return {
      loading: false,
      // 关联证书的单选
      radio: '',
      cerId: '',
      studentId: '',
      options: [],
      // 颁发证书弹框
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
          endDate: '',
          file1: [],
          fileIds: [],
          idCard: '',
          jobName: '',
          name: '',
          sex: null,
          startDate: '',
          studentId: ''// 学员id
        }
      },
      // 关联证书弹框
      leaderDialog2: {
        title: '',
        show: false,
        stuid: null,
        form: {
          fileIds: [],
          file2: [],
          idCard: ''
        }
      },

      // 详情弹框
      stuDialog: {
        title: '',
        show: false,
        id: null,
        form: {
          className: '',
          gmtCreate: '',
          time: '',
          cerId: '', // 证书编号
          companyId: '123',
          companyName: '安胜达',
          eduType: null,
          eduProject: '',
          education: '',
          endDate: '',
          fileIds: [],
          idCard: '',
          jobName: '',
          name: '',
          sex: '',
          email: '',
          wx: '',
          phone: ''
        }
      },
      searchForm: {
        certifStatus: '',
        classesId: null,
        eduProject: null,
        eduType: null,
        keyWord: null,
        resultStatus: null,
        page: 1,
        limit: 10
      },
      tableData: [],
      tableData2: [],
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
    // 关联证书单选
    getRowInfo (row) {
      console.log(row)
      this.radio = row.id
      this.cerId = row.cerId
      // this.studentId = row.id
      // this.rowInfo= row;
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
    // 颁发证书
    clickUploadFile1 (e) {
      this.leaderDialog.form.file1.push(e.file)
      const formData = new FormData()
      this.leaderDialog.form.file1.forEach(item => {
        formData.append('files', item)
      })
      this.$api.class.fileUpload(formData).then(res => {
        this.$message.success('附件上传成功')
        console.log(res);
        this.leaderDialog.form.fileIds = res
        console.log(this.leaderDialog.form.fileIds)
      })
    },
    handleRemove1 (file) {
      console.log(file)
      this.leaderDialog.form.file1 = this.$refs.uploadFile1.uploadFiles.filter(item => item.uid !== file.uid)
      this.$refs.uploadFile1.uploadFiles = this.$refs.uploadFile1.uploadFiles.filter(item => item.uid !== file.uid)
      console.log(this.leaderDialog.form.file1)
      const formData = new FormData()
      this.leaderDialog.form.file1.forEach(item => {
        formData.append('files', item)
      })
      this.$api.class.fileUpload(formData).then(res => {
        // this.$message.success('附件上传成功')
        console.log(res);
        this.leaderDialog.form.fileIds = res
        console.log(this.leaderDialog.form.fileIds)
      })
    },

    // 颁发证书按钮
    addLeader (row) {
      console.log(5555)
      console.log(row)
      this.leaderDialog.title = '颁发证书'
      this.leaderDialog.show = true
      this.leaderDialog.stuid = row.id
      console.log(this.leaderDialog.show)
      // const data = {
      //   id: row.id
      // }
      // this.$api.class.getStudentDetail(data).then(res => {
      //   console.log(res);
      //   this.leaderDialog.form = {
      //     cerId: res.certifId, // 证书编号
      //     companyId: res.companyId,
      //     companyName: res.companyName,
      //     eduType: res.eduType ? '2' : '1',
      //     education: res.education,
      //     idCard: res.idCard,
      //     jobName: res.certifId,
      //     name: res.name,
      //     sex: res.sex,
      //     file1: []
      //   }
      // })
      this.leaderDialog.form = {
        cerId: row.certifId, // 证书编号
        companyId: row.companyId,
        companyName: row.companyName,
        eduType: row.eduType,
        education: row.education,
        idCard: row.idCard,
        // jobName: row.certifId,
        name: row.name,
        sex: row.sex,
        file1: []
      }
    },
    // 提交颁发证书
    addLeaderSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          console.log(this.leaderDialog.form.time[1])
          const data = {
            cerId: this.leaderDialog.form.cerId,
            companyId: this.leaderDialog.form.companyId,
            companyName: this.leaderDialog.form.companyName,
            eduType: this.leaderDialog.form.eduType,
            education: this.leaderDialog.form.education,
            endDate: this.leaderDialog.form.time[1],
            fileIds: this.leaderDialog.form.fileIds,
            idCard: this.leaderDialog.form.idCard,
            jobName: this.leaderDialog.form.jobName,
            name: this.leaderDialog.form.name,
            sex: this.leaderDialog.form.sex,
            startDate: this.leaderDialog.form.time[0],
            studentId: this.leaderDialog.stuid
          }
          console.log(data)
          this.$api.class.certSave(data).then(res => {
            console.log(res);
            this.leaderDialog.show = false
            this.$message.success('颁发证书成功')
            this.loading = false
            this.getTableData()
          })
        }
      });
    },
    // 关联证书按钮
    editLeader (row) {
      console.log(5555)
      console.log(row)
      this.leaderDialog2.title = '关联证书'
      this.leaderDialog2.show = true

      this.leaderDialog2.stuid = row.id
      console.log(row.idCard)
      this.leaderDialog2.idCard = row.idCard
      console.log(this.leaderDialog2.show)
      const data = {
        sfz: row.idCard
      }
      this.$api.class.getCateByIdcard(data).then(res => {
        console.log(res);
        this.leaderDialog2.form.cerId = res[0].id
        this.tableData2 = res
      })
    },
    // 提交关联证书
    addLeaderSubmit2 (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = {
            cerId: this.cerId,
            studentId: this.leaderDialog2.stuid
          }
          this.$api.class.updateStudentSave(data).then(res => {
            console.log(res);
            this.leaderDialog2.show = false
            this.$message.success('关联证书成功')
            this.getTableData()
          })
        }
      });
    },
    // 学员详情按钮
    detail (row) {
      console.log(99)
      console.log(row)
      this.stuDialog.title = '学员详情'
      this.stuDialog.show = true
      console.log(this.stuDialog.show)
      this.stuDialog.form = {
        className: row.className,
        gmtCreate: row.gmtCreate,
        cerId: row.cerId, // 证书编号
        companyId: row.companyId,
        companyName: row.companyName,
        eduType: row.eduType ? 2 : 1,
        eduProject: row.eduProject,
        education: row.education,
        idCard: row.idCard,
        jobName: row.jobName,
        name: row.name,
        sex: row.sex,
        email: row.email,
        wx: row.wx,
        phone: row.phone
      }
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
    // 分页查询学员管理
    getTableData () {
      const data = {
        certifStatus: this.searchForm.certifStatus,
        classesId: this.searchForm.classesId,
        companyName: this.searchForm.companyName,
        eduProject: this.searchForm.eduProject,
        eduType: this.searchForm.eduType,
        keyWord: this.searchForm.keyWord,
        resultStatus: this.searchForm.resultStatus,
        pageNum: this.searchForm.page,
        pageSize: this.searchForm.limit
      }
      console.log(data)
      this.$api.class.getStudentList(data).then(res => {
        console.log(res)
        this.tableData = res.list
        this.total = res.total
      })
    }

  },
  created () {
  },
  mounted () {
    this.getClass()
    // 分页查询学员管理
    this.getTableData()
  }
};
</script>

<style lang="scss" scoped>
</style>
