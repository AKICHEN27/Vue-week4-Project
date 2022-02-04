import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.js';
import pagination from './pagination.js';

const url = 'https://vue3-course-api.hexschool.io/v2';
const api_path = 'zen777';
let productModal = {};
let delProductModal = {};

const app = createApp ({
  data() {
    return {
      url: 'https://vue3-course-api.hexschool.io/v2',
      products: [],
      temp: {
        imagesUrl: [],
      },
      isNew: false,
      pagination: {},
    }
  },
  components: {
    pagination
  },
  methods: {
    // 驗證API
    userCheck() {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      axios.defaults.headers.common['Authorization'] = token;
      axios
        .post(`${url}/api/user/check`)
        .then((res) => {
          this.getProducts();
        })
        .catch((err) => {
          alert(err.data.message);
          windows.location = 'index.html';
        })
    },
    // 取得產品列表
    getProducts(page = 1) { //參數預設值
      axios
      .get(`${url}/api/${api_path}/admin/products/?page=${page}`)
      .then((res) => {
        this.products = res.data.products;
        this.pagination = res.data.pagination;
      })
      .catch((err) => {
        console.dir(err);
      })
    },
    // 判斷按鈕後開啟互動視窗
    openModal(status, product) {
      if (status === 'new'){
        this.temp = {
          imagesUrl: [],
        }
        this.isNew = true;
        productModal.show();
      }else if ( status === 'edit' ){
        this.temp = {...product};
        this.isNew = false;
        productModal.show();
      }else if ( status === 'del'){
        delProductModal.show();
        this.temp = {...product};
      }
    }
  },
  mounted() {
    this.userCheck();
    productModal = new bootstrap.Modal(document.getElementById('productModal'));
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));
  }
})

app.component('productModal', {
  props: ['temp', 'isNew'],
  template: '#templateProductModal',
  methods: {
    // 元件資料更動時需帶動更新資料
    updateProduct() {
      // 切換post跟put
      let link = `${url}/api/${api_path}/admin/product`;
      let method = 'post';
      if (!this.isNew) {
        method = 'put';
        link = `${url}/api/${api_path}/admin/product/${this.temp.id}`;
      }
      axios
        [method](link, { data:this.temp })
        .then((res) => {
          productModal.hide(); //關閉互動視窗
          this.$emit('get-products');
        })
    },
  }
});

app.component('delProductModal', {
  props: ['temp'],
  template: '#templateDelProductModal',
  methods: {
    delProduct() {
      axios
        .delete(`${url}/api/${api_path}/admin/product/${this.temp.id}`)
        .then((res) => {
          delProductModal.hide(); //關閉互動視窗
          this.$emit('get-products'); //重新取得產品列表
        })
    }
  },
})

app.mount('#app');