<template>
  <div class="examination">
    <header class="display-flex ai-center jc-space-between">
      <h5 class="fs-16 mb-20 mt-0">试卷：{{title}}</h5>
      <div class="position-relative" style="top: -10px;">
        <el-button size="mini" class="mr-16" @click="showPreview = true">预览</el-button>
        <el-button size="mini" type="primary" @click="submit">保存</el-button>
      </div>
    </header>
    <div class="exam-main">
      <div class="left">
        <template v-for="(item, index) in componentOptions">
          <p class="fs-14" :key="item.label">{{item.label}}</p>
          <div class="display-flex fw-wrap jc-space-between" :key="index">
            <el-button
              :disabled="_item.type === 'split_page' && !questionList.length"
              @click="addQuestion(_item)"
              class="width-100 mb-8"
              v-for="(_item, _index) in item.children"
              :key="_index"
              size="small">
              <i class="iconfont fs-14 flex-1" :class="_item.icon"></i>
              <span class="flex-2">{{_item.label}}</span>
            </el-button>
          </div>
        </template>
      </div>
      <div class="content scrollbar">
        <el-scrollbar>
          <div class="item">
            <p class="fs-18 mt-0">{{title}}</p>
            <span class="fs-16 color-info">试卷分数：{{score}}</span>
            <span class="fs-16 color-info ml-20 pl-20">考试时长：{{examTime}}分钟</span>
          </div>
          <div v-if="!questionList.length" class="item-empty">
            <i class="iconfont iconclick color-primary mr-16"></i>
            <p class="fs-14">点击左侧题型设置题目</p>
          </div>
          <!-- 中间题目 -->
          <template v-else v-for="(item, index) in questionList">
            <!--单选-->
            <div
              :id="`question${index}`"
              v-if="item.type === 'single'"
              class="item"
              @click="clickQuestionItem(item)"
              :style="{border: item.selected ? '1px solid #3F9EFF' : 'none'}"
              :key="index">
              <div class="display-flex ai-center jc-space-between">
                <div class="display-flex ai-center flex-1">
                  <span class="mr-20 pr-10">{{index + 1}}</span>
                  <el-input type="textarea" autosize class="width-percent-80" size="mini" v-model="item.title" placeholder="请输入内容"></el-input>
                </div>
                <div>
                  <el-button class="mr-20" type="text" @click="addItem(item)">
                    <i class="el-icon-plus"></i>
                    <span class="color-info fs-14">添加选项</span>
                  </el-button>
                  <el-button type="text" @click="questionList = questionList.filter((_item, _index) => _index !== index)">
                    <i class="el-icon-delete color-danger"></i>
                    <span class="color-info fs-14">删除</span>
                  </el-button>
                </div>
              </div>
              <ul>
                <li class="mt-10" v-for="(_item, _index) in item.option" :key="_index">
                  <el-radio disabled :label="_item.value" class="mr-16">
                    <el-input
                      :ref="`input${index}${_index}`"
                      style="width: 400px;"
                      size="mini"
                      v-model="_item.label"></el-input>
                  </el-radio>
                  <i @click="delItem(_item, item.option)" v-if="item.option.length > 2" class="el-icon-delete color-danger cursor-pointer"></i>
                </li>
              </ul>
            </div>
            <!--判断-->
            <div
              v-else-if="item.type === 'trueOrFalse'"
              :id="`question${index}`"
              class="item"
              @click="clickQuestionItem(item)"
              :style="{border: item.selected ? '1px solid #3F9EFF' : 'none'}"
              :key="index">
              <div class="display-flex ai-center jc-space-between">
                <div class="display-flex ai-center flex-1">
                  <span class="mr-20 pr-10">{{index + 1}}</span>
                  <el-input type="textarea" autosize class="width-percent-80" size="mini" v-model="item.title" placeholder="请输入内容"></el-input>
                </div>
                <div>
                  <el-button disabled class="mr-20" type="text" @click="addItem(item)">
                    <i class="el-icon-plus"></i>
                    <span class="color-info fs-14">添加选项</span>
                  </el-button>
                  <el-button type="text" @click="questionList = questionList.filter((_item, _index) => _index !== index)">
                    <i class="el-icon-delete color-danger"></i>
                    <span class="color-info fs-14">删除</span>
                  </el-button>
                </div>
              </div>
              <ul>
                <li class="mt-10" v-for="(_item, _index) in item.option" :key="_index">
                  <el-radio disabled :label="_item.value" class="width-percent-60 mr-16">
                    <el-input
                      :ref="`input${index}${_index}`"
                      style="width: 400px;"
                      size="mini"
                      v-model="_item.label"></el-input>
                  </el-radio>
                </li>
              </ul>
            </div>
            <!--多选-->
            <div
              v-else-if="item.type === 'multiple'"
              :id="`question${index}`"
              @click="clickQuestionItem(item)"
              class="item"
              :style="{border: item.selected ? '1px solid #3F9EFF' : 'none'}"
              :key="index">
              <div class="display-flex ai-center jc-space-between">
                <div class="display-flex ai-center flex-1">
                  <span class="mr-20 pr-10">{{index + 1}}</span>
                  <el-input type="textarea" autosize class="width-percent-80" size="mini" v-model="item.title" placeholder="请输入内容"></el-input>
                </div>
                <div>
                  <el-button class="mr-20" type="text" @click="addItem(item)">
                    <i class="el-icon-plus"></i>
                    <span class="color-info fs-14">添加选项</span>
                  </el-button>
                  <el-button type="text" @click="questionList = questionList.filter((_item, _index) => _index !== index)">
                    <i class="el-icon-delete color-danger"></i>
                    <span class="color-info fs-14">删除</span>
                  </el-button>
                </div>
              </div>
              <ul>
                <li v-for="(_item, _index) in item.option" :key="_index" class="mt-10">
                  <el-checkbox disabled>
                    <el-input
                      class="mr-16"
                      :ref="`input${index}${_index}`"
                      style="width: 400px;"
                      size="mini"
                      v-model="_item.label"></el-input>
                    <i @click="delItem(_item, item.option)" v-if="item.option.length > 2" class="el-icon-delete color-danger cursor-pointer"></i>
                  </el-checkbox>
                </li>
              </ul>
            </div>
            <!--量表-->
            <div
              v-else-if="item.type === 'scale'"
              :id="`question${index}`"
              @click="clickQuestionItem(item)"
              class="item"
              :style="{border: item.selected ? '1px solid #3F9EFF' : 'none'}"
              :key="index">
              <div class="display-flex ai-center jc-space-between">
                <div class="display-flex ai-center flex-1">
                  <span class="mr-20 pr-10">{{index + 1}}</span>
                  <el-input type="textarea" autosize class="width-percent-80" size="mini" v-model="item.title" placeholder="请输入内容"></el-input>
                </div>
                <div>
                  <el-button disabled class="mr-20" type="text" @click="addItem(item)">
                    <i class="el-icon-plus"></i>
                    <span class="color-info fs-14">添加选项</span>
                  </el-button>
                  <el-button type="text" @click="questionList = questionList.filter((_item, _index) => _index !== index)">
                    <i class="el-icon-delete color-danger"></i>
                    <span class="color-info fs-14">删除</span>
                  </el-button>
                </div>
              </div>
              <ul>
                <el-radio
                  class="mr-20 pr-20 mt-20"
                  v-for="(_item, _index) in item.option"
                  :key="_index"
                  disabled
                  v-model="_item.value"
                  :label="_item.label">
                </el-radio>
                <p class="fs-14 color-info display-flex ai-center jc-space-between" style="width: 390px;">
                  <span>非常满意</span>
                  <span>非常不满意</span>
                </p>
              </ul>
            </div>
            <!--填空题-->
            <div
              v-else-if="item.type === 'blank'"
              :id="`question${index}`"
              @click="clickQuestionItem(item)"
              class="item"
              :style="{border: item.selected ? '1px solid #3F9EFF' : 'none'}"
              :key="index">
              <div class="display-flex ai-center jc-space-between">
                <div class="display-flex ai-center flex-1">
                  <span class="mr-20 pr-10">{{index + 1}}</span>
                  <el-input type="textarea" autosize class="width-percent-80" size="mini" v-model="item.title" placeholder="请输入内容"></el-input>
                </div>
                <div>
                  <el-button disabled class="mr-20" type="text" @click="addItem(item)">
                    <i class="el-icon-plus"></i>
                    <span class="color-info fs-14">添加选项</span>
                  </el-button>
                  <el-button type="text" @click="questionList = questionList.filter((_item, _index) => _index !== index)">
                    <i class="el-icon-delete color-danger"></i>
                    <span class="color-info fs-14">删除</span>
                  </el-button>
                </div>
              </div>
              <ul>
                <el-input
                  readonly
                  class="mt-10"
                  style="width: 400px;"
                  size="mini"
                  v-for="(_item, _index) in item.option"
                  :key="_index"
                  v-model="_item.value"></el-input>
              </ul>
            </div>
            <!--分页-->
            <div
              v-else
              :id="`question${index}`"
              @click="clickQuestionItem(item)"
              class="item"
              :style="{border: item.selected ? '1px solid #3F9EFF' : 'none'}"
              :key="index">
              <el-divider class="margin-0">
                <span class="color-info">分页</span>
              </el-divider>
            </div>
          </template>
        </el-scrollbar>
      </div>
      <div class="right">
        <div v-if="questionList.filter(item => item.selected)[0]">
          <p class="fs-14">题型</p>
          <span class="fs-12 color-info">{{questionList.filter(item => item.selected)[0].typeName}}</span>
          <template v-if="['multiple','single', 'trueOrFalse'].includes(questionList.filter(item => item.selected)[0].type)">
            <el-divider></el-divider>
            <el-form
              size="mini"
              :model="questionList.filter(item => item.selected)[0].form"
              :rules="rules"
              ref="ruleForm">
              <el-form-item label="计分方式" class="width-percent-100 mb-0" prop="scoringMethod">
                <el-select
                  class="width-percent-100 mt-10"
                  :disabled="['single', 'trueOrFalse'].includes(questionList.filter(item => item.selected)[0].type)"
                  v-model="questionList.filter(item => item.selected)[0].form.scoringMethod">
                  <template v-if="questionList.filter(item => item.selected)[0].type === 'multiple'">
                    <el-option label="漏选得分" value="1"></el-option>
                    <el-option label="漏选不得分" value="2"></el-option>
                  </template>
                  <el-option v-else label="此题有唯一答案和分数" value="1"></el-option>
                </el-select>
                <el-divider></el-divider>
              </el-form-item>
              <el-form-item label="请选择该题答案" class="width-percent-100 mb-0" prop="answer">
                <el-radio-group
                  class="width-200"
                  v-if="['single', 'trueOrFalse'].includes(questionList.filter(item => item.selected)[0].type)"
                  v-model="questionList.filter(item => item.selected)[0].form.answer">
                  <el-radio
                    class="display-flex ai-center mt-6"
                    :label="item.value"
                    v-for="item in questionList.filter(_item => _item.selected)[0].option"
                    :key="item.value">
                    <span class="text-overflow width-180 display-inline-block">{{item.label}}</span>
                  </el-radio>
                </el-radio-group>
                <el-checkbox-group v-else v-model="questionList.filter(item => item.selected)[0].form.answer">
                  <br>
                  <el-checkbox
                    class="display-flex ai-center mt-6"
                    v-for="item in questionList.filter(_item => _item.selected)[0].option"
                    :key="item.value"
                    :label="item.value">
                    <span class="text-overflow width-180 display-inline-block">{{item.label}}</span>
                  </el-checkbox>
                </el-checkbox-group>
                <el-divider></el-divider>
              </el-form-item>
              <el-form-item label="该题分数" class="width-percent-100 mb-0" prop="score">
                <br>
                <div class="display-flex mt-8">
                  <el-input
                    maxlength="2"
                    @input="checkNum"
                    class="width-120"
                    v-model="questionList.filter(item => item.selected)[0].form.score"></el-input>
                  <span class="fs-14 ml-10">分</span>
                </div>
                <el-divider></el-divider>
              </el-form-item>
              <el-form-item label="答案解析" class="width-percent-100 mb-0">
                <br>
                <el-input
                  class="mt-8"
                  type="textarea"
                  :autosize="{ minRows: 4, maxRows: 8}"
                  v-model="questionList.filter(item => item.selected)[0].form.explain"></el-input>
              </el-form-item>
            </el-form>
          </template>
        </div>
        <div v-else class="display-flex fd-column ai-center jc-center height-percent-60">
          <img :src="emptyState" alt="">
          <p class="color-info fs-14">暂未选择题型</p>
        </div>
      </div>
    </div>
    <el-dialog
      class="dialog scrollbar"
      :fullscreen="true"
      :show-close="false"
      :visible.sync="showPreview">
      <div slot="title" class="height-percent-100">
        <div class="container display-flex ai-center height-percent-100" @click="showPreview = false">
          <i class="iconfont iconback cursor-pointer mr-10"></i>
          <span class="fs-14 cursor-pointer">退出预览</span>
        </div>
      </div>
      <el-scrollbar class="dialog-content">
        <div class="title">
          <p class="fs-18">{{title}}</p>
          <span class="fs-16 color-info">试卷分数：{{score}}</span>
          <span class="fs-16 color-info ml-20 pl-20">考试时长：{{examTime}}分钟</span>
        </div>
        <div v-for="(item, index) in questionList" :key="index">
          <p class="mt-20">{{index + 1}}、{{item.title}}</p>
          <template v-if="['single', 'trueOrFalse'].includes(item.type)">
            <el-radio-group disabled class="ml-12" v-model="item.form.answer">
              <el-radio class="display-block mb-10 ml-10" v-for="_item in item.option" :key="_item.value" :label="_item.value">{{_item.label}}</el-radio>
            </el-radio-group>
          </template>
          <template v-else-if="item.type === 'multiple'">
            <el-checkbox-group disabled class="ml-12" v-model="item.form.answer">
              <el-checkbox class="display-block mb-10 ml-10" v-for="_item in item.option" :key="_item.value" :label="_item.value">{{_item.label}}</el-checkbox>
            </el-checkbox-group>
          </template>
          <template v-else-if="item.type === 'scale'">
            <el-radio-group disabled class="ml-12" v-model="item.form.answer">
              <el-radio class="ml-10" v-for="_item in item.option" :key="_item.value" :label="_item.value">{{_item.label}}</el-radio>
            </el-radio-group>
            <p class="fs-14 color-info display-flex ai-center jc-space-between ml-20" style="width: 390px;">
              <span>非常满意</span>
              <span>非常不满意</span>
            </p>
          </template>
          <template v-else>
            <el-input
              readonly
              class="ml-20"
              style="width: 400px;"
              size="mini"
              v-for="(_item, _index) in item.option"
              :key="_index"
              v-model="_item.value"></el-input>
          </template>
        </div>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<script>
import emptyState from '@/assets/images/empty-state.png'
import _ from 'lodash'
export default {
  name: 'QuestionManage',
  data () {
    return {
      showPreview: false, // 预览
      emptyState,
      rules: {
        scoringMethod: [
          { required: true, message: '请选择计分方式', trigger: 'submit' }
        ],
        answer: [
          { required: true, message: '请选择答案', trigger: 'submit' }
        ],
        score: [
          { required: true, message: '请输入该题分数', trigger: 'submit' }
        ]
      },
      title: this.$route.query.title, // 试卷标题
      examTime: this.$route.query.time, // 考试时长
      questionList: [], // 题目列表
      componentOptions: [
        {
          label: '选择题',
          children: [
            {
              type: 'single',
              label: '单选题',
              icon: 'iconsingle'
            },
            {
              type: 'trueOrFalse',
              label: '判断题',
              icon: 'icontrueOrFalse'
            },
            {
              type: 'multiple',
              label: '多选题',
              icon: 'iconmultiple'
            },
            {
              type: 'scale',
              label: '量表题',
              icon: 'iconscale'
            }
          ]
        },
        {
          label: '个人信息',
          children: [
            {
              type: 'blank',
              label: '姓名',
              icon: 'iconname'
            },
            {
              type: 'blank',
              label: '手机',
              icon: 'iconmobile'
            },
            {
              type: 'blank',
              label: '邮箱',
              icon: 'iconemail'
            },
            {
              type: 'blank',
              label: '性别',
              icon: 'iconsex'
            },
            {
              type: 'blank',
              label: '行业',
              icon: 'iconindustry'
            },
            {
              type: 'blank',
              label: '职业',
              icon: 'iconoccupation'
            }
          ]
        }
      ]
    }
  },
  watch: {},
  filters: {},
  computed: {
    score () {
      let score = 0
      this.questionList.forEach(item => {
        if (['multiple', 'single', 'trueOrFalse'].includes(item.type)) {
          score += Number(item.form.score)
        }
      })
      return score
    }
  },
  methods: {
    /**
     * 检测题目是否创建正确
     * return promise
     */
    checkQuestion () {
      return new Promise((resolve, reject) => {
        let index = null
        this.questionList.forEach(item => {
          item.selected = false
        })
        for (const question of this.questionList.entries()) {
          question[1].selected = false
          // 去除空格后的选项
          const arr = _.map(question[1].option.map(item => item.label), _.trim)
          // 先去重，后去除无效值
          const arrSet = _.compact([...new Set(arr)])
          // 如果处理后的数组长度不等于原数组，报错
          if (arrSet.length !== arr.length) {
            this.$message.warning('答案选项不能相同或为空')
            question[1].selected = true
            document.getElementById(`question${question[0]}`).scrollIntoView()
            index = question[0]
            reject(index)
            break
          }
          // 判断题目是否是纯空格
          if (!_.trim(question[1].title)) {
            this.$message.warning('题目不能是纯空格')
            question[1].selected = true
            document.getElementById(`question${question[0]}`).scrollIntoView()
            index = question[0]
            reject(index)
            break
          }
          // 验证题目设置表单
          if (['single', 'multiple', 'trueOrFalse'].includes(question[1].type)) {
            if (!question[1].form.score) {
              this.$message.warning('请填写该题分数')
              question[1].selected = true
              document.getElementById(`question${question[0]}`).scrollIntoView()
              index = question[0]
              reject(index)
              break
            }
            if (question[1].type === 'multiple') {
              if (!question[1].form.answer.length) {
                this.$message.warning('请选择该题答案')
                question[1].selected = true
                document.getElementById(`question${question[0]}`).scrollIntoView()
                index = question[0]
                reject(index)
                break
              }
            }
          }
        }
        // 正常执行
        if (index === null) {
          resolve(index)
        }
      })
    },
    /**
     * 限制只能输入正整数
     * @param num
     */
    checkNum (num) {
      if (num) {
        this.questionList.filter(item => item.selected)[0].form.score = num.replace(/[^0-9]/g, '')
      }
    },
    /**
     * 点击某一题触发
     * @param data
     */
    clickQuestionItem (data) {
      this.questionList.forEach(item => {
        item.selected = false
      })
      data.selected = true
    },
    /**
     * 添加一个答案选项
     * @param data
     */
    addItem (data) {
      if (data.option.length < 6) {
        data.option.push({
          value: String(data.option.length + 1),
          label: `选项${data.option.length + 1}`
        })
      } else {
        this.$message.error('最多只能有6个选项')
      }
    },
    /**
     * 删除一个选项
     * @param data 当前删除的input的对象
     * @param list 当前的选项列表
     */
    delItem (data, list) {
      this.questionList.filter(item => item.selected)[0].option = list.filter(item => item.value !== data.value)
      this.questionList.filter(item => item.selected)[0].option = this.questionList.filter(item => item.selected)[0].option.map((_item, index) => {
        return {
          label: _item.label,
          value: String(index + 1)
        }
      })
    },
    /**
     * 添加一个题目
     * @param data
     */
    addQuestion (data) {
      const index = this.questionList.findIndex(item => item.selected)
      this.checkQuestion().then(() => {
        switch (data.type) {
          case 'single':
            this.questionList.splice(index + 1, 0, {
              type: data.type,
              typeName: data.label,
              title: '请选择一个选项',
              selected: true,
              option: [
                {
                  label: '选项1',
                  value: '1'
                },
                {
                  label: '选项2',
                  value: '2'
                },
                {
                  label: '选项3',
                  value: '3'
                }
              ],
              form: {
                scoringMethod: '1',
                answer: '1',
                score: '10',
                explain: ''
              }
            })
            break
          case 'trueOrFalse':
            this.questionList.splice(index + 1, 0, {
              type: data.type,
              typeName: data.label,
              title: '请选择对错',
              selected: true,
              option: [
                {
                  label: '对',
                  value: '1'
                },
                {
                  label: '错',
                  value: '2'
                }
              ],
              form: {
                scoringMethod: '1',
                answer: '1',
                score: '10',
                explain: ''
              }
            })
            break
          case 'multiple':
            this.questionList.splice(index + 1, 0, {
              type: data.type,
              typeName: data.label,
              title: '请选择正确选项（多选）',
              selected: true,
              option: [
                {
                  label: '选项1',
                  value: '1'
                },
                {
                  label: '选项2',
                  value: '2'
                },
                {
                  label: '选项3',
                  value: '3'
                }
              ],
              form: {
                scoringMethod: '1',
                answer: ['1'],
                score: '10',
                explain: ''
              }
            })
            break
          case 'scale':
            this.questionList.splice(index + 1, 0, {
              type: data.type,
              typeName: data.label,
              title: '请对此项目进行评价',
              selected: true,
              option: [
                {
                  label: '1分',
                  value: '1'
                },
                {
                  label: '2分',
                  value: '2'
                },
                {
                  label: '3分',
                  value: '3'
                },
                {
                  label: '4分',
                  value: '4'
                },
                {
                  label: '5分',
                  value: '5'
                }
              ],
              form: {}
            })
            break
          case 'blank':
            this.questionList.splice(index + 1, 0, {
              type: data.type,
              typeName: data.label,
              title: data.label,
              selected: true,
              option: [
                {
                  label: data.label,
                  value: ''
                }
              ],
              form: {}
            })
            break
          case 'split_page':
            this.questionList.splice(index + 1, 0, {
              type: data.type,
              typeName: data.label,
              title: data.label,
              selected: true,
              option: [],
              form: {}
            })
            break
        }
        this.$nextTick(() => {
          document.getElementById(`question${index + 1}`).scrollIntoView()
        })
      })
    },
    submit () {
      if (this.questionList.length) {
        this.checkQuestion().then(() => {
          const question = this.questionList.map(item => {
            return {
              form: {
                answer: typeof item.form.answer === 'string' ? [item.form.answer] : item.form.answer,
                explain: item.form.explain,
                score: item.form.score,
                scoringMethod: item.form.scoringMethod
              },
              option: item.option,
              title: item.title,
              type: item.type,
              typeName: item.typeName
            }
          })
          const obj = {
            id: this.$route.query.id,
            questionList: question
          }
          this.$api.exam.updateQuestion(obj).then(res => {
            this.$message.success('保存成功')
            this.$router.replace('/admin/exam-manage')
          })
        })
      } else {
        this.$message.warning('请添加试题')
      }
    },
    getDetail () {
      this.$api.exam.getQuestionDetail({ examId: this.$route.query.id }).then(res => {
        this.title = res.title
        this.examTime = res.examTime
        res.questionList = res.questionList || []
        if (res.questionList.length) {
          res.questionList.forEach(item => {
            item.selected = false
            if (!['scale', 'blank'].includes(item.type)) {
              item.option.forEach(_item => {
                _item.value = String(_item.value)
              })
              if (item.type !== 'multiple') {
                item.form.answer = item.form.answer[0]
              }
            }
          })
          this.questionList = res.questionList
        } else {
          this.questionList = []
        }
      })
    }
  },
  created () {

  },
  mounted () {
    this.getDetail()
  }
}
</script>

<style lang="scss" scoped>
  .examination {
    border-radius: 4px;
    background-color: #fff;
    padding: 20px;
    height: calc(100vh - 170px);
    /deep/.el-button {
      >span {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
    .el-button + .el-button {
      margin-left: 0;
    }
    header {
      border-bottom: 1px solid #E6E6E6;
    }
    .exam-main {
      display: flex;
      justify-content: space-between;
      height: calc(100% - 18px);
      .left {
        width: 210px;
      }
      .content {
        margin: 0 14px;
        padding: 10px 0 10px 10px;
        background-color: #EFF2F4;
        width: calc(100% - 440px);
        .el-scrollbar {
          height: 100%;
        }
        .item {
          background-color: #fff;
          margin-right: 10px;
          padding: 20px;
          border-radius: 4px;
          &+.item {
            margin-top: 10px;
          }
        }
        .item-empty {
          background-color: #fff;
          padding: 20px;
          border-radius: 4px;
          margin: 10px 10px 10px 0;
          border: 1px dashed #3F9EFF;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
      .right {
        width: 210px;
        .el-divider--horizontal {
          margin: 14px 0;
        }
      }
    }
    .dialog {
      /deep/.el-dialog__header {
        width: 100%;
        height:60px;
        background:rgba(235,235,235,1);
        padding: 0;
      }
      /deep/.el-dialog__body {
        background:rgba(244,244,244,0.98);
        padding: 0;
        height: calc(100% - 60px);
        .el-scrollbar__wrap {
          height: calc(100% - 50px);
          overflow-x: hidden;
          padding: 10px 50px 30px 30px;
          background-color: #fff;
          margin-top: 20px;
        }
      }
      .dialog-content {
        width: 1360px;
        height: 100%;
        margin: 0 auto;
        .title {
          border-bottom: 1px solid #54A4F4;
          padding-bottom: 20px;
        }
      }
    }
  }
</style>
