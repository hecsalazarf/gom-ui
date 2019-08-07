/* IMPORTANT: Bind "this" to the Vue instance from the caller function */

/**
 * Clear app state
 */
async function clearState () {
  await Promise.all([
    this.$apollo.getClient().clearStore(), // clear Apollo store
    this.$store.dispatch('GomState/clearAll') // clear Vuex store
  ])
  this.$user.clear() // clear user info
  this.$ability.update([]) // clear CASL ability
}

/**
 * Log out
 */
async function logout () {
  this.$q.loading.show()
  try {
    await Promise.all([
      clearState.call(this),
      unsubscribeToPush.call(this) // Unsubscribe from notifications
    ])
    await this.$axios.get('auth/logout') // Clear all cookies and finish session
    this.$router.replace({ name: 'login' }) // Go to login page
  } catch (err) {
    notifyOnError.call(this)
  } finally {
    this.$q.loading.hide()
  }
}

/**
 * Generic function to notify an error
 */
function notifyOnError () {
  this.$q.loading.hide() // hide any loading window
  this.$q.notify({
    color: 'negative',
    message: this.$t('notifications.error.generic'),
    icon: 'report_problem'
  })
}

/**
 * Function that will encode the base64 public key to Array buffer
 * which is needed by the subscription option
 * @param {string} base64String
 */
function urlB64ToUint8Array (base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

/**
 * Subscribe to push notifications
 */
async function subscribeToPush () {
  const applicationServerKey = urlB64ToUint8Array(
    process.env.VAPID_KEY // transform public key into a array buffer
  )
  const registration = await navigator.serviceWorker.getRegistration() // get service worker registration
  if (!registration) {
    console.error('Cannot subscribe to Push Notifications: No service worker has been registered')
    return
  }
  const options = { applicationServerKey, userVisibleOnly: true }
  try {
    const subscription = await registration.pushManager.subscribe(options)
    await this.$axios.post('webpush/subscribe', JSON.stringify(subscription), { headers: { 'X-Csrf-Token': this.$q.cookies.get('csrf-token') } })
  } catch (error) {
    console.error('Cannot subscribe to Push Notifications')
    console.log(error)
  }
}

/**
 * Unsubscribe from push notifications
 */
async function unsubscribeToPush () {
  const registration = await navigator.serviceWorker.getRegistration() // get service worker registration
  if (!registration) {
    // if no service worker, do nothing
    console.error('Cannot unsubscribe from Push Notifications: No service worker has been registered')
    return
  }
  const subscription = await registration.pushManager.getSubscription()
  if (!subscription) {
    return // if no subscription, do nothing
  }
  try {
    await Promise.all([
      subscription.unsubscribe(), // unsubscribe locally
      this.$axios.post('webpush/unsubscribe', JSON.stringify(subscription), { headers: { 'X-Csrf-Token': this.$q.cookies.get('csrf-token') } }) // unsubscribe remotely
    ])
  } catch (error) {
    console.error('Cannot unsubscribe from Push Notifications')
    console.log(error)
  }
}

function requestNotificationPermission () {
  window.Notification.requestPermission()
    .then(permission => {
      // value of permission can be 'granted', 'default', 'denied'
      // granted: user has accepted the request
      // default: user has dismissed the notification permission popup
      if (permission === 'granted') {
        // if permission is granted, subscribe to push notification
        subscribeToPush.call(this)
      } else {
        console.error('Permission not granted for Notifications')
      }
    })
}

export const Session = {
  logout,
  notifyOnError,
  clearState,
  subscribeToPush,
  unsubscribeToPush,
  requestNotificationPermission
}
