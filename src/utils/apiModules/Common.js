import * as Request from '../Request';

export const Common = {
  // 根据客户名称关键字，模糊查询客户（id，name）
  searchCustomer: (data) => {
    return Request.get('/risk/crm/customer/search/fuzzy', data);
  },
  // 根据部门id，查询人员列表
  getDepartmentUserList: (data) => {
    return Request.post('/user/list', data);
  },
  // 获取市区
  getAreaList: (data) => {
    return Request.get('/city/getCityAreaTree', data);
  },
  // 获取街道
  getStreetList: (data) => {
    return Request.get(`/city/getStreet/${data}`);
  },
  // 懒加载地区
  lazyLoadArea: (data) => {
    return Request.post('/cn/list', data);
  },
  // 获取所有企业
  getCompanyAll: () => {
    return Request.get('/company/all');
  },
  // 获取所有企业部门树
  getDepartmentAll: () => {
    return Request.get('/dept/tree');
  },
  // 懒加载所有人员
  lazyLoadPersonnel: (data) => {
    return Request.get('/company/lazyLoad', data);
  }

}
