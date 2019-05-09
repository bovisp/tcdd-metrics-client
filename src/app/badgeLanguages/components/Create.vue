<template>
  <section>
    <div class="columns is-desktop">
      <div class="column is-half is-offset-one-quarter">
        <div class="my-4">
          <b-message title="Info" type="is-info">
              Please select one or more badges and a language.
          </b-message>
        </div>
        <form v-on:submit.prevent="submit">
          <div class="field">
            <div class="control">
              <b-field label="Badges">
                <b-input icon="magnify"
                  @keyup.native.esc="name = ''"
                  placeholder="Search..."
                  id="searchBadges"
                  autofocus
                  v-model="name"></b-input>
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
                  <button class="button is-text" @click.prevent="selectedBadges = []">Clear Selected</button>
                </template>
              </b-table>
            </div>
          </div>
          <div class="field">
            <div class="control">
              <LanguageSelect :errors="errors" @select="selectedLanguage = $event"></LanguageSelect>
            </div>
          </div>
          <div class="field">
            <div class="control">
              <button class="button is-link" style="margin-bottom: 1.5rem;" >Submit</button>
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
      badges: [],
      selectedBadges: [],
      submitData: {
        badge_id: null,
        language_id: null
      },
      selectedLanguage: {},
      name: '',
      errors: {},
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
      if (!this.selectedBadges.length) {
        this.toast('dark', 'Please select one or more badges.')
        return
      }
      this.submitData.language_id = this.selectedLanguage.id
      let response = ''
      for (let i = 0; i < this.selectedBadges.length; i++) {
        try {
          this.submitData.badge_id = this.selectedBadges[i].id
          response = await axios.post('/api/badge-languages', this.submitData)
        } catch (e) {
          this.errors = e.response.data.errors
          return
        }
      }
      this.toast('success', response.data)
      setTimeout((function () {
        this.$router.replace({ name: 'badgeLanguages' })
      }.bind(this)), 1000)
      // try {
      //   let message = await this.postEachBadge()
      //   this.toast('success', message)
      //   setTimeout((function () {
      //     this.$router.replace({ name: 'badgeLanguages' })
      //   }.bind(this)), 1000)
      // } catch (e) {
      //   this.errors = e.response.data.errors
      // }
    },
    async postEachBadge () {
      this.submitData.language_id = this.selectedLanguage.id
      let response = ''
      for (let i = 0; i < this.selectedBadges.length; i++) {
        try {
          this.submitData.badge_id = this.selectedBadges[i].id
          response = await axios.post('/api/badge-languages', this.submitData)
        } catch (e) {
          this.errors = e.response.data.errors
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
    axios.get('/api/languages').then(response => {
      this.languages = response.data
    })
    axios.get('/api/badges').then(response => {
      this.badges = response.data
    })
  }
}
</script>
