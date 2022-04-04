<template>
  <div>
    <el-header class="display-flex ai-center">
      <div @click="$router.back()" class="nav"><i class="el-icon-back"></i>学习记录</div>
    </el-header>
    <div class="container">
      <el-container class="mt-20">
        <el-main>
          <div class="header">学习记录</div>
          <div class="dec" v-if="$route.query.id"><span>培训班次：{{$route.query.className}}</span><span>培训类型：安全管理员</span><span>培训项目：安全初训</span></div>
          <el-table :data="form" border :header-cell-style="{background:'#e8f7f5 !important',color:'#606266'}">
            <el-table-column v-if="!$route.query.id"
              label="班次"
              align="center"
              prop="className"
              :show-overflow-tooltip="true"
              min-width="200px"/>
            <el-table-column
              label="课程名称"
              align="center"
              prop="couserName"
              :show-overflow-tooltip="true"
              min-width="200px"/>
            <el-table-column
              label="课时"
              align="center"
              prop="courseHour"/>
            <el-table-column
              label="成绩"
              align="center"
              prop="score">
            </el-table-column>
            <el-table-column
              label="学习进度"
              align="center"
              min-width="200px">
              <template slot-scope="scope">
                <el-progress :percentage="scope.row.progress" color="#09BBA1"></el-progress>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PersonalRecord',
  data () {
    return {
      form: [],
      classId: null
    }
  },
  components: {
  },
  watch: {},
  computed: {},
  methods: {
    getHistoryList () {
      if (this.$route.query.id) {
        this.classId = this.$route.query.id
      }
      this.$api.course.getHistoryList({ pageNum: 1, pageSize: 10, classId: this.classId }).then(res => {
        this.form = res.list || []
      })
    }
  },
  created () {
  },
  mounted () {
    this.getHistoryList()
  }
}
</script>

<style lang="scss" scoped>
.el-header{
  background-color: #FFFFFF;
  border-top:1px solid #E6E6E6 ;
  div{
    width: 1360px;
    margin: 0 auto;
  }
}
.el-main{
  min-height: 600px;
  width: 937px;
  background: #FFFFFF;
  border-radius: 8px;
  padding: 20px;
}
.header{
  font-weight: 500;
  color: #333333;
  font-size: 20px;
  position: relative;
  margin-left: 16px;
  line-height: 24px;
  margin-bottom: 18px;
  &:before{
    position: absolute;
    left: -16px;
    content: "";
    width: 6px;
    height: 24px;
    background: #3BBBA1;
    border-radius: 3px;
    position: absolute;
  }
}
.dec{
  color: #666666;
  font-size: 14px;
  margin: 20px 0;
  span{
    margin-right: 30px;
  }
}
</style>
