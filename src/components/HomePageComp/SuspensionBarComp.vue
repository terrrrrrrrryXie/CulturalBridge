<template>
  <div class="sus">
    <form>
      <div class="role">
        <span>I'm a &nbsp;</span>
        <input type="text">
        <span>&nbsp;, &nbsp;</span>
      </div>
      <div class="location">
        <span>I live in &nbsp;</span>
        <input type="text">
      </div>
      <button>GO</button>
    </form>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.sus {
    width: 40vw;
    border: .2px white solid;
    height: 12vh;
    position: fixed;
    right: 4vw;
    bottom: 2vh;
    z-index: 1;
  }
  form {
    display: flex;
    flex-direction: row;
    height: 100%;
    align-items: center;
    color: white;
    background-color: RGB(34, 37, 41);
  }
  form input {
    height: 60%;

    padding: 0.2rem;
    text-align: center;
  }
  .form-control {
    width: auto;
  }
  .role {
    margin-left: 1.2vw;
  }
  form div {
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

  }
  form button {
    height: 100%;
    width: 5vw;
    position: absolute;
    right: 0;
    color: RGB(34, 37, 41);
    background-color: white;
    border: 1px RGB(34, 37, 41) solid;
    box-sizing: border-box;
    transition: .3s all;
  }
  form button:hover {
    background-color: red;
    color: white;
  }
  @media (max-width: 1200px) {
    .sus {
      width: 100%;
      font-size: 1.2rem;
      height: 8vh;
      right: 0;
      bottom: 0vh;
    }
    form button {
      width: 12vw;
    }
  }
  @media (max-width: 768px) {
    form div {
      width: 42%;
      font-size: 1.2rem;
    }
    form input {
      width: 60%;
    }
  }
  @media (max-width: 576px) {
    form div {
      width: 42%;
      font-size: 1rem;
    }
    form input {
      width: 60%;
    }
  }
</style>
