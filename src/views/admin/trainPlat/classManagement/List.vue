<template>
  <div class="main">
    <el-row>
      <el-col :span="4">
        <el-form :inline="true" size="small">
          <el-form-item>
            <el-button @click="$router.push('/admin/class-add')" icon="el-icon-plus" type="primary">添加班次</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="20">
        <!-- 搜索栏 -->
        <el-form class="float-right" :inline="true" size="small" v-model="searchForm">
          <el-form-item>
            <el-date-picker
              value-format="yyyy-MM-dd"
              style="width: 150px;"
              v-model="searchForm.classStartDate"
              type="date"
              placeholder="培训开始日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item class="width-140">
            <el-input placeholder="班次名称" suffix-icon="el-icon-search" clearable v-model="searchForm.className"></el-input>
          </el-form-item>

          <el-form-item class="mr-0">
            <el-button type="primary"  @click="getTableData">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 数据列表展示 -->
    <el-table :data="tableData" border>
      <el-table-column  prop="className" align="center" label="班次名称"></el-table-column>
      <el-table-column prop="classStartDate"  value-format="yyyy-MM-dd" align="center" label="培训开始时间"></el-table-column>
      <el-table-column  prop="classEndDate" align="center" label="培训结束时间"></el-table-column>
      <el-table-column  prop="companyName" align="center" label="培训单位"></el-table-column>
      <el-table-column  prop="type" align="center" label="班次类别">
        <template slot-scope="scope">
          {{scope.row.type==0?'线上培训班':'线下培训班'}}
        </template>
      </el-table-column>
      <el-table-column align="center" width="180px" label="操作">
        <template slot-scope="scope">
<!--          <el-button type="text" size="small" @click="$router.push(`edit/${scope.row.id}`)">预览</el-button>-->
          <el-button type="text" size="small" @click="$router.push(`/admin/class-edit/${scope.row.id}`)">修改</el-button>
          <el-button   @click="$router.push(`/admin/course-list/${scope.row.id}?type=${scope.row.type}`)"  type="text" size="small">课程</el-button>
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
        classStartDate: null,
        className: null,
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
    deleteExam (row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          id: row.id
        }
        this.$api.class.deleteClass(data).then(res => {
          this.$message.success('删除成功')
          // 获取最新
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
    // 获取班次列表
    getTableData () {
      const data = {
        className: this.searchForm.className,
        pageNum: this.searchForm.page,
        pageSize: this.searchForm.limit,
        classStartDate: this.searchForm.classStartDate
      }
      this.$api.class.getClassList(data).then(res => {
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
    // 获取班次列表
    this.getTableData()
    // 获取课程专业
  //  this.getCourseProfessional();
  }
};
</script>

<style lang="scss" scoped>
</style>
