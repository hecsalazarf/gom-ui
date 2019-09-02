import { Notify, Loading, QSpinnerBars } from 'quasar'

export default async () => {
  Notify.setDefaults({
    position: 'bottom-left',
    timeout: 2500,
    textColor: 'white',
    actions: [{ icon: 'close', color: 'white' }]
  })

  Loading.setDefaults({
    delay: 400,
    sanitize: true,
    backgroundColor: 'white',
    spinner: QSpinnerBars, // default spinner
    spinnerColor: 'primary'
  })
}
