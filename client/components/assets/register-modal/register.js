Vue.component('register', {
  template:`
  <div>
    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#register-modal">
      Register
    </button>

    <div class="modal fade" id="register-modal" tabindex="-1" role="dialog" aria-labelledby="registerModalLable" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Register</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <input type="text" placeholder="Enter Username" required> <br>
            <input type="text" placeholder="Enter Email" required> <br>
            <input type="password" placeholder="Enter Password" required> <br>
            <button type="submit">Register</button>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Register</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  `
})