<template>
  <div class="main">
    <el-row>
      <el-col :span="20">
        <!-- 搜索栏 -->
        <el-form class="float-left" :inline="true" size="small" v-model="searchForm">
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
<!--      <el-col :span="4">
            <el-button type="primary" class="float-right" size="small">导出统计报告</el-button>
      </el-col>-->
    </el-row>
    <div class="total">共 {{total}} 份课程
      <div class="mode">
        <div class="mr-10 cursor-pointer" :class="{active: tabIndex === 0}" @click="activeTab(0)"><i class="el-icon-s-data"></i>表格模式</div>
        <div>|</div>
        <div class="ml-10 cursor-pointer" :class="{active: tabIndex === 1}" @click="activeTab(1)"><i class="el-icon-s-data">图表模式</i></div>
      </div>
    </div>
    <!-- 数据列表展示 -->
    <div  v-show="tabIndex === 0">
      <el-table :data="tableData" border  ref="multipleTable"
                tooltip-effect="dark"
                style="width: 100%">
<!--        <el-table-column align="center" type="selection" width="50"></el-table-column>-->
        <el-table-column width="300" prop="courseName" align="center" label="课程名称"></el-table-column>
        <el-table-column width="180" prop="releaseDate" align="center" label="上线时间"></el-table-column>
        <el-table-column width="100" prop="learnCount" align="center" label="已学习人数"></el-table-column>
        <el-table-column align="center" label="参训率">
          <template slot-scope="scope">
            <el-progress :percentage="scope.row.learnRate*100"></el-progress>
          </template>
        </el-table-column>
        <el-table-column  align="center" label="参训合格率">
          <template slot-scope="scope">
            <el-progress :percentage="scope.row.passRate*100"></el-progress>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="80">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="openDialog(scope.row)">统计详情</el-button>
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
    <div v-show="tabIndex === 1">
      <div class="display-flex fw-wrap">
        <div class="chart-area" v-for="(item, index) in tableData" :key="index">
            <div :id="'echarts_box' + index" class="chart"></div>
            <div class="center-info">
              <div class="mb-4">{{item.learnCount}}人</div>
              <div class="course-name">
                <div class="text-overflow" :title='item.courseName'>{{item.courseName}}</div>
                <img src="@/assets/images/bubble.png">
              </div>
              <img src="@/assets/images/icon.png">
            </div>
            <div class="label">
              <div style="margin-right: 38px">
                <div>{{item.learnRate*100}}%</div>
                <div class="box"></div>
              </div>
              <div>
                <div style="color:#6FA5DD">{{item.passRate*100}}%</div>
                <div class="box" style="background:#6FA5DD"></div>
              </div>
            </div>
          <div class="btn" @click="openDialog(item)">统计详情</div>
        </div>
      </div>
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
    <el-dialog
      :title="`${courseName}统计详情`"
      :visible.sync="showDialog"
      width="800px">
        <div class="mode-detail">
          <div :class="{activeDetail: tabDetail === 0}" @click="activeDetailTab(0)"><i class="el-icon-s-data"></i>表格模式</div>
          <div :class="{activeDetail: tabDetail === 1}" @click="activeDetailTab(1)"><i class="el-icon-s-data"></i>图表模式</div>
        </div>
      <div v-show="tabDetail==0">
        <el-table :data="courseData" border>
          <el-table-column  type="index" align="center" label="序号" width="50"></el-table-column>
          <el-table-column show-overflow-tooltip  prop="companyName" align="center" label="企业名称"></el-table-column>
          <el-table-column width="80"  prop="userCount" align="center" label="账户数"></el-table-column>
          <el-table-column width="110" prop="learnCount" align="center" label="观看视频人数"></el-table-column>
          <el-table-column width="100" align="center" label="参与率">
            <template slot-scope="scope">
              {{scope.row.learnRate*100}}%
            </template>
          </el-table-column>
          <el-table-column width="100" align="center" label="参训合格率">
            <template slot-scope="scope">
              {{scope.row.passRate*100}}%
            </template>
          </el-table-column>
        </el-table>
        <div class="mt-20 display-flex fd-row-reverse">
          <!-- 表格数据的分页的功能 -->
          <el-pagination
            hide-on-single-page
            background
            @current-change="(val) => {courseForm.pageNum = val}"
            :current-page="courseForm.pageNum"
            layout="total, prev, pager, next, jumper"
            :total="courseRes.total">
          </el-pagination>
        </div>
      </div>
      <div v-show="tabDetail==1">
        <div id="barChart" :style="{height: 100 + courseData.length * 26 + 'px'}"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'Index',
  data () {
    return {
      showDialog: false,
      tabIndex: 0,
      tabDetail: 0,
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
        time: null,
        keywords: null,
        page: 1,
        limit: 10
      },
      courseName: '',
      courseForm: {
        courseId: '',
        pageNum: 1,
        pageSize: 10
      },
      courseRes: {
        total: 0
      },
      tableData: [],
      courseData: [],
      total: null,
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
    // 统计详情
    openDialog (data) {
      this.tabDetail = 0
      this.showDialog = true
      this.courseName = data.courseName
      this.courseForm.courseId = data.courseId
      this.$api.statistics.getCourseDetail(this.courseForm).then(res => {
        this.courseData = res.list
        this.courseRes = res
      })
    },
    activeTab (index) {
      this.tabIndex = index
      if (index === 1) {
        this.initEcharts()
      }
    },
    initEcharts () {
      for (let i = 0; i < this.tableData.length; i++) {
        const option = {
          title: [
            {
              show: false
            }
          ],
          polar: {
            radius: [50, '70%']
          },
          angleAxis: {
            max: 100,
            startAngle: 90,
            show: false
          },
          radiusAxis: {
            type: 'category',
            data: ['参训率', '参训合格率'],
            show: true
          },
          tooltip: {},
          series: {
            type: 'bar',
            // data: [30, 60],
            data: [this.tableData[i].learnRate * 100, this.tableData[i].passRate * 100],
            coordinateSystem: 'polar',
            label: {
              show: true,
              position: 'middle',
              formatter: '{b}'
            },
            itemStyle: {
              normal: {
                color: function (params) {
                  const colorList = ['#81B648', '#6FA5DD'];
                  return colorList[params.dataIndex]
                }
              }
            }
          }
        };
        var myChart = echarts.init(document.getElementById('echarts_box' + i))
        myChart.setOption(option)
      }
    },
    activeDetailTab (index) {
      this.tabDetail = index
      if (index === 1) {
        this.$nextTick(() => {
          this.initBarChart()
        })
      }
    },
    initBarChart () {
      const yName = []
      const yData1 = []
      const yData2 = []
      this.courseData.forEach(item => {
        yName.push(item.companyName)
        yData1.push(item.passRate * 100)
        yData2.push(item.learnRate * 100)
      })
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        color: ['#ABCAEB', '#567DCE'],
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          position: 'top',
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: yName
        },
        series: [
          {
            name: '合格率',
            type: 'bar',
            data: yData1
          },
          {
            name: '参与率',
            type: 'bar',
            data: yData2
          }
        ]
      };
      var myChart = echarts.init(document.getElementById('barChart'))
      myChart.setOption(option)
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.operateType === 'update') {
            // 调用修改接口
            this.$api.exercise.updateExercise(this.ruleForm).then(res => {
              this.$message.success('编辑成功')
              this.getTableData()
            })
          } else {
            // 调用add接口
            this.$api.exercise.createExercise(this.ruleForm).then(res => {
              this.$message.success('新增成功')
              this.getTableData()
            })
          }
        }
      });
    },
    // 获取习题列表
    getTableData () {
      const data = {
        fuzzy: this.searchForm.keywords,
        pageNum: this.searchForm.page,
        pageSize: this.searchForm.limit,
        startTime: this.searchForm.time ? this.searchForm.time[0] : '',
        endTime: this.searchForm.time ? this.searchForm.time[1] : ''
      }
      this.$api.statistics.getCourseStatistics(data).then(res => {
        this.tableData = res.list
        this.total = res.total
        if (this.tabIndex === 1) {
          this.$nextTick(() => {
            this.initEcharts()
          })
        }
      })
    }
  },
  created () {},
  mounted () {
    // 获取考试列表
    this.getTableData()
  }
};
</script>

<style lang="scss" scoped>
.total{
  margin-bottom: 20px;
  font-weight: 500;
  color: #000000;
  font-size: 16px;
  .mode{
    float: right;
    display: flex;
    color: #999999;
    font-size: 14px;
    .active{
      color: #333333;
    }
  }
}
.chart-area{
  border-radius: 4px;
  border: 1px solid #D8D8D8;
  margin-right: 14px;
  margin-bottom: 14px;
  position: relative;
  .chart{
    width: 288px;
    height: 238px;
    top: -18px;
  }
  .center-info{
    position: absolute;
    left: 136px;
    top: 102px;
    transform:translate(-50%,-50%);
    text-align: center;
    font-weight: 500;
    color: #3899FF;
    font-size: 12px;
    .course-name{
      position: relative;
      div{
        position: absolute;
        width: 100%;
        top: 40%;
        left: 50%;
        transform:translate(-50%,-50%);
        color: #FFFFFF;
      }
    }
    img{
    display: block;
      margin: auto;
  }
  }
  .label{
    display: flex;
    color: #81B648 ;
    font-size: 12px;
    position: absolute;
    top: 71%;
    left: 50%;
    transform:translate(-50%,-50%);
    >div{
      text-align: center;
      .box{
        width: 28px;
        height: 12px;
        background: #81B648 ;
        border-radius: 2px;
      }
    }
  }
  .btn{
    height: 48px;
    line-height: 48px;
    color: #1990FF;
    font-size: 14px;
    text-align: center;
    border-top:  1px solid #D8D8D8;
    cursor: pointer;
  }
}
.mode-detail{
  width: 284px;
  border-radius: 4px;
  border: 1px solid #D9D9D9;
  margin: 0 auto 20px;
  display: flex;
  overflow: hidden;
  div{
    width: 50%;
    height: 36px;
    color: #999999;
    font-size: 12px;
    text-align: center;
    line-height: 36px;
    cursor: pointer;
  }
  .activeDetail{
    background: #1990FF;
    color: #FFFFFF;
  }
}
</style>
