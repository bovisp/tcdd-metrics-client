<template>
  <section>
    <div class="columns is-desktop">
      <div class="column is-half is-offset-one-quarter">
        <div class="my-4">
          <b-message title="Info" type="is-info">
              Please select a webinar, language and number of attendees.
          </b-message>
        </div>
        <div class="field">
          <b-field label="Webinar">
            <vSelect
              label="fullname"
              :options="webinars"
              @input="option => selectedWebinar = option"
            />
          </b-field>
        </div>
        <div class="columns">
          <div class="column">
            <div class="field">
              <div class="control">
                <LanguageSelect :errors="errors" @select="selectedLanguage = $event"></LanguageSelect>
              </div>
            </div>
          </div>
          <div class="column">
            <b-field label="Attendees">
              <input class="input" type="number" v-model="attendees" pattern="[0-9]">
            </b-field>
          </div>
        </div>
        <form v-on:submit.prevent="submit">
          <div class="field">
            <div class="control">
              <button class="button is-link" style="margin-bottom: 1.5rem;">Submit</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
import LanguageSelect from '@/components/LanguageSelect'
import vSelect from 'vue-select'
import { orderBy } from 'lodash'

export default {
  components: {
    LanguageSelect,
    vSelect
  },
  data () {
    return {
      selectedWebinar: {},
      selectedLanguage: {},
      webinars: [],
      languages: [],
      attendees: null,
      submitData: {
        course_id: null,
        language_id: null
      },
      errors: {}
    }
  },
  computed: {

  },
  methods: {
    async submit (e) {
      if (!Object.keys(this.selectedWebinar).length) {
        this.toast('dark', 'Please select a webinar.')
        return
      }
      if (!Object.keys(this.selectedLanguage).length) {
        this.toast('dark', 'Please select a language.')
        return
      }
      if (!this.attendees) {
        this.toast('dark', 'Please enter number of attendees.')
        return
      }
      if (this.attendees - this.attendees !== 0) {
        this.toast('dark', 'Attendees must be a number.')
        return
      }
      let data = {
        course_id: this.selectedWebinar.id,
        language_id: this.selectedLanguage.id,
        attendees: this.attendees
      }
      axios.post('/api/webinar-attendance', data).then(response => {
        this.toast('success', response.data)
        setTimeout((function () {
          this.$router.replace({ name: 'webinarAttendance' })
        }.bind(this)), 1000)
      }).catch(error => {
        this.toast('danger', error.response.data)
      })
    },
    toast (type = 'dark', message) {
      this.$toast.open({
        type: `is-${type}`,
        message
      })
    }
  },
  mounted () {
    axios.get('/api/languages').then(response => {
      this.languages = response.data
    })
    axios.get('/api/webinars').then(response => {
      let data = response.data.map(x => {
        x.fullname = x.english_course_name + ' / ' + x.french_course_name
        return x
      })
      this.webinars = orderBy(data, row => row.fullname.toLowerCase(), 'asc')
    })
  }
}
</script>
