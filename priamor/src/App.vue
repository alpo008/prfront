<template>
  <div class="container-fluid">
    <nav class="navbar navbar-light bg-light pt-3">
      <a class="navbar-brand" href="#">PRIAMOR</a>
      <form class="form-inline my-2 my-lg-0">
        <app-dropdown :apiUrl="apiUrl"></app-dropdown>
        <date-range-picker :min-date="'2020-03-15'" :date-format="'YYYY-MM-DD'" :app-locale="appLocale">
        </date-range-picker>
      </form>
    </nav>
    <div class="row">
      <div class="col-lg-12">
        <div class="chartjs">
          <valute-line-chart :apiUrl="apiUrl"></valute-line-chart>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Dropdown from "./Dropdown"
import DateRangePicker from "./DateRangePicker"
import ValuteLineChart from "./LineChart.vue"
import moment from "moment"

export default {
  name: 'app',
  components: {
    appDropdown: Dropdown,
    dateRangePicker: DateRangePicker,
    valuteLineChart: ValuteLineChart,
  },
  data () {
    return {
      apiUrl: "http://alpo.pw/api/valute/",
      appLocale: moment.localeData('ru')
    }
  }
}
</script>
