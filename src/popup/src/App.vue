<template>
  <div id="app">
    <Popup></Popup>
  </div>
</template>

<script>
import Popup from './components/Popup.vue';


export default {
  name: 'App',
  components: {
    Popup
}
}
</script>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    vertical-align: middle;
    font-family: PingFang SC,HarmonyOS_Regular,Helvetica Neue,Microsoft YaHei,sans-serif
}
</style>
