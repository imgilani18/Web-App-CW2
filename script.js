const store = {
  state: {
      items: [
        { subject: 'Maths', location: 'London', price: 100, spaces: 10, availability: 10},
        { subject: 'Maths', location: 'Oxford', price: 95, spaces: 5, availability: 5},
        { subject: 'English', location: 'London', price: 80, spaces: 10, availability: 10},
        { subject: 'English', location: 'Oxford', price: 70, spaces: 5, availability: 5},
        { subject: 'Science', location: 'Coventry', price: 90, spaces: 5, availability: 5},
        { subject: 'Science', location: 'Lancaster', price: 90, spaces: 5, availability: 5},
        { subject: 'Music', location: 'Coventry', price: 50, spaces: 5, availability: 5},
        { subject: 'Music', location: 'Yorkshire', price: 50, spaces: 5, availability: 5},
        { subject: 'History', location: 'Yorkshire', price: 60, spaces: 5, availability: 5},
        { subject: 'History', location: 'London', price: 60, spaces: 5, availability: 5},
      ]
  },
  methods: {
    cart() {
      return this.items.filter(item => item.availability < item.spaces);
    },
  }
}

const Home = { template: `
<div id="options">
    <h1 class ='boxheading'>
      Options
    </h1>
    <input placeholder="Search" @input="searchTerm=$event.target.value.toLowerCase()" />

    <ul id="sorting"><b>Sort By</b>
      <li @click="sort" :class="{ selected: sortBy == 'subject'}">Subject</li>
      <li @click="sort" :class="{ selected: sortBy == 'location'}">Location</li>
      <li @click="sort" :class="{ selected: sortBy == 'price'}">Price</li>
      <li @click="sort" :class="{ selected: sortBy == 'availability'}">Availability</li>
    </ul>
    <ul id="ordering">
      <li @click="orderBy = 'ascending'" :class="{ selected: orderBy == 'ascending'}">Ascending</li>
      <li @click="orderBy = 'descending'" :class="{ selected: orderBy == 'descending'}">Descending</li>
    </ul>
  </div>
  <main>
    <h1>
      After School Club
    </h1>
    <div class="items">
      <div class="item" v-for="item in computedItems">
        <div class="item-top">
          <span>
            Subject: {{ item.subject }}<br />
            Location: {{ item.location }}<br />
            Price: £{{ item.price }}<br />
            Spaces: {{ item.availability }}<br />
          </span>

          <img :src=\`/public/images/\${item.subject}.png\`>
        </div>
        <div class="item-bot">
          <button @click="item.availability--" :disabled="item.availability == 0">
            Add to cart
          </button>
        </div>
      </div>
    </div>
  </main>
`,
  data() {
    return {
      sortBy: 'subject',
      orderBy: 'ascending',
      searchTerm: '',
      ...store.state
    }
  },
  methods: {
    // Sort based on sortBy
    sort(evt) {
      const by = evt.target.innerText.toLowerCase();
      this.items.sort((a, b) => a[by] > b[by] ? 1 : -1);
      this.sortBy = by;
    },
  },
  computed: {
    computedItems() {
      // Ordering based on orderBy
      const items = (this.orderBy == 'ascending') ? this.items : this.items.slice().reverse();

      // Full-text search on item values
      return items.filter(item => {
        const itemText = JSON.stringify(Object.values(item).join(' ')).toLowerCase();
        return itemText.includes(this.searchTerm);
      });
    },
  },
}

const Cart = { template: `
<main>
    <div v-if="cart.length">
      <h1 class ='boxheading2'>
        Shopping Cart
      </h1>
      <div class="cart" >

        <div class="item" v-for="item in cart">
          <div class="item-top">
            <span>
              Subject: {{ item.subject }}<br />
              Location: {{ item.location }}<br />
              Price: £{{ item.price }}<br />
              Spaces: {{ item.spaces - item.availability }}<br />
            </span>

            <img :src=\`/public/images/\${item.subject}.png\`>
          </div>
          <div class="item-bot">
            <button @click="item.availability++">
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="cart.length" id="checkout">
      <div><b>Total: </b>£{{ amount }}</div>
      <h1 class ='boxheading2'>
        Checkout
      </h1>
      <span>Name: </span> <input :class="{ valid: isValidName }" v-model='name' type="text" />
      <span>Phone: </span> <input :class="{ valid: isValidPhone }" v-model='phone' type="text" />
      <button @click="checkout" :disabled="!isValidName || !isValidPhone">Checkout</button>
    </div>
    </main>
`,
data() {
    return {
      name: '',
      phone: '',
      ...store.state
    }
},
methods: {
  checkout(){
      this.items.forEach(item => {
        item.spaces = item.availability;
      });
      alert("Order Placed Successfully!");
    }
},
computed: {
    amount() {
      return this.cart.map(item => item.price).reduce((a,b) => a+b,0);
    },
    isValidName() {
      // Name must be alhpabets 2-50 characters long
      return /^[a-zA-Z ]{1,50}$/.exec(this.name);
    },
    isValidPhone() {
      // Phone must be a number 10-12 digits long
      return /^[0-9]{10,12}$/.exec(this.phone)
    },
    cart: store.methods.cart,
}}

const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/cart',
    component: Cart,
  }
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes
})

const app = Vue.createApp({
  data() {
    return store.state
  },
  computed: {
  // Needed to enable cart icon when items added
    cart: store.methods.cart
}})

app.use(router);
app.mount('#app')