<template>
  <div class="main">
    <header class="display-flex ai-center jc-space-between mb-20">
      <el-button @click="$router.push(`/admin/courseclass-add/${$route.params.id}?type=${$route.query.type}`)"   icon="el-icon-plus" type="primary" size="small">新增课程 </el-button>
      <div class="display-flex ai-center cursor-pointer" @click="$router.back()">
        <img width="18px" src="@/assets/images/back.png" alt="">
        <span class="fs-14 ml-10">返回班次管理</span>
      </div>
    </header>

    <!-- 数据列表展示 -->
    <el-table :data="tableData" border>
      <el-table-column  prop="courseName" align="center" label="课程名称"></el-table-column>

      <el-table-column  prop="hour" align="center" label="学时"></el-table-column>

      <el-table-column align="center" width="180px" label="操作">

        <template slot-scope="scope">
          <el-button type="text" size="small"
                     @click="$router.push({
                      path:  `/admin/courseclass-edit/${scope.row.id}`,
                      query: {
                        id: scope.row.id,
                        courseName: scope.row.courseName,
                        hour: scope.row.hour
                      }
                     })">修改</el-button>
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
        this.$api.class.deleteCourse(data).then(res => {
          this.$message.success('删除成功')
          // 获取列
          this.getTableData()
        })
      }).catch(() => {});
    },

    // 获取班次列表
    getTableData () {
      const data = {
        classesId: this.$route.params.id,
        pageNum: this.searchForm.page,
        pageSize: this.searchForm.limit

      }
      this.$api.class.getCourseList(data).then(res => {
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
    console.log(this.$route.params.id)
    // 获取课程列表
    this.getTableData()
    // 获取课程专业
  //  this.getCourseProfessional();
  }
};
</script>

<style lang="scss" scoped>
</style>
