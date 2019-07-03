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
    <b-modal :active.sync="isUpdateModalActive" :width="640" scroll="keep">
      <div class="card">
        <div class="card-content">
          <form v-on:submit.prevent="submit">
            <div class="field">
              <label class="label">Course</label>
              <p>{{ selected.fullname }}</p>
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
import { groupBy, orderBy } from 'lodash'

export default {
  data () {
    return {
      isUpdateModalActive: false,
      languages: [],
      data: [],
      selected: {},
      submitData: {
        course_id: null,
        language_id: null
      },
      selectedLanguage: null,
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
  mounted () {
    this.init()
  },
  methods: {
    init () {
      axios.get('/api/webinar-attendance').then(response => {
        let groupedData = Object.values(groupBy(response.data, 'course_id'))
        groupedData = groupedData.map(webinar => {
          return {
            fullname: webinar[0].english_course_name + ' / ' + webinar[0].french_course_name,
            english_attendees: webinar.filter(x => x.language_name.toLowerCase() === 'english')[0] ? 
                               webinar.filter(x => x.language_name.toLowerCase() === 'english')[0].attendees : 'undefined',
            french_attendees: webinar.filter(x => x.language_name.toLowerCase() === 'french')[0] ? 
                              webinar.filter(x => x.language_name.toLowerCase() === 'french')[0].attendees : 'undefined'
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
        message: 'Do you really want to delete this course\'s language?',
        type: 'is-danger',
        onConfirm: () => this.deleteOnConfirm()
      })
    },
    deleteOnConfirm () {
      if (!this.selected.id) {
        this.toast('dark', 'Please select a course.')
        return
      }
      axios.delete(`/api/course-languages/${this.selected.id}`).then(response => {
        this.toast('success', response.data)
        this.refreshTable()
      }).catch(error => {
        this.$dialog.alert({
          message: error.response.data,
          type: 'is-danger'
        })
      })
    },
    submit (e) {
      if (!this.selectedLanguage) {
        this.toast('dark', 'Please select a language.')
        return
      }
      this.submitData.course_id = this.selected.course_id
      this.submitData.language_id = this.selectedLanguage.id
      axios.put(`/api/course-languages/${this.selected.id}`, this.submitData).then(response => {
        this.toast('success', response.data)
        setTimeout((function () {
          this.refreshTable()
          this.isUpdateModalActive = false
        }.bind(this)), 1000)
      }).catch(error => {
        this.snackbar('warning', error.response.data)
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
