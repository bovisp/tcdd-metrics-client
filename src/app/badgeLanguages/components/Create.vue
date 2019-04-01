<template>
  <section class="section">
    <vSelect label="name" :options="languages"></vSelect>
    <vSelect label="name" :options="badges"></vSelect>
  </section>
</template>

<script>
import axios from 'axios'
import vSelect from 'vue-select'

export default {
  data () {
    return {
      languages: [],
      badges: []
    }
  },
  components: {
    vSelect
  },
  mounted () {
    axios.get('/api/languages').then(response => {
      this.languages = response.data
    })
    axios.get('/api/badges').then(response => {
      this.badges = response.data
    })
  }
}
</script>
