import { Model } from '../Base'

class Promotion {
  uid = {
    type: String,
    default: ''
  }

  code = {
    type: String,
    default: ''
  }

  name = {
    type: String,
    default: ''
  }

  start = {
    type: Date,
    default: '',
    options: {
      format: 'DD-MMM-YYYY hh:mm A'
    }
  }

  end = {
    type: Date,
    default: '',
    options: {
      format: 'DD-MMM-YYYY hh:mm A'
    }
  }

  category = {
    type: String,
    default: ''
  }

  content = {
    type: String,
    default: ''
  }

  createdAt = {
    type: Date,
    default: '',
    options: {
      format: 'DD/MM/YYYY HH:mm:ss'
    }
  }

  updatedAt = {
    type: Date,
    default: '',
    options: {
      format: 'DD/MM/YYYY HH:mm:ss'
    }
  }
}

export default Model(Promotion)
