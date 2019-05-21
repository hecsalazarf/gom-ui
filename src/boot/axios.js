import axios from 'axios'

axios.defaults.baseURL = 'http://192.168.0.2:7001'
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.post['Accept'] = 'application/json'

export default async ({ Vue }) => {
  Vue.prototype.$axios = axios
}
