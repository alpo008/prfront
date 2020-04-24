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

        <label for="form__date-range">Даты</label>

        <date-range-picker
          id="form__date-range"
          v-model="dateRange"
          :locale-data="localeData"
          :min-date="minDate"
          :max-date="maxDate"
          :opens="'left'"
          :auto-apply="true"
          :ranges="false"
          @update="setDateRange"
        >
          <!--Optional scope for the input displaying the dates -->
          <div slot="input" slot-scope="picker" style="min-height: 24px">
            {{ picker.startDate | date }}
            {{ !picker.startDate ? '' : '-' }}
            {{ picker.endDate | date }}
          </div>
        </date-range-picker>

        <button
          class="btn btn-outline-success my-2 my-sm-0"
          :disabled="!this.selectedValute || !this.dateRange"
          type="button"
          @click="getCurrencyData"
        >
          Поиск
        </button>
      </form>
    </nav>
    <div class="row">
      <div class="col-lg-12">
        <p class="currency-info">Курс {{ nominal }} {{ valutes[selectedValute] }}
          за период
          {{ dateRange.startDate }}
          {{!dateRange.startDate ? '' : '-'}}
          {{ dateRange.endDate }}
        </p>
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
import DateRangePicker from "vue2-daterange-picker";
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";

export default {
  name: 'app',
  components: {
    lineChart: LineChart,
    dateRangePicker: DateRangePicker
  },
  data () {
    return {
      apiUrl: "http://priam.local/api/valute/",
      valutes : {},
      nominal: null,
      selectedValute: null,
      dateRange: {"startDate": null, "endDate": null},
      chartDataCollection: {},
      chartReady: false,
      localeData: {
        "format": 'YYYY-MM-DD',
        "separator": " / ",
        //"applyLabel": "Применить",
        //"cancelLabel": "Отмена",
        "fromLabel": "С",
        "toLabel": "ПО",
        "customRangeLabel": "Custom",
        "weekLabel": "Нед",
        "daysOfWeek": ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
        "monthNames": ["Январь", "Февраль", "Март", "Апрель", "Май",
          "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
        ],
        "firstDay": 1
      }
    }
  },
  mounted() {
    this.getValutes();
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
      if (!!this.selectedValute && !!this.dateRange.startDate && !!this.dateRange.endDate) {
        let url = this.apiUrl + this.selectedValute + '/' +
          this.dateRange.startDate + '/' + this.dateRange.endDate;
        url = url.replace(/\s+/g, '');
        fetch(url)
          .then(response => response.json())
          .then(res => this.makeDataset(res) )
          .catch(e => console.log(e));
      }
    },
    makeDataset: function (arData) {
      let labels, data, backgroundColor, borderColor, label;
      labels = [];
      data = [];
      borderColor = 'rgba(100, 132, 255, 0.9)';
      backgroundColor = 'rgba(100, 132, 255, 0.1)';
      arData.forEach((obj, i, arr) => {
        if (i === 0) {
          this.nominal = obj['nominal']
        }
        labels.push(obj['date']);
        data.push((obj['value'] * this.nominal / obj['nominal']).toFixed(4));
        label = obj['charCode']
      });
      this.chartDataCollection = {
        "labels": labels,
        "datasets": [{"label": label, "backgroundColor": backgroundColor, "data": data}],
        "backgroundColor": backgroundColor,
      }
      this.chartReady = true
    },
    setDateRange(event) {
      if (!!event.startDate) {
        this.dateRange.startDate = new Date(event.startDate).toISOString().slice(0,10);
      }
      if (!!event.endDate) {
        this.dateRange.endDate = new Date(event.endDate).toISOString().slice(0,10);
      }
    },
  },
  computed: {
    minDate () {
      return '2020-03-05';
      },
    maxDate () {
      return new Date (new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0,10);
    }
  },
  filters: {
    date(value) {
      if (!!value && typeof value === 'object') {
        return value.toISOString().slice(0,10)
      } else {
        return null;
      }
    }
  }
}
</script>
