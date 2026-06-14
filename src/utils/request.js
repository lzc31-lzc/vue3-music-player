import axios from 'axios'
import { showToast } from 'vant'

const request = axios.create({
  timeout: 5000
})

request.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    showToast('网络请求失败')
    return Promise.reject(error)
  }
)

export default request