<template>
  <div class="main">
    <header>
      <h5 class="fs-16 mb-20 mt-0">{{$route.name}} — 班次基本信息</h5>
    </header>
    <el-form class="mt-20 width-percent-70 position-relative clearfix" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px">
      <el-row>
          <el-form-item label="班次封面" prop="coverImageId">
            <div class="selectImage">
              <img :src="selectImage" alt="">
            </div>
            <ul class="imageOption">
              <li v-for="image in imageOption" :key="image.id">
                <img @click="clickImageItem(image)" :style="{opacity: image.selected ? '1' : '0.5'}" :src="image.base64Str"
                     alt="">
              </li>
            </ul>
          </el-form-item>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
      <el-form-item label="班次名称" prop="className">
        <el-input placeholder="请输入班次名称" v-model="ruleForm.className" @change="drawCanvas"></el-input>
      </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="班次类别" prop="type">
            <el-select  v-model="ruleForm.type" placeholder="请选择班次类别"  class="width-percent-100">
              <el-option label="线上培训班" :value="0"></el-option>
              <el-option label="线下培训班" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
        <el-form-item label="班次开始日期" prop="classStartDate">
          <el-date-picker
            v-model="ruleForm.classStartDate"
            type="date"
            @change="drawCanvas"
            value-format="yyyy-MM-dd"
            class="width-percent-100"
            placeholder="选择班次开始日期">
          </el-date-picker>
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="班次结束日期" prop="classEndDate">
          <el-date-picker
            v-model="ruleForm.classEndDate"
            type="date"
            @change="drawCanvas"
            :picker-options="classEndDate"
            class="width-percent-100"
            value-format="yyyy-MM-dd"
            placeholder="选择班次结束日期">
          </el-date-picker>
        </el-form-item>
        </el-col>
      </el-row>
      <el-row>
          <el-form-item label="班次分享海报">
           <div class="bill">
             <div class="title">完善海报信息</div>
             <el-row class="mb-20" :gutter="20">
               <el-col :span="12">
                 <el-form-item label="主要参训人员" prop="participant">
                   <el-input placeholder="请输入主要参训人员" v-model="ruleForm.participant" @blur="drawCanvas"></el-input>
                 </el-form-item>
               </el-col>
               <el-col :span="12">
                 <el-form-item label="请输入联系人" prop="contact">
                   <el-input placeholder="请输入联系人" v-model="ruleForm.contact" @blur="drawCanvas"></el-input>
                 </el-form-item>
               </el-col>
             </el-row>
             <el-row  class="mb-20" :gutter="20">
               <el-col :span="12">
                 <el-form-item label="联系电话" prop="contactNumber">
                   <el-input placeholder="请输入联系电话" v-model="ruleForm.contactNumber" @blur="drawCanvas"></el-input>
                 </el-form-item>
               </el-col>
               <el-col :span="12">
                 <el-form-item label="邮箱" prop="email">
                   <el-input placeholder="请输入邮箱" v-model="ruleForm.email" @blur="drawCanvas"></el-input>
                 </el-form-item>
               </el-col>
             </el-row>
             <el-row class="mb-20">
               <el-form-item label="公司地址" prop="address">
                 <el-input placeholder="请输入公司地址" v-model="ruleForm.address" @blur="drawCanvas"></el-input>
               </el-form-item>
             </el-row>
             <el-row>
               <el-form-item label="选择海报模版" prop="trainPosterId">
                 <div class="billOption">
                   <div v-for="(item,index) in billOption" :key="index">
                     <img :style="{opacity: item.selected ? '1' : '0.5'}" :src="item.url"
                          alt="" @click="clickImage(item)">
                   </div>
                 </div>
               </el-form-item>
             </el-row>
           </div>
          </el-form-item>
      </el-row>
      <div class="post">
        <div class="preview">预览海报：</div>
        <canvas id="canvas" style="width: 320px;height:600px"></canvas>
        <div class="download" @click="saveImage"><i class="el-icon-download" style="color: #3F9EFF"></i>下载</div>
      </div>
      <el-form-item label="上传附件" v-if="ruleForm.type==1">
        <el-upload
          class="upload-demo"
          action=""
          :http-request="uploadSectionFile"
          accept=".zip"
          :file-list="fileList">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <div style="float: right">
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data () {
    return {
      classEndDate: {
        disabledDate: time => {
          if (this.ruleForm.classStartDate) {
            return (
              time.getTime() < new Date(this.ruleForm.classStartDate).getTime() - 8.64e7 // 加- 8.64e7则表示包当天
            )
          }
        }
      },
      fileList: [],
      canvasCtx: null,
      canvas: null,
      selectImgUrl: null,
      ruleForm: {
        companyId: '5921ef3119e345ce8d55fb7fd7754241',
        className: '',
        classStartDate: '',
        classEndDate: '',
        type: '',
        participant: '',
        contact: '',
        contactNumber: '',
        email: '',
        address: '',
        trainPosterId: ''
      },
      selectImage: null,
      imageOption: [], // 可选图
      billOption: [
        { selected: false, url: require('@/assets/images/post4.png'), id: '1' },
        { selected: false, url: require('@/assets/images/post3.png'), id: '2' },
        { selected: false, url: require('@/assets/images/post2.png'), id: '3' },
        { selected: true, url: require('@/assets/images/post1.png'), id: '4' }
      ],
      rules: {
        className: [
          { required: true, message: '请输入班次名称', trigger: 'blur' }
        ],
        classStartDate: [
          { required: true, message: '请输入班次开始日期', trigger: 'change' }
        ],
        classEndDate: [
          { required: true, message: '请输入班次结束日期', trigger: 'change' }
        ],
        type: [
          {
            required: true,
            message: '请选择班次类别',
            trigger: 'change'
          }
        ],
        trainPosterId: [
          {
            required: true,
            message: '请选择海报模板',
            trigger: 'change'
          }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        contactNumber: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ],
        contact: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
        participant: [
          { required: true, message: '请输入主要参训人员', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {},
  computed: {},
  methods: {
    uploadSectionFile (e) {
      console.log(e)
      this.fileList = [{ name: e.file.name }]
      const formData = new FormData()
      formData.append('file', e.file)
      this.$api.class.offlineUpload(formData).then(res => {
        this.$message.success('附件上传成功')
        this.ruleForm.offlineDocumentUrl = res
      })
    },
    saveImage () {
      var image = this.canvas.toDataURL('image/png')
      var saveLink = document.createElement('a');
      saveLink.href = image;
      saveLink.download = '海报.png';
      saveLink.click()
    },
    drawCanvas () {
      if (!this.selectImgUrl || !this.canvasCtx) {
        return
      }
      // eslint-disable-next-line no-self-assign
      this.canvas.width = this.canvas.width
      var img = new Image();
      img.setAttribute('crossOrigin', 'Anonymous')
      img.onload = () => {
        this.canvasCtx.drawImage(img, 0, 0);
        this.canvasCtx.font = 'normal bolder 52px sans-serif';
        this.canvasCtx.fillStyle = '#000000';
        if (this.ruleForm.className) {
          this.canvasCtx.fillText(this.ruleForm.className, 154, 216);
        }
        this.canvasCtx.font = '42px sans-serif';
        this.canvasCtx.fillStyle = '#ffffff';
        if (this.ruleForm.contact) {
          this.canvasCtx.fillText(this.ruleForm.contact, 275, 1612);
        }
        if (this.ruleForm.address) {
          if (this.ruleForm.address.length <= 16) {
            this.canvasCtx.fillText(this.ruleForm.address, 540, 2048);
          } else {
            const line1 = this.ruleForm.address.substr(0, 16);
            const line2 = this.ruleForm.address.substr(16);
            this.canvasCtx.fillText(line1, 540, 2048);
            this.canvasCtx.fillText(line2, 540, 2110);
          }
        }
        this.canvasCtx.fillStyle = '#282828';
        if (this.ruleForm.participant) {
          this.canvasCtx.fillText(this.ruleForm.participant, 470, 1330);
        }
        if (this.ruleForm.email) {
          this.canvasCtx.fillText(this.ruleForm.email, 590, 1650);
        }
        if (this.ruleForm.classStartDate) {
          this.canvasCtx.fillText(this.ruleForm.classStartDate, 470, 1468);
        }
        this.canvasCtx.fillText('——', 714, 1468);
        if (this.ruleForm.classEndDate) {
          this.canvasCtx.fillText(this.ruleForm.classEndDate, 820, 1468);
        }
        this.canvasCtx.font = '40px sans-serif';
        if (this.ruleForm.contactNumber) {
          this.canvasCtx.fillText(this.ruleForm.contactNumber, 660, 1580);
        }
      }
      img.src = this.selectImgUrl
    },
    clickImage (item) {
      this.billOption.forEach(item => {
        item.selected = false
      })
      item.selected = true
      this.ruleForm.trainPosterId = item.id
      var mycanvas = document.getElementById('canvas')
      mycanvas.width = 1242;
      mycanvas.height = 2208
      this.canvas = mycanvas
      var ctx = mycanvas.getContext('2d')
      this.canvasCtx = ctx
      this.selectImgUrl = item.url
      this.drawCanvas()
    },
    /**
     * 限制只能输入正整数
     * @param num
     */
    checkNum (num) {
      if (num) {
        this.ruleForm.time = num.replace(/[^0-9]/g, '')
      }
    },
    // 点击封面选项
    clickImageItem (data) {
      this.imageOption.forEach(item => {
        item.selected = false
      })
      data.selected = true
      this.selectImage = data.base64Str
      this.ruleForm.coverImageId = data.id
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.$route.params.id) {
            // 调用修改接口
            const data = this.ruleForm
            data.id = this.$route.params.id
            this.$api.class.updateClass(data).then(res => {
              this.$message.success('编辑成功')
              this.$router.back()
            })
          } else {
            // 调用add接口
            const data = this.ruleForm
            this.$api.class.createClass(data).then(res => {
              this.$message.success('新增成功')
              this.$router.back()
            })
          }
        }
      });
    },
    // 获取课程封面
    getScoreImageList () {
      return new Promise((resolve, reject) => {
        this.$api.course.getScoreImageList().then(res => {
          res = res || []
          this.imageOption = res.map(item => {
            return {
              ...item,
              selected: false
            }
          })
          this.imageOption[0].selected = true
          this.selectImage = this.imageOption[0].base64Str
          this.ruleForm.coverImageId = this.imageOption[0].id
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    }
  },
  created () {

  },
  mounted () {
    this.getScoreImageList().then(() => {
      // 在编辑时  根据id获取班次基本信息将其展示在框里
      if (this.$route.params.id) {
        const data = {
          id: this.$route.params.id
        }
        this.$api.class.getById(data).then(res => {
          this.ruleForm = res
          this.clickImage(this.billOption[parseInt(this.ruleForm.trainPosterId) - 1])
          if (res.offlineDocumentUrl) {
            this.fileList = [{ name: res.offlineDocumentUrl, url: res.offlineDocumentUrl }]
          }
          this.imageOption.forEach(item => {
            if (item.id === res.coverImageId) {
              this.clickImageItem(item)
            }
          })
        })
      } else {
        this.clickImage(this.billOption[0])
      }
    })
  }
}
</script>

<style lang="scss" scoped>
  header {
    border-bottom: 1px solid #E6E6E6;
  }
  .post{
    position: absolute;
    top: 126px;
    right: -372px;
    padding: 16px;
    border-radius: 4px;
    border: 2px dashed #3F9EFF;
    color: #333333;
    font-size: 14px;
    .preview{
      font-weight: 500;
      margin-bottom: 10px;
    }
    .download{
      text-align: center;
     margin-top: 10px;
      cursor: pointer;
    }
  }
  .selectImage {
    //position: relative;
    img {
      position: relative;
      width: 320px;
      height: 180px;
    }

    p {
      width: 132px;
      height: 60px;
      left: 32px;
      display: inline-block;
      position: absolute;
      top: 50px;
      font-size: 24px;
      color: red;
    }
  }
  .imageOption {
    width: 100%;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 0;

    li {
      position: relative;
      left: -6px;
      margin: 6px;
      height: 32px;
      img {
        cursor: pointer;
        width: 58px;
        height: 32px;
      }

    }
  }
  .billOption {
    display: flex;
    flex-wrap: wrap;
    div {
      position: relative;
      left: -6px;
      margin: 6px;
      img {
        cursor: pointer;
        width: 82px;
        height: 147px;
        display: block
      }
    }
  }
  .bill{
    border-radius: 4px;
    border: 1px solid #D9D9D9;
    padding:0 16px 10px 10px;
    box-sizing: border-box;
    width: 100%;
    .title{
      margin-left: 14px;
      font-weight: 500;
      color: #333333;
      font-size: 12px;
      position: relative;
      &:before {
        display: block;
        position: absolute;
        top: 14px;
        left: -10px;
        content: "";
        width: 4px;
        height: 14px;
        background: #1990FF;
        border-radius: 2px;
      }
    }
  }
</style>
