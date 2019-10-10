import HUpdateFound from 'components/misc/UpdateFound.vue'

export default ({ router }) => {
  // Listen to updates
  window.addEventListener('gom-update', event => onUpdateFound(event.detail, router.app))
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
