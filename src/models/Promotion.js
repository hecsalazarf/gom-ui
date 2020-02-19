import { Model } from './Base'

class Promotion {
  uid = {
    type: String
  }

  code = {
    type: String
  }

  name = {
    type: String
  }

  start = {
    type: Date,
    options: {
      format: 'DD-MMM-YYYY hh:mm A'
    }
  }

  end = {
    type: Date,
    options: {
      format: 'DD-MMM-YYYY hh:mm A'
    }
  }

  category = {
    type: Array,
    options: {
      multiValue: false
    }
  }

  content = {
    type: String
  }
}

export default Model(Promotion)
