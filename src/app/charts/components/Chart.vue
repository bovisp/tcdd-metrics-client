<script>
import { Bar, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Bar,
  mixins: [reactiveProp],
  props: ['options'],
  methods: {
    print () {
      // grab the canvas and generate an image
      this.$refs.canvas.toBlob(blob => {
        this.$emit('print', {title: this.options.title.text, data: blob})
      })
      // Emits an event with the image
    }
  },
  mounted () {
    this.renderChart(this.chartData, this.options)
    setTimeout(() => {
      this.print()
    }, 10000)
  }
}
</script>
