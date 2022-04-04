import Storage from 'store'
import Layout from '@/views/layout/Index'
// 遍历后台传来的路由字符串，转换为组件对象
export const filterAsyncRouter = (asyncRouterMap) => {
  return asyncRouterMap.filter(route => {
    route.path = route.url
    if (!route.component) {
      route.component = Layout
    } else {
      route.component = loadView(route.component)
    }
    if (route.type === 1) {
      delete route.children
    }
    if (route.children !== null && route.children && route.children.length && route.type !== 2) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })
}
// 路由懒加载
export const loadView = (view) => {
  return (resolve) => require([`@/views/${view}`], resolve)
}
/**
 * 是否显示按钮
 * @param {String}btnName 按钮名称
 */
export const showBtn = (btnName) => {
  let btnAuthArr = []
  for (const item of Storage.get('menuList')) {
    for (const _item of item.childList || []) {
      if (_item.url === window.location.hash.substr(1)) {
        _item.childList = _item.childList || []
        btnAuthArr = _item.childList.map(btn => btn.name)
        return btnAuthArr.includes(btnName)
      }
    }
  }
  return false
}
/**
 * 接口地址配置
 * @param type {number} - 选哪个请求头
 * @returns {string}
 */
export const baseURL = (type) => {
  let baseUrl = ''
  if (window.location.href.includes('https')) {
    baseUrl = 'https://edu.asdsafe.cn:18000'
  } else {
    type = 2
    switch (type) {
      case 1:
        baseUrl = 'http://192.168.0.120:8080'
        break
      case 2:
        baseUrl = 'http://192.168.0.112:18001'
        break
      case 3:
        baseUrl = 'http://192.168.0.108:18001'
        break
    }
  }
  baseUrl = 'https://peixun.asdsafe.cn:18001'
  // baseUrl = 'http://8.142.10.94:18001'
  // baseUrl = 'http://192.168.0.112:18001'
  return baseUrl
}
