Vue.component('login', {
  template: `
    <div>
      <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#login-modal">
        Login
      </button>

      <div class="modal fade" id="login-modal" tabindex="-1" role="dialog" aria-labelledby="loginModalLable" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="loginModel">Login</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form @submit="login">
                <input type="text" placeholder="Enter Email" required> <br>
                <input type="password" placeholder="Enter Password" required> <br>
                <button type="submit">Login</button>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">Login</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    login () {
      serverApi
        .post('/users/login', {
          email: this.email,
          password: this.password
        })
        .then(({ data }) => {
          this.$emit('login', data);
          this.email = '';
          this.password = '';
        })
        .catch(({ data }) => {
          this.isLogin = false
        })
    }
  }
})