import * as Request from '../Request';

export const Exercise = {
  // 获取习题管理列表
  getExerciseManageList: (data) => {
    return Request.post('/exercise/list', data);
  },
  //  根据试卷id，获取相关题目
  getExamList: (data) => {
    return Request.get('/exercise/exam/question/list', data);
  },
  // 根据试卷id删除试卷
  deleteExercise: (data) => {
    return Request.del('/exercise/delete', data);
  },
  // 编辑更新试卷
  updateExercise: (data) => {
    return Request.put('/exercise/update', data);
  },
  // 加入试题篮
  saveQuestion: (data) => {
    return Request.put('/exercise/exam/question/save', data);
  },
  // 移除试题篮
  deleteQuestion: (data) => {
    return Request.put('/exercise/exam/question/delete', data);
  },
  // 获取习题详情
  getExerciseInfo: (data) => {
    return Request.get('/exercise/info', data);
  },
  // 新增保存试卷
  createExercise: (data) => {
    return Request.post('/exercise/save', data);
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
  },
  // 习题
  exerciseHistoryList: (data) => {
    return Request.get('/exercise/history/list', data);
  },
  // 考试
  exerciseExamList: (data) => {
    return Request.get('/exercise/exam/history/list', data);
  },
  // 考试
  questionSave: (data) => {
    return Request.put('/exercise/question/save', data);
  },
  // 提交习题答案
  exerciseSubmit: (data) => {
    return Request.post('/exercise/submit', data);
  },
  // 开始考试
  examStart: (data) => {
    return Request.get('/exercise/exam/start', data);
  },
  // 提交试卷答案
  examSubmit: (data) => {
    return Request.post('/exercise/exam/submit', data);
  },
  // 查看试卷详情
  getExamInfo: (data) => {
    return Request.get('/exercise/exam/history/info', data);
  },
  // 练习记录数量统计
  getHistoryNum: (data) => {
    return Request.get('/exercise/history/stat', data);
  }
}
