<template>
  <section class="section">
    <div class="columns is-desktop">
      <div class="column is-half is-offset-one-quarter">
        <div class="my-4">
          <b-message title="Info" type="is-info">
              Please select two courses to assign a multilingual course group.
          </b-message>
        </div>
        <form v-on:submit.prevent="submit">
          <div class="field">
            <label class="label">Courses</label>
            <div class="control">
              <b-select multiple v-model="selectedCourses" placeholder="Select a course">
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
      courses: [],
      submitData: {
        course_id: null,
        multilingual_course_group_id: null
      },
      selectedCourses: []
    }
  },

  methods: {
    submit (e) {
      if (!this.selectedCourses || this.selectedCourses.length !== 2) {
        this.toast('dark', 'Please select two courses.')
      } else {
        this.submitData.course_id = this.selectedCourses[0].id
        axios.post('/api/multilingual-courses', this.submitData).then(response => {
          this.submitData.course_id = this.selectedCourses[1].id
          this.submitData.multilingual_course_group_id = response.data.multilingual_course_group_id
          axios.post('/api/multilingual-courses', this.submitData).then(
            this.toast('success', response.data.message),
            setTimeout((function () {
              this.$router.replace({ name: 'multilingualCourses' })
            }.bind(this)), 1000)
          ).catch(error => {
            this.toast('danger', error.response.data.message)
          })
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
  },
  mounted () {
    axios.get('/api/courses/?filter=notinmlang').then(response => {
      this.courses = response.data
    })
  }
}
</script>
