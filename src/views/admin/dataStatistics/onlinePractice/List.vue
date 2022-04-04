<template>
  <div class="main">
    <el-container>
      <el-aside v-show="$localStorage.get('userInfo').roleCode === 'administrator'" class="mr-20">
        <div class="aside">
          <header>
            <p class="fs-14">共{{totalEnter}}个公司</p>
          </header>
          <div class="padding-20 pt-14 pb-14">
            <el-input placeholder="请输入公司名称" size="small" v-model="searchEnterForm.keyWord">
              <el-button slot="append" type="primary">搜索</el-button>
            </el-input>
          </div>
          <div class="pb-20">
            <!-- 企业列表展示 -->
            <el-table
              :show-header="false"
              :highlight-current-row="true"
              :data="tableEnterData"
              :row-class-name="({row}) => {return row.id === comid ? 'selected-row' : ''}"
              @cell-click="cellClick"
            >
              <el-table-column width="4px" align="center"></el-table-column>
              <el-table-column prop="companyName" align="center"></el-table-column>
            </el-table>
            <div class="mt-10 pb-10">
              <!-- 企业列表格数据的分页的功能 -->
              <el-pagination
                :small="true"
                class="float-right"
                hide-on-single-page
                @current-change="(val) => {searchEnterForm.page = val}"
                :current-page="searchEnterForm.page"
                layout="prev, pager, next"
                :total="totalEnter"
              ></el-pagination>
            </div>
          </div>
        </div>
      </el-aside>
      <el-main>
        <div class="pb-30 enter">
          <!-- 搜索栏部分  searchForm-->
          <el-row>
            <el-col :span="24">
              <el-form
                class="float-right"
                :inline="true"
                size="small"
                v-model="searchForm"
              >
                <el-form-item class="width-180">
                  <el-input
                    v-model="searchForm.name"
                    placeholder="姓名"
                    suffix-icon="el-icon-search"
                    clearable
                  ></el-input>
                </el-form-item>
                <el-form-item class="mr-0">
                  <el-button type="primary" @click="getUserOnlinePractice">搜索</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <!-- 表格数据部分 -->
          <el-table :data="tableData" border>
            <el-table-column align="center" prop="uname" label="姓名"></el-table-column>
            <el-table-column align="center" prop="departmentName" label="所属部门"></el-table-column>
            <el-table-column align="center" prop="courseHour" label="课时数"></el-table-column>
            <el-table-column align="center" prop="onlineTime" label="学习时长(min)"></el-table-column>
            <el-table-column align="center" prop="rate" label="完成课程/所有课程"></el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button
                  type="warning"
                  @click="$router.push(`/admin/data-statistics/online-practice-history/${scope.row.uid}`)"
                  size="small"
                >学习记录
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="mt-10 pb-10">
            <!-- 线上培训记录表格数据的分页的功能 -->
            <el-pagination
              class="float-right"
              hide-on-single-page
              :current-page="searchForm.page"
              @current-change="(val) => {searchForm.page = val}"
              background
              layout="total, prev, pager, next, jumper"
              :total="totalOnline"
            ></el-pagination>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'Index',
  data () {
    return {
      totalEnter: 0,
      // 联动
      departOption: [],
      departOptionProps: {
        value: 'id',
        label: 'name',
        children: 'children'
      },
      comid: null,
      // 公司数据列表
      tableEnterData: [],
      // 公司搜索框
      searchEnterForm: {
        keyword: null,
        page: 1, // 第几页
        limit: 10 // 一页多少条
      },
      searchForm: {
        page: 1, // 第几页
        limit: 10, // 一页多少条
        name: null
        // depart: null
      },
      total: null,
      totalOnline: null,
      tableData: []
    };
  },
  watch: {
    // 企业数据搜索深度监控
    _searchEnterForm: {
      handler: function (newVal, oldVal) {
        if (newVal.page !== 1 && newVal.page === oldVal.page) {
          this.searchEnterForm.page = 1;
        } else {
          this.getEnterList();
        }
      },
      deep: true
    },
    // 线上培训数据搜索深度监控
    _searchForm: {
      handler: function (newVal, oldVal) {
        if (newVal.page !== 1 && newVal.page === oldVal.page) {
          this.searchForm.page = 1;
        } else {
          this.getUserOnlinePractice();
        }
      },
      deep: true
    }
  },
  computed: {
    /**
       * 监听复杂数据类型的变换
       */
    _searchEnterForm () {
      return JSON.parse(JSON.stringify(this.searchEnterForm));
    },
    _searchForm () {
      return JSON.parse(JSON.stringify(this.searchForm));
    }
  },
  methods: {
    // 搜索企业数据
    searchEnter () {
      this.getEnterList();
    },
    // 企业行点击事件方法
    cellClick (row, column, cell, event) {
      this.row = row;
      this.column = column;
      this.comid = row.id;
      this.searchForm.page = 1
      // 加载线上培训数据
      this.getUserOnlinePractice();
    },
    // 企业数据加载
    getEnterList: _.throttle(function () {
      return new Promise((resolve, reject) => {
        const data = {
          keyWord: this.searchEnterForm.keyWord,
          pageSize: this.searchEnterForm.limit,
          pageNum: this.searchEnterForm.page
        };
        this.$api.enterprise.getEnterpriseManageList(data).then((res) => {
          this.tableEnterData = res.list;
          this.totalEnter = res.total;
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    }, 1000),
    // 获取员工线上记录数据
    getUserOnlinePractice: _.throttle(function () {
      const data = {
        pageNum: this.searchForm.page,
        pageSize: this.searchForm.limit,
        companyId: this.comid,
        // departmentId: this.searchForm.depart,
        uname: this.searchForm.name
      };
      this.$api.statistics.getUserOnlinePractice(data).then((res) => {
        // 将学习时长进行数据转换
        this.tableData = res.list.map((item) => {
          return {
            ...item,
            rate: (item.utrainCourseFinishCount) + '/' + (item.utrainCourseCount),
            onlineTime: (item.onlineTime / 60).toFixed(0)
          };
        });
        this.totalOnline = res.total;
      });
    }, 1000)
  },
  created () {
  },
  mounted () {
    // 企业表格加载
    this.getEnterList().then(() => {
      this.comid = this.tableEnterData[0].id
      this.getUserOnlinePractice();
    })
  }
};
</script>

<style lang="scss" scoped>
  /deep/ .el-main {
    padding: 0;
  }
  .aside {
    border: 1px solid #EAECF0;
    border-radius: 4px;

    header {
      height: 50px;
      border-bottom: 1px solid #D8E3ED;
      display: flex;
      align-items: center;

      p {
        font-weight: bold;
        margin-left: 20px;
        text-indent: 16px;
        position: relative;

        &:before {
          display: block;
          position: absolute;
          top: -2px;
          content: "";
          width: 6px;
          height: 20px;
          background: #409EFF;
          border-radius: 3px;
        }
      }
    }

    /deep/ .el-input-group__append {
      border: none;
      background-color: #409EFF;
      color: white;
    }

    /deep/ .selected-row {
      color: #4581FE;
      background-color: #EBF2FF;

      td:first-child {
        background-color: #409EFF;
      }
    }
  }

  .enter {
    border: 1px solid #EAECF0;
    border-radius: 4px;
    padding: 20px;
  }
</style>
