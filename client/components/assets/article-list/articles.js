Vue.component('article-list', {
  props: ['article'],
  template: `
    <div class="container col-9 mx-auto">
      <div class="card">
        <div class="row">
          <div class="col-3">
            <img :src="article.picture" class="picture-box">
          </div>
          <div class="col-6">
            <div class="card-header row">
              <div class="col-4 mx-auto">Title: {{article.title}}</div>
              <div class="col-4 mx-auto">Tags: {{article.tag}}</div>
              <div class="col-4 mx-auto">Author: {{article.author}}</div>
              <div class="col-4 mx-auto">Author: {{article.created_at}}</div>
            </div>
            <div class="card-body">Content</div> 
            <div class="card-footer">
              <a class="navbar-brand" href="#" @click.prevent="$emit('update-post', article)">Update</a>
              <delete-warning></delete-warning>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})