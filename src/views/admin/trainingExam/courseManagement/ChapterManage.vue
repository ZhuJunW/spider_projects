<template>
  <div class="chapter-manage main">
    <header class="display-flex ai-center jc-space-between">
      <h5 class="fs-16 mb-20 mt-0">课程：{{title}}</h5>
      <div class="position-relative" style="top: -10px;">
        <!-- :disabled="!!exam.id"控制按钮显示 -->
        <el-button
          :disabled="!!exam.id"
          icon="el-icon-plus"
          size="mini"
          type="primary"
          class="mr-16"
          @click="addExam"
        >添加试卷</el-button>
        <el-button icon="el-icon-plus" size="mini" type="primary" @click="addChapter">添加章节</el-button>
      </div>
    </header>
    <!--考试试卷-->
    <div class="exam mt-16 fs-14 display-flex ai-center">
      <p v-if="!exam.id" class="ml-20">请添加试卷</p>
      <div v-else class="width-percent-100 pl-20 pr-20 display-flex ai-center jc-space-between">
        <div class="display-flex ai-center">
          <p class="mr-20 display-flex ai-center">
            <i class="iconfont color-primary mr-6 iconshijuan"></i>
            考试名称：{{exam.title}}
          </p>
          <p class="mr-20 display-flex ai-center">
            <i class="iconfont color-primary mr-6 iconfenshu"></i>
            试卷分数：{{exam.Score}}
          </p>
          <p class="mr-20 display-flex ai-center">
            <i class="iconfont color-primary mr-6 iconshijian"></i>
            考试时长：{{exam.examDuration}}
          </p>
        </div>
        <div>
          <el-button type="text" class="mr-10" @click="editExam">
            <i class="iconfont iconbianji mr-8"></i>
            <span class="color-black">编辑</span>
          </el-button>
          <el-button type="text" @click="delExam">
            <i class="iconfont iconshanchu color-danger mr-8"></i>
            <span class="color-black">删除</span>
          </el-button>
        </div>
      </div>
    </div>
    <!--考试章节  根据课程来显示其相应的章节列表  -->
    <div class="chapter">
      <p>
        共{{chapterList.length}}个章节
        <span class="color-info fs-12">（提示：上下拖动章节可修改章节排序）</span>
      </p>
      <div v-if="chapterList.length" class="chapter-list">
        <draggable v-model="chapterList" @end="endDrag">
          <div
            v-for="(item, index) in chapterList"
            :key="item.id"
            class="chapter-item cursor-move mb-10"
          >
            <div class="display-flex">
              <p class="mr-20">章节{{index + 1}}</p>
              <p>{{item.title}}</p>
            </div>
            <div>
               <el-button type="text" class="mr-10" >
                  <span>{{item.lessonhour}}课时</span>
              </el-button>
              <!-- 编辑章节的方法 @click="editChapter(item) -->
              <el-button type="text" class="mr-10" @click="editChapter(item)">
                <i class="iconfont iconbianji mr-8"></i>
                <span class="color-black">编辑</span>
              </el-button>
              <el-button size="mini" type="text" @click="deleteChapter(item)">
                <i class="iconfont iconshanchu color-danger mr-8"></i>
                <span class="color-black">删除</span>
              </el-button>
            </div>
          </div>
        </draggable>
      </div>
      <div v-else class="display-flex fd-column ai-center">
        <img :src="imgEmpty" alt />
        <p  v-if="!chapterList.length" class="fs-14 color-info">请添加章节</p>
      </div>
    </div>
    <!-- 添加试卷的form表单弹框 -->
    <el-dialog :title="addExamDialogTitle"  :visible.sync="addExamDialog">
      <el-form :model="addExamForm" :rules="addExamFormRules" ref="addExamForm" label-width="80px">
        <el-form-item label="选择试卷" prop="value">
          <el-cascader
            clearable
            class="width-percent-100"
            v-model="addExamForm.value"
            :options="examOptions"
            :props="examOptionsProps"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addExamDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitAddExam">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加章节的form表单弹框 -->
    <el-dialog :title="addChapterDialogTitle" :visible.sync="addChapterDialog">
      <el-form
        :model="addChapterForm"
        :rules="addChapterFormRules"
        ref="addChapterForm"
        label-width="80px"
      >
        <el-form-item label="章节名称" prop="courseName">
          <el-input v-model="addChapterForm.courseName" placeholder="请输入章节名称"></el-input>
        </el-form-item>
        <el-form-item label="上传课程" required>
          <el-upload
            v-if="addChapterDialog"
            :on-exceed="() => {$message.warning('只能上传一个文件')}"
            :http-request="uploadFile"
            :file-list="addChapterForm.file"
            accept=".mp4,.doc,.docx,.ppt,.pptx,.pdf"
            class="upload"
            ref="uploadFile"
            :limit="1"
            drag
            action=""
            :on-remove="handleRemove"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">只能上传一个文件，mp4/word/ppt/pdf格式，最大300M</div>
          </el-upload>
        </el-form-item>
<!--        <el-form-item label="操作时长" prop="operateTime">-->
<!--          <el-select-->
<!--            class="width-percent-100"-->
<!--            v-model="addChapterForm.operateTime"-->
<!--            placeholder="请选择操作时长"-->
<!--          >-->
<!--            <el-option-->
<!--              v-for="item in operateTimeOption"-->
<!--              :key="item.id"-->
<!--              :label="item.name"-->
<!--              :value="item.id"-->
<!--            ></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item label="课时数" prop="courseTime">
          <el-input v-model="addChapterForm.courseTime" placeholder="请输入课时数"></el-input>
        </el-form-item>
      </el-form>
      <!--  -->
      <span slot="footer">
        <!-- @click="addChapterDialog = false" 取消按钮时 将编辑章节的对话框不显示 -->
        <el-button @click="addChapterDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitAddChapter">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import imgEmpty from '@/assets/images/empty-state.png';
import draggable from 'vuedraggable';
import axios from 'axios'

export default {
  name: 'ChapterManage',
  components: {
    draggable
  },
  data () {
    return {
      operateTimeOption: [
        {
          id: 30,
          name: '30分钟'
        }
      ],
      // 课程试卷选择下拉
      examOptions: [],
      examOptionsProps: {
        value: 'id',
        label: 'name',
        children: 'examList'
      },
      addExamDialog: false,
      addExamDialogTitle: '',
      // 添加试卷的框里的值
      addExamForm: {
        value: null
      },
      // 添加试卷的表单限定
      addExamFormRules: {
        value: [
          {
            required: true,
            message: '请选择试卷',
            trigger: 'change'
          }
        ]
      },
      // 编辑章节框的显示与否
      addChapterDialog: false,
      // 编辑章节框的标题
      addChapterDialogTitle: '',
      addChapterForm: {
        courseName: '',
        courseTime: '',
        operateTime: 30,
        duration: 0, // 视频时长
        fileId: null,
        file: []
      },
      // 添加章节的表单限制
      addChapterFormRules: {
        courseName: [
          {
            required: true,
            message: '请输入章节名称',
            trigger: 'blur'
          }],
        file: [{
          required: true,
          message: '请选择上传课程',
          trigger: 'change'
        }],
        operateTime: [{
          required: true,
          message: '请选择操作时长',
          trigger: 'blur'
        }],
        courseTime: [{
          required: true,
          message: '请选择课时数',
          trigger: 'blur'
        }]

      },
      imgEmpty,
      title: '',
      // 定义的试卷的对象
      exam: {
        id: null, // 区分是新增还是编辑
        title: '',
        Score: '',
        examDuration: ''

      },
      // 定义的试卷的对象 根据课程显示的章节列表
      chapterList: [],
      // 区分是新增章节还是编辑的
      chapterId: null
    };
  },
  watch: {},
  computed: {},
  methods: {
    // 上传图片删除
    handleRemove (file) {
      this.addChapterForm.fileId = null
      this.$refs.uploadFile.uploadFiles = this.$refs.uploadFile.uploadFiles.filter(item => item.uid !== file.uid)
    },
    uploadFile (e) {
      const loading = this.$loading({
        lock: true,
        text: '文件上传中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      const data = new FormData()
      data.append('file', e.file)
      const fileurl = URL.createObjectURL(e.file);
      const audioElement = new Audio(fileurl);
      audioElement.addEventListener('loadedmetadata', (_event) => {
        this.addChapterForm.duration = Number(parseInt(audioElement.duration))
      });
      axios.create({ timeout: 1000000 }).post(
        `${this.$methods.baseURL()}/course/sectionVideo/upload`,
        data,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: this.$localStorage.get('token')
          }
        }).then(res => {
        loading.close()
        this.addChapterForm.fileId = res.data.data.id
      }).catch(() => {
        this.$message.warning('上传失败')
        loading.close()
        this.$refs.uploadFile.clearFiles()
      })
    },
    // 章节的删除方法
    deleteChapter (row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const data = {
            id: row.id
          }
          this.$api.course.deleteChapter(data).then(res => {
            this.$message.success('删除成功')
            // 获取最新章节咧白哦
            this.chapterManage()
          })
        })
        .catch(() => {});
    },
    // 添加试卷按钮的点击  方法
    addExam () {
      this.addExamDialog = true;
      this.addExamDialogTitle = '添加试卷';
      this.addExamForm.value = null;// 将新增试卷的编辑框清空
    },
    // 点击编辑试卷的方法
    editExam () {
      this.addExamDialog = true;
      this.addExamDialogTitle = '编辑考试';
    },
    // 试卷的删除方法
    delExam () {
      this.$confirm('您确认要删除该考试吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          courseId: this.$route.query.id
        }
        this.$api.exam.deleteExamContact(data).then(res => {
          this.$message.success('删除成功')
          // 获取最新考试咧白哦
          this.chapterManage()
        })
      })
        .catch(() => {});
    },
    // 添加章节的 按钮方法
    addChapter () {
      this.addChapterDialogTitle = '添加章节';
      this.addChapterDialog = true; // 将新增编辑章节的弹框显示出来
      this.chapterId = null
      // 将新增编辑框清空
      this.addChapterForm = {
        courseName: '',
        courseTime: '',
        operateTime: 30,
        duration: 0,
        fileId: null,
        file: []
      }
    },
    // 编辑章节的按钮方法
    editChapter (data) {
      this.addChapterForm = {
        courseName: '',
        courseTime: '',
        operateTime: 30,
        duration: 0,
        fileId: null,
        file: []
      }
      this.addChapterDialogTitle = '编辑章节';
      this.addChapterDialog = true; // 将编辑章节的弹框显示出来
      this.chapterId = data.id // 将选中的章节的id赋给 定义的chapterId的id
      this.$api.course.getSectionDetail({ sectionId: this.chapterId }).then(res => {
        this.addChapterForm = {
          courseName: res.title, // 章节名
          courseTime: res.lessonhour, // 课时
          operateTime: res.interval, // 操作时长
          duration: res.vediotime, // 视频时长
          file: [
            {
              name: res.videoName,
              url: res.videoUrl,
              id: res.videoid
            }
          ],
          fileId: res.videoid
        }
      })
    },
    // 章节排序
    endDrag () {
      const data = {
        courseId: this.$route.query.id,
        sectionIdList: this.chapterList.map(item => item.id)
      }
      this.$api.exam.sortSection(data).then(res => {
        this.$message.success('保存成功');
        this.chapterManage()
      })
    },
    // 添加试卷的 保存方法
    submitAddExam () {
      this.$refs.addExamForm.validate((valid) => {
        if (valid) {
          this.$api.exam.submitChooseExam({ examId: this.addExamForm.value[this.addExamForm.value.length - 1], id: this.$route.query.id }).then(res => {
            this.addExamDialog = false;
            this.$message.success('保存成功');
            this.chapterManage()
          })
        }
      });
    },
    //  获取课程详情（试卷和章节）
    chapterManage () {
      this.$api.course.chapterManage({ id: this.$route.query.id }).then(res => {
        this.title = res.title
        this.exam.id = res.examId // 课程相对应的考试试卷
        this.exam.title = res.examTitle
        this.exam.Score = res.examScore
        this.exam.examDuration = res.examDuration
        this.chapterList = res.sectilonList// 课程相对应的章节数组
      })
    },
    // 章节编辑框的 保存方法
    submitAddChapter () {
      this.$refs.addChapterForm.validate((valid) => {
        if (valid) {
          if (this.addChapterForm.fileId) {
            if (this.chapterId) {
              const data = {
                id: this.chapterId,
                courseId: this.$route.query.id, // 本课程id
                vediotime: this.addChapterForm.duration,
                title: this.addChapterForm.courseName,
                lessonhour: this.addChapterForm.courseTime,
                interval: this.addChapterForm.operateTime,
                videoId: this.addChapterForm.fileId
              }
              this.$api.course.updateChapter(data).then(res => {
                this.$message.success('编辑成功')
                this.addChapterDialog = false;
                this.chapterManage()
              })
            } else {
              const data = {
                courseId: this.$route.query.id, // 本课程id
                vediotime: this.addChapterForm.duration, // 视频时长
                title: this.addChapterForm.courseName,
                lessonhour: this.addChapterForm.courseTime, // 课时
                interval: this.addChapterForm.operateTime,
                videoId: this.addChapterForm.fileId
              }
              this.$api.course.createChapter(data).then(res => {
                this.$message.success('新增成功')
                this.addChapterDialog = false;
                this.chapterManage()
              })
            }
          } else {
            this.$message.warning('请上传视频')
          }
        }
      });
    },
    // 课程试卷选择
    getChooseExamOption () {
      this.$api.exam.getChooseExamOption().then(res => {
        this.examOptions = res || []
      })
    }
  },
  created () {},
  mounted () {
    //  根据课程获得课程详情（试卷和章节）
    this.chapterManage();
    // 课程试卷选择
    this.getChooseExamOption()
  }
};
</script>

<style lang="scss" scoped>
.chapter-manage {
  header {
    border-bottom: 1px solid #e6e6e6;
  }

  .exam {
    height: 60px;
    background: rgba(240, 248, 255, 1);
    border-radius: 8px;
  }

  .chapter-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    background: rgba(244, 244, 244, 1);
    height: 60px;
    border-left: 2px solid #1990ff;
  }
  .upload {
    /*height: 100px;*/
    /deep/.el-upload-dragger {
      width: 220px;
      height: 120px;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: space-around;
      .el-icon-upload {
        margin: 0;
      }
    }
  }
}
</style>
