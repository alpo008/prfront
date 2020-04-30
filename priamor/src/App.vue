<template>
  <div class="container-fluid">
    <nav class="navbar navbar-light bg-light pt-3 navbar-responsive">
      <a class="navbar-brand" href="#">PRIAMOR</a>
      <form class="form-inline my-2 my-lg-0">

        <app-dropdown :apiUrl="apiUrl" @valuteSelected="setValute">
        </app-dropdown>

        <label for="form__date-range">Даты</label>

        <date-range-picker
          :auto-apply="true"
          :locale-data="localeData"
          :max-date="maxDate"
          :min-date="minDate"
          :opens="'left'"
          :ranges="false"
          @update="setDateRange"
          id="form__date-range"
          v-model="dateRange"

        >
          <!--Optional scope for the input displaying the dates -->
          <div slot="input" slot-scope="picker" style="min-height: 24px">
            {{ picker.startDate | date }}
            {{ !picker.startDate ? '' : '-' }}
            {{ picker.endDate | date }}
          </div>
        </date-range-picker>
      </form>
    </nav>
    <div class="row">
      <div class="col-lg-12">
        <div class="chartjs">
          <valute-line-chart
            :dateRange="dateRange"
            :selectedValute="selectedValute"
            :selectedValuteName="selectedValuteName"
            :apiUrl="apiUrl"
            :dataChanged="dataChanged"
            @resetDataChanged="dataChanged = false"
          >
          </valute-line-chart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Dropdown from "./Dropdown";
import DateRangePicker from "vue2-daterange-picker";
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";
import ValuteLineChart from "./LineChart.vue";

export default {
  name: 'app',
  components: {
    appDropdown: Dropdown,
    dateRangePicker: DateRangePicker,
    valuteLineChart: ValuteLineChart
  },
  data () {
    return {
      apiUrl: "http://alpo.pw/api/valute/",
      nominal: null,
      selectedValute: null,
      selectedValuteName: null,
      dateRange: {"startDate": null, "endDate": null},
      dataChanged: false,
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
  methods: {
    setValute (e) {
      this.selectedValute = e.code;
      this.selectedValuteName = e.name;
      this.dataChanged = true;
    },
    setDateRange(event) {
      if (!!event.startDate) {
        this.dateRange.startDate = new Date(event.startDate).toISOString().slice(0,10);
      }
      if (!!event.endDate) {
        this.dateRange.endDate = new Date(event.endDate).toISOString().slice(0,10);
      }
      this.dataChanged = true;
    },
  },
  computed: {
    minDate () {
      return '2020-03-05';
      },
    maxDate () {
      return new Date (new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0,10);
    },
  },
  filters: {
    date(value) {
      if (!!value && typeof value === 'object' && typeof value.toISOString === 'function') {
        return value.toISOString().slice(0,10)
      } else {
        return null;
      }
    }
  }
}
</script>
