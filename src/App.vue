<template>
  <div id='app'>
    <NavBar></NavBar>
    <router-view/>
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
</script>

<style>

body {
  background-color: rgb(70,130,180);
  color: ghostwhite;
  margin: 0;
  padding: 0;

}

#app {
  display: grid;
  position: absolute;
  margin: 0;
  width: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: 85vh;
}
</style>
