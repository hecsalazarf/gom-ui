(function () {
  'use strict'
  /**
   * @license
   * Copyright (c) 2019 hecsalazarf. All Rights Reserved.
   */
  class AssetsCache {
    constructor (workbox, options, scope) {
      this.workbox = workbox
      this.cacheOptions = options
      this.workbox.core.setCacheNameDetails(this.cacheOptions)
      this.workbox.core.skipWaiting() // instructs the latest service worker to activate as soon as it enters the waiting phase
      this.workbox.core.clientsClaim() // instructs the latest service worker to take control of all clients as soon as it's activated
      this.workbox.precaching.precacheAndRoute(scope.__precacheManifest || [])
    }
  }

  class Adapter {
    constructor (scope, workbox, app) {
      this.scope = scope
      this.app = app
      this.origin = scope.location.origin
      if (workbox) {
        this.assetsCache = new AssetsCache(workbox, { prefix: app.name, suffix: app.version || '' }, scope)
      }
    }

    createUrl (path) {
      return new URL(path, this.origin).href
    }
  }

  class Driver {
    constructor (adapter) {
      this.adapter = adapter
      this.scope = adapter.scope
      this.ORDER = 'order' // constant to identify notification type
      this.scope.addEventListener('push', (event) => this.onPush(event))
      this.scope.addEventListener('notificationclick', (event) => this.onNotificationClick(event))
    }

    /**
     * The push handler receives a push message and shows a notification,
     * based on the payload. If the incoming message is of the same kind, merge it
     * @param {PushEvent} event
     */
    onPush (event) {
      if (!event.data) {
        return // do not display notification if data is undefined
      }
      const payload = event.data.json() // extract push message payload
      const tag = `${payload.data.type}:${payload.data.uid}` // tag = {type}:{uid}
      const promiseChain = this.scope.registration.getNotifications() // get notifications being displayed
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
            icon: '/statics/icons/icon-256x256.png',
            badge: '/statics/icons/icon-badge.png'
          }

          // Currently we only handle order operations
          // TODO: We should handle any type and operation, an API call maybe?
          if (currentNotification && currentNotification.data.type === this.ORDER) { // we have an open notification of type 'order'
            const grouping = currentNotification.data.grouping
            if (grouping.findIndex(e => e === payload.data.uid) === -1) {
              // If the incoming notification does not exist in the grouping, add it.
              grouping.push(payload.data.uid)
            }

            // then we set the title and body depending on the operation
            if (currentNotification.data.operation === 'create') {
              title = 'Nuevos pedidos'
              options.body = `Tienes ${grouping.length} nuevos pedidos`
            }
            if (currentNotification.data.operation === 'update') {
              title = 'Pedidos actualizados'
              options.body = `Tienes ${grouping.length} pedidos actualizados`
            }

            options.data = {
              type: this.ORDER,
              operation: currentNotification.data.operation,
              grouping
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
              grouping: [payload.data.uid], // add the uid to grouping
              operation: payload.data.operation
            }
          }
          return this.scope.registration.showNotification(
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
    onNotificationClick (event) {
      const data = event.notification.data // extract data from notifiation
      let urlToOpen = null // We make the URL absolute so we can match it against window URL's later on.
      if (data.type && data.type === this.ORDER) {
        // create the url to open the specified order
        if (data.counter) {
          // a counter exists, it is a merged notification
          urlToOpen = this.adapter.createUrl('/orders/') // new URL('/orders/', this.adapter.origin).href
        } else {
          urlToOpen = this.adapter.createUrl(`/orders/id/${data.uid}`) // new URL('/orders/id/' + data.uid, this.adapter.origin).href
        }
      } else {
        // fallback to open the main path
        urlToOpen = this.adapter.createUrl('/')
      }

      // get a list of the WindowClient objects, which is the list of the currently open tabs and windows (own origin).
      const promiseChain = this.scope.clients.matchAll({
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
          return this.scope.clients.openWindow(urlToOpen)
        }
      })
      event.notification.close()
      event.waitUntil(promiseChain)
    }
  }

  const scope = self
  const adapter = new Adapter(scope, workbox, { name: 'gom' })
  // eslint-disable-next-line no-unused-vars
  const driver = new Driver(adapter)
}())
