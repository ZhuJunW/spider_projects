<template>
  <el-row class="main">
    <el-col :span="5">
      <el-card shadow="never" class="scrollbar">
        <div class="display-flex mb-10">
          <el-button size="mini" type="primary" @click="addDownDepartment">添加下级部门</el-button>
        </div>
        <el-scrollbar :style="{height: 'calc(100vh - 280px)'}" style="padding: 10px 0;">
          <el-tree default-expand-all accordion :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </el-scrollbar>
      </el-card>
    </el-col>
    <el-col :span="19">
      <el-card shadow="never" class="ml-20">
        <div class="header display-flex ai-center jc-space-between">
          <div class="display-flex ai-center">
            <p class="fs-16"><span class="color-info">部门名称：</span>{{departmentDetail.name}}</p>
            <p class="fs-14"><span class="color-info">公司名称：</span>{{departmentDetail.companyName}}</p>
            <p class="fs-14"><span class="color-info">负责人：</span>{{departmentDetail.managerName || '--'}}</p>
          </div>
          <div class="display-flex ai-center">
            <el-button type="text" class="color-danger mr-10" @click="deleteDepartment">删除</el-button>
            <el-button type="text" @click="editDepartment">编辑</el-button>
          </div>
        </div>
        <el-row class="mt-20">
          <el-col :span="6">
            <el-button size="mini" type="primary" @click="addPersonnel">添加员工</el-button>
<!--            <el-button size="mini" type="danger" :disabled="!multipleSelection.length" @click="deletePersonnel(multipleSelection)">批量删除</el-button>-->
          </el-col>
          <el-col :span="18">
            <el-form :inline="true" :model="searchForm" size="mini" class="float-right">
              <el-form-item label="">
                <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable></el-input>
              </el-form-item>
              <el-form-item class="mr-0">
                <el-button type="primary" @click="getTableList(departmentDetail.id)">查询</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
       <!--表格-->
        <el-table
          v-loading="loading"
          border
          @selection-change="(val) => {multipleSelection = val}"
          :data="tableData">
          <el-table-column
            align="center"
            prop="username"
            label="用户名">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="deptName"
            label="部门">
          </el-table-column>
          <el-table-column
            width="80"
            align="center"
            prop="sex"
            label="性别">
            <template slot-scope="scope">
              <span v-if="scope.row.sex === 0">男</span>
              <span v-else>女</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="position"
            label="职位">
          </el-table-column>
          <el-table-column
            min-width="110"
            align="center"
            prop="mobile"
            label="手机号">
          </el-table-column>
          <el-table-column
            align="center"
            prop="roleName"
            label="角色">
          </el-table-column>
          <el-table-column
            width="180"
            align="center"
            prop="roleName"
            label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="text" class="color-danger" @click="deletePersonnel(scope.row)">删除</el-button>
              <el-button size="mini" type="text" class="color-success" @click="editPersonnel(scope.row)">编辑</el-button>
              <el-button size="mini" type="text" @click="resetPassword(scope.row)">重置密码</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="float-right mt-10 mb-10"
          hide-on-single-page
          @current-change="(val) => {searchForm.page = val}"
          :current-page="searchForm.page"
          background
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-card>
    </el-col>
    <!--下级部门dialog-->
    <el-dialog
      :title="departmentDialog.title"
      :visible.sync="departmentDialog.show"
      width="500px">
      <el-form :model="departmentDialog.form" :rules="departmentDialog.rules" ref="departmentForm" label-width="80px">
        <el-form-item label="部门名称" prop="departmentName">
          <el-input placeholder="请输入部门名称" v-model="departmentDialog.form.departmentName"></el-input>
        </el-form-item>
        <el-form-item label="负责人">
          <el-popover
            width="400"
            trigger="hover" >
            <personnel-tree @check="checkPersonnelTree" :multiple="false"></personnel-tree>
            <el-input readonly slot="reference" placeholder="请选择部门负责人" v-model="departmentDialog.form.managerName"></el-input>
          </el-popover>
        </el-form-item>
        <el-form-item label="显示排序" prop="order">
          <el-input-number
            v-model="departmentDialog.form.order"
            controls-position="right"
            :min="1"
            :max="50"></el-input-number>
        </el-form-item>
        <el-form-item label="所属公司" prop="organization">
          <el-select
            placeholder="请选择所属公司"
            class="width-percent-100"
            v-model="departmentDialog.form.organization">
            <el-option
              v-for="item in data"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="departmentDialog.show = false">取 消</el-button>
        <el-button type="primary" @click="submitDepartment">确 定</el-button>
      </span>
    </el-dialog>
    <!--用户dialog-->
    <el-dialog
      :title="personnelDialog.title"
      :visible.sync="personnelDialog.show">
      <el-form :model="personnelDialog.form" :rules="personnelDialog.rules" ref="personnelForm" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="部门" prop="department">
              <el-cascader
                :props="{ expandTrigger: 'hover', value: 'id', label: 'name', children: 'childList' }"
                class="width-percent-100"
                placeholder="请选择部门"
                :options="data"
                v-model="personnelDialog.form.department"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="username">
              <el-input placeholder="请输入姓名" v-model="personnelDialog.form.username"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="职位" prop="position">
              <el-input placeholder="请输入职位" v-model="personnelDialog.form.position"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="sex">
              <el-select class="width-percent-100" v-model="personnelDialog.form.sex" placeholder="请选择性别">
                <el-option label="男" :value="0"></el-option>
                <el-option label="女" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号" prop="mobile">
              <el-input placeholder="请输入手机号" v-model="personnelDialog.form.mobile"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色" prop="role">
              <el-select class="width-percent-100" v-model="personnelDialog.form.role" placeholder="请选择角色">
                <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="排序号" prop="sort">
          <el-input-number v-model="personnelDialog.form.sort" controls-position="right" :min="1" :max="50"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="personnelDialog.show = false">取 消</el-button>
        <el-button type="primary" @click="submitPersonnel">确 定</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>

<script>
import _ from 'lodash'
import PersonnelTree from '@/components/PersonnelTree';
export default {
  name: 'Index',
  components: { PersonnelTree },
  data () {
    return {
      loading: false,
      multipleSelection: [], // 多选表格
      roleList: [], // 角色列表
      departmentDetail: {
        id: null,
        name: '',
        companyName: '',
        companyId: '',
        managerName: '',
        manager: null,
        order: null
      }, // 部门信息
      searchForm: {
        name: '',
        page: 1,
        limit: 10
      },
      tableData: [],
      total: null,
      departmentDialog: {
        title: '',
        show: false,
        form: {
          id: null,
          departmentName: '',
          manager: null,
          managerName: '',
          order: 1,
          organization: ''
        },
        rules: {
          departmentName: [
            { required: true, message: '请输入部门名称', trigger: 'blur' }
          ],
          manager: [
            { required: true, message: '请选择负责人', trigger: 'blur' }
          ],
          order: [
            { required: true, message: '请输入排序号', trigger: 'blur' }
          ],
          organization: [
            { required: true, message: '请选择所属公司', trigger: 'blur' }
          ]
        }
      },
      personnelDialog: {
        title: '',
        show: false,
        form: {
          id: null,
          username: '',
          position: '',
          sort: 1,
          role: '',
          sex: 0, // 0男1女
          mobile: '',
          department: ''
        },
        rules: {
          username: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          position: [
            { required: true, message: '请输入岗位', trigger: 'blur' }
          ],
          sort: [
            { required: true, message: '请输入排序号', trigger: 'blur' }
          ],
          role: [
            { required: true, message: '请选择角色', trigger: 'blur' }
          ],
          sex: [
            { required: true, message: '请选择性别', trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' }
          ],
          department: [
            { required: true, message: '请选择部门', trigger: 'blur' }
          ]
        }
      },
      data: [], // 企业部门树结构
      defaultProps: {
        children: 'childList',
        label: 'name'
      }
    }
  },
  watch: {
    _searchForm: {
      handler: function (newVal, oldVal) {
        if (newVal.page !== 1 && newVal.page === oldVal.page) {
          this.searchForm.page = 1;
        } else {
          this.getTableList(this.departmentDetail.id)
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
      return JSON.parse(JSON.stringify(this.searchForm))
    }
  },
  methods: {
    // 选择人员
    checkPersonnelTree (data) {
      this.departmentDialog.form.manager = data.map(item => item.id)
      this.departmentDialog.form.managerName = data.map(item => item.name).join()
    },
    // 添加下级部门
    addDownDepartment () {
      this.departmentDialog.title = '添加下级部门'
      this.departmentDialog.show = true
    },
    // 编辑部门
    editDepartment () {
      this.departmentDialog.title = '编辑部门'
      this.departmentDialog.show = true
      this.departmentDialog.form.id = this.departmentDetail.id
      this.departmentDialog.form.departmentName = this.departmentDetail.name
      this.departmentDialog.form.manager = [this.departmentDetail.manager]
      this.departmentDialog.form.managerName = this.departmentDetail.managerName
      this.departmentDialog.form.organization = this.departmentDetail.companyId
      this.departmentDialog.form.order = this.departmentDetail.order
    },
    // 删除部门
    deleteDepartment () {
      this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.organization.deleteDepartment([this.departmentDetail.id]).then(res => {
          this.$message.success('删除成功')
          this.getTree().then(() => {
            this.getDepartmentDetail(this.data[0].childList[0].id)
            this.getTableList(this.data[0].childList[0].id)
          })
        })
      }).catch(() => {});
    },
    // 重置密码
    resetPassword (row) {
      this.$confirm('此操作将重置改用户密码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.user.resetPassword(row.id).then(res => {
          this.$message.success('重置成功')
        })
      }).catch(() => {});
    },
    // 添加员工
    addPersonnel () {
      this.personnelDialog.title = '添加员工'
      this.personnelDialog.show = true
      this.personnelDialog.form = {
        id: null,
        username: '',
        position: '',
        sort: 1,
        role: '',
        sex: 0, // 0男1女
        mobile: '',
        department: ''
      }
    },
    // 编辑员工
    editPersonnel (row) {
      this.personnelDialog.title = '编辑员工'
      this.personnelDialog.show = true
      this.personnelDialog.form = {
        id: row.id,
        username: row.username,
        position: row.position,
        sort: row.sort,
        role: row.roleId,
        sex: row.sex || 0, // 0男1女
        mobile: row.mobile,
        department: [row.companyId, row.deptId]
      }
    },
    // 删除员工
    deletePersonnel (data) {
      this.$confirm('此操作将永久删除用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.user.deletePersonnel([data.id]).then(res => {
          this.$message.success('删除成功')
          this.getTableList(this.departmentDetail.id)
        })
      }).catch(() => {});
    },
    // 提交部门dialog表单
    submitDepartment () {
      this.$refs.departmentForm.validate((valid) => {
        if (valid) {
          const data = {
            companyId: this.departmentDialog.form.organization,
            deptManager: this.departmentDialog.form.manager ? this.departmentDialog.form.manager[0] : '',
            deptName: this.departmentDialog.form.departmentName,
            sort: this.departmentDialog.form.order
          }
          if (this.departmentDialog.form.id) {
            data.id = this.departmentDialog.form.id
            this.$api.organization.updateDepartment(data).then(res => {
              this.$message.success('修改成功')
              this.departmentDialog.show = false
              this.getDepartmentDetail(this.departmentDialog.form.id)
            })
          } else {
            this.$api.organization.addDepartment(data).then(res => {
              this.$message.success('添加成功')
              this.departmentDialog.show = false
              this.getTree()
            })
          }
        }
      });
    },
    // 提交人员dialog表单
    submitPersonnel () {
      this.$refs.personnelForm.validate((valid) => {
        if (valid) {
          const data = {
            deptId: this.personnelDialog.form.department[1],
            mobile: this.personnelDialog.form.mobile,
            position: this.personnelDialog.form.position,
            roleId: this.personnelDialog.form.role,
            sex: this.personnelDialog.form.sex,
            sort: this.personnelDialog.form.sort,
            username: this.personnelDialog.form.username
          }
          if (this.personnelDialog.form.id) {
            data.id = this.personnelDialog.form.id
            this.$api.user.updatePersonnel(data).then(res => {
              this.$message.success('修改成功')
              this.personnelDialog.show = false
              this.getTableList(this.departmentDetail.id)
            })
          } else {
            this.$api.user.addPersonnel(data).then(res => {
              this.$message.success('添加成功')
              this.personnelDialog.show = false
              this.getTableList(this.departmentDetail.id)
            })
          }
        }
      });
    },
    /**
     * 获取部门tree
     */
    getTree () {
      return new Promise((resolve, reject) => {
        this.$api.common.getDepartmentAll().then(res => {
          this.data = res || []
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 点击企业部门树
    handleNodeClick (data) {
      if (data.type === 1) {
        this.searchForm.page = 1
        this.getDepartmentDetail(data.id)
        this.getTableList(data.id, 1)
      }
    },
    // 获取表格数据
    getTableList: _.throttle(function (id, page) {
      const data = {
        pageNum: page || this.searchForm.page,
        pageSize: 10,
        deptId: id,
        fuzzy: this.searchForm.name
      }
      this.loading = true
      this.$api.common.getDepartmentUserList(data).then(res => {
        this.tableData = res.list || []
        this.total = res.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }, 1000),
    // 获取部门信息
    getDepartmentDetail (id) {
      this.$api.organization.departmentDetail(id).then(res => {
        this.departmentDetail.id = res.id
        this.departmentDetail.name = res.deptName
        this.departmentDetail.managerName = res.deptManagerName
        this.departmentDetail.companyId = res.companyId
        this.departmentDetail.companyName = res.companyName
        this.departmentDetail.manager = res.deptManager
        this.departmentDetail.order = res.sort
      })
    },
    // 获取角色
    getRoleList () {
      this.$api.role.getRoleList().then(res => {
        this.roleList = res
      })
    }
  },
  created () {

  },
  mounted () {
    this.getTree().then(() => {
      this.getDepartmentDetail(this.data[0].childList[0].id)
      this.getTableList(this.data[0].childList[0].id)
    })
    this.getRoleList()
  }
}
</script>

<style lang="scss" scoped>
  .header {
    background-color: #edf9ff;
    padding: 6px 20px;
    border-radius: 5px;
    p+p {
      margin-left: 40px;
    }
  }
</style>
