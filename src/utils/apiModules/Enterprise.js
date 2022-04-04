import * as Request from '../Request';

export const Enterprise = {
  // 获取企业的行业类别
  getProfessional: (data) => {
    return Request.get('/industry/list', data);
  },
  // 获取企业(岗位)
  getEnterprisePosition: (data) => {
    return Request.get('/course/company_position_list', data);
  },
  // 获取企业管理列表
  getEnterpriseManageList: (data) => {
    return Request.post('/company/list', data);
  },
  // 根据id 删除企业
  deleteEnterprise: (data) => {
    return Request.delBody('/company/delete', data);
  },
  // 编辑更新企业
  updateEnterprise: (data) => {
    return Request.put('/company/update', data);
  },
  // 新增保存企业
  createEnterprise: (data) => {
    return Request.post('/company/save', data);
  },
  // 根据id获取企业详情基本信息
  getEnterpriseDetail: (data) => {
    return Request.get(`/company/info/${data}`);
  }

}
