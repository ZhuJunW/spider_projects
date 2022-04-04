<template>
  <el-tree
    ref="personnelTree"
    @check="check"
    :load="loadNode"
    lazy
    show-checkbox
    node-key="id"
    :props="defaultProps">
  </el-tree>
</template>

<script>
export default {
  name: 'PersonnelTree',
  data () {
    return {
      defaultProps: {
        children: 'childList',
        label: 'name',
        isLeaf: 'leaf'
      }
    }
  },
  props: {
    multiple: {
      type: Boolean,
      default: true
    }
  },
  watch: {},
  computed: {},
  methods: {
    check (data, tree) {
      if (this.multiple) {
        this.$emit('check', tree.checkedNodes.filter(item => item.type === 2))
      } else {
        this.$refs.personnelTree.setCheckedKeys([]);
        this.$refs.personnelTree.setCheckedKeys([data.id]);
        this.$emit('check', [data])
      }
    },
    loadNode (node, resolve) {
      const data = {
        id: node.key,
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
      })
    }
  },
  created () {

  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>

</style>
