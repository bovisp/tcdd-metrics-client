<template>
  <section>

    <!-- index table -->
    <div class="columns is-desktop">
      <div class="column is-half is-offset-one-quarter">
        <div class="my-4">
          <b-message title="Info" type="is-info">
              Please select a badge to update or delete its language.
          </b-message>
        </div>
        <div class="is-flex my-4">
          <router-link :to="{ name: 'create' }" class="button is-link ml-auto">Create</router-link>
        </div>
        <b-table :data="data" :columns="columns" :selected.sync="selected" :striped="true"></b-table>
      </div>
    </div>

    <!-- edit/delete footer -->
    <div class="fixed-bottom has-background-white-ter" v-if="selected.badge_id != null">
        <div class="container">
          <div class="columns">
            <div class="column is-half is-offset-one-quarter is-flex">
              <button class="button is-link" style="margin-left: auto; margin-right: 1rem;"
                @click="isUpdateModalActive = true, openModal()"
                :disabled="!selected.badge_id">Edit</button>
              <button class="button is-danger" @click="confirmDelete" style="margin-right: 1rem;">Delete</button>
              <button class="button is-text" @click="selected = {}">Clear Selected</button>
            </div>
          </div>
        </div>
    </div>

    <!-- edit modal -->
    <b-modal :active.sync="isUpdateModalActive" :width="640" scroll="keep">
      <div class="card">
        <div class="card-content">
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
        </div>
      </div>
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
    this.init()
  },
  methods: {
    init () {
      axios.get('/api/badge-languages').then(response => {
        this.data = response.data
      })
    },
    openModal () {
      axios.get('/api/languages').then(response => {
        this.languages = response.data
      })
      this.selectedLanguage = {
        id: this.selected.language_id,
        name: this.selected.language_name
      }
    },
    refreshTable () {
      this.init()
      this.selected = {}
    },
    confirmDelete () {
      this.$dialog.confirm({
        message: 'Do you really want to delete this badge\'s language?',
        type: 'is-danger',
        onConfirm: () => {
          if (!this.selected.id) {
            this.toast('dark', 'Please select a badge.')
            return
          }
          axios.delete(`/api/badge-languages/${this.selected.id}?confirm=false`).then(response => {
            this.toast('success', response.data)
            this.refreshTable()
          }).catch(error => {
            if (error.response.status === 422) {
              this.confirmDeleteIfBadgeIssued(error)
              return
            }
            this.$dialog.alert({
              message: error.response.data,
              type: 'is-danger'
            })
          })
        }
      })
    },
    confirmDeleteIfBadgeIssued (error) {
      this.$dialog.confirm({
        message: error.response.data + ' Do you really want to delete this badge\'s language?',
        type: 'is-danger',
        onConfirm: () => {
          axios.delete(`/api/badge-languages/${this.selected.id}?confirm=true`).then(response => {
            this.toast('success', response.data)
            this.refreshTable()
          }).catch(error => {
            this.$dialog.alert({
              message: error.response.data,
              type: 'is-danger'
            })
          })
        }
      })
    },
    submit (e) {
      if (!this.selectedLanguage) {
        this.toast('dark', 'Please select a language.')
        return
      }
      this.submitData.badge_id = this.selected.badge_id
      this.submitData.language_id = this.selectedLanguage.id
      axios.put(`/api/badge-languages/${this.selected.id}?confirm=false`, this.submitData).then(response => {
        this.toast('success', response.data)
        setTimeout((function () {
          this.refreshTable()
          this.isUpdateModalActive = false
        }.bind(this)), 1000)
      }).catch(error => {
        if (error.response.status === 422) {
          this.updateIfBadgeIssued(error)
          return
        }
        this.snackbar('warning', error.response.data)
      })
    },
    updateIfBadgeIssued (error) {
      this.$dialog.confirm({
        message: error.response.data + ' Do you really want to update this badge\'s language?',
        type: 'is-danger',
        onConfirm: () => {
          if (!this.selected.id) {
            this.toast('dark', 'Please select a badge.')
          }
          axios.put(`/api/badge-languages/${this.selected.id}?confirm=true`, this.submitData).then(response => {
            this.toast('success', response.data)
            setTimeout((function () {
              this.refreshTable()
              this.isUpdateModalActive = false
            }.bind(this)), 1000)
          }).catch(error => {
            this.$dialog.alert({
              message: error.response.data,
              type: 'is-danger'
            })
          })
        }
      })
    },
    toast (type = 'dark', message) {
      this.$toast.open({
        type: `is-${type}`,
        message
      })
    },
    snackbar (type = 'dark', message) {
      this.$snackbar.open({
        type: `is-${type}`,
        message
      })
    }
  }
}
</script>
