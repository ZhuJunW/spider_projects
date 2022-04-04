<template>
  <div class="main">
    <el-row>
      <el-col :span="20">
        <!-- 搜索栏 -->
        <el-form :inline="true" size="small" v-model="searchForm">
          <el-form-item>
            <el-input placeholder="请输入关键词搜索" suffix-icon="el-icon-search" clearable
                      v-model="searchForm.fuzzy"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getTableData">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4">
        <el-form class="float-right" :inline="true" size="small">
          <el-form-item class="mr-0">
            <el-button icon="el-icon-plus" type="primary" @click="add">添加政策</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 数据列表展示 -->
    <el-table :data="tableData" border>
      <el-table-column prop="title" align="center" label="政策名称"></el-table-column>
      <el-table-column width="100" prop="creatorName" align="center" label="发布人"></el-table-column>
      <el-table-column width="200" prop="createTime" align="center" label="发布时间"></el-table-column>
      <el-table-column label="附件">
        <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.attachmentList" :key="index" class="display-flex ai-center margin-4 ml-0 cursor-pointer">
              <img
                v-if="['doc', 'docx'].includes(item.filename.split('.')[item.filename.split('.').length - 1])"
                class="width-20"
                src="@/assets/images/word.png"
                alt="">
              <img
                v-if="['pdf'].includes(item.filename.split('.')[item.filename.split('.').length - 1])"
                class="width-20"
                src="@/assets/images/pdf.png"
                alt="">
              <img
                v-if="['xls', 'xlsx'].includes(item.filename.split('.')[item.filename.split('.').length - 1])"
                class="width-20"
                src="@/assets/images/excel.png"
                alt="">
              <img
                v-if="['zip'].includes(item.filename.split('.')[item.filename.split('.').length - 1])"
                class="width-20"
                src="@/assets/images/zip.png"
                alt="">
              <img
                v-if="['png', 'jpg'].includes(item.filename.split('.')[item.filename.split('.').length - 1])"
                class="width-20"
                src="@/assets/images/pic.png"
                alt="">
            <el-link class="ml-10" @click="window.open(item.url)">{{item.filename}}</el-link>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" width="180px" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
          <el-button
            class="color-danger"
            size="mini"
            type="text"
            @click="del(scope.row)"
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
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.show">
      <el-form :model="dialog.form" ref="ruleForm" label-width="100px">
        <el-form-item label="政策标题" prop="title" :rules="[{ required: true, message: '请输入政策标题', trigger: 'blur' }]">
          <el-input v-model="dialog.form.title" placeholder="请输入政策标题"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <div id="editor"></div>
        </el-form-item>
        <el-form-item label="上传附件">
          <el-upload
            ref="uploadFile"
            :http-request="uploadFile"
            action=""
            :on-preview="(e) => window.open(e.url)"
            :on-remove="handleRemove"
            multiple
            :limit="9"
            :file-list="dialog.form.file">
            <el-button size="small" type="primary">选择附件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialog.show = false">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import E from 'wangeditor'
export default {
  name: 'Index',
  data () {
    return {
      loading: false,
      window,
      dialog: {
        title: '',
        show: false,
        form: {
          title: '',
          file: []
        }
      },
      searchForm: {
        fuzzy: null,
        page: 1,
        limit: 10
      },
      tableData: [],
      total: null,
      editor: null,
      id: null
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
    uploadFile (e) {
      this.dialog.form.file.push(e.file)
    },
    handleRemove (file) {
      this.dialog.form.file = this.dialog.form.file.filter(item => item.uid !== file.uid)
      this.$refs.uploadFile.uploadFiles = this.$refs.uploadFile.uploadFiles.filter(item => item.uid !== file.uid)
    },
    add () {
      this.id = null
      if (this.editor) {
        this.editor.destroy()
      }
      this.editor = null
      this.dialog = {
        title: '添加政策',
        show: true,
        form: {
          title: '',
          file: []
        }
      }
      this.$nextTick(() => {
        this.editor = new E('#editor')
        this.editor.config.menus = [
          'head',
          'bold',
          'fontSize',
          'italic',
          'underline',
          'strikeThrough',
          'foreColor',
          'backColor',
          'list',
          'table',
          'undo',
          'redo'
        ]
        this.editor.create()
      })
    },
    edit (row) {
      this.id = row.id
      this.$api.policy.info(row.id).then(res => {
        this.dialog.title = '编辑政策'
        this.dialog.show = true
        this.dialog.form.title = res.title
        this.dialog.form.file = res.attachmentList.map(item => {
          return {
            ...item,
            name: item.filename
          }
        })
        if (this.editor) {
          this.editor.destroy()
        }
        this.editor = null
        this.$nextTick(() => {
          this.editor = new E('#editor')
          this.editor.config.menus = [
            'head',
            'bold',
            'fontSize',
            'italic',
            'underline',
            'strikeThrough',
            'foreColor',
            'backColor',
            'list',
            'table',
            'undo',
            'redo'
          ]
          this.editor.create()
          this.editor.txt.html(res.html)
        })
      })
    },
    submit () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true
          const data = new FormData()
          data.append('title', this.dialog.form.title)
          data.append('content', this.editor.txt.text())
          data.append('html', this.editor.txt.html())
          if (this.dialog.form.file.length) {
            this.dialog.form.file.forEach(item => {
              if (item.id) {
                data.append('attachmentIdList', item.id)
              } else {
                data.append('file', item)
              }
            })
          }
          if (this.id) {
            data.append('id', this.id)
            this.$api.policy.edit(data).then(res => {
              this.dialog.show = false
              this.$message.success('编辑成功')
              this.getTableData()
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          } else {
            this.$api.policy.add(data).then(res => {
              this.dialog.show = false
              this.$message.success('添加成功')
              if (this.searchForm.page !== 1) {
                this.searchForm.page = 1
              }
              this.getTableData()
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          }
        }
      });
    },
    del (row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.policy.del(row.id).then(res => {
          this.$message.success('删除成功')
          this.getTableData()
        })
      }).catch(() => {
      });
    },
    getTableData () {
      const data = {
        fuzzy: this.searchForm.fuzzy,
        pageNum: this.searchForm.page,
        pageSize: this.searchForm.limit
      }
      this.$api.policy.list(data).then(res => {
        this.tableData = res.list
        this.total = res.total
      })
    }
  },
  created () {
  },
  mounted () {
    this.getTableData()
  }
};
</script>

<style lang="scss" scoped>

</style>
