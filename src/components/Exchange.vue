<template>

<div class="container">

  <div class="vertical-split">
    <div class="card">
      <div>
        <h2>Section 1</h2>
        <p class="description">bacon milkshake pollerita ojo de bife ribeye</p>
      </div>
    </div>
    <div class="card">
      <div>
        <h2>Section 2</h2>
        <p class="description">bacon milkshake pollerita ojo de bife ribeye</p>
      </div>
    </div>
  </div>

  <div class="vertical">
    <div class="card">
      <div>
        <h2>Section 3</h2>
        <p class="description">bacon milkshake pollerita ojo de bife ribeye</p>
      </div>
    </div>  
  </div>

  <div class="vertical-split">
    <div class="card">
      <div>
        <h2>Section 4</h2>
        <p class="description">bacon milkshake pollerita ojo de bife ribeye</p>
      </div>
    </div>  
    <div class="card">
      <div>
        <h2>Section 5</h2>
        <p class="description">bacon milkshake pollerita ojo de bife ribeye</p>
      </div>
    </div>  
  </div>

  <div class="vertical">
    <div class="card">
      <div>
        <h2>Section6</h2>
        <p class="description">bacon milkshake pollerita ojo de bife ribeye</p>
      </div>
    </div>
  </div>

</div>

</template>

<script>
export default {
  name: 'Exchange',
  props: {}
}

</script>

<style scoped>

.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  padding: 0.3rem 0;
  background:  linear-gradient(
    rgba(50, 100, 100, .9),
    rgba(50, 100, 100, .9)
  ),
  url('../assets/splatter.jpg');
  background-repeat: round;
  background-size: cover;
  color: ghostwhite; 
  /* height: 100%; */
  height: 87vh;
}

.vertical > .card {
  height: 98.5%;
  margin: 3px;
}

.vertical-split > div {
  height: 49%;
  margin: 3px;
}

/* .vertical-split > div:first-child {
  margin-bottom: 2px;
} */

/* .vertical-split:last-child > div:first-child {
  height: 60%;
} */

/* .vertical-split:last-child > div:last-child {
  height: 40%;
} */

.card {
  display: grid;
  width: 95%;
  grid-template-columns: 100%;
  align-items: center;
  border: 1px solid ghostwhite;
  border-radius: 1px;
  margin: 0;
}

.description {
  padding: 1em;
  text-align: left;
}

/**************************************
  Media Queries
***************************************/

@media only screen and (max-width: 1090px) {
/*   .btn a {
    font-size: .8em;
    padding: 1em;
  } */

  .card {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: minmax(150px, auto);
  }

  .vertical-split {
    display: block
  }

  .vertical-split > div,
  .vertical-split > div:first-child {
    height: auto
  }

}

@media only screen and (max-width: 720px) {
/*   .btn a {
    font-size: 1.3em;
    padding: 1em;
  } */

  .card {
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-rows: minmax(150px, auto);
    width: 70vw;
    justify-self: center;
  }

}

/* @media only screen and (max-width: 720px) {
  .btn a {
    font-size: .8em;
  }
} */

</style>
 