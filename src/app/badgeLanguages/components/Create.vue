<template>
  <section class="section">
    <div class="columns is-desktop">
      <div class="column is-half is-offset-one-quarter">
        <form v-on:submit.prevent="submit">
          <div class="field">
            <div class="control">
              <b-field label="Badges">
                <b-input icon="magnify" placeholder="Search..." id="searchBadges" autofocus v-model="name"></b-input>
              </b-field>
              <b-table
                :data="filteredDataObj"
                :columns="columns"
                :checked-rows.sync="selectedBadges"
                paginated
                per-page="10"
                pagination-simple
                checkable
                :striped="true">

                <template slot="bottom-left">
                  <b>Total checked</b>: {{ selectedBadges.length }}
                </template>
              </b-table>
              <!-- <b-field label="Badge">
                <b-autocomplete
                  v-model="name"
                  placeholder="Select a badge..."
                  openOnFocus
                  :data="filteredDataObj"
                  field="name"
                  @select="option => selectedBadge = option">
                </b-autocomplete>
              </b-field> -->
            </div>
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
      badges: [],
      selectedBadges: [],
      submitData: {
        badge_id: null,
        language_id: null
      },
      selectedLanguage: null,
      name: '',
      language: '',
      columns: [
        {
          field: 'name',
          label: 'Badge'
        }
      ]
    }
  },
  computed: {
    filteredDataObj () {
      return this.badges.filter((badge) => {
        return badge.name
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
    async submit (e) {
      if (!this.selectedLanguage || this.selectedBadges.length < 1) {
        this.toast('dark', 'Please select a language and badge(s).')
        return
      }
      this.submitData.language_id = this.selectedLanguage.id
      try {
        let message = await this.postEachBadge()
        this.toast('success', message)
        setTimeout((function () {
          this.$router.replace({ name: 'badgeLanguages' })
        }.bind(this)), 1000)
      } catch (error) {
        this.toast('danger', error.response.data.message)
      }
    },
    async postEachBadge () {
      let response = ''
      for (let i = 0; i < this.selectedBadges.length; i++) {
        this.submitData.badge_id = this.selectedBadges[i].id
        response = await axios.post('/api/badge-languages', this.submitData)
      }
      return response.data.message
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
    axios.get('/api/badges').then(response => {
      this.badges = response.data
    })
  }
}
</script>
