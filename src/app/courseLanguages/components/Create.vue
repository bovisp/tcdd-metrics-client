<template>
  <section class="section">
    <div class="columns is-desktop">
      <div class="column is-half is-offset-one-quarter">
        <form v-on:submit.prevent="submit">
          <div class="field">
            <b-field label="Course">
              <b-autocomplete
                v-model="name"
                placeholder="Select a course..."
                openOnFocus
                :data="filteredDataObj"
                field="fullname"
                @select="option => selectedCourse = option">
              </b-autocomplete>
            </b-field>
          </div>
          <div class="field">
            <div class="control">
              <b-field label="Language">
                <b-autocomplete
                  v-model="language"
                  placeholder="Select a language..."
                  openOnFocus
                  :data="filteredLanguages"
                  field="name"
                  @select="option => selectedLanguage = option">
                </b-autocomplete>
              </b-field>
            </div>
          </div>
          <div class="field">
            <div class="control">
              <button class="button is-link">Submit</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      languages: [],
      courses: [],
      submitData: {
        course_id: null,
        language_id: null
      },
      selectedLanguage: null,
      selectedCourse: null,
      name: '',
      language: ''
    }
  },
  computed: {
    filteredDataObj () {
      return this.courses.filter((course) => {
        return course.fullname
          .toString()
          .toLowerCase()
          .indexOf(this.name.toLowerCase()) >= 0
      })
    },
    filteredLanguages () {
      return this.languages.filter((language) => {
        return language.name
          .toString()
          .toLowerCase()
          .indexOf(this.language.toLowerCase()) >= 0
      })
    }
  },
  methods: {
    submit (e) {
      if (!this.selectedLanguage || !this.selectedCourse) {
        this.toast('dark', 'Please select a course and a language.')
        return
      }
      this.submitData.course_id = this.selectedCourse.id
      this.submitData.language_id = this.selectedLanguage.id
      axios.post('/api/course-languages', this.submitData).then(response => {
        this.toast('success', response.data)
        setTimeout((function () {
          this.$router.replace({ name: 'courseLanguages' })
        }.bind(this)), 1000)
      }).catch(error => {
        this.toast('danger', error.response.data.message)
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
    axios.get('/api/courses/?filter=notinclang').then(response => {
      this.courses = response.data
    })
  }
}
</script>
