

<template>
  <div id="app">
    <header>
      <h1>{{ sitename }}</h1>
      <button @click="toggleShowProduct" v-bind:disabled="!canCheckout" class="checkout_button2">
                {{totalItemsInTheCart}}
                <span class="fas fa-shopping-cart"></span>
                Checkout
            </button>
    </header>

    <main>
      <component :is="currentView"></component>
    </main>
  </div>
</template>

<script>
import LessonsList from './components/LessonsList.vue';
import Checkout from './components/Checkout.vue';

export default {
  name: 'app',
  data() {
    return {
      sitename: "After School Classes",
      cart: [],
      currentView: LessonsList,
    }
  },
  components: {
    LessonsList, Checkout,
  },
  methods: {
    toggleShowProduct() {
      if (this.currentView === this.LessonsList) {
        this.currentView === this.Checkout;
      }
      else {
        this.currentView === this.LessonsList;
      }
    }
  }
}
</script>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
