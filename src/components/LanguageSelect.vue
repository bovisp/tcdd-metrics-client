<template>
  <section>
    <div class="control">
        <b-field label="Language" :type="{ 'is-danger': errors.language_id }">
        <vSelect label="name"
          :options="languages"
          @input="option => $emit('select', option)" />
        </b-field>
        <p class="help is-danger" v-if="errors.language_id">
            {{ errors.language_id[0] }}
        </p>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
import vSelect from 'vue-select'

export default {
  components: {
    vSelect
  },
  data () {
    return {
      languages: []
    }
  },
  props: {
    errors: Object
  },
  mounted () {
    axios.get('/api/languages').then(response => {
      this.languages = response.data
    })
  }
}
</script>

<style scoped>
  @import "~vue-select/dist/vue-select.css";
</style>
