import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App.vue'

Vue.use(VueResource)

Vue.http.options.root = 'http://alpo.pw/api/valute/'

Vue.http.interceptors.push((request, next) => {
  request.headers.set('Authorization', 'Bearer 100-token')
  //request.headers.set('Accept', 'application/json')
  next()
})

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
