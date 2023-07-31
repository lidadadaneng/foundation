<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <p v-for="(item,index) in gz" :key="index">{{item.name}}:{{item.gz}}%</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'App',
  data() {
    return {
      fcodes: [],
      gz: []
    }
  },
  mounted() {
    const data = {
      fcodes: '012769,002708,000362,012323'
    }
    axios({
      url: '/favor/GetFundsInfo?',
      method: "post",
      data
    }).then((res) =>{
      this.gz = res.data.Data.KFS.map(item => ({name: item.SHORTNAME, gz: item.gszzl}));
    }).catch(function (error) {
      console.log(error);
    });
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
