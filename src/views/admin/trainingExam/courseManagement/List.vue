<template>
  <div class="main">
    <el-row>
      <el-col :span="2">
        <!-- Form表单功能按钮 -->
        <el-form :inline="true" size="small">
          <el-form-item>
            <el-button @click="$router.push('/admin/course-add')" icon="el-icon-plus" type="primary">添加课程</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <!-- 搜索栏部分 Form表单-->
      <el-col :span="22">
        <el-form class="float-right" :inline="true" size="small" v-model="searchForm">
          <el-form-item class="width-140">
            <el-select clearable v-model="searchForm.released" placeholder="请选择课程状态">
              <el-option label="已上架" :value="1"></el-option>
              <el-option label="未上架" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="width-140">
            <el-select clearable v-model="searchForm.specialityid" placeholder="请选择专业类别">
              <el-option
                v-for="item in specialityNameOption"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="width-140">
            <el-select clearable v-model="searchForm.isaddExam" placeholder="是否已添加试卷">
              <el-option label="已添加" value="1"></el-option>
              <el-option label="未添加" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="width-140">
            <el-select clearable v-model="searchForm.isaddsection" placeholder="是否已添加章节">
              <el-option label="已添加" value="1"></el-option>
              <el-option label="未添加" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <!-- 日期下拉框的表单 -->
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
            <el-input placeholder="请输入关键词搜索" clearable v-model="searchForm.keywords"
                      suffix-icon="el-icon-search"></el-input>
          </el-form-item>
          <el-form-item class="mr-0">
            <el-button type="primary" @click="getTableData">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- table表格数据展示部分 el-table中用data表示表格数据-->
    <el-table :data="tableData" border>
      <!-- el-table-column 中用prop属性来对应对象中的键名即可填入数据， 用label属性来定义表格的列名。 -->
      <el-table-column show-overflow-tooltip prop="title" align="center" label="课程名字"></el-table-column>
      <el-table-column width="100" prop="specialityName" align="center" label="专业类别"></el-table-column>
      <el-table-column width="140" prop="isAddExam" align="center" label="是否已添加试卷">
        <template slot-scope="scope">
          <span v-if="scope.row.isAddExam === '1'">已添加</span>
          <span v-else class="color-danger">未添加</span>
        </template>
      </el-table-column>
      <el-table-column width="140" prop="isAddSection" align="center" label="是否已添加章节">
        <template slot-scope="scope">
          <span v-if="scope.row.isAddSection === '1'">已添加</span>
          <span v-else class="color-danger">未添加</span>
        </template>
      </el-table-column>
      <el-table-column width="80" prop="courseHour" align="center" label="课时">
        <template slot-scope="scope">
          <span>{{ scope.row.courseHour || '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180" prop="createTime" align="center" label="创建时间"></el-table-column>
      <el-table-column width="80" prop="creator" align="center" label="创建人"></el-table-column>
      <!-- 列数据是switch开关 -->
      <el-table-column width="120px" prop="released" align="center" label="状态">
        <template slot-scope="scope">
          <el-switch
            @change="changState(scope.row)"
            v-model="scope.row.released"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-text="scope.row.released? '已上架' : '未上架'"
          ></el-switch>
        </template>
      </el-table-column>
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
      <!-- 列数据的按钮切换 -->
      <el-table-column align="center" width="180px" label="操作">
        <template slot-scope="scope" style="display: block">
          <el-button @click="$router.push(`/admin/chapter-manage?id=${scope.row.id}`)" type="text" size="small">章节管理</el-button>
          <el-button @click="$router.push(`/admin/course-edit/${scope.row.id}`)" type="text" size="small">编辑</el-button>
          <el-button
            class="color-danger"
            size="small"
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
  </div>
</template>

<script>
export default {
  name: 'Index',
  data () {
    return {
      value: true,
      searchForm: {
        released: '',
        specialityid: null,
        isaddExam: null,
        isaddsection: null,
        time: null,
        keywords: null,
        page: 1,
        limit: 10
      },
      tableData: [],
      total: null,
      specialityNameOption: []
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
    changState (row) {
      const data = {
        status: row.released ? 1 : 0,
        courseId: row.id
      }
      this.$api.course.updateStatus(data)
    },
    // 状态改变方法
    changOpen (row) {
      this.$api.course.updateOpenStatus(row.id, row.open)
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
        this.$api.course.deleteCourse(data).then(res => {
          this.$message.success('删除成功')
          this.getTableData()
        })
      }).catch(() => {
      });
    },
    // 加载出课程列表数据
    getTableData () {
      const data = {
        endTime: this.searchForm.time ? this.searchForm.time[1] : '',
        isaddExam: this.searchForm.isaddExam,
        isaddsection: this.searchForm.isaddsection,
        keyWord: this.searchForm.keywords,
        pageNum: this.searchForm.page,
        pageSize: this.searchForm.limit,
        released: this.searchForm.released,
        specialityid: this.searchForm.specialityid,
        startTime: this.searchForm.time ? this.searchForm.time[0] : ''
      }
      this.$api.course.getCourseManageList(data).then(res => {
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
  created () {
  },
  mounted () {
    // 加载出课程列表数据
    this.getTableData();
    // 获取课程专业类别
    this.getCourseProfessional();
  }
};
</script>

<style lang="scss" scoped>
</style>
