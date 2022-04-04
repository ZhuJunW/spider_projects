<template>
  <el-dialog
    title="区域筛选"
    :visible.sync="showDialog"
    :before-close="close"
    width="800px">
    <div class="custom-tree-container">
      <div class="block" style="padding-right: 10px;flex: 1;">
        <el-input
          style="margin-bottom: 12px;"
          size="small"
          placeholder="输入关键字进行过滤"
          clearable
          v-model="filterText">
        </el-input>
<!--        <div style="text-align: right;">-->
<!--          <el-checkbox v-model="allChecked" @change="checkedAll"/> 全选/取消全选-->
<!--        </div>-->
        <el-tree
          show-checkbox
          node-key="id"
          lazy
          :props="props"
          :data="treeData"
          :load="loadNode"
          :filter-node-method="filterNode"
          ref="tree"
          @check="check"
          :render-after-expand="false"
          accordion
        >
        </el-tree>
      </div>
      <div class="block" style="padding-right: 20px;flex: 1;">
        <h3 style="margin: 8px;">已选{{checked.length}}
          <el-button
            v-if="checked.length!==0"
            @click="deleteAll"
            type="primary"
            size="mini"
            icon="el-icon-delete"
            circle>
          </el-button>
        </h3>
        <div style="margin-left: 10px;">
          <el-tag
            style="margin-right: 10px;margin-bottom: 10px;"
            v-for="(tag,index) in checked"
            :key="index"
            @close="closeTag(tag)"
            closable>
            {{tag.label}}
          </el-tag>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="enter">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'AreaTree',
  props: {
    showDialog: {
      type: Boolean,
      default () {
        return false
      }
    } // dialog状态
  },
  data () {
    return {
      props: {
        isLeaf: 'leaf'
      },
      filterText: '', // 筛选文字
      treeData: [], // 树形结构数据
      checked: [], // 选择的人员
      allChecked: false
    }
  },
  watch: {
    // 监听筛选
    filterText (val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    loadNode (node, resolve) {
      if (node.level <= 3) {
        this.$api.common.lazyLoadArea({ code: node.data.id, level: node.level }).then(res => {
          res = res.map(item => {
            return {
              id: item.code,
              label: item.value,
              level: item.level,
              disabled: item.level !== 3,
              leaf: item.level === 3
            }
          })
          resolve(res);
        })
      }
    },
    // 筛选数据方法
    filterNode (value, data) {
      return !value || data.label.includes(value);
    },
    /**
       * 当复选框被点击的时候触发
       * @param {object} data 传递给 data 属性的数组中该节点所对应的对象
       * @param {object} checked 树目前的选中状态对象
       */
    check (data, checked) {
      this.checked = checked.checkedNodes.filter(item => item.level === 3) || []
    },
    /**
       * dialog的关闭方法
       */
    close () {
      this.$emit('close')
    },
    /**
       * dialog的确定方法
       */
    enter () {
      this.$emit('enter', this.checked)
    },
    /**
       * 点击tag的删除按钮方法
       * @param {Object}tag 此tag的data数据
       */
    closeTag (tag) {
      this.checked.splice(this.checked.indexOf(tag), 1)
      this.$refs.tree.setChecked(tag.id, false)
    },
    /**
       * 右侧已选人员的全部取消操作
       */
    deleteAll () {
      this.checked = []
      this.$refs.tree.setCheckedKeys([]);
      this.allChecked = false
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>

<style scoped lang="scss">
  .custom-tree-container {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;

    .block {
      width: 48%;
      max-height: 460px;
      overflow-y: scroll;
      &::-webkit-scrollbar-track-piece { //滚动条凹槽的颜色，还可以设置边框属性
        background-color: #f8f8f8;
      }

      &::-webkit-scrollbar { // 滚动条整体样式
        width: 4px;     // 高宽分别对应横竖滚动条的尺寸
        height: 4px;
      }

      &::-webkit-scrollbar-thumb { // 滚动条里面小方块
        border-radius: 10px;
        background: #ccc;
      }

      &::-webkit-scrollbar-track { // 滚动条里面轨道
        border-radius: 10px;
      }
    }
  }
</style>
