import * as Request from '../Request';

export const User = {
  // 员工修改自己的登录密码
  changePassword: (data) => {
    return Request.put('/user/password/update', data);
  },
  // 注册
  register: (data) => {
    return Request.post('/auth/register', data);
  },
  // 登录
  login: (data) => {
    return Request.post('/auth/login', data);
  },
  getUserInfo: () => {
    return Request.get('/user/getUserInfo');
  },
  // 添加人员
  addPersonnel: (data) => {
    return Request.post('/user/save', data);
  },
  // 删除人员
  deletePersonnel: (data) => {
    return Request.delBody('/user/delete', data);
  },
  // 修改人员
  updatePersonnel: (data) => {
    return Request.put('/user/update', data);
  },
  // 重置密码
  resetPassword: (id) => {
    return Request.put(`/user/password/reset/${id}`);
  }
}
