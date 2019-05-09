<template>
  <section>
    <div class="columns is-desktop">
      <div class="column is-half is-offset-one-quarter">
        <div class="my-4">
          <b-message title="Info" type="is-info">
              Please select one or more courses and a language.
          </b-message>
        </div>
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
                  <button class="button is-text" @click.prevent="selectedCourses = []">Clear Selected</button>
                </template>
              </b-table>
          </div>
          <div class="field">
            <div class="control">
              <LanguageSelect :errors="errors" @select="selectedLanguage = $event"></LanguageSelect>
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
import LanguageSelect from '@/components/LanguageSelect'

export default {
  components: {
    LanguageSelect
  },
  data () {
    return {
      languages: [],
      courses: [],
      submitData: {
        course_id: null,
        language_id: null
      },
      selectedLanguage: {},
      selectedCourses: [],
      name: '',
      errors: {},
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
      if (!this.selectedCourses.length) {
        this.toast('dark', 'Please select one or more courses.')
        return
      }
      this.submitData.language_id = this.selectedLanguage.id
      let response = ''
      for (let i = 0; i < this.selectedCourses.length; i++) {
        try {
          this.submitData.course_id = this.selectedCourses[i].id
          response = await axios.post('/api/course-languages', this.submitData)
        } catch (e) {
          this.errors = e.response.data.errors
          return
        }
      }
      this.toast('success', response.data)
      setTimeout((function () {
        this.$router.replace({ name: 'courseLanguages' })
      }.bind(this)), 1000)
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
