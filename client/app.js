
const app = new Vue ({
  el: '#app',

  data: {
    articles: [],
    tags: [],
    update: {},
    position: 'home',
    isLogin: false,
    tokenVerified: null,
    userName: '',
    formTitle: '',
    formTags: [],
    formPicture: '',
    formTtext: '',
    email: '',
    name: '',
    password: ''
  },

  created () {
    if(localStorage.getItem('token')){
      this.verify()
    }
  },

  watch: {
    isLogin(val) {
      if(val === true) {
        this.getArticles()
        this.getTags()
      } else {
        this.articles = [],
        this.tags = []
      }
    }
  },

  methods: {
    verify () {
      serverApi
        .post('/users/verify', {}, {
          headers: {
            token: localStorage.getItem('token')
          }
        })
        .then(({ data }) => {``
          this.tokenVerified = data.token
          localStorage.setItem('token', data.token)
          this.userName = data.userInfo.name
          this.isLogin = true
        })
        .catch(({ data }) => {
          console.log(data)
          this.isLogin = false
        })
    },

    getArticles () {
      serverApi
        .get('/articles', {
          headers: {
            token: this.tokenVerified
          }
        })
        .then(({ data }) => {
          this.articles.push(data);
        })
        .catch(({ data }) => {
          console.log(data)
        })
    },

    getTags () {
      serverApi
        .get('/tags', {
          headers: {
            token: this.tokenVerified
          }
        })
        .then(({ data }) => {
          this.tags.push(data)
        })
        .catch(({ data }) => {
          console.log(data)
        })
    },

    updatePost(updateData) {
      console.log('tes')
      this.position = 'update'
    },

    cancelForm(){
      this.formTitle = '',
      this.formTags = [],
      this.formPicture = '',
      this.formText = ''
      $('#summernote').summernote('code', '')
    },

    sumbitForm(){
      this.formText = $('#summernote').summernote('code');      
    },

    login () {
      serverApi
        .post('/users/login', {
          email: this.email,
          password: this.password,
          loginVia: 'website'
        })
        .then(({ data }) => {
          console.log(data)
          this.email = '';
          this.password = '';
          $('#login-modal').modal('toggle');
          localStorage.setItem('token', data.token);
          this.tokenVerified = data.token;
          this.isLogin = true;
        })
        .catch(({ data }) => {
          console.log(data)
          this.isLogin = false
        })
    },

    register () {
      serverApi
        .post('/users/register', {
          name: this.name,
          email: this.email,
          password: this.password
        })
        .then(({ data }) => {
          console.log(data.message)
          $('#register-modal').modal('toggle');
          this.name = '',
          this.email = '',
          this.password = ''
        })
        .catch(({ data }) => {
          console.log(data)
        })
    },

  }
})