<template>
  <div id="app" class="container">
      <b-tabs position="is-centered" class="block" size="is-large">
        <b-tab-item label="COMET">
          <CometList/>
        </b-tab-item>
        <b-tab-item label="Training Portal">
          <TPList/>
        </b-tab-item>
      </b-tabs>
  </div>
</template>

<script>
import CometList from './CometList.vue'
import TPList from './TPList.vue'

export default {
  name: 'app',
  components: {
    CometList,
    TPList
  }
}
</script>
