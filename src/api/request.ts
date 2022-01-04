// Axios Request Instance
import axios from 'axios';
import { ElMessage } from 'element-plus';

const instance = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 4000,
});

instance.interceptors.request.use(
  config => config,
  err => console.log(err),
);

interface FetchedData {
  success: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any
  message: string
}
instance.interceptors.response.use(
  res => {
    const data = res.data as FetchedData;
    if (data.success) return data.content;
    else {
      console.log(data.message);
      ElMessage.error({
        message: data.message, 
        center: true,
      });
      return Promise.reject(data.message);
    }
  },
  async err => {
    console.log(`[Error] Axios ${err}`);
    ElMessage.error({
      message: 'Request error! Check your network connection please.', 
      center: true,
    });
    return await Promise.reject(err);
  },
);

export default instance;
