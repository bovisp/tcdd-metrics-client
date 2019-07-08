<template>
    <section>
        <div class="columns">
            <div class="column" style="margin: 0 1rem 0 .5rem">
                <h2 class="title">Excluded Modules</h2>
                <b-field>
                    <b-input icon="magnify"
                        @keyup.native.esc="excludedSearchTerm = ''"
                        placeholder="Search..."
                        id="searchExcludedCometCourses"
                        autofocus
                        v-model="excludedSearchTerm"
                        style="margin-right: .5rem;"></b-input>
                    <b-checkbox v-model="excludedCourseLangGroup"
                        native-value="english">
                        <span>Show English</span>
                    </b-checkbox>

                    <b-checkbox v-model="excludedCourseLangGroup"
                        native-value="french">
                        <span>Show French</span>
                    </b-checkbox>
                </b-field>

                <b-table
                    :header-checkable="false"
                    :data="excludedCometCourses"
                    checkable
                    :checked-rows.sync="checkedExcludedCometCourses"
                    ref="table"
                    paginated
                    per-page="10"
                    :opened-detailed="defaultOpenedDetails"
                    detailed
                    detail-key="id"
                    :show-detail-icon="showDetailIcon"
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
                            <p @click.prevent="toggle(props.row)">{{ props.row.title }}</p>
                        </b-table-column>
                    </template>

                    <template slot="detail" slot-scope="props">
                        <article class="media">
                            <figure class="media-left">
                                <p class="image is-96x96">
                                    <img :src="props.row.image_src">
                                </p>
                            </figure>
                            <div class="media-content">
                                <div class="content">
                                    <p>
                                        <strong><a :href="props.row.url">{{ props.row.title }}</a></strong>
                                        <br>
                                        {{ props.row.description }}
                                    </p>
                                </div>
                            </div>
                        </article>
                    </template>

                    <template slot="bottom-left">
                        <button class="button is-text" @click.prevent="checkedExcludedCometCourses = []">Clear Selected</button>
                    </template>

                </b-table>
            </div>

            <div class="column is-narrow">
                <button :disabled="!checkedIncludedCometCourses.length" @click.prevent="excludeCourse" class="button is-primary is-link" style="margin: 0 .5rem 0 0;"><b-icon icon="chevron-left"></b-icon></button>
                <button :disabled="!checkedExcludedCometCourses.length" @click.prevent="includeCourse" class="button is-primary is-link" style="margin: 0 0 1rem 0;"><b-icon icon="chevron-right"></b-icon></button><br/>
                <button @click.prevent="submit" class="button is-primary is-link" style="margin: 0 0 1rem 0;">Save</button><br>
                <b-tooltip label="Automatically include translated versions of selected courses."
                    position="is-bottom">
                    <b-switch v-model="addOtherLang" style="margin: 0 0 0 .5rem;"></b-switch>
                </b-tooltip><br>
                <p>Add Other Language</p>
            </div>

            <div class="column" style="margin: 0 .5rem 0 1rem">
                <h2 class="title">Included Modules</h2>

                <b-field>
                    <b-input icon="magnify"
                        @keyup.native.esc="includedSearchTerm = ''"
                        placeholder="Search..."
                        id="searchIncludedCometCourses"
                        autofocus
                        v-model="includedSearchTerm"
                        style="margin-right: .5rem;"></b-input>
                    <b-checkbox v-model="includedCourseLangGroup"
                        native-value="english">
                        <span>Show English</span>
                    </b-checkbox>

                    <b-checkbox v-model="includedCourseLangGroup"
                        native-value="french">
                        <span>Show French</span>
                    </b-checkbox>
                </b-field>

                <b-table
                    :header-checkable="false"
                    :data="includedCometCourses"
                    checkable
                    :checked-rows.sync="checkedIncludedCometCourses"
                    ref="table"
                    paginated
                    per-page="10"
                    :opened-detailed="defaultOpenedDetails"
                    detailed
                    detail-key="id"
                    :show-detail-icon="showDetailIcon"
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
                            <p @click.prevent="toggle(props.row)">{{ props.row.title }}</p>
                        </b-table-column>
                    </template>

                    <template slot="detail" slot-scope="props">
                        <article class="media">
                            <figure class="media-left">
                                <p class="image is-96x96">
                                    <img :src="props.row.image_src">
                                </p>
                            </figure>
                            <div class="media-content">
                                <div class="content">
                                    <p>
                                        <strong><a :href="props.row.url">{{ props.row.title }}</a></strong>
                                        <br>
                                        {{ props.row.description }}
                                    </p>
                                </div>
                            </div>
                        </article>
                    </template>

                    <template slot="bottom-left">
                        <button class="button is-text" @click.prevent="checkedIncludedCometCourses = []">Clear Selected</button>
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
      addOtherLang: false,
      excludedCourseLangGroup: ['english', 'french'],
      includedCourseLangGroup: ['english', 'french'],
      cometCourses: [],
      checkedIncludedCometCourses: [],
      checkedExcludedCometCourses: [],
      defaultOpenedDetails: [1],
      showDetailIcon: true,
      excludedSearchTerm: '',
      includedSearchTerm: ''
    }
  },
  computed: {
    includedCometCourses: function () {
      return this.cometCourses
        .filter(row => row.include_in_catalog)
        .filter(row => {
          if (this.includedCourseLangGroup.length === 0) { return false }
          if (this.includedCourseLangGroup.length === 1) { return row.language === this.includedCourseLangGroup[0] }
          if (this.includedCourseLangGroup.length === 2) { return true }
        })
        .filter(row => row.title
          .toString()
          .toLowerCase()
          .indexOf(this.includedSearchTerm) >= 0 ||
                    row.title === this.includedSearchTerm
        )
    },
    excludedCometCourses: function () {
      return this.cometCourses
        .filter(row => !row.include_in_catalog)
        .filter(row => {
          if (this.excludedCourseLangGroup.length === 0) { return false }
          if (this.excludedCourseLangGroup.length === 1) { return row.language === this.excludedCourseLangGroup[0] }
          if (this.excludedCourseLangGroup.length === 2) { return true }
        })
        .filter(row => row.title
          .toString()
          .toLowerCase()
          .indexOf(this.excludedSearchTerm) >= 0 ||
                    row.title === this.excludedSearchTerm
        )
    }
  },
  methods: {
    submit () {
      axios.put('http://localhost:8000/api/comet-modules', this.cometCourses).then(response => {
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
      if (this.addOtherLang) {
        this.checkedExcludedCometCourses.forEach(c => {
          if (c.language === 'english') {
            let frenchCourse = this.cometCourses.filter(course => course.english_version_id === c.id)[0]
            if (frenchCourse && !frenchCourse.include_in_catalog) { this.checkedExcludedCometCourses.push(frenchCourse) }
          } else if (c.language === 'french') {
            let englishCourse = this.cometCourses.filter(x => x.id === c.english_version_id)[0]
            if (englishCourse && !englishCourse.include_in_catalog) { this.checkedExcludedCometCourses.push(englishCourse) }
          }
        })
      }

      if (this.checkedExcludedCometCourses.length) {
        this.checkedExcludedCometCourses.forEach(x => {
          this.cometCourses.forEach(row => {
            if (row.id === x.id) { row.include_in_catalog = true }
          })
        })
        this.checkedExcludedCometCourses = []
      }
    },
    excludeCourse () {
      // if addOtherLang, foreach checked course
      //      if english, check if french course, check if included, add it to checked group
      //      if french, check if english course included, add it to checked group
      if (this.addOtherLang) {
        this.checkedIncludedCometCourses.forEach(c => {
          if (c.language === 'english') {
            let frenchCourse = this.cometCourses.filter(course => course.english_version_id === c.id)[0]
            if (frenchCourse && frenchCourse.include_in_catalog) { this.checkedIncludedCometCourses.push(frenchCourse) }
          } else if (c.language === 'french') {
            let englishCourse = this.cometCourses.filter(x => x.id === c.english_version_id)[0]
            if (englishCourse && englishCourse.include_in_catalog) { this.checkedIncludedCometCourses.push(englishCourse) }
          }
        })
      }

      if (this.checkedIncludedCometCourses.length) {
        this.checkedIncludedCometCourses.forEach(x => {
          this.cometCourses.forEach(row => {
            if (row.id === x.id) { row.include_in_catalog = false }
          })
        })
        this.checkedIncludedCometCourses = []
      }
    }
  },
  mounted () {
    axios.get('http://localhost:8000/api/comet-modules').then(response => {
      this.cometCourses = response.data
    })
  }
}
</script>
