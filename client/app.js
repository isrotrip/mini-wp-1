const app = new Vue ({
  el: '#app',

  data: {
    articles: [],
    articleShow: [],
    tags: [],
    nameTags: [],
    page: 'home',
    userInfo: {
      userName: '',
      userEmail: '',
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
    }
  },

  created () {
    if(localStorage.getItem('token')){
      this.verify()
    }
  },

  mounted () {
    gapi.load('auth2', function(){
      auth2 = gapi.auth2.init({
        client_id: '813165512440-v1989g1p4nfu00bbbdf7jcm8u75u1bma.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin'
      });
      this.renderButton();
    });
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
    },

    tags(tags) {
      this.nameTags = tags.map(tag => tag = { text: tag.name });
    }
  },

  methods: {
    changePage (value) {
      this.page = value;
    },

    filter (value = 'all') {
      if(value === 'all') {
        this.articleShow = this.articles.slice(0)
      } else if(value === 'tag') {
        this.articleShow = this.articles.filter(article => article)
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
            userName: data.userInfo.name,
            userEmail: data.userInfo.email,
            isLogin: true
          }
          this.getArticles();
          this.getTags();
        })
        .catch(({ data }) => {
          console.log(data)
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
          console.log(data.message)
          $('#register-modal').modal('toggle');
          this.signForm.concat({
            name: '',
            email: '',
            password: ''
          })
        })
        .catch(({ data }) => {
          console.log(data)
        })
    },

    login () {
      serverApi
        .post('/users/login', {
          email: this.signForm.email,
          password: this.signForm.password,
          loginVia:  'website'
        })
        .then(({ data }) => {
          console.log(data)
          this.signForm = {
            email: '',
            password: ''
          };
          $('#login-modal').modal('toggle');
          localStorage.setItem('token', data.token);
          this.userInfo = { 
            userName: data.userInfo.name,
            userEmail: data.userInfo.email,
            isLogin: true
          }
          this.getArticles();
          this.getTags();
        })
        .catch(({ data }) => {
          console.log(data)
          this.userInfo.isLogin = false
        })
    },

    logout () {
      localStorage.removeItem('token');
      this.isLogin = false;
      let auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function () {
        console.log('User signed out.');
      });
    },

    onSuccess(googleUser) {
      console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
    },

    onFailure(error) {
      console.log(error);
    },

    renderButton() {
      gapi.signin2.render('my-signin2', {
        'scope': 'profile email',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': onSuccess,
        'onfailure': onFailure
      });
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
        })
        .catch(({ data }) => {
          console.log(data)
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
        .catch(({ data }) => {
          console.log(data)
        })
    },

    sumbitForm(){
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
          console.log(data)
          if(this.page === 'create') {
            this.articles.unshift(data.article);
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
            this.getTags();
          }
          this.cancelForm();
        })
        .catch(({ data }) => {
          console.log(data);
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

    selectPicture () {
      $(document)
        .on('change', '.btn-file :file', function() {
        let input = $(this),
        label = input
          .val()
          .replace(/\\/g, '/')
          .replace(/.*\//, '');
        input
          .trigger('fileselect', [label]);
      });
    
      $('.btn-file :file')
        .on('fileselect', function(event, label) {
          let input = $(this)
            .parents('.input-group')
            .find(':text')
          log = label;  
          if( input.length ) {
            input.val(log);
          } else {
            if( log ) console.log(log);
          }
      });

      function readURL(input) {
        if (input.files && input.files[0]) {
          let reader = new FileReader();                
          reader.onload = function (e) {
            $('#img-upload').attr('src', e.target.result);
          }
          reader.readAsDataURL(input.files[0]);
        }
      }
    
      $("#imgInp")
        .change(function(){
          readURL(this)
        });
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
          console.log(data)
          this.articles = this.articles
            .filter(article => article._id.toString() !== data.article._id.toString());
          this.crudForm.idSelected = null;
          this.getTags();
        })
        .catch(error => {
          console.log(error)
        })
    },

  }
  
})