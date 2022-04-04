import * as Request from '../Request';

export const Menu = {
  // 新增菜单
  addMenu: (data) => {
    return Request.post('/menu/save', data);
  },
  // 删除菜单
  delMenu: (data) => {
    return Request.delBody('/menu/delete', data);
  },
  // 编辑菜单
  editMenu: (data) => {
    return Request.put('/menu/update', data);
  },
  // 获取菜单列表
  getMenuList: (data) => {
    return Request.get('/menu/list', data);
  },
  // 根据登录的账号，获取菜单树
  getUserMenu: (data) => {
    return Request.get('/user/getMenuTree', data);
  }
}
