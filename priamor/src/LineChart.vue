<script>
  import { Line, mixins } from 'vue-chartjs'
  const { reactiveProp } = mixins

  export default {
    name: "LineChart",
    extends: Line,
    mixins: [reactiveProp],
    props: ['data', 'options'],
    mounted () {
      // this.chartData создаётся внутри миксина.
      // Если требуется передать опции, создайте локальный объект options
      this.renderChart(this.chartData, this.options)
    },
    watch: {
      data: function() {
        this._chart.destroy();
        this.renderChart(this.data, this.options);
      }
    }
  }
</script>

<style scoped>

</style>
