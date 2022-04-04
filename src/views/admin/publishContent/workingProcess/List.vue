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
            <el-button icon="el-icon-plus" type="primary" @click="add">添加工作进程</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- 数据列表展示 -->
    <el-table :data="tableData" border>
      <el-table-column width="200" prop="title" align="center" label="标题"></el-table-column>
      <el-table-column width="100" prop="title" align="center" label="进程类型">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 0">图文</span>
          <span v-if="scope.row.type === 1">视频</span>
          <span v-if="scope.row.type === 2">推文</span>
        </template>
      </el-table-column>
      <el-table-column width="100" prop="creatorName" align="center" label="发布人"></el-table-column>
      <el-table-column width="200" prop="createTime" align="center" label="发布时间"></el-table-column>
      <el-table-column label="附件">
        <template slot-scope="scope">
          <div v-if="scope.row.type === 0" class="display-flex ai-center margin-4 ml-0 cursor-pointer" style="flex-wrap: wrap">
            <img @click="clickImg(item)"  v-for="(item, index) in scope.row.attachmentList" :key="index" class="width-80 margin-6" :src="item.url" alt="">
          </div>
          <template v-else>
            <div v-for="(item, index) in scope.row.attachmentList" :key="index" class="display-flex ai-center margin-4 ml-0 cursor-pointer">
              <el-link @click="window.open(item.url)">{{item.url}}</el-link>
            </div>
          </template>
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
      <el-tabs v-model="dialog.form.type" @tab-click="dialog.form.file = []">
        <el-tab-pane label="图文" name="0"></el-tab-pane>
        <el-tab-pane label="视频" name="1"></el-tab-pane>
        <el-tab-pane label="推文" name="2"></el-tab-pane>
      </el-tabs>
      <el-form :model="dialog.form" ref="ruleForm" label-width="100px">
        <el-form-item label="标题" prop="title" :rules="[{ required: true, message: '请输入标题', trigger: 'blur' }]">
          <el-input v-model="dialog.form.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <div id="editor"></div>
        </el-form-item>
        <el-form-item label="上传封面" v-if="dialog.form.type === '2'" required>
          <el-upload
            ref="uploadCover"
            :http-request="uploadCover"
            action=""
            accept=".jpg,.png"
            :on-preview="(e) => window.open(e.url)"
            :on-remove="removeCover"
            :limit="1"
            :file-list="dialog.form.cover">
            <el-button size="small" type="primary">选择图片</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="上传附件" v-if="dialog.form.type === '2'">
          <el-upload
            ref="uploadFile"
            :http-request="uploadFile"
            action=""
            :on-preview="(e) => window.open(e.url)"
            :on-remove="handleRemove"
            :limit="1"
            :file-list="dialog.form.file">
            <el-button size="small" type="primary">选择附件</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="上传视频" v-if="dialog.form.type === '1'">
          <el-upload
            ref="uploadFile"
            :http-request="uploadFile"
            action=""
            accept=".mp4"
            :on-preview="(e) => window.open(e.url)"
            :on-remove="handleRemove"
            :limit="1"
            :file-list="dialog.form.file">
            <el-button size="small" type="primary">选择视频</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="上传图片" v-if="dialog.form.type === '0'">
          <el-upload
            ref="uploadFile"
            :http-request="uploadFile"
            action=""
            accept=".jpg,.png"
            :on-preview="(e) => window.open(e.url)"
            :on-remove="handleRemove"
            multiple
            :limit="9"
            :file-list="dialog.form.file">
            <el-button size="small" type="primary">选择图片</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialog.show = false">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
    <el-image-viewer
      v-if="showImg"
      :on-close="() => {showImg = false}"
      :url-list="imgUrl" />
  </div>
</template>

<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import E from 'wangeditor'
export default {
  name: 'Index',
  components: { ElImageViewer },
  data () {
    return {
      loading: false,
      window,
      dialog: {
        title: '',
        show: false,
        form: {
          cover: [],
          title: '',
          type: '0',
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
      id: null,
      imgUrl: [],
      showImg: false
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
    clickImg (data) {
      this.imgUrl = [data.url]
      this.showImg = true
    },
    uploadFile (e) {
      this.dialog.form.file.push(e.file)
    },
    handleRemove (file) {
      this.dialog.form.file = this.dialog.form.file.filter(item => item.uid !== file.uid)
      this.$refs.uploadFile.uploadFiles = this.$refs.uploadFile.uploadFiles.filter(item => item.uid !== file.uid)
    },
    uploadCover (e) {
      this.dialog.form.cover.push(e.file)
    },
    removeCover (file) {
      this.dialog.form.cover = this.dialog.form.file.filter(item => item.uid !== file.uid)
      this.$refs.uploadCover.uploadFiles = this.$refs.uploadCover.uploadFiles.filter(item => item.uid !== file.uid)
    },
    add () {
      this.id = null
      if (this.editor) {
        this.editor.destroy()
      }
      this.editor = null
      this.dialog = {
        title: '添加工作进程',
        show: true,
        form: {
          cover: [],
          title: '',
          type: '0',
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
          'image',
          'table',
          'undo',
          'redo'
        ]
        this.editor.config.customUploadImg = async (resultFiles, insertImgFn) => {
          const uploadList = []
          const readFileAsync = file => new Promise(resolve => {
            const reader = new FileReader()
            reader.onload = evt => {
              insertImgFn(evt.target.result)
              resolve(evt.target.result)
            }
            reader.readAsDataURL(file)
          })
          for (let i = 0; i < resultFiles.length; i++) {
            uploadList.push(await readFileAsync(resultFiles[i]))
          }
        }
        this.editor.create()
      })
    },
    edit (row) {
      this.id = row.id
      this.$api.workingProcess.info(row.id).then(res => {
        this.dialog.title = '编辑工作进程'
        this.dialog.show = true
        this.dialog.form.title = res.title
        this.dialog.form.cover = res.footprintCover ? [res.footprintCover].map(item => {
          return {
            ...item,
            name: item.filename
          }
        }) : []
        this.dialog.form.type = String(res.type)
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
            'image',
            'table',
            'undo',
            'redo'
          ]
          this.editor.config.customUploadImg = async (resultFiles, insertImgFn) => {
            const uploadList = []
            const readFileAsync = file => new Promise(resolve => {
              const reader = new FileReader()
              reader.onload = evt => {
                insertImgFn(evt.target.result)
                resolve(evt.target.result)
              }
              reader.readAsDataURL(file)
            })
            for (let i = 0; i < resultFiles.length; i++) {
              uploadList.push(await readFileAsync(resultFiles[i]))
            }
          }
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
          if (this.dialog.form.type === '2') {
            if (this.dialog.form.cover.length) {
              this.dialog.form.cover.forEach(item => {
                if (!item.id) {
                  data.append('cover', item)
                }
              })
            } else {
              this.loading = false
              return this.$message.warning('请上传封面')
            }
          }
          data.append('title', this.dialog.form.title)
          data.append('type', this.dialog.form.type)
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
            this.$api.workingProcess.edit(data).then(res => {
              this.dialog.show = false
              this.$message.success('编辑成功')
              this.getTableData()
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          } else {
            this.$api.workingProcess.add(data).then(res => {
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
        this.$api.workingProcess.del(row.id).then(res => {
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
      this.$api.workingProcess.list(data).then(res => {
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
  /deep/.el-tabs__nav {
    width: 100%;
    .el-tabs__item {
      width: 33.3%;
      text-align: center;
    }
  }
</style>
