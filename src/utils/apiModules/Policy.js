import * as Request from '../Request';

export const Policy = {
  list: (data) => {
    return Request.post('/public/policy/list', data);
  },
  add: (data) => {
    return Request.post('/public/policy/save', data);
  },
  edit: (data) => {
    return Request.post('/public/policy/update', data);
  },
  del: (id) => {
    return Request.del(`/public/policy/remove?id=${id}`);
  },
  info: (id) => {
    return Request.get(`/public/policy/info?id=${id}`);
  }
}
