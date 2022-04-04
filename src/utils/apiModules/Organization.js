import * as Request from '../Request';

export const Organization = {
  // 新增部门
  addDepartment: (data) => {
    return Request.post('/dept/save', data);
  },
  // 删除部门
  deleteDepartment: (data) => {
    return Request.delBody('/dept/delete', data);
  },
  // 修改部门
  updateDepartment: (data) => {
    return Request.put('/dept/update', data);
  },
  // 部门详情
  departmentDetail: (id) => {
    return Request.get(`/dept/info/${id}`);
  }
}
