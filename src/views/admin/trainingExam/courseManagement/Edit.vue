<template>
  <div class="main">
    <header>
      <h5 class="fs-16 mb-20 mt-0">{{$route.name}}</h5>
    </header>
    <!--  -->
    <el-form class="mt-20 width-percent-50" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px">
      <el-form-item label="课程封面" prop="coverImageId">
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
      <el-form-item label="课程名称" prop="title">
        <el-input v-model="ruleForm.title" placeholder="请输入课程名称"></el-input>
      </el-form-item>
      <el-form-item label="专业类别" prop="specialityId">
        <el-select class="width-percent-100" v-model="ruleForm.specialityId" placeholder="请选择专业类别">
          <el-option v-for="item in courseProfessionalOption"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="适用岗位" prop="trainCoursePositionList">
        <el-cascader
          clearable
          collapse-tags
          class="width-percent-100"
          v-model="ruleForm.trainCoursePositionList" placeholder="请选择适用岗位"
          :options="enterpriseOption"
          :props="enterpriseOptionProps"
        ></el-cascader>
        <el-checkbox @change="changeCheckedAll" v-model="checkedAll">全选适用岗位</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Edit',
  data () {
    return {
      checkedAll: false,
      selectImage: null,
      imageOption: [], // 可选图
      ruleForm: {
        coverImageId: null, // 图片id
        title: null, // 课程名
        specialityId: null, // 专业类别
        trainCoursePositionList: null// 适用企业
      },
      rules: {
        coverImageId: [
          {
            required: true,
            message: '请选择课程封面',
            trigger: 'change'
          }
        ],
        title: [
          {
            required: true,
            message: '请输入课程名',
            trigger: 'blur'
          }
        ],
        specialityId: [
          {
            required: true,
            message: '请选择专业类别',
            trigger: 'change'
          }
        ],
        trainCoursePositionList: [
          {
            required: true,
            message: '请选择适用企业',
            trigger: 'change'
          }
        ]
      },
      courseProfessionalOption: [],
      // 获取企业（岗位）类别
      enterpriseOption: [],
      enterpriseOptionProps: {
        multiple: true,
        value: 'id',
        label: 'name',
        children: 'postList'
      }
    }
  },
  watch: {
    'ruleForm.trainCoursePositionList': function (val) {
      if (!val.length) {
        this.checkedAll = false
      }
    }
  },
  computed: {},
  methods: {
    // 全选适用岗位
    changeCheckedAll (e) {
      this.checkedAll = e
      if (this.checkedAll) {
        this.ruleForm.trainCoursePositionList = []
        this.enterpriseOption.forEach(item => {
          item.postList.forEach(_item => {
            this.ruleForm.trainCoursePositionList.push([item.id, _item.id])
          })
        })
      } else {
        this.ruleForm.trainCoursePositionList = []
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
      const trainCoursePositionList = this.ruleForm.trainCoursePositionList.map(item => {
        return {
          companyid: item[0],
          position: item[1]
        }
      })
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = {
            coverImageId: this.ruleForm.coverImageId,
            specialityId: this.ruleForm.specialityId,
            title: this.ruleForm.title,
            trainCoursePositionList: trainCoursePositionList
          }
          if (this.$route.params.id) {
            // 调用修改接口
            data.id = this.$route.params.id
            this.$api.course.updateCourse(data).then(res => {
              this.$message.success('编辑成功')
              this.$router.back()
            })
          } else {
            // 调用add接口
            this.$api.course.createCourse(data).then(res => {
              this.$message.success('新增成功')
              this.$router.back()
            })
          }
        }
      })
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
    },
    // 获取课程专业类别
    getCourseProfessional () {
      return new Promise((resolve, reject) => {
        this.$api.course.getProfessional().then(res => {
          this.courseProfessionalOption = res;
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取企业（岗位）类别
    getEnterprisePosition () {
      return new Promise((resolve, reject) => {
        this.$api.enterprise.getEnterprisePosition().then(res => {
          res = res || []
          res.forEach(item => {
            item.postList = item.postList.map(_item => {
              return {
                id: _item,
                name: _item
              }
            })
          })
          this.enterpriseOption = res;
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
    Promise.all([this.getScoreImageList(), this.getCourseProfessional(), this.getEnterprisePosition()]).then(() => {
      if (this.$route.params.id) {
        this.$api.course.getCourseDetail({ id: this.$route.params.id }).then(res => {
          this.ruleForm = {
            courseHour: res.courseHour,
            coverImageId: res.coverImageId, // 图片id
            title: res.title, // 课程名
            specialityId: res.specialityId, // 专业类别
            trainCoursePositionList: res.coursePositionList.map(item => {
              return [
                item.companyid,
                item.position
              ]
            })
          }
          this.imageOption.forEach(item => {
            item.selected = false
            if (this.ruleForm.coverImageId === item.id) {
              item.selected = true
              this.selectImage = item.base64Str
            }
          })
        })
      }
    })
  }
}
</script>

<style lang="scss" scoped>
  header {
    border-bottom: 1px solid #E6E6E6;
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
</style>
