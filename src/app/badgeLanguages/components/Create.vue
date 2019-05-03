<template>
  <section class="section">
    <div class="columns is-desktop">
      <div class="column is-half is-offset-one-quarter">
        <form v-on:submit.prevent="submit">
          <div class="field">
            <div class="control">
              <b-field label="Badge">
                <b-autocomplete
                  v-model="name"
                  placeholder="Select a badge..."
                  openOnFocus
                  :data="filteredDataObj"
                  field="name"
                  @select="option => selectedBadge = option">
                </b-autocomplete>
              </b-field>
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
      submitData: {
        badge_id: null,
        language_id: null
      },
      selectedLanguage: null,
      selectedBadge: null,
      name: '',
      language: ''
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
    submit (e) {
      if (!this.selectedLanguage || !this.selectedBadge) {
        this.toast('dark', 'Please select a badge and a language.')
        return
      }
      this.submitData.badge_id = this.selectedBadge.id
      this.submitData.language_id = this.selectedLanguage.id
      axios.post('/api/badge-languages', this.submitData).then(response => {
        this.toast('success', response.data)
        setTimeout((function () {
          this.$router.replace({ name: 'badgeLanguages' })
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
    axios.get('/api/badges').then(response => {
      this.badges = response.data
    })
  }
}
</script>
