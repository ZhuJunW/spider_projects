<script>
import SvgIcon from '@/components/SvgIcon'
export default {
  name: 'MenuItem',
  functional: true,
  components: {
    SvgIcon
  },
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render (h, context) {
    const { icon, title } = context.props
    const vnodes = []
    if (icon) {
      vnodes.push(<svg-icon style="margin-right: 16px;margin-left:4px;" name={icon}/>)
    }

    if (title) {
      vnodes.push(<span slot='title'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>
