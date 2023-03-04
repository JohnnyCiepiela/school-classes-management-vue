<template>
  <div id="app">
    <header>
      <h1>{{ sitename }}</h1>
      <button @click="showCheckout" v-bind:disabled="!canCheckout" class="checkout_button2">
        {{ totalItemsInTheCart }}
        <font-awesome-icon icon="fas fa-shopping-cart" />
        Checkout
      </button>
      <button v-if="testConsole" @click="toggleShowTestConsole">
        <font-awesome-icon icon="fas fa-text-height" />
        Test Console
      </button>
      <div v-if="testConsole && showTestConsole" class="test-console">
        <button @click="saveProductToDB" class="test-elem">
          <font-awesome-icon icon="fas fa-save" />
          Test Save a Product to the DB
        </button>
        <button @click="deleteAllCaches" class="test-elem">
          <font-awesome-icon icon="fas fa-trash" />
          Delete All Caches
        </button>
        <button @click="reloadPage" class="test-elem">
          <font-awesome-icon icon="fas fa-sync" />
          Reload Page
        </button>
        <strong class="test-elem">HTTPS Test: </strong>
        <a v-bind:href="serverURL" target="_blank">link</a>
        <button @click="unregisterAllServiceWorkers" class="test-elem">
          <font-awesome-icon icon="fab fa-uniregistry" />
          Unregister All ServiceWorkers
        </button>
      </div>
    </header>

    <main>
      <component :is="currentView" :sortedLessons="sortedLessons" :imagesBaseURL="imagesBaseURL" :cart="cart"
        @add-item-to-cart="addItemToCart" @remove-lesson="removeLesson"></component>
    </main>
  </div>
</template>

<script>
import LessonsList from "./components/LessonsList.vue";
import Checkout from "./components/Checkout.vue";

export default {
  name: "app",
  components: {
    LessonsList,
    Checkout
  },
  data() {
    return {
      sitename: "After School Classes",
      cart: [],
      currentView: LessonsList,
      testConsole: true,
      showTestConsole: true,
      lessons: [],
      serverURL:
        "https://afterschoolclasses2-env.eba-upgmncnr.eu-west-2.elasticbeanstalk.com/collections/lessons",
      sortBy: "name",
      sortDirection: "asc",
      searchTerm: "",
      searchResults: [],
      imagesBaseURL:
        "https://afterschoolclasses2-env.eba-upgmncnr.eu-west-2.elasticbeanstalk.com/",
    };
  },
  created: function () {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("service-worker.js");
    }
    let webstore = this;
    fetch(this.serverURL).then(function (response) {
      response.json().then(function (json) {
        webstore.lessons = json;
      });
    });
  },
  methods: {
    addItemToCart: function (lesson) {
      this.cart.push(lesson.id);
    },
    removeLesson(lesson) {
      this.removeItemFromCart(lesson);
      if (!this.atLeastOneItemInTheCart) {
        this.currentView = LessonsList;
      }
    },
    removeItemFromCart(lesson) {
      let index = this.cart.indexOf(lesson.id);
      this.cart.splice(index, 1);
    },
    showCheckout() {
      console.log("Hej")
      if (this.currentView === this.LessonsList) {
        this.currentView === this.Checkout;
      } else {
        this.currentView === this.LessonsList;
      }
    },
    toggleShowTestConsole() {
      this.showTestConsole = !this.showTestConsole;
    },
    saveProductToDB() {
      const newProduct = {
        id: 2000,
        title: "Math2",
        location: "Hendon2",
        description:
          "Acquisition of new knowledge, skills, and affects that are related to quantity.",
        price: 100,
        image: "images/math_icon.png",
        availableSpaces: 10,
        rating: 2,
      };

      fetch(this.serverURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      }).then(function (response) {
        response.json().then(function (json) {
          console.log("Success: " + json.ackowledged);
          webstore.lessons.push(newProduct);
        });
      });
    },
    deleteAllCaches() {
      caches.keys().then(function (names) {
        for (let name of names) caches.delete(name);
      });

      console.log("All Caches Deleted!");
    },
    reloadPage() {
      window.location.reload();
    },
    unregisterAllServiceWorkers() {
      navigator.serviceWorker.getRegistrations().then(function (registrations) {
        for (let registration of registrations) {
          registration.unregister();
        }
      });

      console.log("ServiceWorkers Unregistered");
    },
    sort(s) {
      if (s === this.sortBy) {
        this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
      }
      this.sortBy = s;
    },
  },
  computed: {
    atLeastOneItemInTheCart() {
      return this.totalItemsInTheCart >= 1;
    },
    totalItemsInTheCart: function () {
      return this.cart.length || " ";
    },
    canCheckout() {
      return this.cart.length > 0;
    },
    sortedLessons() {
      return this.lessons.sort((p1, p2) => {
        let modifier = 1;
        if (this.sortDirection === "desc") modifier = -1;
        if (p1[this.sortBy] < p2[this.sortBy]) return -1 * modifier;
        if (p1[this.sortBy] > p2[this.sortBy]) return 1 * modifier;
        return 0;
      });
    },
  },
};
</script>

<style scoped>
/* header {
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
} */
</style>
