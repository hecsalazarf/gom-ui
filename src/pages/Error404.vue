<template>
  <div class="fixed-center text-center">
    <p>
      <img
        src="~assets/sad.svg"
        style="width:30vw;max-width:150px;"
      >
    </p>
    <p class="text-faded">
      {{ $t('notifications.error.page_not_found') }}
    </p>
    <p><strong> (404)</strong></p>
    <q-btn
      color="primary"
      style="width:200px;"
      @click="$router.replace('/')"
    >
      {{ $t('app.go_back') }}
    </q-btn>
  </div>
</template>

<script>
export default {
  name: 'Error404'
}
</script>
