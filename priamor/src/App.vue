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
        {{ selectedValute }}
        {{ datesRange }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      apiUrl: "http://priam.local/api/valute/",
      valutes : {},
      selectedValute: null,
      datesRange: null
    }
  },
  mounted() {
    this.getValutes();

    const startDate = '2020-03-05';
    const endDate = '2020-12-31';

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
      //TODO
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
</style>
