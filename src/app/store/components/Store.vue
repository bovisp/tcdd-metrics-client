<template>
  <p>Store</p>
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
