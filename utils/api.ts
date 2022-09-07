import axios from 'axios';

const api = axios.create({
  // baseURL is required
  // REACT_APP_API_URL
  baseURL: `${process.env.LOCAL_APP_URL}/`,
});
export default api;
