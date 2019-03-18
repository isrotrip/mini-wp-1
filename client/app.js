const app = new Vue ({
  el: '#app',

  data: {
    articles: [],
    articleShow: [],
    tags: [],
    nameTags: [],
    page: 'home',
    userInfo: {
      isLogin: false
    },
    crudForm: {
      formTitle: '',
      formTag: '',
      formTags: [],
      formPicture: '',
      formText: '',
      pictureForm: '',
      idSelected: null,
      formNameTags: []
    },
    signForm: {
      email: '',
      name: '',
      password: ''
    },
    showTag: false
  },

  created () {
    if(localStorage.getItem('token')){
      this.verify()
    }
    this.getArticles();
    this.getTags();

  },

  watch: {
    tags(tags) {
      this.nameTags = tags.map(tag => tag = { text: tag.name });
    }
  },

  methods: {
    changePage (value) {
      this.page = value;
    },

    toggleTag () {
      if(this.showTag){
        this.showTag = false;
      } else {
        this.showTag = true;
      }
    },

    filter (payload) {
      if(!payload) {
        this.articleShow = this.articles.slice(0);
      }
      else if(payload.type === 'Article') {
        this.articleShow = this.articles.filter(article => article.title.toLowerCase().indexOf(payload.value.toLowerCase()) !== -1);
      } else if(payload.type === 'tags') {
        if(payload.exact === false){
          this.articleShow = this.articles.filter(article => article.tags.map(tag => tag.name.toLowerCase().indexOf(payload.value.toLowerCase()) !== -1).includes(true));
        } else {
          this.articleShow = this.articles.filter(article => article.tags.map(tag => tag.name.toLowerCase()).indexOf(payload.value.toLowerCase()) !== -1);
        }
      }
    },

    verify () {
      serverApi
        .post('/users/verify', {}, {
          headers: {
            token: localStorage.getItem('token')
          }
        })
        .then(({ data }) => {
          this.userInfo = {
            _id: data.userInfo._id,
            userName: data.userInfo.name,
            userEmail: data.userInfo.email,
            isLogin: true
          }
        })
        .catch(({ response }) => {
          SWAL('error', 'Invalid Token');
          localStorage.removeItem('token')
          this.userInfo.isLogin = false
        })
    },

    register () {
      serverApi
        .post('/users/register', {
          name: this.signForm.name,
          email: this.signForm.email,
          password: this.signForm.password
        })
        .then(({ data }) => {
          $('#register-modal').modal('toggle');
          this.signForm = {
            name: '',
            email: '',
            password: ''
          }
        })
        .catch(({ response }) => {
          SWAL('error', response.data.message)
        })
    },

    login (google_token) {
      let payload = {};
      if(google_token) {
        payload = {
          google_token: google_token,
          loginVia: 'google'
        }
      } else {
        payload = {
          email: this.signForm.email,
          password: this.signForm.password,
          loginVia: 'website'
        }
      }
      serverApi
        .post('/users/login', payload)
        .then(({ data }) => {
          (data)
          this.signForm = {
            email: '',
            password: ''
          };
          if(!google_token) {
            $('#login-modal').modal('toggle');
          }
          localStorage.setItem('token', data.token);
          this.userInfo = { 
            _id: data.userInfo._id,
            userName: data.userInfo.name,
            userEmail: data.userInfo.email,
            isLogin: true
          }
          this.getArticles();
          this.getTags();
        })
        .catch(({ response }) => {
          console.log(response)
          SWAL('error', response.data.message)
          this.userInfo.isLogin = false
        })
    },

    logout () {
      this.page = 'home'
      localStorage.removeItem('token');
      this.userInfo = {
        isLogin: false
      };
      this.filter();
    },

    getArticles () {
      serverApi
        .get('/articles', {
          headers: {
            token: localStorage.getItem('token')
          }
        })
        .then(({ data }) => {
          this.articles = data.articles;
          autocomplete(document.getElementById("search-articles"),
            this.articles
              .map(article => article.title)
          );
          this.filter();
        })
        .catch(({ response }) => {
          SWAL('error', response.data.message)
        })
    },

    getTags () {
      serverApi
        .get('/tags', {
          headers: {
            token: localStorage.getItem('token')
          }
        })
        .then(({ data }) => {
          this.tags = data.tags;
          this.formData 
          autocomplete(document.getElementById("search-tags"),
            this.tags
              .map(tag => tag.name)
          );
          autocomplete(document.getElementById("option-tag"),
            this.tags
              .map(tag => tag.name)
          );
        })
        .catch(({ response }) => {
          // SWAL('error', response.data.message)
        })
    },

    submitForm(){
      this.crudForm.formText = $('#summernote').summernote('code');
      let bodyFormData = new FormData();
      bodyFormData.set('title', this.crudForm.formTitle);
      bodyFormData.set('tags', this.crudForm.formNameTags
        .map(tag => tag.text)
        .join(','));
      bodyFormData.set('content', this.crudForm.formText);
      bodyFormData
        .append('image',
          document.getElementById('imgInp').files[0]
        );
      let method = '';
      let additionUrl = '';
      if(this.page === 'create') {
        method = 'post'
      } else if(this.page === 'update') {
        method = 'put'
        additionUrl += `/${this.crudForm.idSelected}`
      }
      serverApi({
        method: method,
        url: `${serverUrl}/articles${additionUrl}`,
        data: bodyFormData,
        headers: {
          token: localStorage.getItem('token')
        },
        config: { 
          headers: {
            'Content-Type': 'multipart/form-data' 
          }
        }
      })
        .then(({ data }) => {
          if(this.page === 'create') {
            this.articles.unshift(data.article);
            this.articleShow.unshift(data.article);
            this.getTags();
          } else if(this.page === 'update') {
            this.articles
              .splice( 
                ( this.articles
                  .map( article => article._id )
                  .indexOf( this.idSelected )
                ), 1);
            this.articles.unshift(data.article);
            data.article.tags.forEach( tag => {
              if(this.tags.indexOf(tag) === -1) {
                this.tags.push(tag);
              }
            })
            this.articleShow
              .splice( 
                ( this.articleShow
                  .map( article => article._id )
                  .indexOf( this.idSelected )
                ), 1);
            this.articleShow.unshift(data.article);
            data.article.tags.forEach( tag => {
              if(this.tags.indexOf(tag) === -1) {
                this.tags.push(tag);
              }
            })
            this.getTags();
          }
          this.cancelForm();
        })
        .catch(({ response }) => {
          SWAL('error', response.data.message)
        })
    },

    cancelForm(){
      this.crudForm = {
        formTitle: '',
        formTags: [],
        formPicture: '',
        formText: '',
        idSelected: null,
        formNameTags: []
      };
      $('#summernote').summernote('code', '');
      this.page = 'home';
    },

    updateArticle (article) {
      this.crudForm = {
        idSelected: article._id,
        formTitle: article.title,
        formTags: article.tags
          .map( tag => tag.name ),
        formPicture: article.pictureUrl,
        formText: article.content,
        formNameTags: article.tags
          .map( tag => tag = { text: tag.name }) 
      };
      this.page = 'update';
      $('#img-upload').ready(() => {
        let label = this.crudForm.formPicture.split('/new-mini-wp/')[1];
        for(i = 0; i < label.length; i++){
          if(label[i] * 0 !== 0){
            label = label.slice(i);
            break;
          }
        }
        $('#imgInp').parents('.input-group').find(':text').val(label)
        $('.btn-file :file').trigger('fileselect', [label]);
        $('#img-upload').attr('src', this.crudForm.formPicture);
      });
    },

    deleteArticle (article) {
      this.crudForm.idSelected = article._id;
      serverApi
        .delete(`${serverUrl}/articles/${this.crudForm.idSelected}`, {
          headers: {
            token: localStorage.getItem('token')
          },
        })
        .then(({ data }) => {
          this.articles = this.articles
            .filter(article => article._id.toString() !== data.article._id.toString());
          this.articleShow = this.articleShow
            .filter(article => article._id.toString() !== data.article._id.toString());
          this.crudForm.idSelected = null;
          this.getTags();
        })
        .catch(({ response }) => {
          SWAL(response.data.message)
        })
    },

  }
  
})