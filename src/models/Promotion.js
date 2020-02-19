import { Model } from './Base'

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
    type: Array,
    default: [],
    options: {
      multiValue: false
    }
  }

  content = {
    type: String,
    default: ''
  }
}

export default Model(Promotion)
