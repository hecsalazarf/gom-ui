import axios from 'axios'

class AxiosProvider {
  constructor () {
    this.baseURL = '/api'
    this.headers = {
      post: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
  }

  createInstance () {
    this.instance = axios.create({
      baseURL: this.baseURL,
      headers: this.headers
    })
    return this.instance
  }
}

export default async ({ Vue }) => {
  Vue.prototype.$axios = new AxiosProvider().createInstance()
}
