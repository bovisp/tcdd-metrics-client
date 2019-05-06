<template>
  <section class="section">
    <div class="columns is-desktop">
      <div class="column is-half is-offset-one-quarter">
        <div class="my-4">
          <b-message title="Info" type="is-info">
              Please select a start date, end date and report(s) to generate.
          </b-message>
        </div>
        <form v-on:submit.prevent="submit">
          <div class="field">
            <div class="control">
              <b-field label="Start date">
                <b-datepicker
                  v-model="startDate"
                  :minDate="minDate"
                  :max-date="maxDate"
                  placeholder="Click to select..."
                  icon="calendar-today">
                </b-datepicker>
              </b-field>
            </div>
          </div>
          <div class="field">
            <div class="control">
              <b-field label="End date">
                <b-datepicker
                  v-model="endDate"
                  :minDate="minDate"
                  :max-date="maxDate"
                  placeholder="Click to select..."
                  icon="calendar-today">
                </b-datepicker>
              </b-field>
            </div>
          </div>
          <div class="field">
            <div class="control">
              <b-field label="Reports">
                <b-select multiple  native-size="2" v-model="selectedReports" placeholder="Select a report">
                  <option
                    v-for="report in reports"
                    :value="report"
                    :key="report.id">
                    {{ report.name }}
                  </option>
                </b-select>
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
import { pull } from 'lodash'

export default {
  data () {
    return {
      reports: [],
      startDate: null,
      endDate: null,
      submitData: {
        reportIds: [],
        startDate: null,
        endDate: null
      },
      selectedReports: [],
      maxDate: null,
      minDate: null,
      minDates: []
    }
  },

  methods: {
    submit (e) {
      if (!this.selectedReports.length || !this.startDate || !this.endDate) {
        this.toast('dark', 'Please select a start date, end date and report.')
        return
      }
      if (this.startDate > this.endDate) {
        this.toast('dark', 'The start date must be before the end date.')
        return
      }
      this.generateValidReports()
    },
    generateValidReports () {
      let reportsToRemove = []
      for (const report of this.selectedReports) {
        let reportMinDate = this.minDates.filter(d => d[report.id])[0]
        console.log(reportMinDate)
        if (this.endDate < reportMinDate[Object.keys(reportMinDate)[0]]) { // gets value of first key
          reportsToRemove.push(report)
        }
      }
      let reportMessage = ''
      if (reportsToRemove.length > 0) {
        for (const reportToRemove of reportsToRemove) {
          pull(this.selectedReports, reportToRemove)
          if (reportsToRemove.indexOf(reportToRemove) === reportsToRemove.length - 1) {
            if (reportsToRemove.length === 1) {
              reportMessage += ' ' + reportToRemove.name
              continue
            }
            reportMessage += ' and ' + reportToRemove.name
            continue
          }
          reportMessage += ' ' + reportToRemove.name + ','
        }
        this.$dialog.confirm({
          message: `Selected end date is before the minimum date for${reportMessage}. These reports will not be included. Continue without those reports?`,
          type: 'is-danger',
          onConfirm: () => {
            this.generateReport()
          }
        })
        return
      }
      this.generateReport()
    },
    async generateReport () {
      this.submitData.reportIds = this.selectedReports.map(r => r.id)
      this.submitData.startDate = this.startDate
      this.submitData.endDate = this.endDate

      const loadingComponent = this.$loading.open()
      try {
        let response = await axios.post('/api/reports', this.submitData)
        this.toast('success', response.data)
      } catch (error) {
        this.toast('danger', error.response.data.message)
      }
      loadingComponent.close()
      this.refreshForm()
    },
    refreshForm () {
      this.selectedReports = []
      this.reportsToRemove = []
    },
    toast (type = 'dark', message) {
      this.$toast.open({
        type: `is-${type}`,
        message
      })
    }
  },
  mounted () {
    this.maxDate = new Date()
    axios.get('/api/reports').then(response => {
      this.reports = response.data
    })
    // send mindates over in same object as reports
    axios.get('api/reports/minDateTimestamps').then(response => {
      let minDateVals = response.data.map(d => d[Object.keys(d)[0]])
      this.minDate = new Date(Math.min(...minDateVals) * 1000) // multiplies timestamp by 1000 for milliseconds and converts to date
      this.minDates = response.data.map(d => {
        d[Object.keys(d)[0]] = new Date(d[Object.keys(d)[0]] * 1000)
        return d
      })
    })
  }
}
</script>
