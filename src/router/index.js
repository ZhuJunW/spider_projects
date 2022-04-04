import Vue from 'vue'
import VueRouter from 'vue-router'
import App from '@/App'
import Store from '@/store'
import { Menu } from '@/utils/apiModules/Menu'
// import { filterAsyncRouter } from '@/utils/Methods'
import Layout from '@/views/layout/Index'
import localStorage from 'store'
Vue.use(VueRouter)
// 解决ElementUI导航栏中的点击当前路由的报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
export const constantRoutes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/auth-login',
    component: App
  },
  {
    path: '*',
    name: '404',
    component: () => import('@/views/layout/404')
  },
  {
    path: '/auth-login',
    name: '登录',
    component: () => import('@/views/auth/Login')
  },
  {
    path: '/home',
    name: '培训前台',
    redirect: '/home/index',
    component: () => import('@/views/home/Index'),
    children: [
      {
        path: 'index',
        name: '首页',
        component: () => import('@/views/home/HomePage')
      },
      {
        path: 'search',
        name: '搜索结果',
        component: () => import('@/views/home/Search')
      },
      {
        path: 'course',
        name: '课程',
        component: () => import('@/views/home/Course')
      },
      {
        path: 'course-detail/:id',
        name: '课程详情',
        component: () => import('@/views/home/CourseDetail')
      },
      {
        path: 'exam-exercise',
        name: '习题考试',
        component: () => import('@/views/home/ExamExercise')
      },
      {
        path: 'exam-detail',
        name: '考试详情',
        component: () => import('@/views/home/ExamDetail')
      },
      {
        path: 'exam',
        name: '去考试',
        component: () => import('@/views/home/Exam')
      },
      {
        path: 'exam-list',
        name: '试卷列表',
        component: () => import('@/views/home/ExamList')
      },
      {
        path: 'exercise',
        name: '开始练习',
        component: () => import('@/views/home/Exercise')
      },
      {
        path: 'exercise-history',
        name: '练习记录',
        component: () => import('@/views/home/ExerciseHistory')
      },
      {
        path: 'exercise-list',
        name: '更多习题',
        component: () => import('@/views/home/ExerciseList')
      },
      {
        path: 'train',
        name: '培训开课',
        component: () => import('@/views/home/Train')
      },
      {
        path: 'train-list',
        name: '培训l列表',
        component: () => import('@/views/home/TrainList')
      },
      {
        path: 'personal-record',
        name: '学习记录',
        component: () => import('@/views/home/PersonalRecord')
      },
      {
        path: 'sign-up',
        name: '报名',
        component: () => import('@/views/home/signUp')
      },
      {
        path: 'certificate',
        name: '证书',
        component: () => import('@/views/home/Certificate')
      }
    ]
  },
  // 培训考试
  {
    path: '/personnel',
    name: '培训前台',
    redirect: '/home/index',
    component: () => import('@/views/personnel/Index'),
    children: [
      {
        path: 'course-list',
        name: '课程列表',
        component: () => import('@/views/personnel/CourseList')
      },
      {
        path: 'course-detail/:id',
        name: '课程详情',
        component: () => import('@/views/personnel/CourseDetail')
      }
    ]
  },
  {
    path: '/personnel/exam/:id',
    name: '考试测验',
    component: () => import('@/views/personnel/Exam')
  },
  {
    path: '/personnel/exam-detail/:id',
    name: '考试详情',
    component: () => import('@/views/personnel/ExamDetail')
  },
  {
    path: '/personnel/course-history',
    name: '学习历史记录',
    component: () => import('@/views/personnel/CourseHistory')
  },
  // 培训后台
  {
    path: '/admin',
    name: '培训后台',
    component: Layout,
    children: [
      {
        path: 'enterprise-list',
        name: '企业列表',
        meta: {
          breadcrumb: ['企业管理', '企业列表']
        },
        component: () => import('@/views/admin/enterprise/List')
      },
      {
        path: 'enterprise-add',
        name: '添加企业',
        meta: {
          breadcrumb: ['企业管理', '企业列表', '添加企业']
        },
        component: () => import('@/views/admin/enterprise/Edit')
      },
      {
        path: 'enterprise-edit/:id',
        name: '编辑企业',
        meta: {
          breadcrumb: ['企业管理', '企业列表', '编辑企业']
        },
        component: () => import('@/views/admin/enterprise/Edit')
      },
      // 课程管理
      {
        path: 'course-manage',
        name: '课程管理',
        meta: {
          breadcrumb: ['培训考试', '课程管理']
        },
        component: () => import('@/views/admin/trainingExam/courseManagement/List')
      },
      {
        path: 'course-add',
        name: '添加课程',
        meta: {
          breadcrumb: ['培训考试', '课程管理', '添加课程']
        },
        component: () => import('@/views/admin/trainingExam/courseManagement/Edit')
      },
      {
        path: 'course-edit/:id',
        name: '编辑课程',
        meta: {
          breadcrumb: ['培训考试', '课程管理', '编辑课程']
        },
        component: () => import('@/views/admin/trainingExam/courseManagement/Edit')
      },

      {
        path: 'chapter-manage',
        name: '章节管理',
        meta: {
          breadcrumb: ['培训考试', '课程管理', '章节管理']
        },
        component: () => import('@/views/admin/trainingExam/courseManagement/ChapterManage')
      },
      {
        path: 'exam-manage',
        name: '考试管理',
        meta: {
          breadcrumb: ['培训考试', '考试管理']
        },
        component: () => import('@/views/admin/trainingExam/examManagement/List')
      },
      // 试卷管理
      {
        path: 'exam-add',
        name: '创建试卷',
        meta: {
          breadcrumb: ['培训考试', '考试管理', '创建试卷']
        },
        component: () => import('@/views/admin/trainingExam/examManagement/Create')
      },
      {
        path: 'exam-edit/:id',
        name: '编辑试卷',
        meta: {
          breadcrumb: ['培训考试', '考试管理', '编辑试卷']
        },
        component: () => import('@/views/admin/trainingExam/examManagement/Create')
      },
      // 习题管理
      {
        path: 'exercise-manage',
        name: '习题管理',
        meta: {
          breadcrumb: ['培训考试', '习题管理']
        },
        component: () => import('@/views/admin/trainingExam/exerciseManagement/List')
      },
      {
        path: 'exercise',
        name: '题目管理',
        meta: {
          breadcrumb: ['培训考试', '习题管理', '题目管理']
        },
        component: () => import('@/views/admin/trainingExam/exerciseManagement/QuestionManage')
      },
      {
        path: 'basket',
        name: '试题篮',
        meta: {
          breadcrumb: ['培训考试', '习题管理', '试题篮']
        },
        component: () => import('@/views/admin/trainingExam/exerciseManagement/Basket')
      },
      // 证书管理
      {
        path: 'cert-manage',
        name: '证书管理',
        meta: {
          breadcrumb: ['培训平台', '证书管理']
        },
        component: () => import('@/views/admin/trainPlat/certManagement/List')
      },
      {
        path: 'cert-add',
        name: '新增证书',
        meta: {
          breadcrumb: ['培训平台', '证书管理', '新增证书']
        },
        component: () => import('@/views/admin/trainPlat/certManagement/Create')
      },
      {
        path: 'cert-detail/:id',
        name: '详细信息',
        meta: {
          breadcrumb: ['培训平台', '证书管理', '详细信息']
        },
        component: () => import('@/views/admin/trainPlat/certManagement/detail')
      },
      {
        path: 'cert-record/:id',
        name: '培训记录',
        meta: {
          breadcrumb: ['培训平台', '证书管理', '培训记录']
        },
        component: () => import('@/views/admin/trainPlat/certManagement/record')
      },
      // 学员管理
      {
        path: 'student-manage',
        name: '学员管理',
        meta: {
          breadcrumb: ['培训管理', '学员管理']
        },
        component: () => import('@/views/admin/trainPlat/studentManagement/List')
      },
      {
        path: 'student-add',
        name: '新增学员',
        meta: {
          breadcrumb: ['培训管理', '学员管理', '新增学员']
        },
        component: () => import('@/views/admin/trainPlat/studentManagement/Create')
      },
      {
        path: 'courseStudent-manage/:id',
        name: '关联课程管理',
        meta: {
          breadcrumb: ['培训管理', '学员管理', '课程管理']
        },
        component: () => import('@/views/admin/trainPlat/studentManagement/courseStudentList')
      },
      // {
      //   path: 'courseStudent-add',
      //   name: '关联课程管理编辑',
      //   meta: {
      //     breadcrumb: ['培训管理', '学员管理', '添加课程']
      //   },
      //   component: () => import('@/views/admin/trainPlat/studentManagement/courseStudentAdd')
      // },

      // 报名人员管理
      {
        path: 'mem-manage',
        name: '报名人员管理',
        meta: {
          breadcrumb: ['培训管理', '报名人员管理']
        },
        component: () => import('@/views/admin/trainPlat/memManagement/List')
      },
      {
        path: 'mem-add',
        name: '新增报名人员',
        meta: {
          breadcrumb: ['培训管理', '报名人员管理', '新增报名人员']
        },
        component: () => import('@/views/admin/trainPlat/memManagement/Create')
      },
      // 班次管理
      {
        path: 'class-manage',
        name: '班次管理',
        meta: {
          breadcrumb: ['培训管理', '班次管理']
        },
        component: () => import('@/views/admin/trainPlat/classManagement/List')
      },
      {
        path: 'class-add',
        name: '新增班次',
        meta: {
          breadcrumb: ['培训管理', '班次管理', '新增班次']
        },
        component: () => import('@/views/admin/trainPlat/classManagement/Create')
      },
      {
        path: 'class-edit/:id',
        name: '编辑班次',
        meta: {
          breadcrumb: ['培训管理', '班次管理', '编辑班次']
        },
        component: () => import('@/views/admin/trainPlat/classManagement/Create')
      },
      {
        path: 'course-list/:id',
        name: '课程表',
        meta: {
          breadcrumb: ['培训管理', '班次管理', '课程表']
        },
        component: () => import('@/views/admin/trainPlat/classManagement/courseList')
      },
      {
        path: 'courseclass-add/:id',

        name: '课程表新增',
        meta: {
          breadcrumb: ['培训管理', '班次管理', '课程表新增']
        },
        component: () => import('@/views/admin/trainPlat/classManagement/CourseAdd')
      },
      {
        path: 'courseclass-edit/:id',
        name: '课程表编辑',
        meta: {
          breadcrumb: ['培训管理', '班次管理', '课程表编辑']
        },
        component: () => import('@/views/admin/trainPlat/classManagement/CourseEdit')
      },
      {
        path: 'cert-edit/:id',
        name: '编辑试卷',
        meta: {
          breadcrumb: ['培训平台', '证书管理', '编辑证书']
        },
        component: () => import('@/views/admin/trainPlat/certManagement/Create')
      },
      {
        path: 'question-manage',
        name: '题目管理',
        meta: {
          breadcrumb: ['培训考试', '考试管理', '题目管理']
        },
        component: () => import('@/views/admin/trainingExam/examManagement/QuestionManage')
      },
      {
        path: 'data-statistics/online-practice-list',
        name: '人员统计',
        meta: {
          breadcrumb: ['数据统计', '人员统计']
        },
        component: () => import('@/views/admin/dataStatistics/onlinePractice/List')
      },
      {
        path: 'data-statistics/course-statistics',
        name: '课程统计',
        meta: {
          breadcrumb: ['数据统计', '课程统计']
        },
        component: () => import('@/views/admin/dataStatistics/courseStatistics/List')
      },
      {
        path: 'data-statistics/online-practice-history/:id',
        name: '历史记录',
        meta: {
          breadcrumb: ['数据统计', '人员统计', '人员学习记录']
        },
        component: () => import('@/views/admin/dataStatistics/onlinePractice/OnlineCourseHistory')
      },
      {
        path: 'system/menu',
        name: '菜单管理',
        meta: {
          breadcrumb: ['系统设置', '菜单管理']
        },
        component: () => import('@/views/admin/systemSetting/menu/List')
      },
      {
        path: 'system/org',
        name: '组织机构',
        meta: {
          breadcrumb: ['系统设置', '组织机构']
        },
        component: () => import('@/views/admin/systemSetting/organization/List')
      },
      {
        path: 'system/role',
        name: '角色管理',
        meta: {
          breadcrumb: ['系统设置', '角色管理']
        },
        component: () => import('@/views/admin/systemSetting/role/List')
      },
      {
        path: 'system/role-add',
        name: '添加角色',
        meta: {
          breadcrumb: ['系统设置', '角色管理', '添加角色']
        },
        component: () => import('@/views/admin/systemSetting/role/Edit')
      },
      {
        path: 'system/role-edit/:id',
        name: '编辑角色',
        meta: {
          breadcrumb: ['系统设置', '角色管理', '编辑角色']
        },
        component: () => import('@/views/admin/systemSetting/role/Edit')
      },
      // 发布内容
      {
        path: 'publishContent/policy',
        name: '发布政策',
        meta: {
          breadcrumb: ['发布内容', '发布政策']
        },
        component: () => import('@/views/admin/publishContent/policy/List')
      },
      {
        path: 'publishContent/workingProcess',
        name: '发布工作进程',
        meta: {
          breadcrumb: ['发布内容', '发布工作进程']
        },
        component: () => import('@/views/admin/publishContent/workingProcess/List')
      }
    ]
  }
]

const router = new VueRouter({
  routes: constantRoutes
})
router.beforeEach((to, from, next) => {
  // 修改title
  window.document.title = to.name
  if (!to.path.includes('auth')) {
    if (to.meta.breadcrumb) {
      Store.commit('setBreadcrumb', to.meta.breadcrumb || [])
    } else {
      Store.commit('setBreadcrumb', to.matched.map(item => item.name) || [])
    }
    if (!Store.state.token) {
      // 重新拉取菜单
      Menu.getUserMenu().then(res => {
        Store.commit('setToken', localStorage.get('token'))
        localStorage.set('menuList', res || [])
        // const accessedRoutes = filterAsyncRouter(res)
        // router.addRoutes([...accessedRoutes])
        next({ ...to, replace: true })
      }).catch(() => {
        next()
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
