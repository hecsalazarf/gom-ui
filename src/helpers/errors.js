import { Session } from './session'
import { Notifications } from './notifications'
import { GraphQlErrors } from 'src/errors'

const { logout } = Session
const { notifyError } = Notifications

/* IMPORTANT: Bind "this" to the Vue instance from the caller function */

/**
 * Graphql error handler
 */
function handleGraphQlErrors (errors) {
  errors.map(e => {
    console.error(e.message)
    if (!GraphQlErrors.hasCustomHandler(e.extensions.code)) {
      this.$q.loading.hide() // hide any loading window
      notifyError.call(this)
    }
  })
}

/**
 * Network error handler
 */
function handleNetworkErrors (networkError) {
  if (networkError.result && networkError.result.error && networkError.result.error === 'jwt_error') {
    logout.call(this)
  } else {
    this.$q.loading.hide() // hide any loading window
    notifyError.call(this)
  }
}

export const ErrorHandlers = {
  handleGraphQlErrors,
  handleNetworkErrors
}
