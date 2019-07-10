<template>
  <section>
    <div class="field">
        <button class="button is-link" @click.prevent="download">Download</button>
        <b-tabs v-model="activeTab">
          <b-tab-item label="English">
        <div class="columns">
          <div class="column">
            <Chart :chartData="totalEnglishCometAccesses" @chart:print="console.log('here')" :options="{...chartOptions, title: { display: true, text: 'Total COMET Modules Accessed (# Visits)' } }"></Chart>
            <Chart :chartData="top5EnglishCometAccesses" @print="handlePrint" :options="{...chartOptions, title: { display: true, text: 'Top 5 COMET Modules Accessed (# Visits)' } }"></Chart>

            <Chart :chartData="totalEnglishTrainingPortalViews" @print="handlePrint" :options="{...chartOptions, title: { display: true, text: 'Total Training Portal Courses Accessed (# Visits)' } }"></Chart>
            <Chart :chartData="top5EnglishTrainingPortalViews" @print="handlePrint" :options="{...chartOptions, title: { display: true, text: 'Top 5 Training Portal Courses Accessed (# Visits)' } }"></Chart>

            <Chart :chartData="totalEnglishWebinarAttendance" @print="handlePrint" :options="{...chartOptions, title: { display: true, text: 'Total Stay Connected Webinars Live Attendance (# Participants)' } }"></Chart>
            <Chart :chartData="top5EnglishWebinarAttendance" @print="handlePrint" :options="{...chartOptions, title: { display: true, text: 'Top 5 Stay Connected Webinars Live Attendance (# Participants)' } }"></Chart>
          </div>
          <div class="column">
            <Chart :chartData="totalEnglishCometCompletions" @print="handlePrint" :options="{...chartOptions, title: { display: true, text: 'Total COMET Modules Quizzed (# Quizzes)' } }"></Chart>
            <Chart :chartData="top5EnglishCometCompletions" @print="handlePrint" :options="{...chartOptions, title: { display: true, text: 'Top 5 COMET Modules Quizzed (# Quizzes)' } }"></Chart>

            <Chart :chartData="totalEnglishTrainingPortalCompletions" @print="handlePrint" :options="{...chartOptions, title: { display: true, text: 'Total Training Portal Courses Completed (# Completions)' } }"></Chart>
            <Chart :chartData="top5EnglishTrainingPortalCompletions" @print="handlePrint" :options="{...chartOptions, title: { display: true, text: 'Top 5 Training Portal Courses Completed (# Completions)' } }"></Chart>

            <Chart :chartData="totalEnglishWebinarViews" @print="handlePrint" :options="{...chartOptions, title: { display: true, text: 'Total Stay Connected Webinars Training Portal Access (# Visits)' } }"></Chart>
            <Chart :chartData="top5EnglishWebinarViews" @print="handlePrint" :options="{...chartOptions, title: { display: true, text: 'Top 5 Stay Connected Webinars Training Portal Access (# Visits)' } }"></Chart>
          </div>
        </div>

          </b-tab-item>
          <b-tab-item label="French">
            <div class="columns">
              <div class="column">
                <Chart :chartData="totalFrenchCometAccesses" @chart:print="console.log('here')" :options="{...chartOptions, title: { display: true, text: 'Nombre total de modules COMET fréquentés (# visiteurs)' } }"></Chart>
                <Chart :chartData="top5FrenchCometAccesses" @print="handlePrint" :options="{...chartOptions, title: { display: true, text: 'Les 5 modules COMET les plus fréquentés (# visiteurs)' } }"></Chart>

                <Chart :chartData="totalFrenchTrainingPortalViews" @print="handlePrint" :options="{...chartOptions, title: { display: true, text: 'Nombre total de cours du portail de formation fréquentés (# visiteurs)' } }"></Chart>
                <Chart :chartData="top5FrenchTrainingPortalViews" @print="handlePrint" :options="{...chartOptions, title: { display: true, text: 'Les 5 cours du portail de formation les plus fréquentés (# visiteurs)' } }"></Chart>

                <Chart :chartData="totalFrenchWebinarAttendance" @print="handlePrint" :options="{...chartOptions, title: { display: true, text: 'Participation totale aux webinaires Restez-Branchés en direct (# participants)' } }"></Chart>
                <Chart :chartData="top5FrenchWebinarAttendance" @print="handlePrint" :options="{...chartOptions, title: { display: true, text: 'Les 5 webinaires Restez-Branchés les plus fréquentés en direct (# participants)' } }"></Chart>
              </div>
              <div class="column">
                <Chart :chartData="totalFrenchCometCompletions" @print="handlePrint" :options="{...chartOptions, title: { display: true, text: 'Nombre total de quizz des modules COMET effectués (# quizz)' } }"></Chart>
                <Chart :chartData="top5FrenchCometCompletions" @print="handlePrint" :options="{...chartOptions, title: { display: true, text: 'Les 5 modules COMET ayant eu le plus de quizz complétés (# quizz)' } }"></Chart>

                <Chart :chartData="totalFrenchTrainingPortalCompletions" @print="handlePrint" :options="{...chartOptions, title: { display: true, text: 'Nombre total de cours du portail de formation achevés (# achèvements)' } }"></Chart>
                <Chart :chartData="top5FrenchTrainingPortalCompletions" @print="handlePrint" :options="{...chartOptions, title: { display: true, text: 'Les 5 cours du portail de formation les plus achevés (# achèvements)' } }"></Chart>

                <Chart :chartData="totalFrenchWebinarViews" @print="handlePrint" :options="{...chartOptions, title: { display: true, text: 'Participation totale aux webinaires Restez-Branchés du portail de formation (# visiteurs)' } }"></Chart>
                <Chart :chartData="top5FrenchWebinarViews" @print="handlePrint" :options="{...chartOptions, title: { display: true, text: 'Les 5 webinaires Restez-Branchés les plus fréquentés du portail de formation (# visiteurs)' } }"></Chart>
              </div>
            </div>
          </b-tab-item>

        </b-tabs>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
import Chart from '@/app/pdf/components/Chart'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import * as jsPDF from 'jspdf/dist/jspdf.debug'
import { orderBy, groupBy } from 'lodash'
import JSZip from 'jszip'

export default {
  components: {
    Chart
  },
  data () {
    return {
      activeTab: 0,
      images: [],
      totalEnglishCometAccesses: {},
      totalFrenchCometAccesses: {},
      top5EnglishCometAccesses: {},
      top5FrenchCometAccesses: {},
      totalEnglishCometCompletions: {},
      totalFrenchCometCompletions: {},
      top5EnglishCometCompletions: {},
      top5FrenchCometCompletions: {},
      totalEnglishTrainingPortalViews: {},
      totalFrenchTrainingPortalViews: {},
      top5EnglishTrainingPortalViews: {},
      top5FrenchTrainingPortalViews: {},
      totalEnglishTrainingPortalCompletions: {},
      totalFrenchTrainingPortalCompletions: {},
      top5EnglishTrainingPortalCompletions: {},
      top5FrenchTrainingPortalCompletions: {},
      totalEnglishWebinarAttendance: {},
      totalFrenchWebinarAttendance: {},
      top5EnglishWebinarAttendance: {},
      top5FrenchWebinarAttendance: {},
      totalEnglishWebinarViews: {},
      totalFrenchWebinarViews: {},
      top5EnglishWebinarViews: {},
      top5FrenchWebinarViews: {},
      errors: {},
      chartOptions: {
        plugins: {
            datalabels: {
                color: '#FFFFFF',
                anchor: 'end',
                align: 'start',
                clamp: true
            }
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            },
            stacked: true
          }],
          xAxes: [{
            ticks: {
              maxRotation: 0
            },
            stacked: true,
            maxBarThickness: 150,
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
      this.images.push(image)

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
    download () {
      let zip = new JSZip();
      zip.file("Hello.txt", "Hello World");
      zip.generateAsync({type:"blob"}).then(content => {
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(content)
        link.download = 'example.zip'
        link.click()
      })
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
    },
    getEnglishChartData () {
      // comet accesses
      axios.get('/api/reports/comet-accesses').then(response => {
        let rawCometAccesses = Object.entries(response.data).map(x => x[1])
        rawCometAccesses = orderBy(rawCometAccesses, ['totalCompletions'], ['desc'])

        // total
        let sumEnglishCometAccesses = rawCometAccesses.reduce((acc, curr) => acc + curr.englishCompletions, 0)
        let sumFrenchCometAccesses = rawCometAccesses.reduce((acc, curr) => acc + curr.frenchCompletions, 0)

        this.totalEnglishCometAccesses = {
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
        let top5EnglishCometAccesses = rawCometAccesses.slice(0, 5)
        let labels = top5EnglishCometAccesses.map(row => [[row.englishTitle.substring(0,17)],[row.englishTitle.substring(17,34)],[row.englishTitle.substring(34,51)]])
        let englishData = top5EnglishCometAccesses.map(row => {
          if(row.englishCompletions > 0)
            return row.englishCompletions
          return null
        })
        let frenchData = top5EnglishCometAccesses.map(row => {
          if(row.frenchCompletions > 0)
            return row.frenchCompletions
          return null
        })

        this.top5EnglishCometAccesses = {
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

      // comet completions
      axios.get('/api/reports/comet-completions').then(response => {
        let rawCometCompletions = Object.entries(response.data).map(x => x[1])
        rawCometCompletions = orderBy(rawCometCompletions, ['totalCompletions'], ['desc'])

        // total
        let sumEnglishCometCompletions = rawCometCompletions.reduce((acc, curr) => acc + curr.englishCompletions, 0)
        let sumFrenchCometCompletions = rawCometCompletions.reduce((acc, curr) => acc + curr.frenchCompletions, 0)

        this.totalEnglishCometCompletions = {
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
        let top5EnglishCometCompletions = rawCometCompletions.slice(0, 5)
        let labels = top5EnglishCometCompletions.map(row => [[row.englishTitle.substring(0,17)],[row.englishTitle.substring(17,34)],[row.englishTitle.substring(34,51)]])
        let englishData = top5EnglishCometCompletions.map(row => {
          if(row.englishCompletions > 0)
            return row.englishCompletions
          return null
        })
        let frenchData = top5EnglishCometCompletions.map(row => {
          if(row.frenchCompletions > 0)
            return row.frenchCompletions
          return null
        })

        this.top5EnglishCometCompletions = {
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

    // training portal views and webinar views
    axios.get('/api/reports/tp-views').then(response => {
      let rawTPViews = Object.entries(response.data).map(x => x[1])
      rawTPViews = orderBy(rawTPViews, ['views'], ['desc'])

      // total
      let sumTPViews = rawTPViews.reduce((acc, curr) => acc + curr.views, 0)

      let rawWebinarViews = rawTPViews.filter(row => row.english_category_name.toLowerCase() === `stay connected`)
      let sumWebinarViews = rawWebinarViews.reduce((acc, curr) => acc + curr.views, 0)

      this.totalEnglishTrainingPortalViews = {
        datasets: [
          {
            label: 'Total',
            backgroundColor: '#7D4A7E',
            data: [sumTPViews]
          }
        ]
      }

      this.totalEnglishWebinarViews = {
        datasets: [
          {
            label: 'Total',
            backgroundColor: '#7D4A7E',
            data: [sumWebinarViews]
          }
        ]
      }

      // top 5
      let top5EnglishTrainingPortalViews = rawTPViews.slice(0, 5)
      let labels = top5EnglishTrainingPortalViews.map(row => [[row.english_course_name.substring(0,17)],[row.english_course_name.substring(17,34)],[row.english_course_name.substring(34,51)]])
      let data = top5EnglishTrainingPortalViews.map(row => row.views)

      this.top5EnglishTrainingPortalViews = {
        labels: labels,
        datasets: [
          {
            label: 'Total',
            backgroundColor: '#7D4A7E',
            data: data
          }
        ]
      }

      let top5EnglishWebinarViews = rawWebinarViews.slice(0, 5)
      let labelsWeb = top5EnglishWebinarViews.map(row => [[row.english_course_name.substring(0,17)],[row.english_course_name.substring(17,34)],[row.english_course_name.substring(34,51)]])
      let dataWeb = top5EnglishWebinarViews.map(row => row.views)

      this.top5EnglishWebinarViews = {
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

    // training portal completions
    axios.get('/api/reports/tp-completions').then(response => {
      let rawTPCompletions = Object.entries(response.data).map(x => x[1])
      rawTPCompletions = orderBy(rawTPCompletions, ['completions'], ['desc'])

      // total
      let sumEnglishTPCompletions = rawTPCompletions.filter(x => x.Language && x.Language.toLowerCase() === 'english')
        .reduce((acc, curr) => acc + curr.completions, 0)
      let sumFrenchTPCompletions = rawTPCompletions.filter(x => x.Language && x.Language.toLowerCase() === 'french')
        .reduce((acc, curr) => acc + curr.completions, 0)
      let sumTPCompletionsNullLang = rawTPCompletions.filter(x => !x.Language)
        .reduce((acc, curr) => acc + curr.completions, 0)

      this.totalEnglishTrainingPortalCompletions = {
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
      let groupedTPCompletions = groupBy(rawTPCompletions, 'Course Id')

      groupedTPCompletions = orderBy(groupedTPCompletions, [row => {
        if (row[1]) { return row[0].completions + row[1].completions }
        return row[0].completions
      }], 'desc')

      let top5EnglishTrainingPortalCompletions = groupedTPCompletions.slice(0, 5)
      let labels = top5EnglishTrainingPortalCompletions.map(row => [[row[0].english_course_name.substring(0,17)],[row[0].english_course_name.substring(17,34)],[row[0].english_course_name.substring(34,51)]])

      let englishData = top5EnglishTrainingPortalCompletions.map(row => {
        let englishCourse = row.filter(x => x.Language && x.Language.toLowerCase() === 'english')
        if (englishCourse.length) { return englishCourse[0].completions }
        return null
      })

      let frenchData = top5EnglishTrainingPortalCompletions.map(row => {
        let frenchCourse = row.filter(x => x.Language && x.Language.toLowerCase() === 'french')
        if (frenchCourse.length) { return frenchCourse[0].completions }
        return null
      })

      let nullLangData = top5EnglishTrainingPortalCompletions.map(row => {
        let nullLangCourse = row.filter(x => !x.Language)
        if (nullLangCourse.length) { return nullLangCourse[0].completions }
        return null
      })

      this.top5EnglishTrainingPortalCompletions = {
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

    // webinar attendance
    axios.get('/api/webinar-attendance').then(response => {
      let rawWebinarAttendance = response.data

      // total
      let sumEnglishAttendance = rawWebinarAttendance.filter(x => x.language_name && x.language_name.toLowerCase() === 'english')
        .reduce((acc, curr) => acc + curr.attendees, 0)
      let sumFrenchAttendance = rawWebinarAttendance.filter(x => x.language_name && x.language_name.toLowerCase() === 'french')
        .reduce((acc, curr) => acc + curr.attendees, 0)

      this.totalEnglishWebinarAttendance = {
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
      let labels = webinarAttendance.map(row => [[row.fullname.substring(0,17)],[row.fullname.substring(17,34)],[row.fullname.substring(34,51)]])
      let englishData = webinarAttendance.map(x => x.english_attendees)
      let frenchData = webinarAttendance.map(x => x.french_attendees)

      this.top5EnglishWebinarAttendance = {
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
    },
    getFrenchChartData () {
      // comet accesses
      axios.get('/api/reports/comet-accesses').then(response => {
        let rawCometAccesses = Object.entries(response.data).map(x => x[1])
        rawCometAccesses = orderBy(rawCometAccesses, ['totalCompletions'], ['desc'])

        // total
        let sumEnglishCometAccesses = rawCometAccesses.reduce((acc, curr) => acc + curr.englishCompletions, 0)
        let sumFrenchCometAccesses = rawCometAccesses.reduce((acc, curr) => acc + curr.frenchCompletions, 0)

        this.totalFrenchCometAccesses = {
          datasets: [
            {
              label: 'Anglais',
              backgroundColor: '#C80815',
              data: [sumEnglishCometAccesses]
            },
            {
              label: 'Français',
              backgroundColor: '#318CE7',
              data: [sumFrenchCometAccesses]
            }
          ]
        }

        // top 5
        let top5FrenchCometAccesses = rawCometAccesses.slice(0, 5)
        let labels = top5FrenchCometAccesses.map(row => [[row.frenchTitle.substring(0,17)],[row.frenchTitle.substring(17,34)],[row.frenchTitle.substring(34,51)]])
        let englishData = top5FrenchCometAccesses.map(row => {
          if(row.englishCompletions > 0)
            return row.englishCompletions
          return null
        })
        let frenchData = top5FrenchCometAccesses.map(row => {
          if(row.frenchCompletions > 0)
            return row.frenchCompletions
          return null
        })

        this.top5FrenchCometAccesses = {
          labels: labels,
          datasets: [
            {
              label: 'Anglais',
              backgroundColor: '#C80815',
              data: englishData
            },
            {
              label: 'Français',
              backgroundColor: '#318CE7',
              data: frenchData
            }
          ]
        }
      })

        // comet completions
        axios.get('/api/reports/comet-completions').then(response => {
          let rawCometCompletions = Object.entries(response.data).map(x => x[1])
          rawCometCompletions = orderBy(rawCometCompletions, ['totalCompletions'], ['desc'])

          // total
          let sumEnglishCometCompletions = rawCometCompletions.reduce((acc, curr) => acc + curr.englishCompletions, 0)
          let sumFrenchCometCompletions = rawCometCompletions.reduce((acc, curr) => acc + curr.frenchCompletions, 0)

          this.totalFrenchCometCompletions = {
            datasets: [
              {
                label: 'Anglais',
                backgroundColor: '#C80815',
                data: [sumEnglishCometCompletions]
              },
              {
                label: 'Français',
                backgroundColor: '#318CE7',
                data: [sumFrenchCometCompletions]
              }
            ]
          }

          // top 5
          let top5EnglishCometCompletions = rawCometCompletions.slice(0, 5)
          let labels = top5EnglishCometCompletions.map(row => [[row.frenchTitle.substring(0,17)],[row.frenchTitle.substring(17,34)],[row.frenchTitle.substring(34,51)]])
          let englishData = top5EnglishCometCompletions.map(row => {
            if(row.englishCompletions > 0)
              return row.englishCompletions
            return null
          })
          let frenchData = top5EnglishCometCompletions.map(row => {
            if(row.frenchCompletions > 0)
              return row.frenchCompletions
            return null
          })

          this.top5FrenchCometCompletions = {
            labels: labels,
            datasets: [
              {
                label: 'Anglais',
                backgroundColor: '#C80815',
                data: englishData
              },
              {
                label: 'Français',
                backgroundColor: '#318CE7',
                data: frenchData
              }
            ]
          }
        })

      // training portal views and webinar views
      axios.get('/api/reports/tp-views').then(response => {
        let rawTPViews = Object.entries(response.data).map(x => x[1])
        rawTPViews = orderBy(rawTPViews, ['views'], ['desc'])

        // total
        let sumTPViews = rawTPViews.reduce((acc, curr) => acc + curr.views, 0)

        let rawWebinarViews = rawTPViews.filter(row => row.english_category_name.toLowerCase() === `stay connected`)
        let sumWebinarViews = rawWebinarViews.reduce((acc, curr) => acc + curr.views, 0)

        this.totalFrenchTrainingPortalViews = {
          datasets: [
            {
              label: 'Total',
              backgroundColor: '#7D4A7E',
              data: [sumTPViews]
            }
          ]
        }

        this.totalFrenchWebinarViews = {
          datasets: [
            {
              label: 'Total',
              backgroundColor: '#7D4A7E',
              data: [sumWebinarViews]
            }
          ]
        }

        // top 5
        let top5FrenchTrainingPortalViews = rawTPViews.slice(0, 5)
        let labels = top5FrenchTrainingPortalViews.map(row => [[row.french_course_name.substring(0,17)],[row.french_course_name.substring(17,34)],[row.french_course_name.substring(34,51)]])
        let data = top5FrenchTrainingPortalViews.map(row => row.views)

        this.top5FrenchTrainingPortalViews = {
          labels: labels,
          datasets: [
            {
              label: 'Total',
              backgroundColor: '#7D4A7E',
              data: data
            }
          ]
        }

        let top5FrenchWebinarViews = rawWebinarViews.slice(0, 5)
        let labelsWeb = top5FrenchWebinarViews.map(row => [[row.french_course_name.substring(0,17)],[row.french_course_name.substring(17,34)],[row.french_course_name.substring(34,51)]])
        let dataWeb = top5FrenchWebinarViews.map(row => row.views)

        this.top5FrenchWebinarViews = {
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

      // training portal completions
      axios.get('/api/reports/tp-completions').then(response => {
        let rawTPCompletions = Object.entries(response.data).map(x => x[1])
        rawTPCompletions = orderBy(rawTPCompletions, ['completions'], ['desc'])

        // total
        let sumEnglishTPCompletions = rawTPCompletions.filter(x => x.Language && x.Language.toLowerCase() === 'english')
          .reduce((acc, curr) => acc + curr.completions, 0)
        let sumFrenchTPCompletions = rawTPCompletions.filter(x => x.Language && x.Language.toLowerCase() === 'french')
          .reduce((acc, curr) => acc + curr.completions, 0)
        let sumTPCompletionsNullLang = rawTPCompletions.filter(x => !x.Language)
          .reduce((acc, curr) => acc + curr.completions, 0)

        this.totalFrenchTrainingPortalCompletions = {
          datasets: [
            {
              label: 'Anglais',
              backgroundColor: '#C80815',
              data: [sumEnglishTPCompletions]
            },
            {
              label: 'Français',
              backgroundColor: '#318CE7',
              data: [sumFrenchTPCompletions]
            },
            {
              label: 'Indéterminé',
              backgroundColor: '#7D4A7E',
              data: [sumTPCompletionsNullLang]
            }
          ]
        }

        // top 5
        let groupedTPCompletions = groupBy(rawTPCompletions, 'Course Id')

        groupedTPCompletions = orderBy(groupedTPCompletions, [row => {
          if (row[1]) { return row[0].completions + row[1].completions }
          return row[0].completions
        }], 'desc')

        let top5FrenchTrainingPortalCompletions = groupedTPCompletions.slice(0, 5)
        let labels = top5FrenchTrainingPortalCompletions.map(row => [[row[0].french_course_name.substring(0,17)],[row[0].french_course_name.substring(17,34)],[row[0].french_course_name.substring(34,51)]])

        let englishData = top5FrenchTrainingPortalCompletions.map(row => {
          let englishCourse = row.filter(x => x.Language && x.Language.toLowerCase() === 'english')
          if (englishCourse.length) { return englishCourse[0].completions }
          return null
        })

        let frenchData = top5FrenchTrainingPortalCompletions.map(row => {
          let frenchCourse = row.filter(x => x.Language && x.Language.toLowerCase() === 'french')
          if (frenchCourse.length) { return frenchCourse[0].completions }
          return null
        })

        let nullLangData = top5FrenchTrainingPortalCompletions.map(row => {
          let nullLangCourse = row.filter(x => !x.Language)
          if (nullLangCourse.length) { return nullLangCourse[0].completions }
          return null
        })

        this.top5FrenchTrainingPortalCompletions = {
          labels: labels,
          datasets: [
            {
              label: 'Anglais',
              backgroundColor: '#C80815',
              data: englishData
            },
            {
              label: 'Français',
              backgroundColor: '#318CE7',
              data: frenchData
            },
            {
              label: 'Indéterminé',
              backgroundColor: '#7D4A7E',
              data: nullLangData
            }
          ]
        }
      })

      // webinar attendance
      axios.get('/api/webinar-attendance').then(response => {
        let rawWebinarAttendance = response.data

        // total
        let sumEnglishAttendance = rawWebinarAttendance.filter(x => x.language_name && x.language_name.toLowerCase() === 'english')
          .reduce((acc, curr) => acc + curr.attendees, 0)
        let sumFrenchAttendance = rawWebinarAttendance.filter(x => x.language_name && x.language_name.toLowerCase() === 'french')
          .reduce((acc, curr) => acc + curr.attendees, 0)

        this.totalFrenchWebinarAttendance = {
          datasets: [
            {
              label: 'Anglais',
              backgroundColor: '#C80815',
              data: [sumEnglishAttendance]
            },
            {
              label: 'Français',
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
            fullname: webinar[0].french_course_name,
            english_attendees: webinar.filter(x => x.language_name.toLowerCase() === 'english')[0]
              ? webinar.filter(x => x.language_name.toLowerCase() === 'english')[0].attendees : 'undefined',
            french_attendees: webinar.filter(x => x.language_name.toLowerCase() === 'french')[0]
              ? webinar.filter(x => x.language_name.toLowerCase() === 'french')[0].attendees : 'undefined'
          }
        })
        let labels = webinarAttendance.map(row => [[row.fullname.substring(0,17)],[row.fullname.substring(17,34)],[row.fullname.substring(34,51)]])
        let englishData = webinarAttendance.map(x => x.english_attendees)
        let frenchData = webinarAttendance.map(x => x.french_attendees)

        this.top5FrenchWebinarAttendance = {
          labels: labels,
          datasets: [
            {
              label: 'Anglais',
              backgroundColor: '#C80815',
              data: englishData
            },
            {
              label: 'Français',
              backgroundColor: '#318CE7',
              data: frenchData
            }
          ]
        }
      })
    }
  },
  mounted () {
    this.getEnglishChartData()
    this.getFrenchChartData()

    
  }
}
</script>
