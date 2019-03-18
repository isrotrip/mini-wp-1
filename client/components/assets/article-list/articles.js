Vue.component('article-list', {
  props: ['articles', 'page', 'userInfo'],
  data(){
    return {
      pickArticle: {},
      currentIndex: ''
    }
  },
  template: `
    <div>
      <div
      v-if="page === 'home'"
      class="container"
      v-for="(article, index) in articles">
        <div class="card">
          <div class="row background-card">
            <div class="col-3">
              <img :src="article.pictureUrl" class="picture-box">
            </div>
            <div class="col-7">
              <div class="card-header row">
                <div class="mx-auto">
                  <center>
                    <h3>{{article.title}}</h3>
                    <a class="tag-name" href="#" v-for="articleTag in article.tags">{{articleTag.name}}</a>
                    <br>
                    created by: {{article.userId.name}} <br>
                    time: {{new Date(article.created_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}}
                  </center>
                </div>
              </div>
              <center>
                <a v-if="currentIndex !== index" @click="showContent(index)" class="read-full">show content</a>
                <a v-if="currentIndex === index" @click="showContent(index)" class="read-full">hide content</a>
              </center>
              <div v-if="currentIndex === index" class="card-body">
                <span v-html="article.content"></span>
              </div>
              <div v-if="userInfo._id" class="card-footer">
                <div v-if="userInfo._id.toString() === article.userId._id.toString()">
                  <center>
                    <a class="btn hover-btn-primary" href="#" @click.prevent="updateArticle(article)"><i class="fa fa-pencil-square-o"></i></a>
                    <button type="button" class="btn hover-btn-danger" @click.prevent="showWarning(article)"><i class="fa fa-trash-o"></i></button>
                  </center>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <center>
        <div v-if="pickArticle._id">      
          <div id="warning" class="modal fade" role="dialog">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" style="display:none">&times;</button>
                  <h4 class="modal-title">Are You Sure Want To Delete This Content?</h4>
                </div>
                <div class="card">
                  <div class="row background-card" style="width: 90%">
                    <div class="col-3">
                      <img :src="pickArticle.pictureUrl" class="picture-box">
                    </div>
                    <div class="col-7">
                      <div class="card-header row">
                        <div class="mx-auto">
                          <center>
                            <h3>{{pickArticle.title}}</h3>
                            <a class="tag-name" href="#" v-for="pickArticleTag in pickArticle.tags" @click="filter(pickArticleTag.name)">{{pickArticleTag.name}}</a>
                            <br>
                            created by: {{pickArticle.userId.name}} <br>
                            time: {{new Date(pickArticle.created_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}}
                          </center>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-default" data-dismiss="modal">No</button>
                  <button type="button" class="btn btn-default" data-dismiss="modal" @click="deleteArticle(pickArticle)">Yes</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </center>
    </div>`,
  methods: {
    updateArticle(article) {
      this.$emit('update-article', article);
    },

    deleteArticle(article) {
      this.$emit('delete-article', article);
    },

    showContent(index) {
      if(index !== this.currentIndex){
        this.currentIndex = index
      } else {
        this.currentIndex = ''
      }
    },

    showWarning(article) {
      this.pickArticle = article;
      setTimeout(() => {
        $('#warning').modal('toggle')
      }, 1)
    },

    filter(article) {
      this.$emit('filter', {
        type: 'tags',
        value: article
      })
    }
  }
})