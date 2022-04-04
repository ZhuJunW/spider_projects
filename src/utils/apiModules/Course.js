import * as Request from '../Request';

export const Course = {
  // 获取课程专业类别
  getProfessional: (data) => {
    return Request.get('/course/section/specialityList', data);
  },
  // 获取个人课程列表
  getCourseList: (data) => {
    return Request.post('/train/userCouserList', data);
  },
  // 获取个人课程章节列表
  getCourseChapterList: (data) => {
    return Request.get('/train/courseSectionDetail', data);
  },
  // 获取个人课程状态
  getCourseState: (data) => {
    return Request.get('/train/courseStatus', data);
  },
  // 获取个人课程考试状态
  getCourseExamState: (data) => {
    return Request.get('/train/courseExam', data);
  },
  // 更新个人课程章节时间
  updateVideoTime: (data) => {
    return Request.post('/train/addUserSectionStudyTime', data);
  },
  // 获取成绩列表
  getHistoryList: (data) => {
    return Request.post('/train/userCouserLearnHistory', data);
  },
  // 获取课程封面图片列表
  getScoreImageList: (data) => {
    return Request.get('/course/coverList', data);
  },
  // 获取课程封面图片
  getCourseImage: (data) => {
    return Request.get('/course/cover', data);
  },
  // 获取课程管理列表
  getCourseManageList: (data) => {
    return Request.post('/course/search', data);
  },
  // 根据id 删除课程列
  deleteCourse: (data) => {
    return Request.del('/course/delete', data);
  },
  // 新增保存课程列表
  saveCourse: (data) => {
    return Request.post('/course/create', data);
  },
  // 根据id 删除章节
  deleteChapter: (data) => {
    return Request.del('/course/section/delete', data);
  },
  // 编辑更新课程
  updateCourse: (data) => {
    return Request.post('/course/update', data);
  },
  // 新增保存课程
  createCourse: (data) => {
    return Request.post('/course/create', data);
  },
  // 编辑更新章节
  updateChapter: (data) => {
    return Request.post('/course/section/update', data);
  },
  // 新增保存章节
  createChapter: (data) => {
    return Request.post('/course/section/add', data);
  },
  // 课程详情（根据课程获得相应试卷和章节）
  chapterManage: (data) => {
    return Request.get('/course/section/manage', data);
  },
  // 编辑课程时的 课程基本数据展示
  getCourseDetail: (data) => {
    return Request.get('/course/detail', data);
  },
  // 更新课程状态(1.上架; 0.下架)
  updateStatus: (data) => {
    return Request.get('/course/updateStatus', data);
  },
  // 更新课程公开状态(0.不公开; 1.公开)
  updateOpenStatus: (courseId, open) => {
    return Request.put(`/course/updateOpen?courseId=${courseId}&open=${open}`);
  },
  // 章节编辑框的章节详情
  getSectionDetail: (data) => {
    return Request.get('/course/section/detail', data);
  }

}
