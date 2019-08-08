/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.conf > pwa > workboxPluginMode is set to "InjectManifest"
 */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js')

const ORDER = 'order' // constant to identify notification type
if (workbox) {
  console.log(`Yay! Workbox is loaded`)
} else {
  console.log(`Boo! Workbox didn't load`)
}

self.addEventListener('push', pushNotificationHandler)
self.addEventListener('notificationclick', notificationClickHandler)

/**
 * The push handler receives a push message and shows a notification,
 * based on the payload. If the incoming message is of the same kind, merge it
 * @param {PushEvent} event
 */
function pushNotificationHandler (event) {
  if (!event.data) {
    return // do not display notification if data is undefined
  }
  const payload = event.data.json() // extract push message payload
  const tag = `${payload.data.type}:${payload.data.uid}` // tag = {type}:{uid}
  const promiseChain = self.registration.getNotifications() // get notifications being displayed
    .then(notifications => {
      let currentNotification = null

      for (let i = 0; i < notifications.length; i++) {
        if (notifications[i].data && // check data is defined
            notifications[i].data.operation === payload.data.operation && // check it is the same operation (create | update)
            notifications[i].data.type === payload.data.type && // check it is the same type (order)
            notifications[i].tag !== tag // we don't want to manually merge the same tag, this is automatically done
        ) {
          // a notification of the same type and operation is found
          currentNotification = notifications[i]
        }
      }

      return currentNotification
    }).then(currentNotification => {
      let title
      const options = { // set notification options
        icon: '/statics/icons/icon-512x512.png',
        badge: '/statics/icons/badge-sample.png'
      }

      // Currently we only handle order operations
      // TODO: We should handle any type and operation, an API call maybe?
      if (currentNotification && currentNotification.data.type === ORDER) { // we have an open notification of type 'order'
        // set the counter of grouped messages; if property exists add 1,
        // otherwise it is the first merge so there are only two notifications
        const messageCount = currentNotification.data.counter ? currentNotification.data.counter + 1 : 2

        // then we set the title and body depending on the operation
        if (currentNotification.data.operation === 'create') {
          title = 'Nuevos pedidos'
          options.body = `Tienes ${messageCount} nuevos pedidos`
        }
        if (currentNotification.data.operation === 'update') {
          title = 'Pedidos actualizados'
          options.body = `Tienes ${messageCount} pedidos actualizados`
        }

        options.data = {
          type: ORDER,
          operation: currentNotification.data.operation,
          counter: messageCount
        }
        currentNotification.close() // close the old notification
      } else {
        // No need to merge; show the regular notification
        title = payload.title
        options.body = payload.body
        options.tag = tag
        options.data = {
          type: payload.data.type,
          uid: payload.data.uid,
          operation: payload.data.operation
        }
      }
      return self.registration.showNotification(
        title,
        options
      )
    }).catch(error => {
      console.error('An error occurred while showing a notification')
      console.error(error)
    })
  event.waitUntil(promiseChain)
}

/**
 * The notification click handler look for active windows or tabs, if one
 * is found, it get focused; otherwise a new window is opened.
 * @param {NotificationEvent} event
 */
function notificationClickHandler (event) {
  const data = event.notification.data // extract data from notifiation
  let urlToOpen = null // We make the URL absolute so we can match it against window URL's later on.
  if (data.type && data.type === ORDER) {
    // create the url to open the specified order
    if (data.counter) {
      // a counter exists, it is a merged notification
      urlToOpen = new URL('/orders/', self.location.origin).href
    } else {
      urlToOpen = new URL('/orders/id/' + data.uid, self.location.origin).href
    }
  } else {
    // fallback to open the main path
    urlToOpen = new URL('/', self.location.origin).href
  }

  // get a list of the WindowClient objects, which is the list of the currently open tabs and windows (own origin).
  const promiseChain = self.clients.matchAll({
    type: 'window', // look for tabs and windows and exclude web workers
    includeUncontrolled: true // allows us to search for all tabs from your origin that are not controlled by the current service worker
  }).then(windowClients => {
    let matchingClient = null

    for (let i = 0; i < windowClients.length; i++) {
      // we iterate through the returned window clients and compare their URLs to the URL we want to open
      const windowClient = windowClients[i]
      if (windowClient.url === urlToOpen) {
        matchingClient = windowClient
        break
      }
    }

    if (matchingClient) {
      // If we find a match, we focus that client, which will bring that window to the users attention
      return matchingClient.focus()
    } else {
      // If we can't find a matching client, we open a new window
      return self.clients.openWindow(urlToOpen)
    }
  })
  event.notification.close()
  event.waitUntil(promiseChain)
}
