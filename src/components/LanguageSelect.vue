<template>
  <section>
    <div class="field">
        <b-field label="Language" >
            <!-- :type="{ 'is-danger': errors.language_id }" -->
        <b-autocomplete
            v-model="languageName"
            placeholder="Select a language..."
            openOnFocus
            :data="filteredLanguages"
            field="name"
            @select="option => selectedLanguage = option">
        </b-autocomplete>
        </b-field>
        <!-- <p class="help is-danger" v-if="errors.language_id">
            {{ errors.language_id[0] }}
        </p> -->
    </div>
  </section>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      languages: [],
      selectedLanguage: {},
      languageName: ''
    }
  },
  computed: {
    filteredLanguages () {
      return this.languages.filter((language) => {
        return language.name
          .toString()
          .toLowerCase()
          .indexOf(this.languageName.toLowerCase()) >= 0
      })
    }
  },
  methods: {

  },
  mounted () {
    axios.get('/api/languages').then(response => {
      this.languages = response.data
    })
  }
}
</script>
