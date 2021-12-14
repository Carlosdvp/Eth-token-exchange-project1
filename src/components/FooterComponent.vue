
<template>
  <footer class="container-fluid footer py-3 bg-dark">
    <p><small><a id="main-footer-link" class="links" href="./" target="_blank">{{ msg }}</a>&nbsp; &copy; &nbsp;2019</small></p>
  </footer>
</template>

<script>
export default {
  name: 'FooterComponent',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

a#main-footer-link:hover,
footer p:hover {
  color: rgba(178, 34, 34, .8);
  text-decoration: none;
}

footer a {
  color: ghostwhite;
  font-family: 'Bellefair', serif;
  letter-spacing: .2em;
  text-decoration: none;
}

footer p  {
  color: ghostwhite;
  text-align: center;
  margin: 0;
  padding: 1.5em 0;
}

footer {
  background:  linear-gradient(
    rgba(4, 8, 8, .7),
    rgba(4, 8, 8, .85)
  ),
  url('../assets/pink-texture.jpg');
  background-repeat: no-repeat;
  background-size: cover;
}

</style>