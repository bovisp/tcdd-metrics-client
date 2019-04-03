<template>
  <div class="columns is-desktop">
    <div class="column is-half is-offset-one-quarter">
      <b-table :data="data" :columns="columns" :striped="true"></b-table>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      data: [],
      columns: [
        {
          field: 'id',
          label: 'ID',
          width: '40',
          numeric: true
        },
        {
          field: 'badge_name',
          label: 'Badge'
        },
        {
          field: 'language_name',
          label: 'Language'
        }
      ]
    }
  },
  mounted () {
    axios.get('/api/badge-languages').then(response => {
      this.data = response.data
    })
  }
}
</script>
