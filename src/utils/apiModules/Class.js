import * as Request from '../Request';

export const Class = {
  // 分页查询
  getClassList: (data) => {
    return Request.post('/trainCertifClasses/list', data);
  },
  //
  // 查询全部班次列表
  getClass: () => {
    return Request.get('/trainCertifClasses/listAll');
  },
  getPosterImageList: () => {
    return Request.get('/trainCertifClasses/poster/list');
  },
  // 根据id查询班次
  getById: (data) => {
    return Request.get('/trainCertifClasses/getById', data);
  },
  // 根据id
  deleteClass: (data) => {
    return Request.del('/trainCertifClasses/delete', data);
  },
  // // 删除课程
  // deleteCourse: (data) => {
  //   return Request.del('/trainCertifCourse/delete', data);
  // },
  // 编辑班次
  updateClass: (data) => {
    return Request.put('/trainCertifClasses/update', data);
  },
  // 新增班次
  createClass: (data) => {
    return Request.post('/trainCertifClasses/save', data);
  },
  //  课程管理 根据id删除
  deleteCourse: (data) => {
    return Request.del('/trainCertifCourse/delete', data);
  },
  // 分页查询课程
  getCourseList: (data) => {
    return Request.post('/trainCertifCourse/list', data);
  },
  // 新增课程
  createCourse: (data) => {
    return Request.post('/trainCertifCourse/save', data);
  },
  // 编辑课程
  updateCourse: (data) => {
    return Request.put('/trainCertifCourse/update', data);
  },
  // 分页查询报名人员
  getMemList: (data) => {
    return Request.post('/trainCertifStudent/list', data);
  },
  // 分页查询学员管理
  getStudentList: (data) => {
    return Request.post('/trainCertifStudent/listStudent', data);
  },
  // 获取单个学员的详情
  getStudentDetail: (data) => {
    return Request.get('/trainCertifStudent/selectOne', data);
  },
  // 新增报名人员
  createMem: (data) => {
    return Request.post('/trainCertifStudent/save', data);
  },
  // 查询学员关联课程
  listCourse: (studentId) => {
    return Request.post(`/trainCertifStudent/listCourse?studentId=${studentId}`);
  },

  // 审核
  updateMem: (data) => {
    return Request.put('/trainCertifStudent/update', data);
  },
  // 删除报名人员
  deleteMem: (data) => {
    return Request.del('/trainCertifStudent/delete', data);
  },
  // 颁发证书
  certSave: (data) => {
    return Request.post('/trainCertificate/save', data);
  },
  // // 关联证提交
  // updateStudentSave: (cerId, studentId) => {
  //   return Request.post(`/trainCertificate/updateStudent?cerId=${cerId}&studentId=${studentId}`);
  // },
  // 关联证提交
  updateStudentSave: (data) => {
    return Request.put('/trainCertificate/updateStudent', data);
  },
  //
  // 根据人员身份证号查询证书
  getCateByIdcard: (data) => {
    return Request.get('/trainCertifStudent/getCateById', data);
  },
  //
  // 分页查询证书
  getCertList: (data) => {
    return Request.post('/trainCertificate/list', data);
  },
  // 查询学员关联课程
  studentCourse: (studentId) => {
    return Request.post(`/trainCertifStudent/listCourse?studentId=${studentId}`);
  },
  // 录入成绩
  updateCour: (data) => {
    return Request.put('/trainCertifStudent/updateCourse', data);
  },
  // 根据证书培训记录
  getRecord: (data) => {
    return Request.get('/trainCertificate/selectRecord', data);
  },
  // 上传证书附件
  fileUpload: (data) => {
    return Request.post('/trainCertificate/fileUpload', data);
  },
  // 上传线下资料
  offlineUpload: (data) => {
    return Request.post('/trainCertifClasses/offline/document/upload', data);
  },
  // 查看二维码
  qrCode: (data) => {
    return Request.get('/trainCertificate/qrCode', data);
  },
  // 报名人员编辑
  updateStatus: (data) => {
    return Request.put('/trainCertifStudent/updateStatus', data);
  },
  // // 批量导出二维码
  batchCode: (data) => {
    return Request.get('/trainCertificate/exportCode', data);
  }
}
