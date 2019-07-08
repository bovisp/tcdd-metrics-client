<template>
    <section>
        <div class="columns">
            <div class="column" style="margin: 0 1rem 0 .5rem">
                <h2 class="title">Excluded Courses</h2>
                <b-field>
                    <b-input icon="magnify"
                        @keyup.native.esc="excludedSearchTerm = ''"
                        placeholder="Search..."
                        id="searchExcludedTPCourses"
                        autofocus
                        v-model="excludedSearchTerm"
                        style="margin-right: .5rem;"></b-input>
                    <!-- <b-checkbox v-model="excludedCourseLangGroup"
                        native-value="english">
                        <span>Show English</span>
                    </b-checkbox>

                    <b-checkbox v-model="excludedCourseLangGroup"
                        native-value="french">
                        <span>Show French</span>
                    </b-checkbox> -->
                </b-field>

                <b-table
                    :header-checkable="false"
                    :data="excludedCourses"
                    checkable
                    :checked-rows.sync="checkedExcludedCourses"
                    ref="table"
                    paginated
                    per-page="10"
                    aria-next-label="Next page"
                    aria-previous-label="Previous page"
                    aria-page-label="Page"
                    aria-current-label="Current page"
                >

                    <template slot="empty">
                        (No data)
                    </template>

                    <template slot-scope="props">
                        <b-table-column field="title" label="Title">
                            {{ props.row.fullname }}
                        </b-table-column>
                    </template>

                    <template slot="bottom-left">
                        <button class="button is-text" @click.prevent="checkedExcludedCourses = []">Clear Selected</button>
                    </template>

                </b-table>
            </div>

            <div class="column is-narrow">
                <button :disabled="!checkedIncludedCourses.length" @click.prevent="excludeCourse" class="button is-primary is-link" style="margin: 0 .5rem 0 0;"><b-icon icon="chevron-left"></b-icon></button>
                <button :disabled="!checkedExcludedCourses.length" @click.prevent="includeCourse" class="button is-primary is-link" style="margin: 0 0 1rem 0;"><b-icon icon="chevron-right"></b-icon></button><br/>
                <button @click.prevent="submit" class="button is-primary is-link" style="margin: 0 0 1rem 0;">Save</button><br>
                <!-- <b-tooltip label="Automatically include translated versions of selected courses."
                    position="is-bottom">
                    <b-switch v-model="addOtherLang" style="margin: 0 0 0 .5rem;"></b-switch>
                </b-tooltip><br>
                <p>Add Other Language</p> -->
            </div>

            <div class="column" style="margin: 0 .5rem 0 1rem">
                <h2 class="title">Included Courses</h2>

                <b-field>
                    <b-input icon="magnify"
                        @keyup.native.esc="includedSearchTerm = ''"
                        placeholder="Search..."
                        id="searchIncludedTPCourses"
                        autofocus
                        v-model="includedSearchTerm"
                        style="margin-right: .5rem;"></b-input>
                    <!-- <b-checkbox v-model="includedCourseLangGroup"
                        native-value="english">
                        <span>Show English</span>
                    </b-checkbox>

                    <b-checkbox v-model="includedCourseLangGroup"
                        native-value="french">
                        <span>Show French</span>
                    </b-checkbox> -->
                </b-field>

                <b-table
                    :header-checkable="false"
                    :data="includedCourses"
                    checkable
                    :checked-rows.sync="checkedIncludedCourses"
                    ref="table"
                    paginated
                    per-page="10"
                    aria-next-label="Next page"
                    aria-previous-label="Previous page"
                    aria-page-label="Page"
                    aria-current-label="Current page"
                >

                    <template slot="empty">
                        (No data)
                    </template>

                    <template slot-scope="props">
                        <b-table-column field="title" label="Title">
                            {{ props.row.fullname }}
                        </b-table-column>
                    </template>

                    <template slot="bottom-left">
                        <button class="button is-text" @click.prevent="checkedIncludedCourses = []">Clear Selected</button>
                    </template>

                </b-table>
            </div>
        </div>

    </section>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      // addOtherLang: false,
      // excludedCourseLangGroup: ['english', 'french'],
      // includedCourseLangGroup: ['english', 'french'],
      courses: [],
      checkedIncludedCourses: [],
      checkedExcludedCourses: [],
      excludedSearchTerm: '',
      includedSearchTerm: ''
    }
  },
  computed: {
    includedCourses: function () {
      return this.courses
        .filter(row => row.include_in_catalog)
      // .filter(row => {
      //     if(this.includedCourseLangGroup.length === 0)
      //         return false
      //     if(this.includedCourseLangGroup.length === 1)
      //         return row.language === this.includedCourseLangGroup[0]
      //     if(this.includedCourseLangGroup.length === 2)
      //         return true
      // })
        .filter(row => row.fullname
          .toString()
          .toLowerCase()
          .indexOf(this.includedSearchTerm) >= 0 ||
                    row.fullname === this.includedSearchTerm
        )
    },
    excludedCourses: function () {
      return this.courses
        .filter(row => !row.include_in_catalog)
      // .filter(row => {
      //     if(this.excludedCourseLangGroup.length === 0)
      //         return false
      //     if(this.excludedCourseLangGroup.length === 1)
      //         return row.language === this.excludedCourseLangGroup[0]
      //     if(this.excludedCourseLangGroup.length === 2)
      //         return true
      // })
        .filter(row => row.fullname
          .toString()
          .toLowerCase()
          .indexOf(this.excludedSearchTerm) >= 0 ||
                    row.fullname === this.excludedSearchTerm
        )
    }
  },
  methods: {
    submit () {
      axios.put('http://localhost:8000/api/tp-modules', this.courses).then(response => {
        this.$toast.open({
          message: response.data,
          type: 'is-success'
        })
      }).catch(e => {
        this.$toast.open({
          message: e,
          type: 'is-danger'
        })
      })
    },
    toggle (row) {
      this.$refs.table.toggleDetails(row)
    },
    includeCourse () {
      // if(this.addOtherLang) {
      //     this.checkedExcludedCourses.forEach(c => {
      //         if(c.language === 'english') {
      //             let frenchCourse = this.courses.filter(course => course.english_version_id === c.id)[0]
      //             if(frenchCourse && !frenchCourse.include_in_catalog)
      //                 this.checkedExcludedCourses.push(frenchCourse)
      //         } else if (c.language === 'french') {
      //             let englishCourse = this.courses.filter(x => x.id === c.english_version_id)[0]
      //             if(englishCourse && !englishCourse.include_in_catalog)
      //                 this.checkedExcludedCourses.push(englishCourse)
      //         }
      //     })
      // }

      if (this.checkedExcludedCourses.length) {
        this.checkedExcludedCourses.forEach(x => {
          this.courses.forEach(row => {
            if (row.course_id === x.course_id) { row.include_in_catalog = true }
          })
        })
        this.checkedExcludedCourses = []
      }
    },
    excludeCourse () {
      // if addOtherLang, foreach checked course
      //      if english, check if french course, check if included, add it to checked group
      //      if french, check if english course included, add it to checked group
      // if(this.addOtherLang) {
      //     this.checkedIncludedCourses.forEach(c => {
      //         if(c.language === 'english') {
      //             let frenchCourse = this.courses.filter(course => course.english_version_id === c.id)[0]
      //             if(frenchCourse && frenchCourse.include_in_catalog)
      //                 this.checkedIncludedCourses.push(frenchCourse)
      //         } else if (c.language === 'french') {
      //             let englishCourse = this.courses.filter(x => x.id === c.english_version_id)[0]
      //             if(englishCourse && englishCourse.include_in_catalog)
      //                 this.checkedIncludedCourses.push(englishCourse)
      //         }
      //     })
      // }

      if (this.checkedIncludedCourses.length) {
        this.checkedIncludedCourses.forEach(x => {
          this.courses.forEach(row => {
            if (row.course_id === x.course_id) { row.include_in_catalog = false }
          })
        })
        this.checkedIncludedCourses = []
      }
    }
  },
  mounted () {
    axios.get('http://localhost:8000/api/tp-modules').then(response => {
      this.courses = response.data
    })
  }
}
</script>
