import qs from 'qs';
import axios from 'axios';

// 只针对文件请求单独创建一个 axios 实例
const uploadRequest = axios.create();

uploadRequest.defaults.baseURL = 'http://localhost:8888';
uploadRequest.defaults.headers['Content-Type'] = 'multipart/form-data';
uploadRequest.defaults.transformRequest = (data, headers) => {
  const contentType = headers['Content-Type'];

  if (contentType === 'application/x-www-form-urlencoded') qs.stringify(data);

  return data;
};
uploadRequest.interceptors.response.use(
  res => {
    return res.data;
  },
  err => Promise.reject(err)
);


export default  uploadRequest