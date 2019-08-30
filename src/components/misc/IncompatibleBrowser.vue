<template>
  <q-banner
    rounded
    class="bg-primary q-gutter-y-md h-rounded-borders-20"
  >
    <div class="text-h6">
      {{ $t('notifications.error.incompatible_browser') }}
    </div>
    <div class="text-body1">
      {{ $t('app.for_better_ux') }}
    </div>

    <template v-slot:action>
      <div class=" q-gutter-x-md">
        <q-icon
          name="fab fa-chrome"
          size="3em"
        >
          <q-badge
            color="accent"
            floating
          >
            {{ chrome_v }}
          </q-badge>
        </q-icon>
        <q-icon
          name="fab fa-safari"
          size="3em"
        >
          <q-badge
            color="accent"
            floating
          >
            {{ safari_v }}
          </q-badge>
        </q-icon>
        <q-icon
          name="fab fa-firefox"
          size="3em"
        >
          <q-badge
            color="accent"
            floating
          >
            {{ firefox_v }}
          </q-badge>
        </q-icon>
      </div>
    </template>

    <template v-slot:avatar>
      <q-icon
        name="error"
        size="5em"
      />
    </template>
  </q-banner>
</template>

<script>
export default {
  name: 'HIncompatibleBrowser',
  data () {
    return {}
  },
  computed: {
    chrome_v () {
      return process.env.CHROME_V
    },
    safari_v () {
      return process.env.SAFARI_V
    },
    firefox_v () {
      return process.env.FIREFOX_V
    }
  }
}
</script>

<style>
</style>
