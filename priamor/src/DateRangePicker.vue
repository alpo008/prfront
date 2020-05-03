<template>
  <div class ="form-group app__form_element">
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
  </div>
</template>

<script>
  import DateRangePicker from "vue2-daterange-picker";
  import "vue2-daterange-picker/dist/vue2-daterange-picker.css";
  import {eventEmitter} from "./main";
  export default {
    components: {
      DateRangePicker
    },
    props: {
      minDate: String,
      dateFormat: String
    },
    data() {
      return {
        dateRange: {"startDate": null, "endDate": null},
        localeData: {
          "format": this.dateFormat,
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
      setDateRange(event) {
        if (!!event.startDate) {
          this.dateRange.startDate = new Date(event.startDate).toISOString().slice(0,10);
        }
        if (!!event.endDate) {
          this.dateRange.endDate = new Date(event.endDate).toISOString().slice(0,10);
        }
        eventEmitter.$emit('dateRangeChanged', this.dateRange)
      },
    },
    computed: {
      maxDate () {
        return new Date (new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0,10);
      }
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

<style scoped>

</style>
