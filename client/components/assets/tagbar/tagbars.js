Vue.component('my-tagbar', {
  props: ['tags'],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark tag-bar">
      <form class="form-inline my-2 my-lg-0">
        <div class="input-group-append">
          <input class="form-control mr-sm-2" type="search" placeholder="Search Tag..." aria-label="Search">
          <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
        </div>
      </form>
      <a v-for="(tag, index) in tags" class="navbar-brand" href="#" :id="index">{{tag}}</a>
    </nav>`
})