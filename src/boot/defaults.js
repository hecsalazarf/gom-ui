import { Notify, Loading, QSpinnerBars, Quasar } from 'quasar'

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

  // Force not to use the 24h format used in the 'es' language pack
  Quasar.lang.props.date.format24h = false
}
