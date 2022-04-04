import * as Request from '../Request';

export const Role = {
  // 新增角色
  addRole: (data) => {
    return Request.post('/role/save', data);
  },
  // 删除角色
  delRole: (data) => {
    return Request.delBody('/role/delete', data);
  },
  // 编辑角色
  editRole: (data) => {
    return Request.put('/role/update', data);
  },
  // 获取角色列表
  getRoleList: (data) => {
    return Request.get('/role/list', data);
  },
  // 获取所有角色列表
  getRoleAllList: (data) => {
    return Request.get('/role/all', data);
  },
  // 获取角色详情
  getRoleDetail: (id) => {
    return Request.get(`/role/info/${id}`);
  }
}
