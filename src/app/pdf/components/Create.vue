<template>
  <section>
    <div class="field">
        <button class="button is-link">Print</button>
        <div class="columns">
          <div class="column">
            <Chart :chartData="totalCometAccesses" @chart:print="handlePrint" :options="chartOptions"></Chart>
            <Chart :chartData="top5CometAccesses" @chart:print="handlePrint" :options="chartOptions"></Chart>
          </div>
          <div class="column">
            <Chart :chartData="totalCometCompletions" @chart:print="handlePrint" :options="chartOptions"></Chart>
            <Chart :chartData="top5CometCompletions" @chart:print="handlePrint" :options="chartOptions"></Chart>
          </div>
        </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
import Chart from '@/app/pdf/components/Chart'
import * as jsPDF from 'jspdf/dist/jspdf.debug'

export default {
  components: {
    Chart
  },
  data () {
    return {
      rawCometAccesses: {},
      rawCometCompletions: {},
      totalCometCompletions: {},
      top5CometCompletions: {},
      totalCometAccesses: {},
      top5CometAccesses: {},
      errors: {},
      chartData: {
        labels: ["Course A", "Course B"],
        datasets: [
          {
            label: 'English',
            backgroundColor: '#f87979',
            data: [50, 40]
          }, {
            label: 'French',
            backgroundColor: '#g87999',
            data: [45, 35]
          }
        ]
      },
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
      // console.log(image)
      // let pdf = new jsPDF()
      // console.log(pdf)
      
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
    },
  },
  mounted () {
    axios.get('/api/reports/comet-accesses').then(response => {
      this.rawCometAccesses = Object.entries(response.data).map(x => x[1])
      let sumEnglishCometAccesses = this.rawCometAccesses.reduce((acc, curr) => acc + curr.englishCompletions,0)
      let sumFrenchCometAccesses = this.rawCometAccesses.reduce((acc, cur) => acc + cur.frenchCompletions,0)

      this.totalCometAccesses = {
        labels: ['Total Comet Accesses'],
        datasets: [
          {
            label: 'English',
            backgroundColor: '#003366',
            data: [sumEnglishCometAccesses]
          },
          {
            label: 'French',
            backgroundColor: '#8B0000',
            data: [sumFrenchCometAccesses]
          }
        ]
      }

      // top 5
      let top5CometAccesses = this.rawCometAccesses.slice(0,5)
      let labels = top5CometAccesses.map(row => row.englishTitle)
      let englishData = top5CometAccesses.map(row => row.englishCompletions)
      let frenchData = top5CometAccesses.map(row => row.frenchCompletions)

      this.top5CometAccesses = {
        labels: labels,
        datasets: [
          {
            label: 'English',
            backgroundColor: '#003366',
            data: englishData
          },
          {
            label: 'French',
            backgroundColor: '#8B0000',
            data: frenchData
          }
        ]
      }
    })
    axios.get('/api/reports/comet-completions').then(response => {
      this.rawCometCompletions = Object.entries(response.data).map(x => x[1])

      // total
      let sumEnglishCometCompletions = this.rawCometCompletions.reduce((acc, curr) => acc + curr.englishCompletions,0)
      let sumFrenchCometCompletions = this.rawCometCompletions.reduce((acc, cur) => acc + cur.frenchCompletions,0)

      this.totalCometCompletions = {
        labels: ['Total Comet Completions'],
        datasets: [
          {
            label: 'English',
            backgroundColor: '#003366',
            data: [sumEnglishCometCompletions]
          },
          {
            label: 'French',
            backgroundColor: '#8B0000',
            data: [sumFrenchCometCompletions]
          }
        ]
      }

      // top 5
      let top5CometCompletions = this.rawCometCompletions.slice(0,5)
      let labels = top5CometCompletions.map(row => row.englishTitle)
      let englishData = top5CometCompletions.map(row => row.englishCompletions)
      let frenchData = top5CometCompletions.map(row => row.frenchCompletions)

      this.top5CometCompletions = {
        labels: labels,
        datasets: [
          {
            label: 'English',
            backgroundColor: '#003366',
            data: englishData
          },
          {
            label: 'French',
            backgroundColor: '#8B0000',
            data: frenchData
          }
        ]
      }
    })
  }
}
</script>
