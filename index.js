import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.js';

const url = 'https://vue3-course-api.hexschool.io/v2';

const app = createApp ({
  data() {
    return {
      user: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    // 登入驗證
    login() {
      axios
        .post(`${url}/admin/signin`, this.user)
        .then((res) => {
          const { token, expired } = res.data;
          document.cookie = `hexToken = ${ token }; expires = ${ new Date (expired)}`;
          window.location = 'products.html';
        })
        .catch((err) => {
          alert(err.data.message);
        })
    }
  }
})
app.mount('#app');