<template>
  <el-container class="main">
    <el-header class="padding-0">
      <header class="display-flex ai-center jc-space-between">
        <el-button type="primary" size="small" @click="$router.back()">返回</el-button>
        <el-button type="primary" size="small" @click="printPDF">导出证书</el-button>
      </header>
    </el-header>
    <el-main id="printPDF">
      <div>
        <div class="info display-flex ai-center jc-space-between">
          <p class="ml-0 fs-14 mt-14">
            <span class="fw-bolder">{{username}}</span>
            <span>手机号：{{cellPhoneNumber}}</span>
            <span>岗位：{{position}}</span>
            <span>培训学时：{{courseNumber}}</span>
            <span>培训年度：{{year}}</span>
          </p>
          <img v-if="state" class="mr-20 pr-20 imgPass" :src="ImgPass" alt="">
        </div>
        <div class="display-flex ai-center jc-space-between mt-20 mb-10">
          <h5 class="fs-16">学习历史记录</h5>
          <div>
            <el-select class="mr-20" clearable v-model="searchForm.year" placeholder="培训年度">
              <el-option :label="`${Number($moment().format('yyyy')) - 2}年`" :value="`${Number($moment().format('yyyy')) - 2}年`"></el-option>
              <el-option :label="`${Number($moment().format('yyyy')) - 1}年`" :value="`${Number($moment().format('yyyy')) - 1}年`"></el-option>
              <el-option :label="`${Number($moment().format('yyyy'))}年`" :value="`${Number($moment().format('yyyy'))}年`"></el-option>
            </el-select>
            <el-select clearable v-model="searchForm.score" placeholder="考试成绩">
              <el-option label="合格" value="3"></el-option>
              <el-option label="不合格" value="2"></el-option>
            </el-select>
          </div>
        </div>
        <el-table
          :data="tableData"
          border>
          <el-table-column
            show-overflow-tooltip
            prop="couserName"
            label="课程名称">
          </el-table-column>
          <el-table-column
            align="center"
            prop="courseHour"
            label="课时数"
            width="150">
          </el-table-column>
          <el-table-column
            align="center"
            prop="period"
            label="学习时长(min)"
            width="150">
          </el-table-column>
          <el-table-column
            align="center"
            label="考试成绩"
            width="150">
            <template slot-scope="scope">
              <span :class="scope.row.couserStatus === '3' ? 'color-success' : 'color-danger'" >{{scope.row.score ? scope.row.score : '--'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="学习进度"
            width="250">
            <template slot-scope="scope">
              <el-progress v-if="scope.row.progress === 1" :percentage="scope.row.progress * 100" status="success"></el-progress>
              <el-progress v-else :percentage="scope.row.progress * 100"></el-progress>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="createTime"
            label="完成时间"
            width="250">
          </el-table-column>
        </el-table>
        <div class="mt-20" v-show="showPage">
          <el-pagination
            class="float-right"
            hide-on-single-page
            @current-change="(val) => {searchForm.page = val}"
            :current-page="searchForm.page"
            background
            layout="total, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import DomToImage from 'dom-to-image'
import ImgPass from '@/assets/images/certificate-logo.png'
export default {
  name: 'OnlineCourseHistory',
  data () {
    return {
      showPage: true,
      state: null, // 是否合格
      ImgPass,
      searchForm: {
        score: '',
        year: '',
        page: 1,
        limit: 10
      },
      tableData: [],
      total: null,
      username: null,
      cellPhoneNumber: null,
      position: null,
      courseNumber: null,
      year: this.$moment().format('yyyy年')
    }
  },
  watch: {
    _searchForm: {
      handler: function (newVal, oldVal) {
        if (newVal.page !== 1 && newVal.page === oldVal.page) {
          this.searchForm.page = 1;
        } else {
          this.getScoreList()
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
    getScoreList () {
      return new Promise((resolve, reject) => {
        const data = {
          userId: this.$route.params.id,
          pageNum: this.searchForm.page,
          pageSize: this.searchForm.limit,
          scoreStatus: this.searchForm.score,
          yearStr: this.searchForm.year
        }
        this.$api.course.getHistoryList(data).then(res => {
          this.tableData = res.list.map(item => {
            return {
              ...item,
              period: ((item.period) / 60).toFixed(0)
            }
          }) || []
          this.total = res.total
          this.username = res.userInfo.userName
          this.state = res.userInfo.scoreStatus
          this.cellPhoneNumber = res.userInfo.moblie
          this.position = res.userInfo.position
          this.courseNumber = res.userInfo.courseHour
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    async printPDF () {
      this.showPage = false
      this.searchForm.page = 1
      await this.getScoreList()
      if (this.total > 10) {
        for (let i = 1; i <= this.total / 10; i++) {
          this.searchForm.page = i
          if (i !== 1) {
            await this.getScoreList()
          }
          DomToImage.toPng(document.getElementById('printPDF')).then(url => {
            const link = document.createElement('a');
            link.download = `证书-第${i}页.png`;
            link.href = url;
            link.click();
          })
        }
      } else {
        DomToImage.toPng(document.getElementById('printPDF')).then(url => {
          const link = document.createElement('a');
          link.download = '证书.png';
          link.href = url;
          link.click();
        })
      }
      setTimeout(() => {
        this.showPage = true
      }, 500)
    }
  },
  created () {
  },
  mounted () {
    // 加载学习记录数据
    this.getScoreList()
  }
}
</script>

<style lang="scss" scoped>
  /deep/ .el-main {
    padding: 0;
  }
  header {
    width: 100%;
  }
  .info {
    background: url("~@/assets/images/history-bg.png");
    color: #782114;
    background-size: 100%;
    margin: 0 auto;
    width: 100%;
    height: 100px;
    border-radius:4px;
    span {
      margin-left: 40px;
    }
    .imgPass {
      width: 60px;
    }
  }
</style>
