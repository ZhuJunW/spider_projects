import * as Request from '../Request';

export const Statistics = {
  // 分页查询企业员工线上培训详情数据
  getUserOnlinePractice: (data) => {
    return Request.post('/home/enterpriseUserTrainOnlineList', data);
  },
  getCourseStatistics: (data) => {
    return Request.post('/stat/course/list', data);
  },
  getCourseDetail: (data) => {
    return Request.post('/stat/course/detail', data);
  }
}
