import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8080/api'
axios.defaults.withCredentials = true
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.post['Accept'] = 'application/json'

export default async ({ Vue }) => {
  Vue.prototype.$axios = axios
}
