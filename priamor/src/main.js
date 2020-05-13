import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App.vue'

Vue.use(VueResource)

export const eventEmitter = new Vue();

export const windowWidth = window.screen.availWidth

window.addEventListener("orientationchange", () => {
  eventEmitter.$emit('windowWidthChanged', window.screen.availWidth)
}, false);
window.addEventListener("resize", () => {
  eventEmitter.$emit('windowWidthChanged', window.screen.availWidth)
}, false);

new Vue({
  el: '#app',
  render: h => h(App)
})
