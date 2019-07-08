<template>
  <section>
    <div class="field">
        <button class="button is-link">Print</button>
        <div class="columns">
          <div class="column">
            <Chart :chartData="totalCometAccesses" @chart:print="handlePrint" :options="chartOptions"></Chart>
            <Chart :chartData="top5CometAccesses" @chart:print="handlePrint" :options="chartOptions"></Chart>

            <Chart :chartData="totalTPViews" @chart:print="handlePrint" :options="chartOptions"></Chart>
            <Chart :chartData="top5TPViews" @chart:print="handlePrint" :options="chartOptions"></Chart>

            <Chart :chartData="totalWebinarAttendance" @chart:print="handlePrint" :options="chartOptions"></Chart>
            <Chart :chartData="top5WebinarAttendance" @chart:print="handlePrint" :options="chartOptions"></Chart>
          </div>
          <div class="column">
            <Chart :chartData="totalCometCompletions" @chart:print="handlePrint" :options="chartOptions"></Chart>
            <Chart :chartData="top5CometCompletions" @chart:print="handlePrint" :options="chartOptions"></Chart>

            <Chart :chartData="totalTPCompletions" @chart:print="handlePrint" :options="chartOptions"></Chart>
            <Chart :chartData="top5TPCompletions" @chart:print="handlePrint" :options="chartOptions"></Chart>

            <Chart :chartData="totalWebinarViews" @chart:print="handlePrint" :options="chartOptions"></Chart>
            <Chart :chartData="top5WebinarViews" @chart:print="handlePrint" :options="chartOptions"></Chart>
          </div>
        </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
import Chart from '@/app/pdf/components/Chart'
import * as jsPDF from 'jspdf/dist/jspdf.debug'
import { orderBy, groupBy } from 'lodash'

export default {
  components: {
    Chart
  },
  data () {
    return {
      rawCometAccesses: {},
      totalCometAccesses: {},
      top5CometAccesses: {},
      rawCometCompletions: {},
      totalCometCompletions: {},
      top5CometCompletions: {},
      rawTPViews: {},
      totalTPViews: {},
      top5TPViews: {},
      rawTPCompletions: {},
      totalTPCompletions: {},
      top5TPCompletions: {},
      rawWebinarAttendance: {},
      totalWebinarAttendance: {},
      top5WebinarAttendance: {},
      totalWebinarViews: {},
      top5WebinarViews: {},
      errors: {},
      chartOptions: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            },
            stacked: true
          }],
          xAxes: [{
            stacked: true
          }]
        }
      }
    }
  },
  computed: {

  },
  watch: {

  },
  methods: {
    handlePrint (image) {
      // let pdf = new jsPDF()

      // setTimeout(() => {
      //   pdf.addImage(image, 0, 0)
      //   pdf.text('Hello world!', 1, 1)
      // }, 5000)

      // setTimeout(() => {
      //   pdf.addImage(image, 10, 10, 100, 100)
      // }, 5000)
      // setTimeout(() => {
      //   pdf.save('output.pdf')
      // }, 10000)

      // const win = window.open('', 'Print', 'height=600, width=800')
      // win.document.write(`<br><img src='${image}' />`)
      // setTimeout(win.print, 3000)
      // setTimeout(win.close, 4000)

    },
    submit () {
      // let data = {}
      // data.language_id = this.selectedLanguage.id
      // axios({
      //   method: 'post',
      //   url: '/api/generate-pdf',
      //   responseType: 'blob',
      //   data: data
      // }).then(function (response) {
      //   let link = document.createElement('a')
      //   link.href = window.URL.createObjectURL(response.data)
      //   link.download = data.language_id === 1 ? 'catalog_en.pdf' : 'catalog_fr.pdf'
      //   link.click()
      // })
    }
  },
  mounted () {
    axios.get('/api/reports/comet-accesses').then(response => {
      this.rawCometAccesses = Object.entries(response.data).map(x => x[1])
      this.rawCometAccesses = orderBy(this.rawCometAccesses, ['totalCompletions'], ['desc'])

      // total
      let sumEnglishCometAccesses = this.rawCometAccesses.reduce((acc, curr) => acc + curr.englishCompletions, 0)
      let sumFrenchCometAccesses = this.rawCometAccesses.reduce((acc, curr) => acc + curr.frenchCompletions, 0)

      this.totalCometAccesses = {
        labels: ['Total COMET Modules Accessed'],
        datasets: [
          {
            label: 'English',
            backgroundColor: '#C80815',
            data: [sumEnglishCometAccesses]
          },
          {
            label: 'French',
            backgroundColor: '#318CE7',
            data: [sumFrenchCometAccesses]
          }
        ]
      }

      // top 5
      let top5CometAccesses = this.rawCometAccesses.slice(0, 5)
      let labels = top5CometAccesses.map(row => row.englishTitle)
      let englishData = top5CometAccesses.map(row => row.englishCompletions)
      let frenchData = top5CometAccesses.map(row => row.frenchCompletions)

      this.top5CometAccesses = {
        labels: labels,
        datasets: [
          {
            label: 'English',
            backgroundColor: '#C80815',
            data: englishData
          },
          {
            label: 'French',
            backgroundColor: '#318CE7',
            data: frenchData
          }
        ]
      }
    })
    axios.get('/api/reports/comet-completions').then(response => {
      this.rawCometCompletions = Object.entries(response.data).map(x => x[1])
      this.rawCometCompletions = orderBy(this.rawCometCompletions, ['totalCompletions'], ['desc'])

      // total
      let sumEnglishCometCompletions = this.rawCometCompletions.reduce((acc, curr) => acc + curr.englishCompletions, 0)
      let sumFrenchCometCompletions = this.rawCometCompletions.reduce((acc, curr) => acc + curr.frenchCompletions, 0)

      this.totalCometCompletions = {
        labels: ['Total COMET Modules Quizzed'],
        datasets: [
          {
            label: 'English',
            backgroundColor: '#C80815',
            data: [sumEnglishCometCompletions]
          },
          {
            label: 'French',
            backgroundColor: '#318CE7',
            data: [sumFrenchCometCompletions]
          }
        ]
      }

      // top 5
      let top5CometCompletions = this.rawCometCompletions.slice(0, 5)
      let labels = top5CometCompletions.map(row => row.englishTitle)
      let englishData = top5CometCompletions.map(row => row.englishCompletions)
      let frenchData = top5CometCompletions.map(row => row.frenchCompletions)

      this.top5CometCompletions = {
        labels: labels,
        datasets: [
          {
            label: 'English',
            backgroundColor: '#C80815',
            data: englishData
          },
          {
            label: 'French',
            backgroundColor: '#318CE7',
            data: frenchData
          }
        ]
      }
    })

    axios.get('/api/reports/tp-views').then(response => {
      this.rawTPViews = Object.entries(response.data).map(x => x[1])
      this.rawTPViews = orderBy(this.rawTPViews, ['views'], ['desc'])

      // total
      let sumTPViews = this.rawTPViews.reduce((acc, curr) => acc + curr.views, 0)
      
      let rawWebinarViews = this.rawTPViews.filter(row => row.english_category_name.toLowerCase() === `stay connected`)
      let sumWebinarViews = rawWebinarViews.reduce((acc, curr) => acc + curr.views, 0)

      this.totalTPViews = {
        labels: ['Total Training Portal Courses Accessed'],
        datasets: [
          {
            label: 'Total',
            backgroundColor: '#7D4A7E',
            data: [sumTPViews]
          }
        ]
      }

      this.totalWebinarViews = {
        labels: ['Total Webinar Views'],
        datasets: [
          {
            label: 'Total',
            backgroundColor: '#7D4A7E',
            data: [sumWebinarViews]
          }
        ]
      }

      // top 5
      let top5TPViews = this.rawTPViews.slice(0, 5)
      let labels = top5TPViews.map(row => row.english_course_name)
      let data = top5TPViews.map(row => row.views)

      this.top5TPViews = {
        labels: labels,
        datasets: [
          {
            label: 'Total',
            backgroundColor: '#7D4A7E',
            data: data
          }
        ]
      }

      let top5WebinarViews = rawWebinarViews.slice(0, 5)
      let labelsWeb = top5WebinarViews.map(row => row.english_course_name)
      let dataWeb = top5WebinarViews.map(row => row.views)

      this.top5WebinarViews = {
        labels: labelsWeb,
        datasets: [
          {
            label: 'Total',
            backgroundColor: '#7D4A7E',
            data: dataWeb
          }
        ]
      }
    })

    axios.get('/api/reports/tp-completions').then(response => {
      this.rawTPCompletions = Object.entries(response.data).map(x => x[1])
      this.rawTPCompletions = orderBy(this.rawTPCompletions, ['completions'], ['desc'])

      // total
      let sumEnglishTPCompletions = this.rawTPCompletions.filter(x => x.Language && x.Language.toLowerCase() === 'english')
        .reduce((acc, curr) => acc + curr.completions, 0)
      let sumFrenchTPCompletions = this.rawTPCompletions.filter(x => x.Language && x.Language.toLowerCase() === 'french')
        .reduce((acc, curr) => acc + curr.completions, 0)
      let sumTPCompletionsNullLang = this.rawTPCompletions.filter(x => !x.Language)
        .reduce((acc, curr) => acc + curr.completions, 0)

      this.totalTPCompletions = {
        labels: ['Total Training Portal Courses Completed'],
        datasets: [
          {
            label: 'English',
            backgroundColor: '#C80815',
            data: [sumEnglishTPCompletions]
          },
          {
            label: 'French',
            backgroundColor: '#318CE7',
            data: [sumFrenchTPCompletions]
          },
          {
            label: 'Undefined',
            backgroundColor: '#7D4A7E',
            data: [sumTPCompletionsNullLang]
          }
        ]
      }

      // top 5
      let groupedTPCompletions = groupBy(this.rawTPCompletions, 'Course Id')

      groupedTPCompletions = orderBy(groupedTPCompletions, [row => {
        if (row[1]) { return row[0].completions + row[1].completions }
        return row[0].completions
      }], 'desc')

      let top5TPCompletions = groupedTPCompletions.slice(0, 5)
      let labels = top5TPCompletions.map(row => row[0].english_course_name)

      let englishData = top5TPCompletions.map(row => {
        let englishCourse = row.filter(x => x.Language && x.Language.toLowerCase() === 'english')
        if (englishCourse.length) { return englishCourse[0].completions }
        return 0
      })

      let frenchData = top5TPCompletions.map(row => {
        let frenchCourse = row.filter(x => x.Language && x.Language.toLowerCase() === 'french')
        if (frenchCourse.length) { return frenchCourse[0].completions }
        return 0
      })

      let nullLangData = top5TPCompletions.map(row => {
        let nullLangCourse = row.filter(x => !x.Language)
        if (nullLangCourse.length) { return nullLangCourse[0].completions }
        return 0
      })

      this.top5TPCompletions = {
        labels: labels,
        datasets: [
          {
            label: 'English',
            backgroundColor: '#C80815',
            data: englishData
          },
          {
            label: 'French',
            backgroundColor: '#318CE7',
            data: frenchData
          },
          {
            label: 'Undefined',
            backgroundColor: '#7D4A7E',
            data: nullLangData
          }
        ]
      }
    })

    axios.get('/api/webinar-attendance').then(response => {
      this.rawWebinarAttendance = response.data
      // total
      let sumEnglishAttendance = this.rawWebinarAttendance.filter(x => x.language_name && x.language_name.toLowerCase() === 'english')
        .reduce((acc, curr) => acc + curr.attendees, 0)
      let sumFrenchAttendance = this.rawWebinarAttendance.filter(x => x.language_name && x.language_name.toLowerCase() === 'french')
        .reduce((acc, curr) => acc + curr.attendees, 0)

      this.totalWebinarAttendance = {
        labels: ['Total Stay Connected Webinars Live Attendance (# Participants)'],
        datasets: [
          {
            label: 'English',
            backgroundColor: '#C80815',
            data: [sumEnglishAttendance]
          },
          {
            label: 'French',
            backgroundColor: '#318CE7',
            data: [sumFrenchAttendance]
          }
        ]
      }

      // top 5
      let groupedData = Object.values(groupBy(response.data, 'course_id'))
      groupedData = orderBy(groupedData, [row => {
        if (row[1]) { return row[0].attendees + row[1].attendees }
        return row[0].attendees
      }], 'desc')

      let top5Attendance = groupedData.slice(0, 5)
      let webinarAttendance = top5Attendance.map(webinar => {
        return {
          fullname: webinar[0].english_course_name,
          english_attendees: webinar.filter(x => x.language_name.toLowerCase() === 'english')[0]
            ? webinar.filter(x => x.language_name.toLowerCase() === 'english')[0].attendees : 'undefined',
          french_attendees: webinar.filter(x => x.language_name.toLowerCase() === 'french')[0]
            ? webinar.filter(x => x.language_name.toLowerCase() === 'french')[0].attendees : 'undefined'
        }
      })
      let labels = webinarAttendance.map(x => x.fullname)
      let englishData = webinarAttendance.map(x => x.english_attendees)
      let frenchData = webinarAttendance.map(x => x.french_attendees)

      this.top5WebinarAttendance = {
        labels: labels,
        datasets: [
          {
            label: 'English',
            backgroundColor: '#C80815',
            data: englishData
          },
          {
            label: 'French',
            backgroundColor: '#318CE7',
            data: frenchData
          }
        ]
      }
    })
  }
}
</script>
