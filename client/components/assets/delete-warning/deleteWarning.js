Vue.component('delete-warning', {
  template: `
    <div>
      <button type="button" class="btn" data-toggle="modal" data-target="#warning">Delete</button>
      
      <div id="warning" class="modal fade" role="dialog">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" style="display:none">&times;</button>
              <h4 class="modal-title">Are You Sure Want To Delete This Content?</h4>
            </div>
            <div class="modal-body">
              <p>name of content is bla bla bla</p>
              <p>description of content is bla bla bla</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">No</button>
              <button type="button" class="btn btn-default" data-dismiss="modal">Yes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})