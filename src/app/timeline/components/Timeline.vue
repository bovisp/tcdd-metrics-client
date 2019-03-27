<template>
  <p>Timeline</p>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      index: null
    }
  },
  mounted () {
    axios.get('/api/timeline').then(response => {

    })
  }
}
</script>
