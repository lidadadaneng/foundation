<template>
  <div id="app">
    <Home></Home>
  </div>
</template>

<script>
import Home from './views/Home'

export default {
  name: 'App',
  components:{Home}
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
}
html,body{
  margin: 0;
  height: 100%;
  width: 100%;
}
</style>
