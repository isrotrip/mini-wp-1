const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema =  new Schema({
  title: {
    type: String,
    required: true
  },
  tags: [{
    type: Schema.Types.ObjectId,
    ref: 'Tag'
  }],
  content: {
    type: String, 
    required: true
  },
  pictureUrl: {
    type: String
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  created_at: {
    type: Date,
    required: true
  }
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;