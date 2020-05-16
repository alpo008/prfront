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
      data() {
       return {
         valutes: {},
         resource: null
       }
      },
      methods: {
        setValutes() {
          this.resource.get()
            .then(response => response.json())
            .then(valutes => { this.valutes = valutes })
            .catch(e => {
              console.log(e) //TODO
            });
        },
        selectValute(e) {
          eventEmitter.$emit('valuteSelected',
            {code: e.target.value, name: this.valutes[e.target.value]}
          )
        }
      },
      created() {
        this.resource = this.$resource('')
      },
      beforeMount() {
        this.setValutes();
      }
    }
</script>
