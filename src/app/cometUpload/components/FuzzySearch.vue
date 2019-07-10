<template>
    <section>
        <div v-if="!dropFiles.length" class="columns">
            <div class="column">
                <b-field>
                    <b-upload v-model="dropFiles"
                        multiple
                        drag-drop
                        @input="submitFiles">
                        <section class="section">
                            <div class="content has-text-centered">
                                <p>
                                    <b-icon
                                        icon="upload"
                                        size="is-large">
                                    </b-icon>
                                </p>
                                <p>Drop your files here or click to upload</p>
                            </div>
                        </section>
                    </b-upload>
                </b-field>
            </div>
        </div>
        <div class="columns">
          <div class="column is-10 is-offset-1">
            <div v-for="(file, i) in dropFiles">
              <p class="content has-text-centered"><strong>{{file.name}}</strong></p>
              <b-tabs v-model="activeTab[i]" v-if="dropFiles.length" position="is-centered" size="is-medium" class="block">
                <b-tab-item label="Completions">

                    <div class="columns" v-if="completionIncorrectModulesTitlesFr[i].length">
                      <h2 class="title column is-5 is-offset-1">Original Title</h2>
                      <h2 class="title column is-5">Suggested Title</h2>
                    </div>
                    <div class="columns" v-if="completionIncorrectModulesTitlesFr[i].length" v-for="(title, j) in completionIncorrectModulesTitlesFr[i]">
                      <p class="has-text-left column is-5 is-offset-1">{{ title }}</p>
                      <b-field class="column is-5">
                        <b-input v-model="completionSuggestedModuleTitlesFr[i][j]"></b-input>
                      </b-field>
                    </div>
                </b-tab-item>
                <b-tab-item label="Accesses">

                    <div class="columns" v-if="accessIncorrectModulesTitlesFr[i].length">
                      <h2 class="title column is-5 is-offset-1">Original Title</h2>
                      <h2 class="title column is-5">Suggested Title</h2>
                    </div>
                    <div class="columns" v-if="accessIncorrectModulesTitlesFr[i].length" v-for="(title, j) in accessIncorrectModulesTitlesFr[i]">
                      <p class="has-text-left column is-5 is-offset-1">{{ title }}</p>
                      <b-field class="column is-5">
                        <b-input v-model="accessSuggestedModuleTitlesFr[i][j]"></b-input>
                      </b-field>
                    </div>

                </b-tab-item>
              </b-tabs>
            </div>
            <button v-if="dropFiles.length" class="button field is-link is-pulled-right" @click="submit" style="margin: 1rem 0 1rem 0;">
              <span>Submit</span>
            </button>
          </div>
        </div>
    </section>
</template>

<script>
import axios from 'axios'
import Fuse from 'fuse.js'
import _ from 'lodash'

export default {
  data () {
    return {
      activeTab: 0,
      dropFiles: [],
      cometAccesses: [],
      cometCompletions: [],
      accessAllModuleTitlesFr: [],
      accessIncorrectModulesTitlesFr: [],
      accessSuggestedModuleTitlesFr: [],
      correctModuleTitlesFr: [],
      completionAllModuleTitlesFr: [],
      completionIncorrectModulesTitlesFr: [],
      completionSuggestedModuleTitlesFr: [],
      fuseOptions: {
        tokenize: true,
        matchAllTokens: false,
        shouldSort: true,
        includeScore: false,
        threshold: 0.3,
        location: 0,
        distance: 100,
        maxPatternLength: 200,
        minMatchCharLength: 1,
        keys: [
          'title'
        ]
      },
      fuse: null
    }
  },
  methods: {
    submitFiles () {
      if(process.env.NODE_ENV !== undefined && process.env.NODE_ENV === 'development') {
        axios.defaults.baseURL = 'http://localhost:8000'
      } else {
        axios.defaults.baseURL = 'http://msc-educ-smc.cmc.ec.gc.ca/tcdd-metrics'
      }

      for (let i = 0; i < this.dropFiles.length; i++) {
        let formData = new FormData()
        formData.append('file', this.dropFiles[i])
        axios.post('/api/comet-uploads', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(response => {
          // comet completions
          this.cometCompletions.push([])
          this.completionIncorrectModulesTitlesFr.push([])
          this.completionSuggestedModuleTitlesFr.push([])
          this.cometCompletions[i] = response.data[0].flat()
          this.completionAllModuleTitlesFr[i] = this.cometCompletions[i]
            .filter(row => row.Language === 'French')
            .map(row => row.Module)

          for (let j = 0; j < this.completionAllModuleTitlesFr[i].length; j++) {
            let result = this.fuse.search(this.completionAllModuleTitlesFr[i][j])[0]
            if (this.completionAllModuleTitlesFr[i][j] != result.title) {
              this.completionIncorrectModulesTitlesFr[i].push(this.completionAllModuleTitlesFr[i][j])
              this.completionSuggestedModuleTitlesFr[i].push(result.title)
            }
          }
          // comet accesses
          this.cometAccesses.push([])
          this.accessIncorrectModulesTitlesFr.push([])
          this.accessSuggestedModuleTitlesFr.push([])
          this.cometAccesses[i] = response.data[1].flat()
          this.accessAllModuleTitlesFr[i] = this.cometAccesses[i]
            .filter(row => row.language === 'French')
            .map(row => row.Module)

          for (let j = 0; j < this.accessAllModuleTitlesFr[i].length; j++) {
            let result = this.fuse.search(this.accessAllModuleTitlesFr[i][j])[0]
            if (this.accessAllModuleTitlesFr[i][j] != result.title) {
              this.accessIncorrectModulesTitlesFr[i].push(this.accessAllModuleTitlesFr[i][j])
              this.accessSuggestedModuleTitlesFr[i].push(result.title)
            }
          }
        })
      }
    },
    deleteDropFile (index) {
      this.dropFiles.splice(index, 1)
    },
    submit () {
      // for each drop file, search the module names for each module name in incorrectModuleTitlesFr at the same index as that drop file
      // when found, replace with the suggestedTitle at the index of the drop file and index of the incorrect title

      for (let i = 0; i < this.dropFiles.length; i++) {
        this.cometCompletions[i].forEach(row => {
          for (let j = 0; j < this.completionIncorrectModulesTitlesFr[i].length; j++) {
            if (row.Module === this.completionIncorrectModulesTitlesFr[i][j]) { row.Module = this.completionSuggestedModuleTitlesFr[i][j] }
          }
          delete row.topic
        })
        this.cometCompletions[i] = _.uniqWith(this.cometCompletions[i], _.isEqual)
      }

      for (let i = 0; i < this.dropFiles.length; i++) {
        this.cometAccesses[i].forEach(row => {
          for (let j = 0; j < this.accessIncorrectModulesTitlesFr[i].length; j++) {
            if (row.Module === this.accessIncorrectModulesTitlesFr[i][j]) { row.Module = this.accessSuggestedModuleTitlesFr[i][j] }
          }
          delete row.topic
        })
        this.cometAccesses[i] = _.uniqWith(this.cometAccesses[i], _.isEqual)
      }

      axios.post('/api/comet-completions', this.cometCompletions).then(response => {
        axios.post('/api/comet-accesses', this.cometAccesses).then(response => {
          this.$toast.open({
            message: response.data,
            type: 'is-success'
          })
          this.activeTab = 0
          this.dropFiles = []
          this.cometAccesses = []
          this.cometCompletions = []
          this.accessAllModuleTitlesFr = []
          this.accessIncorrectModulesTitlesFr = []
          this.accessSuggestedModuleTitlesFr = []
          this.correctModuleTitlesFr = []
          this.completionAllModuleTitlesFr = []
          this.completionIncorrectModulesTitlesFr = []
          this.completionSuggestedModuleTitlesFr = []
        })
      }).catch(e => {
        this.$toast.open({
          message: e,
          type: 'is-danger'
        })
      })
    }
  },
  mounted () {
    axios.get('/api/correct-titles').then(response => {
      this.correctModuleTitlesFr = response.data
      this.fuse = new Fuse(this.correctModuleTitlesFr, this.fuseOptions)
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
