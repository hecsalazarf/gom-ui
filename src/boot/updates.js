import HUpdateFound from 'components/misc/UpdateFound.vue'

export default ({ router }) => {
  window.addEventListener('gomupdatefound', (event) => {
    let vm = router.app
    vm.$q.dialog({
      component: HUpdateFound,
      parent: vm
    }).onOk(() => {
      window.location.reload()
    })
  })
}
