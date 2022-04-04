<template>
  <div class="main">
    <header>
      <h5 class="fs-16 mb-20 mt-0">{{$route.name}}</h5>
    </header>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="mt-20">
      <p>基本信息</p>
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="角色code" prop="code">
        <el-input v-model="ruleForm.code"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <p>菜单权限</p>
          <el-tree
            @check="checkMenu"
            accordion
            ref="menuTree"
            default-expand-all
            :data="menuList"
            show-checkbox
            node-key="id"
            :expand-on-click-node="false"
            :props="defaultProps">
            <span class="display-flex jc-space-between ai-center width-percent-80" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span v-if="data.type === 1">
<!--                <el-button-->
                <!--                  type="text"-->
                <!--                  size="mini"-->
                <!--                  @click.stop="setAuth(data)">-->
                <!--                  权限设置-->
                <!--                </el-button>-->
              </span>
            </span>
          </el-tree>
        </el-col>
        <!--        <el-col :span="12" id="authDetail">-->
        <!--          <template v-if="authList.filter(item => item.selected).length">-->
        <!--            <p>-->
        <!--              数据权限-->
        <!--              <span class="color-danger">-->
        <!--                （{{authList.filter(item => item.selected)[0].name}}）-->
        <!--              </span>-->
        <!--            </p>-->
        <!--            <el-form-item label="权限类型">-->
        <!--              <el-select-->
        <!--                filterable-->
        <!--                clearable-->
        <!--                class="width-percent-90"-->
        <!--                v-model="authList.filter(item => item.selected)[0].authType"-->
        <!--                placeholder="请选择权限类型">-->
        <!--                <el-option label="企业" :value="1"></el-option>-->
        <!--                <el-option label="部门" :value="2"></el-option>-->
        <!--                <el-option label="自己" :value="3"></el-option>-->
        <!--              </el-select>-->
        <!--            </el-form-item>-->
        <!--            <p>权限拓展</p>-->
        <!--            <el-form-item label="选择企业" prop="companyIds">-->
        <!--              <el-select-->
        <!--                filterable-->
        <!--                clearable-->
        <!--                multiple-->
        <!--                class="width-percent-90"-->
        <!--                v-model="authList.filter(item => item.selected)[0].otherCompany"-->
        <!--                placeholder="请选择企业">-->
        <!--                <el-option-->
        <!--                  v-for="item in companyList"-->
        <!--                  :key="item.id"-->
        <!--                  :label="item.companyName"-->
        <!--                  :value="item.id"></el-option>-->
        <!--              </el-select>-->
        <!--            </el-form-item>-->
        <!--            <el-form-item label="选择部门" prop="departmentIds">-->
        <!--              <el-cascader-->
        <!--                placeholder="请选择部门"-->
        <!--                class="width-percent-90"-->
        <!--                :options="departmentList"-->
        <!--                filterable-->
        <!--                clearable-->
        <!--                collapse-tags-->
        <!--                v-model="authList.filter(item => item.selected)[0].otherDept"-->
        <!--                :props="{ expandTrigger: 'hover', multiple: true, value: 'id', label: 'name', children: 'children' }">-->
        <!--              </el-cascader>-->
        <!--            </el-form-item>-->
        <!--            <el-form-item label="选择人员" prop="userIds">-->
        <!--              <el-tree-->
        <!--                @check="checkPersonnel"-->
        <!--                ref="tree"-->
        <!--                :load="loadNode"-->
        <!--                lazy-->
        <!--                show-checkbox-->
        <!--                node-key="id"-->
        <!--                :props="defaultProps">-->
        <!--              </el-tree>-->
        <!--            </el-form-item>-->
        <!--          </template>-->
        <!--          <p v-else class="color-danger">-->
        <!--            请点击右侧权限设置-->
        <!--          </p>-->
        <!--        </el-col>-->
      </el-row>
      <el-form-item class="mt-20">
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data () {
    return {
      authList: [],
      defaultProps: {
        children: 'childList',
        label: 'name',
        isLeaf: 'leaf'
      },
      menuList: [],
      buttonIds: [],
      companyList: [],
      departmentList: [],
      ruleForm: {
        name: '',
        code: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入角色code', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {},
  computed: {},
  methods: {
    // 权限设置
    setAuth (data) {
      this.authList.forEach(item => {
        item.selected = false
      })
      this.authList.filter(item => item.id === data.id)[0].selected = true
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys([], true);
        this.$refs.tree.setCheckedKeys(this.authList.filter(item => item.selected)[0].otherUser, true);
        // document.getElementById('authDetail').scrollIntoView()
      })
    },
    // 懒加载人员数
    loadNode (node, resolve) {
      const data = {
        id: node.key || 1,
        type: node.level
      }
      this.$api.common.lazyLoadPersonnel(data).then(res => {
        res = res.map(item => {
          return {
            ...item,
            disabled: item.type !== 2,
            leaf: item.type === 2
          }
        })
        resolve(res);
        this.$refs.tree.setCheckedKeys(this.authList.filter(item => item.selected)[0].otherUser, true);
      })
    },
    // 选择菜单
    checkMenu (data, node) {
      this.buttonIds = node.checkedNodes.filter(item => item.type === 2).map(_item => _item.id)
    },
    // 选择人员
    checkPersonnel (data, node) {
      this.authList.filter(item => item.selected)[0].otherUser = node.checkedNodes.filter(item => item.type === 2).map(_item => _item.id)
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // const menuTreeNode = this.$refs.menuTree.getCheckedNodes().filter(item => item.type === 1)
          // const menuDataPermList = []
          // this.authList.forEach(item => {
          //   menuTreeNode.forEach(_item => {
          //     if (item.id === _item.id) {
          //       menuDataPermList.push(item)
          //     }
          //   })
          // })
          const data = {
            roleName: this.ruleForm.name,
            roleCode: this.ruleForm.code,
            menuIds: this.buttonIds
            // menuDataPermList: menuDataPermList.map(item => {
            //   return {
            //     visible: item.authType,
            //     menuId: item.id,
            //     userIds: item.otherUser,
            //     companyIds: item.otherCompany,
            //     deptIds: item.otherDept
            //   }
            // })
          }
          if (this.$route.params.id) {
            data.id = this.$route.params.id
            this.$api.role.editRole(data).then(res => {
              this.$message.success('修改成功')
              this.$router.back()
            })
          } else {
            this.$api.role.addRole(data).then(res => {
              this.$message.success('创建成功')
              this.$router.back()
            })
          }
        }
      });
    },
    /**
     * 获取菜单列表
     */
    getMenuList () {
      return new Promise((resolve, reject) => {
        this.$api.menu.getMenuList().then(res => {
          // this.authList = []
          this.menuList = res || []
          // this.menuList.forEach(item => {
          //   item.children.forEach(_item => {
          //     this.authList.push(_item)
          //   })
          // })
          // this.authList = this.authList.map(item => {
          //   return {
          //     selected: false,
          //     id: item.id,
          //     name: item.name,
          //     authType: 1,
          //     otherCompany: [],
          //     otherDept: [],
          //     otherUser: []
          //   }
          // })
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    /**
     * 获取企业列表
     */
    getCompanyAll () {
      return new Promise((resolve, reject) => {
        this.$api.common.getCompanyAll().then(res => {
          this.companyList = res || []
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    /**
     * 获取部门tree
     */
    getDepartmentAll () {
      return new Promise((resolve, reject) => {
        this.$api.common.getDepartmentAll().then(res => {
          this.departmentList = res || []
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
    // Promise.all([this.getMenuList(), this.getCompanyAll(), this.getDepartmentAll()]).then(() => {
    Promise.all([this.getMenuList()]).then(() => {
      if (this.$route.params.id) {
        this.$api.role.getRoleDetail(this.$route.params.id).then(res => {
          this.ruleForm.name = res.roleName
          this.ruleForm.code = res.roleCode
          this.buttonIds = res.menuIds
          this.$refs.menuTree.setCheckedKeys(res.menuIds)
          // this.authList = []
          // this.authList = res.menuDataPermList.map(item => {
          //   return {
          //     selected: false,
          //     id: item.menuId,
          //     name: item.menuName,
          //     authType: item.visible,
          //     otherCompany: item.companyIds,
          //     otherDept: item.deptIds,
          //     otherUser: item.userIds
          //   }
          // })
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
</style>
