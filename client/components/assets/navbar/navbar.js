Vue.component('my-navbar', {
  props: ['userInfo', 'signForm'],
  
  data() {
    return {
      findArticle: '',
      auth2: null
    }
  },
  
  mounted () {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '813165512440-v1989g1p4nfu00bbbdf7jcm8u75u1bma.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin'
      });
      this.renderButton();
    });
  },

  watch: {
    async userInfo(val) {
      if(!val.isLogin) {
        await gapi.load('auth2', () => {
          this.auth2 = gapi.auth2.init({
            client_id: '813165512440-v1989g1p4nfu00bbbdf7jcm8u75u1bma.apps.googleusercontent.com',
            cookiepolicy: 'single_host_origin'
          });
        });
        this.renderButton();
      }
    }
  },
  
  template: `
    <div>
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark d-flex justify-content-around" style="background-color: black !important;">
        <a href="#" class="hover-btn-warning bigger white-font" @click.prevent="changePage('home')"><i class="fa fa-money"></i></a>
        <a href="#" class="hover-btn-peace bigger white-font" @click.prevent="$emit('show-tag')"><i class="fa fa-tag"></i></a>
          <form autocomplete="off" class="form-inline my-2 my-lg-0" @keyup.enter="filter" @submit.prevent="filter">
            <div class="input-group-append">
              <div class="autocomplete auto-filler">
                <input id="search-articles" class="form-control mr-sm-2" type="text" placeholder="Search Article..." aria-label="Search" name="searchArticles" v-model="findArticle">
              </div>
              <button class="btn btn-outline-success my-2 my-sm-0 black-white-button" type="submit"><i class="fa fa-search"></i></button>
            </div>
          </form>
          <button v-if="userInfo.isLogin" type="button" class="btn hover-btn-primary bigger white-font" @click.prevent="changePage('create')"><i class="fa fa-plus-square-o"></i></button>
          <button v-if="userInfo.isLogin" type="button" class="btn hover-btn-danger bigger white-font" @click.prevent="logout()"><i class="fa fa-sign-out"></i></button>
        
          <button v-if="!userInfo.isLogin" type="button" class="btn btn-primary" data-toggle="modal" data-target="#login-modal">
            Login
          </button>

          <div class="modal fade" id="login-modal" tabindex="-1" role="dialog" aria-labelledby="loginModalLable" aria-hidden="true">
            <div class="modal-dialog" role="document">
              <form @submit.prevent="login">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="loginModel">Login</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    <input type="text" placeholder="Enter Email" required v-model="signForm.email"> <br>
                    <input type="password" placeholder="Enter Password" required v-model="signForm.password"> <br>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary">Login</button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <button v-if="!userInfo.isLogin" type="button" class="btn btn-primary" data-toggle="modal" data-target="#register-modal">
            Register
          </button>

          <div class="modal fade" id="register-modal" tabindex="-1" role="dialog" aria-labelledby="registerModalLable" aria-hidden="true">
            <div class="modal-dialog" role="document">
              <form @submit.prevent="register">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Register</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    <input type="text" placeholder="Enter Username" required v-model="signForm.name"> <br>
                    <input typ  e="text" placeholder="Enter Email" required v-model="signForm.email"> <br>
                    <input type="password" placeholder="Enter Password" required v-model="signForm.password"> <br>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary">Register</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div v-if="!userInfo.isLogin" id="my-signin2"></div>
        
      </nav>
    </div>`,

  methods: {
    changePage(val) {
      this.$emit('cancel-form')
      this.$emit('change-page', val)
      if(val === 'home') {
        this.$emit('filter')
      }
    },
    
    login(){
      this.$emit('login')
    },

    register(){
      this.$emit('register')
    },

    async logout(){
      this.auth2 = gapi.auth2.getAuthInstance();
      await this.auth2.signOut().then(function () {
      });
      localStorage.removeItem('token')
      this.$emit('logout')
    },

    filter(){
      this.findArticle = $('#search-articles').val();
      this.$emit('filter', {
        type: 'Article',
        value: this.findArticle
      })
    },

    onSuccess(googleUser) {
      let id_token = googleUser.getAuthResponse().id_token;
      this.$emit('login', id_token)
    },

    onFailure(error) {
      SWAL('error', error);
    },

    renderButton() {
      gapi.signin2.render('my-signin2', {
        'scope': 'profile email',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': this.onSuccess,
        'onfailure': this.onFailure
      });
    }
  }
})