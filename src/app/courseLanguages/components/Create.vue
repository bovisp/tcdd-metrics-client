<template>
  <section class="section">
    <div class="columns is-desktop">
      <div class="column is-half is-offset-one-quarter">
        <form v-on:submit.prevent="submit">
          <div class="field">
            <b-field label="Course">
              <b-input icon="magnify"
                placeholder="Search..." 
                id="searchBadges" 
                autofocus 
                v-model="name" 
                @keyup.native.esc="name=''"></b-input>

              <!-- <b-autocomplete
                v-model="name"
                placeholder="Select a course..."
                openOnFocus
                :data="filteredDataObj"
                field="fullname"
                @select="option => selectedCourse = option">
              </b-autocomplete> -->
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
                  <b>Total checked</b>: {{ selectedCourses.length }}
                </template>
              </b-table>
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
      selectedCourses: [],
      name: '',
      language: '',
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
    // cancelSearch () {
    //   console.log('cancel')
    // },
    async submit (e) {
      if (!this.selectedLanguage || this.selectedCourses.length < 1) {
        this.toast('dark', 'Please select a language and course(s).')
        return
      }
      this.submitData.language_id = this.selectedLanguage.id
      try {
        let message = await this.postEachCourse()
        this.toast('success', message)
        setTimeout((function () {
          this.$router.replace({ name: 'courseLanguages' })
        }.bind(this)), 1000)
      } catch (error) {
        this.toast('danger', error.response.data.message)
      }
    },
    async postEachCourse () {
      let response = ''
      for (let i = 0; i < this.selectedCourses.length; i++) {
        this.submitData.course_id = this.selectedCourses[i].id
        response = await axios.post('/api/course-languages', this.submitData)
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
    axios.get('/api/languages').then(response => {
      this.languages = response.data
    })
    axios.get('/api/courses/?filter=notinclang').then(response => {
      this.courses = response.data
    })
  }
}
</script>
