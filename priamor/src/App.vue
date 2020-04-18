<template>
  <div class="container-fluid">
    <nav class="navbar navbar-light bg-light pt-3">
    <a class="navbar-brand" href="#">PRIAMOR</a>
      <form class="form-inline">
      <label for="currency-select">Валюта</label>
      <select id="currency-select" class="form-control" v-model="selectedValute">
        <option v-for="(value, name) in valutes" :value=name>
          {{ value }}
        </option>
      </select>
      <label for="dates-input">Даты</label>
      <input type="text" id="dates-input" class="form-control" v-model="datesRange">
      <button
        class="btn btn-outline-success my-2 my-sm-0"
        :disabled="!this.selectedValute || !this.datesRange"
        type="button"
        @click="getCurrencyData"
      >
        Поиск
      </button>
      </form>
    </nav>
    <div class="row">
      <div class="col-lg-12">
        <p class="currency-info">Курс {{ nominal }} {{ valutes[selectedValute] }} за период {{ datesRange }}</p>
        <div class="chartjs">
          <line-chart
            :chart-data="chartDataCollection"
            v-if="chartReady"
            :options="{responsive: true, maintainAspectRatio: false}">
          </line-chart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LineChart from './LineChart.js'
export default {
  name: 'app',
  components: {
    LineChart
  },
  data () {
    return {
      apiUrl: "http://priam.local/api/valute/",
      valutes : {},
      nominal: null,
      selectedValute: null,
      datesRange: null,
      chartDataCollection: {},
      chartReady: false
    }
  },
  mounted() {
    this.getValutes();
    const startDate = '2020-03-05';
    const endDate = new Date (new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0,10);

    $('#dates-input').daterangepicker({
      "minDate": startDate,
      "maxDate": endDate,
      "autoApply": true,
      "autoUpdateInput": true,
      "locale": {
        "format": 'YYYY-MM-DD',
        "separator": " / ",
        //"applyLabel": "Применить",
        //"cancelLabel": "Отмена",
        "fromLabel": "С",
        "toLabel": "ПО",
        "customRangeLabel": "Custom",
        "weekLabel": "Нед",
        "daysOfWeek": [
          "Вс",
          "Пн",
          "Вт",
          "Ср",
          "Чт",
          "Пт",
          "Сб"
        ],
        "monthNames": [
          "Январь",
          "Февраль",
          "Март",
          "Апрель",
          "Май",
          "Июнь",
          "Июль",
          "Август",
          "Сентябрь",
          "Октябрь",
          "Ноябрь",
          "Декабрь"
        ],
        "firstDay": 1
      }
    })
      .on('apply.daterangepicker', (e, picker) => {
        this.datesRange = e.target.value;
      });
  },
  methods: {
    getValutes() {
      fetch(this.apiUrl, {method: 'GET'})
        .then(response => response.json())
        .then(res => this.setValutes(res) )
        .catch(e => console.log(e));
    },
    setValutes(oValutes) {
      this.valutes = oValutes;
    },
    getCurrencyData() {
      if (!!this.selectedValute && !!this.datesRange) {
        let url = this.apiUrl + this.selectedValute + '/' + this.datesRange;
        url = url.replace(/\s+/g, '');
        fetch(url)
          .then(response => response.json())
          .then(res => this.makeDataset(res) )
          .catch(e => console.log(e));
      }
    },
    makeDataset(arData) {
      let labels, data, backgroundColor, defaultBgColor, label;
      labels = [];
      data = [];
      backgroundColor = [];
      defaultBgColor = 'rgba(100, 255, 132, 0.2)';
      arData.forEach((obj, i, arr) => {
        this.nominal = obj['nominal']
        labels.push(obj['date']);
        data.push(obj['value']);
        backgroundColor.push(defaultBgColor);
        label = obj['charCode']
      });
      this.chartDataCollection = {
        "labels": labels,
        "datasets": [{"label": label, "backgroundColor" : backgroundColor, "data": data}],
        "backgroundColor": defaultBgColor,
      }
      this.chartReady = true
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.navbar > form > label, .navbar > form > select, .navbar > form > input {
  margin-right: 15px;
}
.navbar > form > select, .navbar > form > input {
  max-width: 200px;
}
.currency-info {
  margin-top: 7px;
  text-align: center;
}
</style>
