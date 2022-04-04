<template>
  <div class="main">
    <header class="display-flex ai-center jc-space-between mb-20">
<div></div>
      <div class="display-flex ai-center cursor-pointer" @click="$router.back()">
        <img width="18px" src="@/assets/images/back.png" alt="">
        <span class="fs-14 ml-10">返回证书管理</span>
      </div>
    </header>
<div>
  <el-row :gutter="20">
    <el-col :span="24"><div class="grid-content bg-purple">
      <el-button type="text" @click="show()">附件{{path ?path.length: 0}}张</el-button>
      <el-image-viewer
        v-if="showImg"
        :on-close="() => {showImg=false}"
        :url-list="path" />
    </div></el-col>
  </el-row>
    <div v-for="item in record" :key="item.classesId">

      <el-row :gutter="20">
        <el-col :span="12"><div class="grid-content bg-purple">培训单位： {{item.companyName}}</div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple">培训班次： {{item.className}}</div></el-col>

      </el-row>
      <el-row :gutter="20">
        <el-col :span="24"><div class="grid-content bg-purple">培训时间： {{item.classStartDate}}至{{item.classEndDate}}</div></el-col>
      </el-row>

    <el-table :data="item.courseList" border>
      <el-table-column  prop="courseName" align="center" label="课程名称"></el-table-column>
      <el-table-column  prop="hour" align="center" label="学时"></el-table-column>
      <el-table-column  prop="result" align="center" label="成绩"></el-table-column>
      <el-table-column  prop="remark" align="center" label="备注"></el-table-column>
    </el-table>
    </div>
  </div>
  </div>
</template>

<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
export default {
  name: 'Index',
  components: { ElImageViewer },
  data () {
    return {
      showImg: false,
      path: [],
      record: [{ classesId: '', companyName: '', classStartDate: '', className: '', classEndDate: '', courseList: [] }]
    }
  },
  watch: {},
  computed: {},
  methods: {
    show () {
      this.showImg = true
    },
    /**
     * 限制只能输入正整数
     * @param num
     */
    // 获取培训记录列表
    getTableData () {
      const data = {
        id: this.$route.params.id
      }
      this.$api.class.getRecord(data).then(res => {
        console.log(res);
        this.record = res.list
        this.path = res.path
      })
    }
  },
  created () {

  },
  mounted () {
    console.log(this.$route.params.id)
    // 获取培训记录；列表
    this.getTableData();
  }
}
</script>

<style lang="scss" scoped>
  header {
    border-bottom: 1px solid #E6E6E6;
  }
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

</style>
