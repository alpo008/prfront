<template>
  <div class ="form-group app__form_element">
    <label for="currency-select">Валюта</label>

    <select id="currency-select" class="form-control" @change="selectValute">
      <option value="null"></option>
      <option v-for="(value, name) in valutes" :value=name>
        {{ value }}
      </option>
    </select>
  </div>
</template>

<script>
    import {eventEmitter} from "./main";

    export default {
      name: "Dropdown",
      props: {
        'apiUrl' : String
      },
      data() {
       return {
         valutes: {},
       }
      },
      methods: {
        setValutes() {
          fetch(this.apiUrl, {method: 'GET'})
            .then(response => response.json())
            .then(res => {
              this.valutes = res;
            })
            .catch(e => {
              console.log(e);//TODO
              return {};
            });
        },
        selectValute(e) {
          eventEmitter.$emit('valuteSelected',
            {code: e.target.value, name: this.valutes[e.target.value]}
          )
        }
      },
      beforeMount() {
        this.setValutes();
      }
    }
</script>

<style scoped>
  .app__form_element {
  }
  .app__form_element > label {
    display: inline-block;
    margin-right: 15px;
  }
</style>
