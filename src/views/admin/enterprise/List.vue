<template>
  <div class="main">
    <el-row>
      <el-col :span="4">
        <el-form :inline="true" size="small">
          <el-form-item>
            <el-button @click="$router.push('/admin/enterprise-add')" icon="el-icon-plus" type="primary">添加企业</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <!-- 搜索栏部分 -->
      <el-col :span="20">
        <el-form class="float-right" :inline="true" size="small" v-model="searchForm">
          <el-form-item>
            <el-input placeholder="请输入关键词搜索" suffix-icon="el-icon-search" clearable
                      v-model="searchForm.keywords"></el-input>
          </el-form-item>
          <el-form-item class="mr-0">
            <el-button type="primary" @click="getTableData">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 表格数据展示 -->
    <el-table
      :data="tableData"
      border
     >
      <el-table-column
        show-overflow-tooltip
        prop="companyName"
        align="center"
        label="企业名称">
      </el-table-column>
      <el-table-column
        prop="cityArea"
        width="200"
        show-overflow-tooltip
        align="center"
        label="地区">
        <template slot-scope="scope">
          <span>{{scope.row.cityName}}/{{scope.row.areaName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="streetName"
        width="120"
        show-overflow-tooltip
        align="center"
        label="街道">
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="address"
        align="center"
        label="详细地址">
      </el-table-column>
      <el-table-column
        width="120"
        show-overflow-tooltip
        prop="industryName"
        align="center"
        label="行业分类">
      </el-table-column>
      <el-table-column
        prop="creditCode"
        align="center"
        label="统一社会信用代码">
      </el-table-column>
      <el-table-column
        align="center"
        width="140px"
        label="操作">
        <template slot-scope="scope">
          <el-button
            @click="$router.push(`/admin/enterprise-edit/${scope.row.id}`)"
            type="text"
            size="small">编辑</el-button>
          <el-button
            class="color-danger"
            size="mini"
            type="text"
            @click="deleteRow(scope.row)">删除
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
import _ from 'lodash';

export default {
  name: 'Index',
  data () {
    return {

      searchForm: {
        keywords: null,
        page: 1,
        limit: 10
      },
      tableData: [],
      total: null,
      professionalOption: []
    }
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
    deleteRow (row) {
      this.$confirm('此操作将永久删除该企业, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.enterprise.deleteEnterprise([row.id]).then(res => {
          this.$message.success('删除成功')
          this.getTableData()
        })
      }).catch(() => {
      });
    },
    // 获取企业列表数据
    getTableData: _.throttle(function () {
      const data = {
        keyWord: this.searchForm.keywords,
        pageNum: this.searchForm.page,
        pageSize: this.searchForm.limit
      }
      this.$api.enterprise.getEnterpriseManageList(data).then(res => {
        this.tableData = res.list
        this.total = res.total
      })
    }, 500)
  },
  created () {

  },
  mounted () {
    // 获取企业列表数据
    this.getTableData()
  }
}
</script>

<style lang="scss" scoped>

</style>
