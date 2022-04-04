import Axios from 'axios'
import Storage from 'store'
import {
  MessageBox,
  Message
} from 'element-ui'
import { baseURL } from '@/utils/Methods'

Axios.defaults.timeout = 1000000;

Axios.defaults.baseURL = baseURL()

// 对请求参数做处理
Axios.interceptors.request.use(
  async config => {
    // 有token且不是授权接口
    if (Storage.get('token')) {
      Axios.defaults.authorization = Storage.get('token');
    }
    // 没有tokens存储则需要重新登录
    if (
      !window.location.href.includes('/auth') &&
      !Storage.get('token')
    ) {
      window.location.href = '/'
    }
    config.headers = {
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: Axios.defaults.authorization || null
    };
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
// 响应拦截器即异常处理
Axios.interceptors.response.use(response => {
  if (response && response.data.code === 200) {
    return response;
  } else {
    if (response.data.code === 401) {
      MessageBox.confirm(
        '登录已过期',
        '系统提示',
        {
          confirmButtonText: '重新登录',
          type: 'warning'
        }
      ).then(() => {
        Storage.set('historyUrl', window.location.href)
        window.location.href = '/'
      })
    } else {
      Message.warning(response.data.message || '服务器忙');
    }
    return Promise.reject(response);
  }
}, err => {
  if (err && err.response) {
    const errMes = err.response.data.message;
    switch (err.response.status) {
      case 400:
        Message.error(errMes || '错误请求');
        break;
      case 401:
        Message.error(errMes || '用户未登录');
        break;
      case 403:
        Message.error(errMes || '拒绝访问');
        break;
      case 404:
        Message.error(errMes || '请求错误,未找到该资源');
        break;
      case 405:
        Message.error(errMes || '请求方法未允许');
        break;
      case 406:
        Message.error(errMes || '请求方法不被接受');
        break;
      case 408:
        Message.error(errMes || '请求超时');
        break;
      case 500:
        Message.error(errMes || '服务器端出错');
        break;
      case 501:
        Message.error(errMes || '网络未实现');
        break;
      case 502:
        Message.error(errMes || '网络错误');
        break;
      case 503:
        Message.error(errMes || '服务升级中');
        break;
      case 504:
        Message.error(errMes || '网络超时');
        break;
      case 505:
        Message.error(errMes || 'http版本不支持该请求');
        break;
      default:
        Message.error(errMes || `连接错误${err.response.status}`);
        break;
    }
    return Promise.reject(err)
  } else {
    Message.warning('网络开小差了，请重试');
  }
  return Promise.reject(err)
});

/**
 * 封装get方法
 * @param {string} url - 接口地址
 * @param {object} params = {} - 接口参数
 * @returns {*} Promise
 */

export function get (url, params = {}) {
  return new Promise((resolve, reject) => {
    Axios.get(url, {
      params: params
    })
      .then(response => {
        if (response.data.code === 200) {
          resolve(response.data.data)
        } else {
          reject(response.data)
        }
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 封装delete方法
 * @param {string} url - 接口地址
 * @param {object} params = {} - 接口参数
 * @returns {*} Promise
 */

export function del (url, params = {}) {
  return new Promise((resolve, reject) => {
    Axios.delete(url, {
      params: params
    })
      .then(response => {
        if (response.data.code === 200) {
          resolve(response.data.data)
        } else {
          reject(response.data)
        }
      })
      .catch(err => {
        reject(err)
      })
  })
}
/**
 * 封装delete方法
 * @param {string} url - 接口地址
 * @param  data - 接口参数
 * @returns {*} Promise
 */

export function delBody (url, data) {
  return new Promise((resolve, reject) => {
    Axios.delete(url, {
      data: data
    })
      .then(response => {
        if (response.data.code === 200) {
          resolve(response.data.data)
        } else {
          reject(response.data)
        }
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 封装post请求
 * @param {string} url - 接口地址
 * @param {object} data = {} - 接口参数
 * @returns {*} Promise
 */

export function post (url, data = {}) {
  return new Promise((resolve, reject) => {
    Axios.post(url, data)
      .then(response => {
        if (response.data.code === 200) {
          resolve(response.data.data)
        } else {
          reject(response.data)
        }
      }, err => {
        reject(err)
      })
  })
}

/**
 * 封装patch请求
 * @param {string} url - 接口地址
 * @param {object} data = {} - 接口参数
 * @returns {*} Promise
 */

export function patch (url, data = {}) {
  return new Promise((resolve, reject) => {
    Axios.patch(url, data)
      .then(response => {
        if (response.data.code === 200) {
          resolve(response.data.data)
        } else {
          reject(response.data)
        }
      }, err => {
        reject(err)
      })
  })
}

/**
 * 封装put请求
 * @param {string} url - 接口地址
 * @param {object} data = {} - 接口参数
 * @returns {*} Promise
 */

export function put (url, data = {}) {
  return new Promise((resolve, reject) => {
    Axios.put(url, data)
      .then(response => {
        if (response.data.code === 200) {
          resolve(response.data.data)
        } else {
          reject(response.data)
        }
      }, err => {
        reject(err)
      })
  })
}
