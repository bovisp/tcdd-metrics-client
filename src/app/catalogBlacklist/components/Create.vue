<template>
  <section>
    <div class="columns is-desktop">
      <div class="column is-2" style="margin-top: 1rem;">
        <div class="field">
          <LanguageSelect :errors="errors" @select="selectedLanguage = $event"></LanguageSelect>
        </div>
      </div>
    </div>
    <div class="field">
        <button class="button is-link" @click.prevent="submit">Generate</button>
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
      selectedLanguage: {},
      errors: {}
    }
  },
  computed: {

  },
  watch: {

  },
  methods: {
    submit () {
      let data = {}
      data.language_id = this.selectedLanguage.id
      axios({
        method: 'post',
        url: '/api/generate-pdf',
        responseType: 'blob',
        data: data
      }).then(function (response) {
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(response.data)
        link.download = data.language_id === 1 ? 'catalog_en.pdf' : 'catalog_fr.pdf'
        link.click()
      })
    }
  },
  mounted () {

  }
}
</script>
