Vue.component('wysiwyg', {
  props: ['text']
  ,template: `
    <div>
      <form>
        <textarea id="summernote" name="editordata"></textarea>
      </form>
    </div>
  `,
  mounted () {
    $('#summernote').summernote({
      placeholder: 'Input Content Here...',
      tabsize: 2,
      height: 100
    });
  }
})
