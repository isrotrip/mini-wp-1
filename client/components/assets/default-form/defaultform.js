Vue.component('default-form',{
  props: ['position', 'update'],
  template: `
    <form @submit.prevent="sumbit">
      {{ position }}
      <div class="form-group">
        <label for="create-title">Title:</label>
        <input type="text" class="form-control" id="create-title">
      </div>
      <div class="form-group">
        <label for="create-tags">Tags:</label>
        <input type="text" class="form-control" id="create-tags">
      </div>
      <wysiwyg 
        :text=text
      ></wysiwyg>
      <button
        type="submit"
        class="btn btn-default"
        @click.prevent="$emit('change-position', 'home')">
        Cancel
      </button>
      <button
        type="submit"
        class="btn btn-default">
        Submit
      </button>
    </form>
  `,
  data() {
    return {
      title: '',
      tags: [],
      picture: '',
      text: ''
    }
  },
  created() {
    if(this.update) {
      this.article = this.update
    }
  },  
  methods: {
    cancel(){
      this.title = '',
      this.tags = [],
      this.picture = '',
      this.text = ''
      $('#summernote').summernote('code', 'text')
    },
    sumbit(){
      this.text = $('#summernote').summernote('code');      
    }
  }
})