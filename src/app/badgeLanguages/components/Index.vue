<template>
  <section>
    <div class="columns is-desktop">
      <div class="column is-half is-offset-one-quarter">
        <div v-if="selected.badge_id == null">
        <b-message title="Info" type="is-info">
            Please select a badge to update its language.
          </b-message>
          </div>
        <div class="is-flex my-4">
          <router-link :to="{ name: 'create' }" class="button is-link ml-auto">Create</router-link>
        </div>
        <b-table :data="data" :columns="columns" :selected.sync="selected" :striped="true">

        </b-table>
        
      </div>
      
    </div>

    <div class="fixed-bottom has-background-white-ter" v-if="selected.badge_id != null">
        <div class="column is-half is-offset-one-quarter is-flex">
          <button class="button is-link" style="margin-left: auto; margin-right: 1rem;"
          @click="isUpdateModalActive = true, openModal()"
      :disabled="!selected.badge_id">Edit</button>
      <button class="button is-danger" @click="selected = {}">Delete</button>
        </div>
  </div>

    

    <b-modal :active.sync="isUpdateModalActive" :width="640" scroll="keep">
            <form v-on:submit.prevent="submit">
      <div class="field">
        <label class="label">Badge</label>
        <p>{{ selected.badge_name }}</p>
      </div>
      <div class="field">
        <label class="label">Language</label>
        <div class="control">
          <b-select v-model="selectedLanguage">
                <option
                    v-for="language in languages"
                    :value="language"
                    :key="language.id">
                    {{ language.name }}
                </option>
          </b-select>
        </div>
      </div>

      <div class="field">
        <div class="control">
          <button class="button is-link">Update</button>
        </div>
      </div>
    </form>
    </b-modal>
  </section>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      isUpdateModalActive: false,
      languages: [],
      data: [],
      selected: {},
      submitData: {
        badge_id: null,
        language_id: null
      },
      selectedLanguage: null,
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
  },
  methods: {
    openModal () {
      axios.get('/api/languages').then(response => {
        this.languages = response.data
      })
      this.selectedLanguage = {
        id: this.selected.language_id,
        name: this.selected.language_name
      }
    },
    submit (e) {
      if (!this.selectedLanguage) {
        this.toast('dark', 'Please select a language.')
      } else {
        this.submitData.badge_id = this.selected.badge_id
        this.submitData.language_id = this.selectedLanguage.id
        axios.put('/api/badge-languages/' + this.selected.id, this.submitData).then(response => {
          this.toast('success', response.data)

          setTimeout((function () {
            this.isUpdateModalActive = false
            mounted()
          }.bind(this)), 1000)
        }).catch(error => {
          this.toast('danger', error.response.data.message)
        })
      }
    },
    toast (type = 'dark', message) {
      this.$toast.open({
        type: `is-${type}`,
        message
      })
    }
  }
}
</script>
