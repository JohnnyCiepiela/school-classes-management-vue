<template>
    <div>
        <h2> Number of items in the cart: {{ totalItemsInTheCart }}</h2>

        <div v-for="lesson in sortedLessons" class="inner_lessons">

            <div v-if="atLeastOneItemInTheCart(lesson)">
                <h3 v-text="lesson.title"></h3>
                <p><span>Lesson ID: </span> {{ " " + lesson.id }}</p>

                <figure>
                    <img v-bind:src="imagesBaseURL + lesson.image" width="100px" height="100px" />
                </figure>
                <p><span>Price: </span> {{ " " + lesson.price }}</p>
                <p>Available items: {{ classesLeft(lesson) }} (<strong>In cart you have added: {{ cartCount(lesson.id)
                }}</strong>)</p>

                <button v-on:click="removeLesson(lesson)">Remove one from the cart</button>

            </div>

        </div>

        <h2>Checkout process:</h2>
        <p v-if="order.errors.length">
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

        <button @click="submitCheckoutForm" v-bind:disabled="!canSubmitDetails">Place your order</button>
    </div>
</template>

<script>
console.log("Im in the component")
export default {
    name: "Checkout",
    props: ["sortedLessons", "imagesBaseURL", "cart"],
    data() {
        return {
            order: {
                errors: [],
                name: null,
                phone_number: null,
            },
            lessonsIdsOrder: [],
            orderLessonSpaces: 0,
        };
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
        validName(name) {
            var name_regex = /^[a-zA-Z]+$/;
            return name_regex.test(name);
        },
        validNumber(phone_number) {
            var phone_regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
            return phone_regex.test(phone_number);
        },
        computeLessonsForOrder() {
            this.cart.forEach(i => {
                this.lessonsIdsOrder.push(i);
                this.orderLessonSpaces = this.orderLessonSpaces + 1;
            })
        },
        submitCheckoutForm() {
            this.computeLessonsForOrder();
            const newOrder = {
                name: this.order.name,
                phoneNumber: this.order.phone_number,
                lessonId: this.lessonsIdsOrder,
                numberOfSpaces: this.orderLessonSpaces
            };

            fetch("https://afterschoolclasses2-env.eba-upgmncnr.eu-west-2.elasticbeanstalk.com/collections/order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newOrder)
            }).then(response => response.json())
                .then(json => {
                    console.log("Success: " + json.acknowledged);
                })
                .catch(error => {
                    console.error("Error while submitting order: " + error);
                });

            this.cart.forEach(cartItem => {
                let count = 0;
                const lesson = this.lessons.find(lessonItem => lessonItem.id === cartItem);
                if (lesson) {
                    count += 1;
                    const updateLesson = {
                        availableSpaces: lesson.availableSpaces - count
                    };

                    fetch(`https://afterschoolclasses2-env.eba-upgmncnr.eu-west-2.elasticbeanstalk.com/collections/lessons/${lesson._id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(updateLesson)
                    }).then(response => response.json())
                        .then(json => {
                            console.log("Success: " + json.acknowledged);
                        })
                        .catch(error => {
                            console.error("Error while updating lesson: " + error);
                        });
                }
            });
            alert("Thank you for submitting your order!");
        }

    },
    computed: {
        totalItemsInTheCart: function () {
            return this.cart.length || " ";
        },
        canSubmitDetails() {
            this.order.errors = [];

            if (!this.order.name) {
                this.order.errors.push('Name required.');
            } else if (!this.validName(this.order.name)) {
                this.order.errors.push("The name can be letters only!");

            }
            if (!this.order.phone_number) {
                this.order.errors.push('Phone required.');
            } else if (!this.validNumber(this.order.phone_number)) {
                this.order.errors.push("Valid phone number required in format XXX XXX XXXX, numbers only!");

            }
            else {
                return true;
            }
        },
    },
}
</script>