import axios from 'axios';
import authHeader from './authHeader';

const requestServices = (url, requestMethod, data) => {
  const requestOptions = {
    url,
    method: requestMethod || 'get',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...authHeader()
    }
  };
  if (data) {
    requestOptions.data = data;
  }
  return axios(requestOptions);
};

export default requestServices;
