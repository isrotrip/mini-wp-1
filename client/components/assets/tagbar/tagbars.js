Vue.component('my-tagbar', {
  props: ['tags', 'nameTags'],
  template: `
    <div>
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark tag-bar background-card">
        <!-- search tag  -->
        <form autocomplete="off" class="form-inline my-2 my-lg-0" @submit.prevent="filter" @keyup.enter="filter">
          <div class="input-group-append">
            <div class="autocomplete auto-filler">
              <input id="search-tags" class="form-control mr-sm-2" type="text" placeholder="Search Tags..." aria-label="Search" name="searchArticles" v-model="findTags">
              <button class="btn btn-outline-success my-2 my-sm-0 white-black-button" type="submit"><i class="fa fa-search"></i></button>
            </div>
          </div>
        </form>
        <!-- pick tag --> 
        <button v-for="(tag, index) in tags" type="button" class="tag-name btn-tag" @click="filter(tag.name)"> {{ tag.name }} - {{ tag.articles.length }} </button>
      </nav>
    </div>`,
  data() {
    return {
      findTags: ''
    }
  },
  methods: {
    filter(value) {
      if(!value || value.key == 'Enter') {
        this.findTags = $('#search-tags').val();
        this.$emit('filter', {
          type: 'tags',
          value: this.findTags,
          exact: false
        })
      } else {
        this.$emit('filter', {
          type: 'tags',
          value: value,
          exact: true
        })
      }
    }
  }
})