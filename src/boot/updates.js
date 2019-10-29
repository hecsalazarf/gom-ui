import { Platform } from 'quasar'
import HUpdateFound from 'components/misc/UpdateFound.vue'

export default ({ router, ssrContext }) => {
  const platform = process.env.SERVER
    ? Platform.parseSSR(ssrContext) // we're on server
    : Platform // otherwise we're on client

  // Listen to updates
  window.addEventListener('updateFound', event => onUpdateFound(event.detail, router.app))

  if (platform.is.ios) {
    // Listen to manual updates on iOS devices
    window.addEventListener('updateCheck', event => onCheckUpdates(event.detail, router.app))
  }
}

function onUpdateFound (waitingWorker, vm) {
  if ('MessageChannel' in window) {
    vm.$q.dialog({
      component: HUpdateFound,
      parent: vm
    }).onOk(() => {
      waitingWorker.onstatechange = () => {
        if (waitingWorker.state === 'activated') {
          // reload window when waiting worker gets activated
          window.location.reload()
        }
      }
      /*
      const channel = new MessageChannel()
      channel.port1.onmessage = event => {
        console.log('Message in window scope')
      }
      */
      waitingWorker.postMessage({ type: 'SKIP_WAITING' }/* ,[channel.port2] */)
    })
  }
}

function onCheckUpdates (registration, vm) {
  // iOS has a different PWA lifecycle and does not automatically detect
  // changes on the App boot up. We have to force the update by checking the
  // visibility status. More information at:
  // https://medium.com/@firt/whats-new-on-ios-12-2-for-progressive-web-apps-75c348f8e945
  // https://stackoverflow.com/questions/55581719/reactjs-pwa-not-updating-on-ios

  let hidden
  let visibilityChange
  if (typeof document.hidden !== 'undefined') {
    // Opera 12.10 and Firefox 18 and later support
    hidden = 'hidden'
    visibilityChange = 'visibilitychange'
  } else if (typeof document.msHidden !== 'undefined') {
    hidden = 'msHidden'
    visibilityChange = 'msvisibilitychange'
  } else if (typeof document.webkitHidden !== 'undefined') {
    hidden = 'webkitHidden'
    visibilityChange = 'webkitvisibilitychange'
  }

  window.document.addEventListener(visibilityChange, () => {
    if (!document[hidden]) {
      // manually force detection of a potential update when the pwa is opened
      registration.update()
    }
  })
}
