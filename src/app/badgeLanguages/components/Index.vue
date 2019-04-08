<template>
  <section>
    <div class="columns is-desktop">
      <div class="column is-half is-offset-one-quarter">
        <div class="flex my-4">
          <router-link :to="{ name: 'create' }" class="button is-link ml-auto">Create</router-link>
        </div>
        <b-table :data="data" :columns="columns" :striped="true"></b-table>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      data: [],
      columns: [
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
