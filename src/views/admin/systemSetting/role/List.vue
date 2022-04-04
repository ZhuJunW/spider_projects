<template>
  <div class="main">
    <el-row>
      <el-col :span="4">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="$router.push('role-add')"
        >添加角色
        </el-button>
      </el-col>
      <el-col :span="20" class="display-flex fd-row-reverse">
        <div>
          <el-input class="width-200" v-model="searchForm.fuzzy" placeholder="请输入角色名称" size="mini"></el-input>
          <el-button
            class="ml-16"
            type="primary"
            size="mini"
            @click="getTableData"
          >搜索
          </el-button>
        </div>
      </el-col>
    </el-row>
    <el-table class="mt-20" border :data="tableData">
      <el-table-column align="center" prop="roleName" label="角色名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column align="center" prop="roleCode" label="角色code" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleDel(scope.row)"
          ><span class="color-danger">删除</span>
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="$router.push(`role-edit/${scope.row.id}`)"
          >编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="display-flex fd-row-reverse mt-10">
      <el-pagination
        hide-on-single-page
        @current-change="(val) => {searchForm.page = val}"
        :current-page="searchForm.page"
        :page-size="searchForm.limit"
        small
        layout="prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>

import _ from 'lodash';

export default {
  name: 'Index',
  data () {
    return {
      tableData: [],
      total: 0,
      searchForm: {
        page: 1,
        limit: 10,
        fuzzy: ''
      }
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
      return JSON.parse(JSON.stringify(this.searchForm))
    }
  },
  methods: {
    /** 查询菜单列表 */
    getTableData: _.throttle(function () {
      const data = {
        page: this.searchForm.page,
        limit: this.searchForm.limit,
        fuzzy: this.searchForm.fuzzy
      }
      this.$api.role.getRoleList(data).then(res => {
        this.tableData = res
      })
    }),
    /** 删除按钮操作 */
    handleDel (row) {
      this.$confirm('是否确认删除该角色?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.role.delRole([row.id]).then(res => {
          this.$message.success('删除成功')
          this.getTableData()
        })
      }).catch(() => {
      });
    }
  },
  created () {

  },
  mounted () {
    this.getTableData()
  }
}
</script>

<style lang="scss" scoped>

</style>
