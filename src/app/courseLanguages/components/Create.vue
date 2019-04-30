<template>
  <section class="section">
    <div class="columns is-desktop">
      <div class="column is-half is-offset-one-quarter">
        <form v-on:submit.prevent="submit">
          <div class="field">
            <label class="label">Course</label>
            <div class="control">
              <b-select v-model="selectedCourse" placeholder="Select a course">
                <option
                  v-for="course in courses"
                  :value="course"
                  :key="course.id">
                  {{ course.fullname }}
                </option>
              </b-select>
            </div>
          </div>
          <div class="field">
            <label class="label">Language</label>
            <div class="control">
              <b-select v-model="selectedLanguage" placeholder="Select a language">
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
      selectedCourse: null
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
