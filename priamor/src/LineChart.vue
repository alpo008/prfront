<template>
  <div class="container-fluid height-400">
    <p>
      {{ this.dateRange.startDate }} {{ !!this.dateRange.startDate ? ' - ' : ''}}
      {{ this.dateRange.endDate }} : &emsp;
      {{ this.nominal }}  {{ this.selectedValuteName }}
    </p>
    <line-chart :chart-data="dataCollection" :options="dataOptions"></line-chart>
  </div>
</template>

<script>
  import LineChart from './Linechart'

  export default {
    components: {
      LineChart
    },
    props: {
      dateRange: Object,
      selectedValute: String,
      selectedValuteName: String,
      apiUrl: String,
      dataChanged: Boolean,
    },
    data () {
      return {
        dataCollection: {},
        dataOptions: {responsive: true, maintainAspectRatio: false},
        nominal: ''
      }
    },
    beforeUpdate() {
      let url = this.getServerUrl();
      if (!!url && this.dataChanged) {
        fetch(url)
          .then(response => response.json())
          .then(res => this.fillDatasets(res) )
          .catch(e => console.log(e)); //TODO
      }
    },
    methods: {
      fillDatasets(valuteData) {
        let labels, data, backgroundColor, borderColor, label;
        labels = [];
        data = [];
        borderColor = 'rgba(100, 132, 255, 0.9)';
        backgroundColor = 'rgba(100, 132, 255, 0.05)';
        valuteData.forEach((obj, i, arr) => {
          if (i === 0) {
            this.nominal = obj['nominal'];
            label = obj['nominal'] + ' ' + obj['charCode'];
          }
          labels.push(obj['date']);
          data.push((obj['value'] * this.nominal / obj['nominal']).toFixed(4));
        });
        this.dataCollection = {
          "labels": labels,
          "datasets": [{"label": label, "backgroundColor": backgroundColor, "data": data, "borderColor": borderColor}],
          "backgroundColor": backgroundColor,
          "color": borderColor,
          "borderWidth": 4
        };
        this.$emit('resetDataChanged');
      },
      getServerUrl() {
        if (!!this.selectedValute && !!this.dateRange.startDate && !!this.dateRange.endDate) {
          let url = this.apiUrl + this.selectedValute + '/' +
            this.dateRange.startDate + '/' + this.dateRange.endDate;
          return url.replace(/\s+/g, '');
        } else {
          return '';
        }
      },
    },
  }
</script>

<style scoped>
  .height-400{
    height: 400px;
  }
</style>
