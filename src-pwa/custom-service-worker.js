/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.conf > pwa > workboxPluginMode is set to "InjectManifest"
 */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js')

if (workbox) {
  console.log(`Yay! Workbox is loaded`)
} else {
  console.log(`Boo! Workbox didn't load`)
}

self.addEventListener('push', function (event) {
  console.log('[Service Worker] Push Received.')
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`)

  const title = 'Push Codelab'
  const options = {
    body: 'Yay it works.',
    icon: 'images/icon.png',
    badge: 'images/badge.png'
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

// self.addEventListener('activate', async () => {
//   try {
//     const applicationServerKey = urlB64ToUint8Array(
//       'BJo1ZeE62MZqVkZN8g9TOSFXOCtxmpmejfId8JpLT5C52ASUqhabfpVpHqQrySWhD0PCgEWohR1vKpbRJ48boWA'
//     )
//     const options = { applicationServerKey, userVisibleOnly: true }
//     const subscription = await self.registration.pushManager.subscribe(options)
//     console.log(JSON.stringify(subscription))
//   } catch (err) {
//     console.log('Error', err)
//   }
// })
