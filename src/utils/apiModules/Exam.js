import * as Request from '../Request';

export const Exam = {
  // 获取考试管理列表
  getExamManageList: (data) => {
    return Request.post('/exam/search', data);
  },
  // 根据试卷id删除试卷
  deleteExam: (data) => {
    return Request.del('/exam/deleteExam', data);
  },
  // 编辑更新试卷
  updateExam: (data) => {
    return Request.post('/exam/update', data);
  },
  // 新增保存试卷
  createExam: (data) => {
    return Request.post('/exam/create', data);
  },
  // 获取试卷详情
  getQuestionDetail: (data) => {
    return Request.get('/exam/detail', data);
  },
  // 更新试卷_题目
  updateQuestion: (data) => {
    return Request.put('/exam/updateQuestion', data);
  },
  // 课程试卷选择
  getChooseExamOption: (data) => {
    return Request.get('/course/exam/choose', data);
  },
  // 更新课程公开状态(0.不公开; 1.公开)
  updateOpenStatus: (examId, open) => {
    return Request.put(`/exam/updateOpen?examId=${examId}&open=${open}`);
  },
  // 章节排序
  sortSection: (data) => {
    return Request.post('/course/section/sort', data);
  },
  // 保存选择的试卷
  submitChooseExam: (data) => {
    return Request.get('/course/exam/update', data);
  },
  // 课程试卷选择
  getExamDetail: (data) => {
    return Request.get('/exam/mainDetail', data);
  },
  // 删除关联试卷
  deleteExamContact: (data) => {
    return Request.del('/course/exam/delete', data);
  },
  // 用户培训 获取试卷详情
  getUserExamDetail: (data) => {
    return Request.get('/train/courese/examDetail', data);
  },
  // 用户培训 获取得分详情
  getScoreDetail: (data) => {
    return Request.get('/train/courese/userExamDetail', data);
  },
  // 提交试卷
  submitExam: (data) => {
    return Request.post('/train/courese/examsumbit', data);
  }
}
