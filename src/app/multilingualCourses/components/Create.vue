<template>
  <section class="section">
    <div class="columns is-desktop">
      <div class="column is-half is-offset-one-quarter">
        <div class="my-4">
          <b-message title="Info" type="is-info">
              Please select two or more courses to create a course group.
          </b-message>
        </div>
        <form v-on:submit.prevent="submit">
          <div class="field">
            <label class="label">Courses</label>
            <div class="control">
              <b-select multiple  native-size="7" v-model="selectedCourses" placeholder="Select a course">
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
    async submit (e) {
      if (!this.selectedCourses || this.selectedCourses.length < 2) {
        this.toast('dark', 'Please select at least two courses.')
        return
      }
      await this.postFirstSelectedCourse()
      await this.postOtherSelectedCourses()
    },
    async postFirstSelectedCourse () {
      this.submitData.course_id = this.selectedCourses[0].id
      try {
        let firstResponse = await axios.post('/api/multilingual-courses', this.submitData)
        this.submitData.multilingual_course_group_id = firstResponse.data.multilingual_course_group_id // set group id for subsequent course post requests
      } catch (error) {
        this.toast('danger', error.response.data.message)
      }
    },
    async postOtherSelectedCourses () {
      try {
        let message = await this.postEachAdditionalCourse()
        this.toast('success', message)
        setTimeout((function () {
          this.$router.replace({ name: 'multilingualCourses' })
        }.bind(this)), 1000)
      } catch (error) {
        this.toast('danger', error.response.data.message)
      }
    },
    async postEachAdditionalCourse () {
      let subsequentResponse
      for (let i = 1; i < this.selectedCourses.length; i++) {
        this.submitData.course_id = this.selectedCourses[i].id
        subsequentResponse = await axios.post('/api/multilingual-courses', this.submitData)
      }
      return subsequentResponse.data.message
    },
    toast (type = 'dark', message) {
      this.$toast.open({
        type: `is-${type}`,
        message
      })
    }
  },
  mounted () {
    axios.get('/api/courses/?filter=notinmlang').then(firstResponse => {
      this.courses = firstResponse.data
    })
  }
}
</script>
