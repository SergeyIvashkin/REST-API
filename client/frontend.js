import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.esm.browser.js';

Vue.component('loader', {
  template: `
<div class="text-center">
  <div class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</div>
  `,
});

new Vue({
  el: '#app',
  data() {
    return {
      form: {
        name: '',
        value: '',
      },
      contacts: [],
      loading: false,
    };
  },
  methods: {
    async createContact() {
      const { ...contact } = this.form;

      const newContact = await request('/app/contacts', 'POST', contact);

      this.contacts.push(newContact);

      this.form.name = this.form.value = '';
    },
    async markContact(id) {
      const person = this.contacts.find((el) => el.id === id);
      const update = await request(`/app/contacts/${id}`, 'PUT', { ...person, marked: true });
      person.marked = update.marked;

      console.log(person);

      //   const person = this.contacts;
      //   person.map((el) => (el.id === id ? (el.marked = true) : el));
    },
    async deleteContact(id) {
      await request(`/app/contacts/${id}`, 'DELETE');

      this.contacts = this.contacts.filter((el) => el.id !== id);
    },
  },
  computed: {
    canPress() {
      return this.form.name.trim() && this.form.value.trim();
    },
  },
  async mounted() {
    this.loading = true;

    this.contacts = await request('/app/contacts', 'GET');

    this.loading = false;
  },
});

async function request(url, method, data = null) {
  try {
    const headers = {};
    let body;

    if (data) {
      (headers['Content-Type'] = 'application/json'), (body = JSON.stringify(data));
    }

    const response = await fetch(url, {
      method,
      headers,
      body,
    });
    return await response.json();
  } catch (e) {
    console.log('error:', e.message);
  }
}
