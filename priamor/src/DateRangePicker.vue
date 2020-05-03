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
      dateFormat: String,
      appLocale: Object
    },
    data() {
      return {
        dateRange: {"startDate": null, "endDate": null},
        localeData: {
          format: this.dateFormat, // настройка через локаль, если `:auto-apply="false"`
          separator: " / ",
          //applyLabel: "Применить",
          //cancelLabel: "Отмена",
          fromLabel: "С",
          toLabel: "ПО",
          customRangeLabel: "Custom",
          daysOfWeek: this.appLocale.weekdaysMin(),
          monthNames: this.appLocale.monthsShort(),
          firstDay: this.appLocale.firstDayOfWeek()
        }
      }
    },
    methods: {
      setDateRange(event) {
        if (!!event.startDate) {
          this.dateRange.startDate = moment(event.startDate).format(this.dateFormat);
        }
        if (!!event.endDate) {
          this.dateRange.endDate = moment(event.endDate).format(this.dateFormat);
        }
        eventEmitter.$emit('dateRangeChanged', this.dateRange)
      },
    },
    computed: {
      maxDate () {
        return moment().endOf('day').format(this.dateFormat);
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
