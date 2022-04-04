<template>
  <div class="main">
<!--    <img :src="URL" alt="">-->
    <el-row>
      <el-col :span="4">
        <el-form :inline="true" size="small">
          <el-form-item>
            <el-button @click="batchCode()"  type="primary">二维码导出</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="20">
        <!-- 搜索栏 -->
        <el-form class="float-right" :inline="true" size="small" v-model="searchForm">
          <el-form-item  >
            <el-select v-model="searchForm.classesId"  clearable placeholder="请选择培训班次">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.className"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="width-120">
            <el-select clearable v-model="searchForm.eduType" placeholder="培训类型">
              <el-option label="安全管理员" :value='1'></el-option>
              <el-option label="主要负责人" :value='2'></el-option>
              <el-option label="班组长" :value='3'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="width-180" >
            <el-input placeholder="姓名/身份证"  clearable v-model="searchForm.keyWord"></el-input>
          </el-form-item>
          <el-form-item class="width-120">
            <el-input placeholder="证书编号"  clearable v-model="searchForm.cerId"></el-input>
          </el-form-item>
          <el-form-item  class="width-120" prop="status">
            <el-select v-model="searchForm.status" clearable @clear="searchForm.status = null"  placeholder="证书有效性">
              <el-option label="生效中" :value='1'></el-option>
              <el-option label="已过期" :value='2'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="width-120">
            <el-input placeholder="单位名称"  clearable v-model="searchForm.companyName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              value-format="yyyy-MM-dd"
              style="width: 150px;"
              v-model="searchForm.gmtCreate"
              type="date"
              placeholder="发证日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              value-format="yyyy-MM-dd"
              style="width: 150px;"
              v-model="searchForm.startDate"
              type="date"
              placeholder="有效开始日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item class="mr-0">
            <el-button type="primary"  @click="getTableData">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 数据列表展示 -->
    <el-table :data="tableData" border     @selection-change="(val) => {selection = val}">
      <el-table-column width="120" prop="name" align="center" label="姓名"></el-table-column>
      <el-table-column width="120" prop="eduType" align="center" label="培训类型">

        <template slot-scope="scope">
          <span v-if="scope.row.eduType === 1">安全管理员</span>
          <span v-if="scope.row.eduType === 2">主要负责人</span>
          <span v-if="scope.row.eduType === 3">班组长</span>

        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="companyName" align="center" label="单位名称"></el-table-column>
      <el-table-column show-overflow-tooltip prop="cerId" align="center" label="证书编号"></el-table-column>
      <el-table-column show-overflow-tooltip prop="idCard" align="center" label="身份证号"></el-table-column>
      <el-table-column width="120" prop="gmtCreate" align="center" label="发证日期"></el-table-column>
      <el-table-column width="100" prop="status" align="center" label="证书状态">
        <template slot-scope="scope">
          <span class="color-success" v-if="scope.row.status === 1">生效中</span>
          <span class="color-danger" v-else>已过期</span>
        </template>

      </el-table-column>

      <el-table-column  prop="startDate" align="center" label="有效期">
        <template slot-scope="scope">
          {{scope.row.startDate}} — {{scope.row.endDate}}
        </template>
      </el-table-column>
      <el-table-column align="center" width="240px" label="操作">
        <template slot-scope="scope">
          <el-button @click="detail(scope.row)" type="text" size="small">详细信息</el-button>
          <el-button @click="$router.push(`/admin/cert-record/${scope.row.id}`)" type="text" size="small">培训记录</el-button>
              <el-button type="text" @click="show(scope.row.id)"> 二维码 </el-button>
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
      <el-image-viewer
        v-if="showImg"
        :on-close="() => {showImg = false}"
        :url-list="imgUrl" />
    </div>
    <!--详情弹框-->
    <el-dialog
      width="800px"
      :title="stuDialog.title"
      :visible.sync="stuDialog.show">
      <el-form :model="stuDialog.form" ref="leaderForm" label-width="80px">

        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name" >
              <el-input disabled v-model="stuDialog.form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="sex" >
              <el-select disabled  v-model="stuDialog.form.sex" placeholder="请选择性别">
                <el-option label="男" :value='0'></el-option>
                <el-option label="女" :value='1'></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="培训类型" prop="eduType" >
              <el-select disabled v-model="stuDialog.form.eduType" >
                <el-option label="安全管理员" :value='1'></el-option>
                <el-option label="主要负责人" :value='2'></el-option>
                <el-option label="班组长" :value='3'></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="培训项目" prop="eduProject" >
              <el-select disabled v-model="stuDialog.form.eduProject" >
                <el-option label="安全初训" :value='1'></el-option>
                <el-option label="安全复训" :value='2'></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="最高学历" prop="education" >
              <el-input disabled v-model="stuDialog.form.education" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号码" prop="idCard">
              <el-input disabled v-model="stuDialog.form.idCard" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="单位名称" prop="companyName" >
              <el-input disabled v-model="stuDialog.form.companyName" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报名时间" prop="gmtCreate" >
              <el-input disabled v-model="stuDialog.form.gmtCreate" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer">
        <el-button @click="stuDialog.show = false">取 消</el-button>
        <!--        <el-button type="primary" @click="addstuSubmit('stuForm')">确 定</el-button>-->
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import Axios from 'axios'
export default {
  name: 'Index',
  components: { ElImageViewer },
  data () {
    return {
      options: [],
      // 批量导出的所有多的id
      ids: '',
      imgUrl: [],
      // 批量选择
      selection: [],
      qrcode: null,
      path: '',
      showImg: false,
      // 详情弹框
      stuDialog: {
        title: '',
        show: false,
        id: null,
        form: {
          gmtCreate: '',
          time: '',
          cerId: '', // 证书编号
          companyId: '123',
          companyName: '安胜达',
          eduType: null,
          eduProject: '',
          education: '',
          endDate: '',
          fileIds: [
          ],
          idCard: '',
          jobName: '',
          name: '',
          sex: null,
          email: '',
          wx: '',
          phone: ''
        }
      },
      searchForm: {
        eduType: null,
        cerId: null,
        classesId: null,
        companyName: null,
        endDate: null,
        gmtCreate: null,
        keyWord: null,
        startDate: null,
        status: null,
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
    // 批量导出二维码
    batchCode () {
      // const data = {
      //   eduType: this.searchForm.eduType,
      //   cerId: this.searchForm.cerId,
      //   keyWord: this.searchForm.keyWord,
      //   classesId: this.searchForm.classesId,
      //   companyName: this.searchForm.companyName,
      //   status: this.searchForm.status,
      //   gmtCreate: this.searchForm.gmtCreate,
      //   startDate: this.searchForm.startDate,
      //   pageNum: '',
      //   pageSize: ''
      // }
      // console.log(data)
      // this.$api.class.getCertList(data).then(res => {
      //   console.log(res);
      //   // this.tableData = res.list
      //   // console.log(this.tableData);
      //   // this.total = res.total
      // })

      const data = {
        eduType: this.searchForm.eduType,
        cerId: this.searchForm.cerId,
        keyWord: this.searchForm.keyWord,
        classesId: this.searchForm.classesId,
        companyName: this.searchForm.companyName,
        status: this.searchForm.status,
        gmtCreate: this.searchForm.gmtCreate,
        startDate: this.searchForm.startDate,
        pageNum: this.searchForm.page,
        pageSize: this.searchForm.limit
      }

      const axios = Axios.create({
        baseURL: this.$methods.baseURL(),
        headers: { Authorization: this.$localStorage.get('token') },
        responseType: 'blob'
      });
      axios.post('/trainCertificate/exportCode', data).then(res => {
        // 下载文件->文件流转换
        const blob = new Blob([res.data], {
          type: 'application/zip'

        });
        const eleLink = document.createElement('a');
        eleLink.style.display = 'none';
        // 字符内容转变成blob地址
        console.log(res);
        eleLink.download = `${decodeURI(res.headers.filename.split('.')[0])}.zip`
        eleLink.href = URL.createObjectURL(blob);
        // 触发点击
        document.body.appendChild(eleLink);
        eleLink.click();
        // 然后移除
        document.body.removeChild(eleLink);
      })
    },
    // 查看二维码
    show (id) {
      console.log(id)
      this.$message({
        message: '右击二维码可复制或下载',
        type: 'success',
        duration: 5000
      });
      Axios.create().get(`${this.$methods.baseURL()}/trainCertificate/qrCode?id=${id}`, {
        responseType: 'blob',
        headers: {
          Authorization: this.$localStorage.get('token')
        }
      }).then(res => {
        // 下载文件->文件流转换
        const blob = new Blob([res.data], {
          type: 'image/png', // 将会被放入到blob中的数组内容的MIME类型
          name: '二维码'
        });
        const URL = window.URL.createObjectURL(blob);
        this.imgUrl = [URL]
        this.showImg = true
      })
    },
    // 学员详情按钮
    detail (row) {
      console.log(99)
      this.stuDialog.title = '详细信息'
      this.stuDialog.show = true
      console.log(this.stuDialog.show)
      this.stuDialog.form = {
        gmtCreate: row.gmtCreate,
        cerId: row.cerId, // 证书编号
        companyId: row.companyId,
        companyName: row.companyName,
        eduType: row.eduType,
        eduProject: row.eduProject,
        education: row.education,
        idCard: row.idCard,
        jobName: row.jobName,
        name: row.name,
        sex: row.sex,
        email: row.email,
        wx: row.wx,
        phone: row.phone
      }
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
        this.$api.exam.deleteExam(data).then(res => {
          this.$message.success('删除成功')
          // 获取最新考试咧白哦
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
    // 获取班次
    getClass () {
      this.$api.class.getClass().then(res => {
        this.options = res.map(item => {
          return {
            id: item.id,
            className: item.className
          }
        })
        console.log(this.options)
      })
    },
    // 获取列表
    getTableData () {
      const data = {
        eduType: this.searchForm.eduType,
        cerId: this.searchForm.cerId,
        keyWord: this.searchForm.keyWord,
        classesId: this.searchForm.classesId,
        companyName: this.searchForm.companyName,
        status: this.searchForm.status,
        gmtCreate: this.searchForm.gmtCreate,
        startDate: this.searchForm.startDate,
        pageNum: this.searchForm.page,
        pageSize: this.searchForm.limit
      }
      console.log(data)
      this.$api.class.getCertList(data).then(res => {
        console.log(res);
        this.tableData = res.list
        console.log(this.tableData);
        this.total = res.total
      })
    }
  },
  created () {},
  mounted () {
    // 获取班次
    this.getClass();

    // const data = {
    //   eduType: this.searchForm.eduType,
    //   cerId: this.searchForm.cerId,
    //   keyWord: this.searchForm.keyWord,
    //   classesId: this.searchForm.classesId,
    //   companyName: this.searchForm.companyName,
    //   status: this.searchForm.status,
    //   gmtCreate: this.searchForm.gmtCreate,
    //   startDate: this.searchForm.startDate,
    //   pageNum: this.searchForm.page,
    //   pageSize: this.searchForm.limit
    // }
    // console.log(data)
    // this.$api.class.getCertList(data).then(res => {
    //   console.log(res);
    //   this.tableData = res.list
    //   console.log(this.tableData);
    //   this.total = res.total
    // });

    // 获取证书列表
    this.getTableData()
  }
};
</script>

<style lang="scss" scoped>
</style>
