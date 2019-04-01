<template>
  <b-table :data="data" :columns="columns"></b-table>
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
          field: 'created_at',
          label: 'Created At'
        },
        {
          field: 'updated_at',
          label: 'Updated At'
        },
        {
          field: 'badge_id',
          label: 'Badge Id',
          numeric: true
        },
        {
          field: 'language_id',
          label: 'Language Id',
          numeric: true
        }
      ]
    }
  },
  mounted () {
    axios.get('/api/badge-languages').then(response => {
      this.data = response.data
      console.log(response.data)
    })
  }
}
</script>
