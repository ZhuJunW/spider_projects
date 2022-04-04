<template>
  <div class="main">
    <el-row>
      <el-col :span="4">
        <el-form :inline="true" size="small">
          <el-form-item>
            <el-button @click="openDialog()" icon="el-icon-plus" type="primary">添加习题</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="20">
        <!-- 搜索栏 -->
        <el-form class="float-right" :inline="true" size="small" v-model="searchForm">
          <el-form-item class="width-140">
            <el-select clearable v-model="searchForm.state" placeholder="是否添加题目">
              <el-option label="已添加" :value="1"></el-option>
              <el-option label="未添加" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              value-format="yyyy-MM-dd"
              style="width: 300px;"
              v-model="searchForm.time"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item class="width-180">
            <el-input placeholder="请输入关键词搜索" suffix-icon="el-icon-search" clearable v-model="searchForm.keywords"></el-input>
          </el-form-item>
          <el-form-item class="mr-0">
            <el-button type="primary"  @click="getTableData">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div class="total">共找到 {{total}} 条习题列表</div>
    <!-- 数据列表展示 -->
    <el-table :data="tableData" border>
      <el-table-column prop="title" align="center" label="习题名称"></el-table-column>
      <el-table-column width="120" prop="specialityName" align="center" label="所属类别"></el-table-column>
      <el-table-column width="140" prop="isAddSubject" align="center" label="是否已添加题目">
        <template slot-scope="scope">
          <span v-if="scope.row.isAddSubject">已添加</span>
          <span v-else class="color-danger">未添加</span>
        </template>
      </el-table-column>
      <el-table-column width="180" prop="createTime" align="center" label="创建时间"></el-table-column>
      <el-table-column width="120" prop="creatorName" align="center" label="创建人"></el-table-column>
      <el-table-column align="center" width="180px" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="openDialog(scope.row)">编辑</el-button>
          <el-button @click="exerciseManage(scope.row)" type="text" size="small">题目管理</el-button>
          <el-button
            class="color-danger"
            size="mini"
            type="text"
            @click="deleteExercise(scope.row)"
          >删除</el-button>
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
    <el-dialog
      title="添加习题"
      :visible.sync="showDialog"
      width="500px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="clearfix">
        <el-form-item label="习题名称" prop="title">
          <el-input placeholder="请输入习题名称" v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="专业类别" prop="specialityId">
          <el-select class="width-percent-100" v-model="ruleForm.specialityId" placeholder="请选择专业类别">
            <el-option v-for="item in specialityNameOption"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="float-right">
          <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'Index',
  data () {
    return {
      showDialog: false,
      ruleForm: {},
      defaultForm: {
        title: '',
        specialityId: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入试卷标题', trigger: 'change' }
        ],
        specialityId: [
          { required: true, message: '请选择专业类别', trigger: 'change' }
        ]
      },
      searchForm: {
        categoryId: null,
        state: '',
        time: null,
        keywords: null,
        page: 1,
        limit: 10
      },
      tableData: [],
      total: null,
      // 专业类别
      specialityNameOption: [],
      operateType: ''
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
    openDialog (data) {
      this.showDialog = true
      if (data) {
        this.operateType = 'update'
        this.ruleForm = _.cloneDeep(data);
      } else {
        this.ruleForm = _.cloneDeep(this.defaultForm);
        this.operateType = 'add'
        this.$refs.ruleForm.resetFields();
      }
    },
    cancel () {
      this.showDialog = false
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.operateType === 'update') {
            // 调用修改接口
            this.$api.exercise.updateExercise(this.ruleForm).then(res => {
              this.$message.success('编辑成功')
              this.getTableData()
              this.showDialog = false
            })
          } else {
            // 调用add接口
            this.$api.exercise.createExercise(this.ruleForm).then(res => {
              this.$message.success('新增成功')
              this.getTableData()
              this.showDialog = false
            })
          }
        }
      });
    },
    deleteExercise (row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          id: row.id
        }
        this.$api.exercise.deleteExercise(data).then(res => {
          this.$message.success('删除成功')
          // 获取最新考试咧白哦
          this.getTableData()
        })
      }).catch(() => {});
    },
    exerciseManage (row) {
      this.$router.push({
        path: 'exercise',
        query: {
          id: row.id
        }
      })
    },
    // 获取习题列表
    getTableData () {
      const data = {
        fuzzy: this.searchForm.keywords,
        isAddSubject: this.searchForm.state === '' ? 2 : this.searchForm.state,
        pageNum: this.searchForm.page,
        pageSize: this.searchForm.limit,
        startTime: this.searchForm.time ? this.searchForm.time[0] : '',
        endTime: this.searchForm.time ? this.searchForm.time[1] : '',
        subjectId: this.searchForm.categoryId
      }
      this.$api.exercise.getExerciseManageList(data).then(res => {
        this.tableData = res.list
        this.total = res.total
      })
    },
    // 获取课程专业类别
    getCourseProfessional () {
      this.$api.course.getProfessional().then(res => {
        this.specialityNameOption = res;
      })
    }
  },
  created () {},
  mounted () {
    // 获取考试列表
    this.getTableData()
    // 获取课程专业
    this.getCourseProfessional();
  }
};
</script>

<style lang="scss" scoped>
.total{
  margin-bottom: 20px;
  font-weight: 500;
  color: #000000;
  font-size: 16px;
}
</style>
