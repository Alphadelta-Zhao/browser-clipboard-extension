import Vue from 'vue'
import App from './App.vue'
import './assets/iconfont/iconfont.css'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  beforeCreate(){
    this.prototype.$bus = this;
  }  
}).$mount('#app')
