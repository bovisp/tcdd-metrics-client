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
      maxDate: new Date(),
      minDates: []
    }
  },

  methods: {
    async submit (e) {
      // foreach selectedReport, if datepicker end date is before min date with key = selectedReport's id, error msg
      let invalidEndDate = false
      this.selectedReports.forEach(r => {
        let reportMinDate = this.minDates.filter(d => d[r.id])[0]
        if (this.endDate < reportMinDate[Object.keys(reportMinDate)[0]]) { this.toast('dark', `Error: end date is before minimum date for ${r.name}.`) }
        invalidEndDate = true
      })
      if (invalidEndDate === true) { return }
      if (!this.selectedReports.length || !this.startDate || !this.endDate) {
        this.toast('dark', 'Please select a start date, end date and report.')
        return
      }
      if (this.startDate > this.endDate) {
        this.toast('dark', 'The start date must be before the end date.')
        return
      }
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
    axios.get('api/reports/minDateTimestamps').then(response => {
      this.minDates = response.data.map(d => {
        d[Object.keys(d)[0]] = new Date(d[Object.keys(d)[0]] * 1000) // multiplies timestamp by 1000 for milliseconds and converts to date
        return d
      })
    })
  }
}
</script>
