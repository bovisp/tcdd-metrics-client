<template>
  <section>
    <div class="columns is-desktop">
      <div class="column is-half is-offset-one-quarter">
        <div class="my-4">
          <b-message title="Info" type="is-info">
              Please create a course group, and then select one or more courses to add to a group.
          </b-message>
        </div>
        <div class="is-flex my-4">
          <router-link :to="{ name: 'createCourseGroup' }" class="button is-link ml-auto">Create Course Group</router-link>
        </div>
        <form v-on:submit.prevent="submit">
          <div class="field">
            <div class="control">
              <b-field label="Courses">
                <b-input icon="magnify"
                  placeholder="Search..."
                  id="searchCourses"
                  autofocus
                  v-model="name"
                  @keyup.native.esc="name = ''"></b-input>
              </b-field>
              <b-table
                :data="filteredDataObj"
                :columns="columns"
                :checked-rows.sync="selectedCourses"
                paginated
                per-page="10"
                pagination-simple
                checkable
                :striped="true">
                <template slot="bottom-left">
                  <button class="button is-text" @click.prevent="selectedCourses = []">Clear Selected</button>
                </template>
              </b-table>
            </div>
            <div class="control">
              <b-field label="Course Group" :type="{ 'is-danger': errors.multilingual_course_group_id }">
                <b-autocomplete
                  v-model="courseGroupName"
                  placeholder="Enter a course group name..."
                  openOnFocus
                  :data="filteredCourseGroups"
                  field="name"
                  @select="option => selectedCourseGroup = option"
                  @keyup.native.esc="courseGroupName=''">
                </b-autocomplete>
              </b-field>
              <p class="help is-danger" v-if="errors.multilingual_course_group_id">
                  {{ errors.multilingual_course_group_id[0] }}
              </p>
            </div>
          </div>
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

export default {
  data () {
    return {
      courses: [],
      courseGroups: [],
      submitData: {
        course_id: null,
        multilingual_course_group_id: null,
        course_group_name: ''
      },
      selectedCourses: [],
      selectedCourseGroup: {},
      courseGroupName: '',
      name: '',
      errors: [],
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
      })
    },
    filteredCourseGroups () {
      return this.courseGroups.filter(group => {
        return group.name
          .toLowerCase()
          .includes(this.courseGroupName.toLowerCase())
      })
    }
  },
  methods: {
    refreshForm () {
      this.selectedCourseGroup = {}
      this.selectedCourses = []
    },
    async submit (e) {
      this.submitData.multilingual_course_group_id = this.selectedCourseGroup.id
      let response = ''
      let reponseData = await this.postEachSelectedCourse()
      if (!this.errors.length && reponseData) {
        this.refreshForm()
        this.toast('success', reponseData)
        setTimeout((function () {
          this.$router.replace({ name: 'multilingualCourses' })
        }.bind(this)), 1000)
      }
    },
    async postEachSelectedCourse () {
      this.submitData.multilingual_course_group_id = this.selectedCourseGroup.id
      let response = ''
      for (let i = 0; i < this.selectedCourses.length; i++) {
        try {
          this.submitData.course_id = this.selectedCourses[i].id
          response = await axios.post('/api/multilingual-courses', this.submitData)
        } catch (e) {
          this.errors = e.response.data.errors
          this.refreshForm()
          return
        }
      }
      return response.data
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
    axios.get('/api/multilingual-course-groups').then(response => {
      this.courseGroups = response.data
    })
  }
}
</script>
