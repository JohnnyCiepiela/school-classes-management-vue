<template>
    <div>
        <h2> Number of items in the cart: {{ totalItemsInTheCart }}</h2>

        <div v-for="lesson in sortedLessons" class="inner_lessons">

            <div v-if="atLeastOneItemInTheCart(lesson)">
                <h3 v-text="lesson.title"></h3>
                <p><span>Lesson ID: </span> {{ " " + lesson.id }}</p>

                <figure>
                    <img v-bind:src="imagesBaseURL + lesson.image" width="100px" height="=100px" />
                </figure>
                <p><span>Price: </span> {{ " " + lesson.price }}</p>
                <p>Available items: {{ classesLeft(lesson) }} (<strong>In cart you have added: {{ cartCount(lesson.id)
                }}</strong>)</p>

                <button v-on:click="removeLesson(lesson)">Remove one from the cart</button>

            </div>

        </div>

        <h2>Checkout process:</h2>
        <!--User input validation container-->
        <!-- <p v-if="order.errors.length">
            <b>Please consider the following requirements:</b>
        <ul>
            <li v-for="error in order.errors">{{ error }}</li>
        </ul>
        </p>

        <p>
            <strong>Name:</strong>
            <input type="text" v-model.trim="order.name">
        </p>

        <p>
            <strong>Phone:</strong>
            <input type="text" v-model.trim="order.phone_number">
        </p>

        <button @click="submitCheckoutForm" v-bind:disabled="!canSubmitDetails">Place your order</button> -->
    </div>
</template>

<script>
export default {
    name: "Checkout",
    props: ["sortedLessons", "imagesBaseUrl", "cart"],
    data() {
        return {}
    },
    methods: {
        atLeastOneItemInTheCart(lesson) {
            return this.cart.includes(lesson.id);
        },
        removeLesson(lesson) {
            this.$emit("remove-lesson", lesson);
        },
        classesLeft(lesson) {
            return lesson.availableSpaces - this.cartCount(lesson.id);
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
    computed: {
        totalItemsInTheCart: function () {
            return this.cart.length || " ";
        },
    },
}
</script>