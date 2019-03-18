Vue.component('default-form',{
  props: ['page', 'crudForm', 'nameTags'],
  template: `
    <div
      v-if="page === 'create' || page === 'update'">
      <center>
      <form @submit.prevent="sumbitForm">
        <h3>{{ page == 'create' ? 'Create' : 'Update' }} Form</h3>
        <div class="form-group">
          <label for="create-title">Title:</label>
          <input type="text" class="form-control" id="create-title" v-model="crudForm.formTitle">
        </div>
        <div class="form-group">
          <label for="create-tags">Tags:</label>
          <br>
            <vue-tags-input
              v-model="crudForm.formTag"
              :tags="crudForm.formNameTags"
              :autocomplete-items="nameTags"
              @tags-changed="newTags => crudForm.formNameTags = newTags"
            />
        </div>
        <div class="col-md-6">
          <div class="form-group">
              <label>Upload Image</label>
              <div class="input-group">
                  <span class="input-group-btn">
                      <span class="btn btn-default btn-file" @click="selectPicture">
                        Browse… <input type="file" id="imgInp">
                      </span>
                  </span>
                  <input type="text" class="form-control" readonly>
              </div>
              <img id='img-upload'/>
          </div>
        </div>
        <wysiwyg
          :text="crudForm.formText"></wysiwyg>
        <button
          type="submit"
          class="btn btn-default"
          @click.prevent="cancelForm">
          Cancel
        </button>
        <button
          type="submit"
          class="btn btn-default">
          Submit
        </button>
      </form>
      </center>
    </div>`,
  data() {
    return {
      title: '',
      tags: [],
      picture: '',
      text: ''
    }
  },
  methods: {
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

    cancelForm () {
      this.$emit('cancel-form')
    },

    sumbitForm () {
      this.$emit('submit-form')
    }
  }
})