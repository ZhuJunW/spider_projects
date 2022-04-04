import * as Request from '../Request';

export const WorkingProcess = {
  list: (data) => {
    return Request.post('/public/footprint/list', data);
  },
  add: (data) => {
    return Request.post('/public/footprint/save', data);
  },
  edit: (data) => {
    return Request.post('/public/footprint/update', data);
  },
  del: (id) => {
    return Request.del(`/public/footprint/remove?id=${id}`);
  },
  info: (id) => {
    return Request.get(`/public/footprint/info?id=${id}`);
  }
}
