/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.conf > pwa > workboxPluginMode is set to "InjectManifest"
 */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js')

const ORDER = 'order' // order type to identify notification type

if (workbox) {
  console.log(`Yay! Workbox is loaded`)
} else {
  console.log(`Boo! Workbox didn't load`)
}

self.addEventListener('push', pushNotificationHandler)
self.addEventListener('notificationclick', notificationClickHandler)

/**
 * The push handler receives a push message and shows a notification,
 * based on the payload
 * @param {PushEvent} event
 */
function pushNotificationHandler (event) {
  if (!event.data) {
    return // do not display notification if data is undefined
  }

  const payload = event.data.json() // extract push message payload
  const title = payload.title
  const options = { // set notification options
    body: payload.body,
    tag: payload.data.type + ':' + payload.data.uid,
    icon: '/statics/icons/icon-512x512.png',
    badge: '/statics/icons/badge-sample.png',
    data: {
      type: payload.data.type,
      uid: payload.data.uid
    }
  }
  // show notification
  event.waitUntil(self.registration.showNotification(title, options))
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
    urlToOpen = new URL('/orders/id/' + data.uid, self.location.origin).href
  } else {
    // fallback to open the main path
    urlToOpen = new URL('/' + data.uid, self.location.origin).href
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
