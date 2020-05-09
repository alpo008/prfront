<template>
  <div class="container-fluid height-400">
    <bar-chart :chart-data="dataCollection" :options="dataOptions"></bar-chart>
  </div>
</template>

<script>
  import BarChart from './Barchart'
  import {eventEmitter} from "./main";

  export default {
    components: {
      BarChart
    },
    props: {
      apiUrl: String,
    },
    data () {
      return {
        selectedValute: '',
        selectedValuteName: '',
        dateRange: {},
        dataCollection: {},
        nominal: ''
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
          fetch(url)
            .then(response => response.json())
            .then(res => this.fillDatasets(res))
            .catch(e => console.log(e)) //TODO
        }
      },
      fillDatasets(valuteData) {
        let labels, data, backgroundColor, borderColor, label
        labels = []
        data = []
        borderColor = 'rgba(100, 132, 255, 0.9)'
        backgroundColor = 'rgba(100, 132, 255, 0.6)'
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
          let url = this.apiUrl + this.selectedValute + '/' +
            this.dateRange.startDate + '/' + this.dateRange.endDate
          return url.replace(/\s+/g, '')
        } else {
          return ''
        }
      },
      dataOptions() {
        return {
          scales: {
            yAxes: [{
              gridLines: {
                display: true
              }
            }],
            xAxes: [{
              gridLines: {
                display: false
              },
              ticks: {
                  callback(val) {
                    return moment(val).format('DD.MM.YYYY');
                  }
              }
            }]
          },
          tooltips: {
            enabled: true,
              mode: 'single',
              callbacks: {
              label(tooltipItems, data) {
                return tooltipItems.yLabel + ' ₽';
              },
              title(tooltipItems, data) {
                return moment(tooltipItems[0].xLabel).format('DD.MM.YYYY');
              }
            }
          },
          responsive: true,
          maintainAspectRatio: false,
          height: 200
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
