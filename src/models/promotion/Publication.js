import { Model } from '../Base'

class Publication {
  type = {
    type: String,
    default: 'NOTIFICATION'
  }

  status = {
    type: String,
    default: 'WAITING'
  }

  delay = {
    type: Number,
    default: 0
  }
}

export default Model(Publication)
