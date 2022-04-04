<template>
  <div class="main">
    <el-row>
      <el-col :span="4">
        <el-form :inline="true" size="small">
          <el-form-item>
            <el-button @click="$router.push('/admin/exam-add')" icon="el-icon-plus" type="primary">添加试卷</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="20">
        <!-- 搜索栏 -->
        <el-form class="float-right" :inline="true" size="small" v-model="searchForm">
              <el-form-item class="width-140">
            <el-select clearable v-model="searchForm.categoryId" placeholder="专业类别">
              <el-option
                v-for="item in categoryOption"
                :key="item.id"
                :label="item.label"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="width-140">
            <el-select clearable v-model="searchForm.state" placeholder="是否添加题目">
              <el-option label="已添加" value="1"></el-option>
              <el-option label="未添加" value="0"></el-option>
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
    <!-- 数据列表展示 -->
    <el-table :data="tableData" border>
      <el-table-column prop="title" align="center" label="试卷标题"></el-table-column>
      <el-table-column width="120" prop="categoryName" align="center" label="专业类别"></el-table-column>
      <el-table-column width="120" prop="score" align="center" label="试卷分数"></el-table-column>
      <el-table-column width="120" prop="duration" align="center" label="考试时长"></el-table-column>
      <el-table-column width="140" prop="isAddSuject" align="center" label="是否已添加题目">
        <template slot-scope="scope">
          <span v-if="scope.row.isAddSuject">已添加</span>
          <span v-else class="color-danger">未添加</span>
        </template>
      </el-table-column>
      <el-table-column width="180" prop="createTime" align="center" label="创建时间"></el-table-column>
      <el-table-column width="120" prop="creator" align="center" label="创建人"></el-table-column>
      <!-- 列数据是switch开关 -->
      <el-table-column width="120px" prop="released" align="center" label="公开状态">
        <template slot-scope="scope">
          <el-switch
            @change="changOpen(scope.row)"
            v-model="scope.row.open"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-text="scope.row.open? '已公开' : '未公开'"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" width="180px" label="操作">
        <template slot-scope="scope">
<!--          <el-button type="text" size="small" @click="$router.push(`edit/${scope.row.id}`)">预览</el-button>-->
          <el-button type="text" size="small" @click="$router.push(`/admin/exam-edit/${scope.row.id}`)">编辑试卷</el-button>
          <el-button @click="exerciseManage(scope.row)" type="text" size="small">题目管理</el-button>
          <el-button
            class="color-danger"
            size="mini"
            type="text"
            @click="deleteExam(scope.row)"
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
  </div>
</template>

<script>
export default {
  name: 'Index',
  data () {
    return {
      searchForm: {
        categoryId: null,
        state: null,
        time: null,
        keywords: null,
        page: 1,
        limit: 10
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
    // 状态改变方法
    changOpen (row) {
      this.$api.exam.updateOpenStatus(row.id, row.open)
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
    exerciseManage (row) {
      this.$router.push({
        path: 'question-manage',
        query: {
          id: row.id
        }
      })
    },
    // 获取考试列表
    getTableData () {
      const data = {
        fuzzy: this.searchForm.keywords,
        isAddSuject: this.searchForm.state,
        pageNum: this.searchForm.page,
        pageSize: this.searchForm.limit,
        startTime: this.searchForm.time ? this.searchForm.time[0] : '',
        endTime: this.searchForm.time ? this.searchForm.time[1] : '',
        subjectId: this.searchForm.categoryId
      }
      this.$api.exam.getExamManageList(data).then(res => {
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
</style>
