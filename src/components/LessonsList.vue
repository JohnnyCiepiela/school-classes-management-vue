<template>
  <!-- <div class="sort_section">
                <h2>Sort by:</h2>
                <ul>
                    <li @click="sort('title')" v-bind:class="[sortBy === 'title' ? sortDirection : '']">
                        Subject</li>
                    <li @click="sort('location')" v-bind:class="[sortBy === 'location' ? sortDirection : '']">
                        Location</li>
                    <li @click="sort('price')" v-bind:class="[sortBy === 'price' ? sortDirection : '']">
                        Price</li>
                    <li @click="sort('availableSpaces')"
                        v-bind:class="[sortBy === 'availableSpaces' ? sortDirection : '']">
                        Availability</li>
                </ul>
            </div> -->
  <div>
    <div v-for="lesson in sortedLessons" class="float_child">
      <h1 v-text="lesson.title"></h1>

      <figure>
        <img
          v-bind:src="imagesBaseURL + lesson.image"
          width="100px"
          height="=100px"
        />
      </figure>

      <h1 v-text="lesson.title"></h1>
      <p><b>Location:</b> {{ lesson.location }}</p>
      <p><b>Description:</b> {{ lesson.description }}</p>
      <p><b>Price:</b> {{ lesson.price }}</p>

      <button v-on:click="addItemToCart(lesson)" v-if="canAddToCart(lesson)">
        Add to the Cart
      </button>

      <button v-else disabled>Add to the Cart</button>

      <span v-if="classesLeft(lesson) === 0"> All out!</span>

      <span v-else-if="classesLeft(lesson) < 4">
        Only {{ classesLeft(lesson) }} left!</span
      >

      <span v-else> Buy now!</span>

      <div>
        <span v-for="n in lesson.rating"> ★ </span>
        <span v-for="n in 5 - lesson.rating"> ☆ </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LessonsList",
  props: ["sortedLessons", "imagesBaseURL", "cart"],
  data() {
    return {};
  },
  methods: {
    canAddToCart(lesson) {
      return lesson.availableSpaces > this.cartCount(lesson.id);
    },
    cartCount(id) {
      let count = 0;
      for (let i = 0; i < this.cart.length; i++) {
        if (this.cart[i] === id) {
          count++;
        }
      }
      return count;
    },
  },
};
</script>
