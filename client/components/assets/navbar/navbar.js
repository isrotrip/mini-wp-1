Vue.component('my-navbar', {
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <a class="navbar-brand" href="#" @click.prevent="$emit('change-position', 'home')">Mini Wordpress</a>
      <a class="navbar-brand" href="#" @click.prevent="$emit('change-position', 'create')">Create</a>
      <login
        @login="$emit('login', $event)"></login>
      <register></register>
      <form class="form-inline my-2 my-lg-0">
        <input class="form-control mr-sm-2" type="search" placeholder="Search Article..." aria-label="Search">
        <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
      </form>
    </nav>`
})