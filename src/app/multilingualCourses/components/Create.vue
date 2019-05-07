<template>
  <section class="section">
    <div class="columns is-desktop">
      <div class="column is-half is-offset-one-quarter">
        <div class="my-4">
          <b-message title="Info" type="is-info">
              Please select two or more courses and a course group name.
          </b-message>
        </div>
        <form v-on:submit.prevent="submit">
          <div class="field">
            <div class="control">
              <b-field label="Courses">
                <b-input icon="magnify" placeholder="Search..." id="searchCourses" autofocus v-model="name"></b-input>
              </b-field>
              <!-- <b-select multiple  native-size="7" v-model="selectedCourses" @click.native="changed" placeholder="Select courses">
                <option
                  v-for="course in filteredDataObj"
                  :value="course.id"
                  :key="course.id">
                  {{ course.fullname }}
                </option>
              </b-select> -->
              <!-- <select multiple size="7" name="" id="" v-model="selectedCourses" @click="changed">
                <option v-for="course in filteredDataObj" :value="course.id" :key="course.id">{{ course.fullname }}</option>
              </select> -->

              <b-table
                :data="filteredDataObj"
                :columns="columns"
                :checked-rows.sync="selectedCourses"
                paginated
                per-page="10"
                pagination-simple
                checkable>

                <template slot="bottom-left">
                  <b>Total checked</b>: {{ selectedCourses.length }}
                </template>
              </b-table>

            </div>
            <div class="control">
              <b-field label="Course Group Name">
                <input class="input" id="courseGroupName" autofocus v-model="courseGroupName">
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
      courses: [],
      submitData: {
        course_id: null,
        multilingual_course_group_id: null,
        course_group_name: ''
      },
      selectedCourses: [],
      courseGroupName: '',
      name: '',
      testArray: [],
      columns: [
        {
          field: 'fullname',
          label: 'Course'
        }
      ]
    }
  },
  computed: {
    filteredDataObj () {
      return this.courses.filter(course => {
        return course.fullname
          .toLowerCase()
          .includes(this.name.toLowerCase())
          // .indexOf(this.name.toLowerCase()) >= 0
      })
    }
  },
  methods: {
    changed (e) {
      console.log(e)
      this.testArray.push(e.target.value)
    },
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
      this.submitData.course_group_name = this.courseGroupName
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
    axios.get('/api/courses/?filter=notinmlang').then(response => {
      this.courses = response.data
    })
  }
}
</script>
