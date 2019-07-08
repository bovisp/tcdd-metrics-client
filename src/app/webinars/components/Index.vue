<template>
  <section>

    <!-- index table -->
    <div class="columns is-desktop">
      <div class="column is-half is-offset-one-quarter">
        <div class="my-4">
          <b-message title="Info" type="is-info">
              Please select a webinar to update or delete its number of attendees.
          </b-message>
        </div>
        <div class="is-flex my-4">
          <router-link :to="{ name: 'createWebinarAttendance' }" class="button is-link ml-auto">Create</router-link>
        </div>
        <b-table style="margin-bottom: 1.5rem;"
          :data="data"
          :columns="columns"
          :selected.sync="selected"
          paginated
          per-page="10"
          pagination-simple
          :striped="true">
        </b-table>
      </div>
    </div>

    <!-- edit/delete footer -->
    <div class="fixed-bottom has-background-white-ter" v-if="selected.course_id != null">
        <div class="container">
          <div class="columns">
            <div class="column is-half is-offset-one-quarter is-flex">
              <button class="button is-link" style="margin-left: auto; margin-right: 1rem;"
                @click="isUpdateModalActive = true, openModal()"
                :disabled="!selected.course_id">Edit</button>
              <button class="button is-danger" @click="confirmDelete" style="margin-right: 1rem;">Delete</button>
              <button class="button is-text" @click="selected = {}">Clear Selected</button>
            </div>
          </div>
        </div>
    </div>

    <!-- edit modal -->
    <b-modal :active.sync="isUpdateModalActive" :width="640" scroll="keep" @close="englishAttendees = null; frenchAttendees = null">
      <div class="card">
        <div class="card-content">
          <form v-on:submit.prevent="submit">
            <div class="field">
              <label class="label">Webinar</label>
              <p>{{ selected.fullname }}</p>
            </div>
            <div class="columns">
              <div class="column">
                <b-field label="English Attendees">
                  <input class="input" type="number" v-model="englishAttendees" pattern="[0-9]">
                </b-field>
                <b-field>
                  <button class="button is-link">Update</button>
                </b-field>
              </div>
              <div class="column">
                <b-field label="French Attendees">
                  <input class="input" type="number" v-model="frenchAttendees" pattern="[0-9]">
                </b-field>
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
import { groupBy, orderBy } from 'lodash'

export default {
  data () {
    return {
      isUpdateModalActive: false,
      languages: [],
      data: [],
      selected: {
        course_id: null,
        english_attendees: null,
        french_attendees: null
      },
      updateEnglishAttendees: null,
      updateFrenchAttendees: null,
      columns: [
        {
          field: 'fullname',
          label: 'Webinar'
        },
        {
          field: 'english_attendees',
          label: 'English Attendees'
        },
        {
          field: 'french_attendees',
          label: 'French Attendees'
        }
      ]
    }
  },
  computed: {
    englishAttendees: {
      get: function () {
        return this.selected.english_attendees
      },
      set: function (newValue) {
        this.updateEnglishAttendees = newValue
      }
    },
    frenchAttendees: {
      get: function () {
        return this.selected.french_attendees
      },
      set: function (newValue) {
        this.updateFrenchAttendees = newValue
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      axios.get('/api/webinar-attendance').then(response => {
        let groupedData = Object.values(groupBy(response.data, 'course_id'))
        groupedData = groupedData.map(webinar => {
          return {
            course_id: webinar[0].course_id,
            fullname: webinar[0].english_course_name + ' / ' + webinar[0].french_course_name,
            english_attendees: webinar.filter(x => x.language_name.toLowerCase() === 'english')[0]
              ? webinar.filter(x => x.language_name.toLowerCase() === 'english')[0].attendees : 'undefined',
            french_attendees: webinar.filter(x => x.language_name.toLowerCase() === 'french')[0]
              ? webinar.filter(x => x.language_name.toLowerCase() === 'french')[0].attendees : 'undefined'
          }
        })
        this.data = orderBy(groupedData, 'fullname', 'asc')
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
        message: `Do you really want to delete this webinar's attendance records?`,
        type: 'is-danger',
        onConfirm: () => this.deleteOnConfirm()
      })
    },
    deleteOnConfirm () {
      if (!this.selected.course_id) {
        this.toast('dark', 'Please select a webinar.')
        return
      }
      axios.delete(`/api/webinar-attendance/${this.selected.course_id}`).then(response => {
        this.toast('success', response.data)
        this.refreshTable()
      }).catch(error => {
        this.$dialog.alert({
          message: error,
          type: 'is-danger'
        })
      })
    },
    submit (e) {
      let submitData = {}
      submitData.english_attendees = this.updateEnglishAttendees ? this.updateEnglishAttendees : this.selected.english_attendees
      submitData.french_attendees = this.updateFrenchAttendees ? this.updateFrenchAttendees : this.selected.french_attendees

      axios.put(`/api/webinar-attendance/${this.selected.course_id}`, submitData).then(response => {
        this.toast('success', response.data)
        setTimeout((function () {
          this.refreshTable()
          this.isUpdateModalActive = false
        }.bind(this)), 1000)
      }).catch(error => {
        this.snackbar('warning', error)
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
