<template>
  <div class="container-fluid height-400">
    <line-chart :chart-data="dataCollection" :options="dataOptions"></line-chart>
  </div>
</template>

<script>
  import LineChart from './Linechart'
  import {eventEmitter} from "./main";

  export default {
    components: {
      LineChart
    },
    data () {
      return {
        selectedValute: '',
        selectedValuteName: '',
        dateRange: {},
        dataCollection: {},
        dataOptions: {responsive: true, maintainAspectRatio: false},
        nominal: '',
        resource: null
      }
    },
    created: function () {
      eventEmitter.$on('valuteSelected', (e) => {
        this.selectedValute = e.code
        this.selectedValuteName = e.name
        this.setValuteData(this.serverUrl)
      });
      eventEmitter.$on('dateRangeChanged', (e) => {
        this.dateRange = e
        this.setValuteData(this.serverUrl)
      });
    },
    methods: {
      setValuteData(url) {
        if (!!url) {
          this.resource = this.$resource(url)
          this.$http.get(url)
            .then(response => response.json())
            .then(valuteData => this.fillDatasets(valuteData))
            .catch(e => console.log(e)) //TODO
        }
      },
      fillDatasets(valuteData) {
        let labels, data, backgroundColor, borderColor, label
        labels = []
        data = []
        borderColor = 'rgba(100, 132, 255, 0.9)'
        backgroundColor = 'rgba(100, 132, 255, 0.05)'
        valuteData.forEach((obj, i, arr) => {
          if (i === 0) {
            this.nominal = obj['nominal']
            label = obj['nominal'] + ' ' + obj['charCode']
          }
          labels.push(obj['date']);
          data.push((obj['value'] * this.nominal / obj['nominal']).toFixed(4))
        });
        this.dataCollection = {
          "labels": labels,
          "datasets": [{"label": label, "backgroundColor": backgroundColor, "data": data, "borderColor": borderColor}],
          "backgroundColor": backgroundColor,
          "color": borderColor,
          "borderWidth": 4
        };
      }
    },
    computed: {
      serverUrl() {
        if (!!this.selectedValute && !!this.dateRange.startDate && !!this.dateRange.endDate) {
          let url = this.selectedValute + '/' +
            this.dateRange.startDate + '/' + this.dateRange.endDate
          return url.replace(/\s+/g, '')
        } else {
          return ''
        }
      }
    }
  }
</script>

<style scoped>
  .height-400 {
    height: 400px;
  }
</style>
