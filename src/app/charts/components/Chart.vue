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
      let image = this.$refs.canvas
      // Emits an event with the image
      this.$emit('chart:print', image.toDataURL())
    }
  },
  mounted () {
    this.renderChart(this.chartData, this.options)
    // this.print()
  }
}
</script>
