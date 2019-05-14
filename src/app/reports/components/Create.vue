<template>
  <section>
    <div class="columns is-desktop">
      <div class="column is-half is-offset-one-quarter">
        <div class="my-4">
          <b-message title="Info" type="is-info">
              Please select a start date, end date and one or more reports to generate.
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
              <b-field>
                <b-table
                  :data="reports"
                  :columns="columns"
                  :checked-rows.sync="selectedReports"
                  checkable
                  :is-row-checkable="(row) => this.validReports.includes(row)"
                  :striped="true">
                </b-table>
                <!-- <b-select multiple  native-size="2" v-model="selectedReports" placeholder="Select a report">
                  <option
                    v-for="report in reports"
                    :value="report"
                    :key="report.id">
                    {{ report.name }}
                  </option>
                </b-select> -->
              </b-field>
            </div>
          </div>
          <div class="field">
            <div class="control">
              <button class="button is-link" style="margin-bottom: 1.5rem;">Submit</button>
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
      reports: [],
      startDate: null,
      endDate: null,
      submitData: {
        reportIds: [],
        startDate: null,
        endDate: null
      },
      errors: [],
      selectedReports: [],
      maxDate: null,
      minDate: null,
      minDates: [],
      columns: [
        {
          field: 'name',
          label: 'Report'
        }
      ]
    }
  },
  computed: {
    validReports () {
      // include reports where report min date is before selected end date
      if (this.reports.length && this.minDates.length) {
        return this.reports.filter((report) => {
          let reportMinDate = this.minDates.filter(d => d[report.id])[0]
          let minDateValue = reportMinDate[Object.keys(reportMinDate)[0]]
          return minDateValue <= this.endDate
        })
      }
      return []
    }
  },
  watch: {
    validReports: function (val) {
      if (val.length) {
        this.reports.forEach(r => {
          r.name = r.name.replace(' (no data)', '')
          if (!val.includes(r)) { r.name = r.name + ' (no data)' }
        })
        this.selectedReports = this.selectedReports.filter(sr => val.includes(sr))
      }
    }
  },
  methods: {
    submit (e) {
      if (!this.selectedReports.length) {
        this.toast('dark', 'Please select one or more reports.')
        return
      }
      if (this.startDate >= this.endDate) {
        this.toast('dark', 'The start date must be before the end date.')
        return
      }
      this.generateValidReports()
    },
    generateValidReports () {
      // warn if any selected reports have a min date after selected start date
      let reportsToWarn = []
      let warnMessage = ''
      for (const report of this.selectedReports) {
        let reportMinDate = this.minDates.filter(d => d[report.id])[0]
        if (this.startDate < reportMinDate[Object.keys(reportMinDate)[0]]) { // gets value of first key
          reportsToWarn.push(report)
        }
      }
      if (reportsToWarn.length) {
        for (const report of reportsToWarn) {
          if (reportsToWarn.indexOf(report) === reportsToWarn.length - 1) {
            if (reportsToWarn.length === 1) {
              warnMessage += ' ' + report.name
              continue
            }
            warnMessage += ' and ' + report.name
          }
          warnMessage += ' ' + report.name + ','
        }
        this.$dialog.confirm({
          message: `Selected start date is before the minimum date for${warnMessage}. Continue?`,
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
        this.toast('danger', error.response.data)
      }
      loadingComponent.close()
      this.selectedReports = []
    },
    toast (type = 'dark', message) {
      this.$toast.open({
        type: `is-${type}`,
        message
      })
    }
  },
  mounted () {
    axios.get('/api/reports').then(response => {
      this.reports = response.data
    })
    // send mindates over in same object as reports
    axios.get('api/reports/minDateTimestamps').then(response => {
      let minDateVals = response.data.map(d => d[Object.keys(d)[0]])
      this.minDate = new Date(Math.min(...minDateVals) * 1000) // multiplies timestamp by 1000 for milliseconds and converts to date
      this.startDate = this.minDate
      this.maxDate = new Date()
      this.endDate = this.maxDate
      this.minDates = response.data.map(d => {
        d[Object.keys(d)[0]] = new Date(d[Object.keys(d)[0]] * 1000)
        return d
      })
    })
  }
}
</script>
