<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-half is-offset-one-quarter">
          <div id="app">
            <form>
              <b-tabs size="is-medium" v-model="activeTab">
                <b-tab-item label="Metadata">
              <div class="field">
                <p class="control">
                  <label class="label">Languages (English)</label>
                  <vSelect multiple v-model="languagesEn" :options="['English','French']" />
                </p>
              </div>

              <div class="field">
                <p class="control">
                  <label class="label">Languages (French)</label>
                  <vSelect multiple v-model="languagesFr" :options="['Anglais','Français']" />
                </p>
              </div>

              <b-field label="Publish date">
                <b-datepicker placeholder="Click to select..." icon="calendar-today" v-model="publishDate">
                </b-datepicker>
              </b-field>

              <div class="field">
                <p class="control">
                  <label class="label">Presenters</label>
                  <vSelect multiple v-model="presenters" taggable />
                </p>
              </div>

              <div class="field">
                <p class="control">
                  <label class="label">Keywords (English)</label>
                  <vSelect multiple v-model="keywordsEn" taggable />
                </p>
              </div>

              <div class="field">
                <p class="control">
                  <label class="label">Keywords (French)</label>
                  <vSelect multiple v-model="keywordsFr" taggable />
                </p>
              </div>

              <div class="field">
                <label class="label">Minimum estimated time</label><hr style="margin: .5rem 0">
                <div class="columns">
                  <p class="control column">
                    <label class="label">Days</label>
                    <input class="input" type="number" v-model="minEstimatedTime.days">
                  </p>
                  <p class="control column">
                    <label class="label">Hours</label>
                    <input class="input" type="number" v-model="minEstimatedTime.hours">
                  </p>
                  <p class="control column">
                    <label class="label">Minutes</label>
                    <input class="input" type="number" v-model="minEstimatedTime.minutes">
                  </p>
                </div>
              </div>

              <div class="field" v-if="!reqMaxEstimatedTime">
                <p class="control">
                  <button class="button is-text" @click.prevent="reqMaxEstimatedTime = true">Enter max estimated time</button>
                </p>
              </div>

              <div class="field" v-if="reqMaxEstimatedTime">
                <label class="label">Maximum estimated time</label><hr style="margin: .5rem 0">
                <div class="columns">
                  <p class="control column">
                    <label class="label">Days</label>
                    <input class="input" type="number" v-model="maxEstimatedTime.days">
                  </p>
                  <p class="control column">
                    <label class="label">Hours</label>
                    <input class="input" type="number" v-model="maxEstimatedTime.hours">
                  </p>
                  <p class="control column">
                    <label class="label">Minutes</label>
                    <input class="input" type="number" v-model="maxEstimatedTime.minutes">
                  </p>
                </div>
              </div>
              </b-tab-item>
                <b-tab-item label="Objectives">
              <label class="label">Objectives (English)</label>
              <div class="field" v-for="(objective, index) in objectivesEn">
                <p class="control">
                  <input class="input" type="text" v-model="objectivesEn[index]">
                </p>
              </div>

              <label class="label">Objectives (French)</label>
              <div class="field" v-for="(objective, index) in objectivesFr">
                <p class="control">
                  <input class="input" type="text" v-model="objectivesFr[index]">
                </p>
              </div>

              <div class="field">
                <p class="control">
                  <button class="button is-text" @click.prevent="addMoreObjectives">Add more objectives</button>
                </p>
              </div>

                  </b-tab-item>
                <b-tab-item label="Description">
                  <label class="label">Description (English)</label>
                  <div class="field">
                    <p class="control">
                      <textarea class="textarea" v-model="descriptionEn"></textarea>
                    </p>
                  </div>
                  <label class="label">Description (French)</label>
                  <div class="field">
                    <p class="control">
                      <textarea class="textarea" v-model="descriptionFr"></textarea>
                    </p>
                  </div>
                  </b-tab-item>
              </b-tabs>
              <div class="field">
                <p class="control">
                  <button class="button is-info" @click.prevent="submit">Submit</button>
                </p>
              </div>
            </form>

            <pre>{{ output }}</pre>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
import vSelect from 'vue-select'
import moment from 'moment'

moment.locale('fr', {
  months: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
  monthsShort: 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
  monthsParseExact: true,
  weekdays: 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
  weekdaysShort: 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
  weekdaysMin: 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd D MMMM YYYY HH:mm'
  },
  calendar: {
    sameDay: '[Aujourd’hui à] LT',
    nextDay: '[Demain à] LT',
    nextWeek: 'dddd [à] LT',
    lastDay: '[Hier à] LT',
    lastWeek: 'dddd [dernier à] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'dans %s',
    past: 'il y a %s',
    s: 'quelques secondes',
    m: 'une minute',
    mm: '%d minutes',
    h: 'une heure',
    hh: '%d heures',
    d: 'un jour',
    dd: '%d jours',
    M: 'un mois',
    MM: '%d mois',
    y: 'un an',
    yy: '%d ans'
  },
  dayOfMonthOrdinalParse: /\d{1,2}(er|e)/,
  ordinal: function (number) {
    return number + (number === 1 ? 'er' : 'e')
  },
  meridiemParse: /PD|MD/,
  isPM: function (input) {
    return input.charAt(0) === 'M'
  },
  // In case the meridiem units are not separated around 12, then implement
  // this function (look at locale/id.js for an example).
  // meridiemHour : function (hour, meridiem) {
  //     return /* 0-23 hour, given meridiem token and hour 1-12 */ ;
  // },
  meridiem: function (hours, minutes, isLower) {
    return hours < 12 ? 'PD' : 'MD'
  },
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // Used to determine first week of the year.
  }
})

export default {
  components: {
    vSelect
  },
  data () {
    return {
      activeTab: 0,
      languagesEn: [],
      languagesFr: [],
      keywordsEn: [],
      keywordsFr: [],
      publishDate: '',
      presenters: [],
      output: '',
      minEstimatedTime: {
        days: null,
        hours: null,
        minutes: null
      },
      maxEstimatedTime: {
        days: null,
        hours: null,
        minutes: null
      },
      reqMaxEstimatedTime: false,
      objectivesEn: ['', '', ''],
      objectivesFr: ['', '', ''],
      descriptionEn: '',
      descriptionFr: ''
    }
  },
  computed: {

  },
  watch: {

  },
  methods: {
    addMoreObjectives () {
      this.objectivesEn.push(...['', '', ''])
      this.objectivesFr.push(...['', '', ''])
    },

    submit () {
      // english
      this.output = `{mlang en}\n`

      if (this.languagesEn.length) {
        this.output += `<div id="language">\n`
        this.output += `  <span class="name">Language</span>: `
        this.output += `<span class="value">${this.outputList(this.languagesEn)}</span>\n`
        this.output += `</div>\n`
      }

      if (this.publishDate !== '') {
        this.output += `<div id="datecreated">\n`
        this.output += `  <span class="name">Published</span>: `
        this.output += `<span class="value">${this.getPublishDate('en', this.publishDate)}</span>\n`
        this.output += `</div>\n`
      }

      if (this.presenters.length) {
        this.output += `<div id="presenters">\n`
        this.output += `  <span class="name">Presenters</span>: `
        this.output += `<span class="value">${this.outputList(this.presenters)}</span>\n`
        this.output += `</div>\n`
      }

      if (this.keywordsEn.length) {
        this.output += `<div id="keywords">\n`
        this.output += `  <span class="name">Keywords</span>: `
        this.output += `<span class="value">${this.outputList(this.keywordsEn)}</span>\n`
        this.output += `</div>\n`
      }

      if (this.minEstimatedTime.days > 0 || this.minEstimatedTime.hours > 0 || this.minEstimatedTime.minutes > 0) {
        this.output += this.getEstimatedTime('en')
      }

      if (this.objectivesEn.some(o => o !== '')) {
        this.output += this.getObjectives('en')
      }

      if (this.descriptionEn !== '') {
        this.output += `<div id="description">Description</div>\n`
        this.output += `<div id="description-content">${this.descriptionEn}</div>\n`
      }

      this.output += `{mlang}\n\n`
      // end english
      // french
      this.output += `{mlang fr}\n`

      if (this.languagesFr.length) {
        this.output += `<div id="language">\n`
        this.output += `  <span class="name">Langue</span>: `
        this.output += `<span class="value">${this.outputList(this.languagesFr)}</span>\n`
        this.output += `</div>\n`
      }

      if (this.publishDate !== '') {
        this.output += `<div id="datecreated">\n`
        this.output += `  <span class="name">Date de publication</span>: `
        this.output += `<span class="value">${this.getPublishDate('fr', this.publishDate)}</span>\n`
        this.output += `</div>\n`
      }

      if (this.presenters.length) {
        this.output += `<div id="presenters">\n`
        this.output += `  <span class="name">Présentatrices</span>: `
        this.output += `<span class="value">${this.outputList(this.presenters)}</span>\n`
        this.output += `</div>\n`
      }

      if (this.keywordsFr.length) {
        this.output += `<div id="keywords">\n`
        this.output += `  <span class="name">Mots-clés</span>: `
        this.output += `<span class="value">${this.outputList(this.keywordsFr)}</span>\n`
        this.output += `</div>\n`
      }

      if (this.minEstimatedTime.days > 0 || this.minEstimatedTime.hours > 0 || this.minEstimatedTime.minutes > 0) {
        this.output += this.getEstimatedTime('fr')
      }

      if (this.objectivesFr.some(o => o !== '')) {
        this.output += this.getObjectives('fr')
      }

      if (this.descriptionFr !== '') {
        this.output += `<div id="description">Description</div>\n`
        this.output += `<div id="description-content">${this.descriptionFr}</div>\n`
      }

      this.output += `{mlang}`
      // end french
    },

    getObjectives (lang) {
      let output = ''
      if (lang === 'fr') {
        output += `<div id="objectives">Objectifs</div>\n`
        output += `<div id="objectives-content">\n`
        output += `<ul>\n`
        this.objectivesFr.forEach(o => {
          if (o !== '') {
            output += `  <li>`
            output += `${o}`
            output += `</li>\n`
          }
        })
        output += `</ul>\n`
        output += `</div>\n`
        return output
      }
      output += `<div id="objectives">Objectives</div>\n`
      output += `<div id="objectives-content">\n`
      output += `<ul>\n`
      this.objectivesEn.forEach(o => {
        if (o !== '') {
          output += `  <li>`
          output += `${o}`
          output += `</li>\n`
        }
      })
      output += `</ul>\n`
      output += `</div>\n`

      return output
    },

    getEstimatedTime (lang) {
      let output = `<div id="estimatedtime">\n`
      if (lang === 'fr') {
        output += `  <span class="name">Durée estimée</span>: `
        output += `<span class="value">`
        if (this.minEstimatedTime.days > 0) {
          if (this.minEstimatedTime.days == 1) { output += `${this.minEstimatedTime.days} jour ` } else { output += `${this.minEstimatedTime.days} jours ` }
        }
        if (this.minEstimatedTime.hours > 0) { output += `${this.minEstimatedTime.hours} h ` }
        if (this.minEstimatedTime.minutes > 0) {
          if (this.minEstimatedTime.days < 1 && this.minEstimatedTime.hours < 1) { output += `${this.minEstimatedTime.minutes} minutes ` } else { output += `${this.minEstimatedTime.minutes} ` }
        }
        if (this.maxEstimatedTime.days > 0 || this.maxEstimatedTime.hours > 0 || this.maxEstimatedTime.minutes > 0) {
          output += `&agrave; `
          if (this.maxEstimatedTime.days > 0) {
            if (this.maxEstimatedTime.days == 1) { output += `${this.maxEstimatedTime.days} jour ` } else { output += `${this.maxEstimatedTime.days} jours ` }
          }
          if (this.maxEstimatedTime.hours > 0) { output += `${this.maxEstimatedTime.hours} h ` }
          if (this.maxEstimatedTime.minutes > 0) {
            if (this.maxEstimatedTime.days < 1 && this.maxEstimatedTime.hours < 1) { output += `${this.maxEstimatedTime.minutes} minutes ` } else { output += `${this.maxEstimatedTime.minutes} ` }
          }
        }
        output = output.trimEnd()
        output += `</span>\n`
        output += `</div>\n`
        return output
      }
      output += `  <span class="name">Estimated time to complete</span>: `
      output += `<span class="value">`
      if (this.minEstimatedTime.days > 0) { output += `${this.minEstimatedTime.days}d ` }
      if (this.minEstimatedTime.hours > 0) { output += `${this.minEstimatedTime.hours}h ` }
      if (this.minEstimatedTime.minutes > 0) { output += `${this.minEstimatedTime.minutes}m ` }
      if (this.maxEstimatedTime.days > 0 || this.maxEstimatedTime.hours > 0 || this.maxEstimatedTime.minutes > 0) {
        output += `- `
        if (this.maxEstimatedTime.days > 0) { output += `${this.maxEstimatedTime.days}d ` }
        if (this.maxEstimatedTime.hours > 0) { output += `${this.maxEstimatedTime.hours}h ` }
        if (this.maxEstimatedTime.minutes > 0) { output += `${this.maxEstimatedTime.minutes}m ` }
      }
      output = output.trimEnd()
      output += `</span>\n`
      output += `</div>\n`
      return output
    },

    outputList (arr) {
      let string = ''

      arr.forEach((item, index) => {
        if (index !== arr.length - 1) {
          string += item + ', '
        } else {
          string += item
        }
      })

      return string
    },

    getPublishDate (lang, date) {
      moment.locale(lang)

      return lang === 'en' ? moment(date).format('MMMM D, YYYY') : moment(date).format('D MMMM, YYYY')
    }
  }
}
</script>

<style scoped>
  .tab-content {
    border-left: 1px solid #dbdbdb;
    border-right: 1px solid #dbdbdb;
    border-bottom: 1px solid #dbdbdb;
    border-radius: 5px;
  }
</style>
