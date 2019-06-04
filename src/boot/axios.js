import axios from 'axios'

axios.defaults.baseURL = '/api'
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.post['Accept'] = 'application/json'

export default async ({ Vue }) => {
  Vue.prototype.$axios = axios
}
