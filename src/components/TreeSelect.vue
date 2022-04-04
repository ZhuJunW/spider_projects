<template>
  <treeselect
    @input="select"
    :searchable="false"
    :style="{height: height, width: width, 'line-height': height}"
    class="tree"
    :limit="2"
    :limitText="() => '...'"
    valueFormat="object"
    v-model="value"
    :flat="multiple"
    :disable-branch-nodes="true"
    :load-options="loadOptions"
    value-consists-of="LEAF_PRIORITY"
    :options="options"
    :multiple="multiple"
    :placeholder="placeholder">
    <label slot="option-label" slot-scope="{ node }">
      <span v-if="node.isBranch" >{{ node.label }}</span>
      <span v-else>{{node.label}} <i style="float: right;color: #666666" v-show="workload">({{node.raw.workload}})</i></span>
    </label>
  </treeselect>
</template>

<script>
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import { LOAD_ROOT_OPTIONS, LOAD_CHILDREN_OPTIONS, Treeselect } from '@riophae/vue-treeselect'
export default {
  name: 'TreeSelect',
  components: { Treeselect },
  props: {
    defaultValue: {
      type: undefined,
      default () {
        return null
      }
    },
    multiple: {
      type: Boolean,
      default () {
        return true
      }
    }, // 是否多选
    workload: {
      type: Boolean,
      default () {
        return false
      }
    }, // 是否显示工作饱和度
    placeholder: {
      type: String,
      default () {
        return '请选择'
      }
    }, // 提示文字
    id: {
      type: String,
      default () {
        return ''
      }
    }, // id
    width: {
      type: String,
      default () {
        return '240px'
      }
    }, // 样式
    height: {
      type: String,
      default () {
        return '28px'
      }
    } // 样式
  },
  data () {
    return {
      value: null,
      options: null
    }
  },
  watch: {
  },
  computed: {},
  methods: {
    select (value) {
      this.$emit('changeValue', value)
    },
    normalizer (data) {
      return data.map(node => {
        if (node.type === 0) {
          return {
            id: node.id,
            label: node.name,
            children: null,
            type: node.type,
            workload: node.workload
          }
        } else {
          return {
            id: node.id,
            label: node.name,
            type: node.type,
            workload: node.workload
          }
        }
      }) || []
    },
    getOptions (id = null, type = 0) {
      const data = {
        type
      }
      if (id) {
        data.id = id
      }
      return new Promise((resolve, reject) => {
        this.$api.common.lazyLoadPersonnel(data).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    async loadOptions ({ action, callback, parentNode }) {
      // 根菜单
      if (action === LOAD_ROOT_OPTIONS) {
        await this.getOptions().then(res => {
          this.options = this.normalizer(res)
        })
      }
      // 子节点
      if (action === LOAD_CHILDREN_OPTIONS) {
        if (parentNode.type === 0) {
          await this.getOptions(parentNode.id).then(res => {
            parentNode.children = this.normalizer(res)
          })
        } else {
          parentNode.children = []
          callback(new Error('暂无数据'))
        }
      }
    }
  },
  created () {

  },
  mounted () {
    if (this.defaultValue) {
      this.value = this.defaultValue
    }
  }
}
</script>

<style lang="scss" scoped>
  .tree {
    cursor: pointer;
    /deep/ .vue-treeselect__control {
      height: 100%;
      line-height: 100%;
      vertical-align: sub;
      .vue-treeselect__single-value {
        display: flex;
        align-items: center;
        text-indent: 6px;
      }
      .vue-treeselect__multi-value {
        margin-bottom: 0;
        .vue-treeselect__multi-value-item-container {
          padding: 4px;
        }
      }
      .vue-treeselect__placeholder {
        display: flex;
        align-items: center;
      }
      .vue-treeselect-helper-hide {
        display: none;
      }
    }
  }
</style>
