<template>
  <div class="main">
    <el-row>
      <el-col :span="24">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增菜单
        </el-button>
      </el-col>
    </el-row>
    <el-table
      row-key="id"
      class="mt-20"
      border
      :data="menuList"
      :tree-props="{children: 'childList', hasChildren: 'hasChildren'}">
      <el-table-column align="left" prop="name" label="菜单名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column align="center" label="菜单路由" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.url || scope.row.perms}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sort" label="排序号"></el-table-column>
      <el-table-column align="center" label="类型" prop="Type">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" v-if="scope.row.type === 0">目录</el-button>
          <el-button size="mini" v-if="scope.row.type === 1">菜单</el-button>
          <el-button size="mini" v-if="scope.row.type === 2">按钮</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleDel(scope.row)"
          ><span class="color-danger">删除</span>
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleEdit(scope.row)"
          >编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="菜单名称" prop="name" v-if="form.type !== 2">
          <el-input v-model="form.name" placeholder="请输入菜单名称"/>
        </el-form-item>
        <el-form-item label="权限名称" prop="name" v-else>
          <el-input v-model="form.name" placeholder="请输入权限名称"/>
        </el-form-item>
        <el-form-item label="权限接口" prop="perms" v-if="form.type === 2">
          <el-input v-model="form.perms" placeholder="请输入权限"></el-input>
        </el-form-item>
        <el-form-item label="菜单路由" prop="path" v-if="form.type !== 2">
          <el-input v-model="form.path" placeholder="请输入菜单路由"/>
        </el-form-item>
        <el-form-item label="组件路径" prop="path" v-if="form.type === 1">
          <el-input v-model="form.component" placeholder="请输入组件路径"/>
        </el-form-item>
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio :label="0">目录</el-radio>
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">权限</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="显示排序" prop="sort">
          <el-input-number v-model="form.sort" controls-position="right" :min="0"/>
        </el-form-item>
        <el-form-item v-if="form.type !== 2" label="菜单图标" prop="icon">
          <el-popover
            placement="bottom-start"
            width="460"
            trigger="click"
            @show="$refs['iconSelect'].reset()"
          >
            <IconSelect ref="iconSelect" @selected="selected"/>
            <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
              <svg-icon
                v-if="form.icon"
                slot="prefix"
                :name="form.icon"
                class="el-input__icon"
                style="height: 32px;width: 16px;"
              />
              <i v-else slot="prefix" class="el-icon-search el-input__icon"/>
            </el-input>
          </el-popover>
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentId" v-if="form.type === 1">
          <el-select v-model="form.parentId" placeholder="请选择">
            <el-option
              v-for="(item,index)  in menuList"
              :key="index"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentId" v-if="form.type === 2">
          <el-cascader
            @change="(e) => {form.parentId = e[e.length-1]}"
            v-model="form.parentId"
            :options="cascaderList"
            :props="{ expandTrigger: 'hover' }"></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import IconSelect from '@/components/IconSelect';

export default {
  name: 'Index',
  components: { IconSelect },
  data () {
    return {
      // 遮罩层
      // 菜单表格树数据
      menuList: [],
      cascaderList: [],
      // 菜单树选项
      menuOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          {
            required: true,
            message: '菜单名称不能为空',
            trigger: 'blur'
          }
        ],
        sort: [
          {
            required: true,
            message: '菜单顺序不能为空',
            trigger: 'blur'
          }
        ],
        path: [
          {
            required: true,
            message: '路由地址不能为空',
            trigger: 'blur'
          }
        ],
        type: [
          {
            required: true,
            message: '菜单类型不能为空',
            trigger: 'blur'
          }
        ],
        icon: [
          {
            required: true,
            message: '图标不能为空',
            trigger: 'submit'
          }
        ],
        parentId: [
          {
            required: true,
            message: '上级菜单不能为空',
            trigger: 'blur'
          }
        ],
        perms: [
          {
            required: true,
            message: '权限接口不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {},
  computed: {},
  methods: {
    // 选择图标
    selected (name) {
      this.form.icon = name;
    },
    /** 查询菜单列表 */
    getList () {
      this.$api.menu.getMenuList().then(res => {
        this.menuList = res
        this.cascaderList = res.map(item => {
          return {
            value: item.id,
            label: item.name,
            children: item.childList.map(_item => {
              return {
                value: _item.id,
                label: _item.name
              }
            })
          }
        })
      })
    },
    // 取消按钮
    cancel () {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset () {
      this.form = {
        id: null,
        parentId: null,
        name: null,
        path: null,
        icon: null,
        type: 0,
        sort: 0,
        component: null,
        perms: null
      };
    },
    /** 新增按钮操作 */
    handleAdd () {
      this.reset();
      this.open = true;
      this.title = '添加菜单';
    },
    /** 修改按钮操作 */
    handleEdit (row) {
      this.reset();
      this.form.parentId = row.parentId;
      this.form.name = row.name
      this.form.icon = row.icon
      this.form.perms = row.perms
      this.form.sort = row.sort
      this.form.type = row.type
      this.form.path = row.url
      this.form.id = row.id
      this.form.component = row.component
      this.open = true;
      this.title = '编辑菜单';
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs.form.validate(valid => {
        if (valid) {
          const data = {
            hidden: 0,
            icon: this.form.icon,
            name: this.form.name,
            parentId: this.form.parentId,
            perms: this.form.perms,
            component: this.form.component,
            sort: this.form.sort,
            type: this.form.type,
            url: this.form.path
          }
          if (this.form.id) {
            data.id = this.form.id
            this.$api.menu.editMenu(data).then(res => {
              this.$message.success('操作成功')
              this.open = false
              this.getList()
            })
          } else {
            this.$api.menu.addMenu(data).then(res => {
              this.$message.success('操作成功')
              this.open = false
              this.getList()
            })
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDel (row) {
      this.$confirm('是否确认删除名称为"' + row.name + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.menu.delMenu([row.id]).then(res => {
          this.getList()
          this.$message.success('删除成功')
        })
      }).catch(() => {
      });
    }
  },
  created () {

  },
  mounted () {
    this.getList()
  }
}
</script>

<style lang="scss" scoped>

</style>
