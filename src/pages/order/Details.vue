<template>
  <q-page class="flex">
    <!-- <div class="column">
      <h1>Detalles</h1>
    </div>-->
    <div class="row full-width content-start">
      <div class="col-xs-12 col-sm-12 col-md-6 q-pa-xs">
        <q-card class="no-shadow">
          <!-- <q-img src="https://media-cdn.tripadvisor.com/media/photo-s/0a/47/a8/91/chicken-salad-sandwich.jpg" /> -->

          <q-card-section>
            <q-btn
              fab
              color="primary"
              icon="place"
              class="absolute"
              style="top: 20px; right: 50px;"
            />

            <div class="row no-wrap items-center">
              <div class="col text-h6 ellipsis">Cafe Basilico</div>
              <div class="col-auto text-grey q-pt-md">
                <q-icon name="place"/>250 ft
              </div>
            </div>
          </q-card-section>

          <q-card-section>
            <div class="text-subtitle1">$・Italian, Cafe</div>
            <div
              class="text-subtitle2 text-grey"
            >Small plates, salads & sandwiches in an intimate setting.</div>
          </q-card-section>

          <q-separator/>

          <q-card-actions>
            <q-btn flat round icon="event" v-close-popup/>
            <q-btn flat v-close-popup>5:30PM</q-btn>
            <q-btn flat v-close-popup>7:30PM</q-btn>
            <q-btn flat v-close-popup>9:00PM</q-btn>
            <q-btn flat color="primary" v-close-popup>Reserve</q-btn>
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 q-pa-xs">
        <q-expansion-item
          expand-separator
          icon="perm_identity"
          label="Account settings"
          caption="John Doe"
        >
          <q-card>
            <q-card-section>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit eos corrupti
              commodi magni quaerat ex numquam, dolorum officiis modi facere maiores architecto suscipit iste
              eveniet doloribus ullam aliquid.
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 q-pa-xs">
        <q-expansion-item expand-separator icon="signal_wifi_off" label="Wifi settings">
          <q-card>
            <q-card-section>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit eos corrupti
              commodi magni quaerat ex numquam, dolorum officiis modi facere maiores architecto suscipit iste
              eveniet doloribus ullam aliquid.
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </div>
      <div class="col-xs-12 col-sm-12 col-md-6 q-pa-xs">
        <q-expansion-item expand-separator icon="drafts" label="Drafts" header-class="text-purple">
          <q-card>
            <q-card-section>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit eos corrupti
              commodi magni quaerat ex numquam, dolorum officiis modi facere maiores architecto suscipit iste
              eveniet doloribus ullam aliquid.
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </div>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
export default {
  props: {
    tk: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: '',
      required: true
    }
  },
  name: 'PageOrders',
  mounted () {}
}
</script>
