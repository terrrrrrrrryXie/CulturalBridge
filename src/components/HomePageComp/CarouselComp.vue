<template>
  <div class="container">
    <div id="carouselExampleCaptions" class="carousel slide">
      <form>
        <div>
          <label>
            <input type="text" placeholder="What are you looking for?" />
          </label>
        </div>
      </form>
      <div class="carousel-indicators">
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="0"
          class="active"
          aria-current="true"
          aria-label="Slide 1"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="1"
          aria-label="Slide 2"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="2"
          aria-label="Slide 3"
        ></button>
      </div>
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img src="@\assets\CHW6of24-1.jpg" class="d-block w-100" alt="..." />
          <div class="carousel-caption d-block">
            <h5>First slide label</h5>
            <p>Some representative placeholder Lorem ipsum dolor sit amet, consectate, temporibus laborum sit nam inventore blanditiis fugiat non, omnis, corporis placeat doloremque maxime.content for the first slide.</p>
          </div>
        </div>
        <div class="carousel-item">
          <img src="@\assets\DSF2334-1.jpg" class="d-block w-100" alt="..." />
          <div class="carousel-caption d-block">
            <h5>Second slide label</h5>
            <p>Some representative placeholder content for the second slide.</p>
          </div>
        </div>
        <div class="carousel-item">
          <img src="@\assets\IMG_0338-2.jpg" class="d-block w-100" alt="..." />
          <div class="carousel-caption d-block">
            <h5>Third slide label</h5>
            <p>Some representative placeholder content for the third slide.</p>
          </div>
        </div>
      </div>
      <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.carousel-inner,
.carousel-item {
  height: 78vh;
}
.container {
  margin-top: 1.2rem;
}
@media (max-width: 1200px) {
  .carousel-caption {
    display: block;
    margin: auto;
    font-size: 1.2rem;
    padding-bottom: 0%;
    bottom: 6vh;
  }
  @media (max-width: 768.9px) {
    .carousel-caption {
      bottom: 10vh;
    }
  }
  @media (max-width: 575.9px) {
    .carousel-caption {
      bottom: 30vh;
    }
  }
  .carousel-caption h5 {
    font-size: 1.4rem;
    font-weight: bold;
  }
}
form {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1;
  margin: auto;
}
form div {
  width: 64%;
  height: 12%;
  margin: auto;
  margin-top: 4vh;
}
@media (max-width: 1199.9px) {
  form div {
    width: 80%;
    height: 10%;
  }
}
@media (max-width: 768.9px) {
  form div {
    position: absolute;
    width: 100%;
    top: 0;
  }
}
@media (max-width: 575.9px) {
  form {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  form div {
    position: absolute;
    width: 100%;
    margin: auto;
    top: 2vh
  }
}
label {
  width: 100%;
  height: 100%;
}
form div input {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 0.6rem;
  border: 1px rgba(255, 255, 255, 0.412) solid;
  padding: 2rem;
  color: white;
  text-align: center;
  outline: none;
}
form div input::placeholder {
  color: rgba(255, 255, 255, 0.882);
  text-align: center;
}
.carousel-item img {
  height: 100%;
  width: auto;
  object-fit: cover;
}
</style>
