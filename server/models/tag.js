const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tagSchema =  new Schema({
  name: {
    type: String,
    required: true
  },
  articles: [{
    type: Schema.Types.ObjectId,
    ref: 'Article'
  }]
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;