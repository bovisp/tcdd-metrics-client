<template>
  <section class="section">
    <form v-on:submit.prevent="submit">
      <div class="field">
        <label class="label">Badge</label>
        <div class="control">
          <!-- <vSelect label="name" v-model="selectedBadge" :options="badges"></vSelect> -->
          <b-select v-model="selectedBadge" placeholder="Select a badge">
                <option
                    v-for="badge in badges"
                    :value="badge"
                    :key="badge.id">
                    {{ badge.name }}
                </option>
          </b-select>
        </div>
      </div>
      <div class="field">
        <label class="label">Language</label>
        <div class="control">
          <!-- <vSelect label="name" min-width=160px v-model="selectedLanguage" :options="languages"></vSelect> -->
          <b-select v-model="selectedLanguage" placeholder="Select a language">
            <option
              v-for="language in languages"
              :value="language"
              :key="language.id">
              {{ language.name }}
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
      selectedBadge: null
    }
  },

  methods: {
    submit (e) {
      if (!this.selectedLanguage || !this.selectedBadge) {
        this.toast('dark', 'Please select a badge and a language.')
      } else {
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
      }
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
