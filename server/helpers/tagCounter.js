const Tag = require('../models/tag');

module.exports = (articleId, added, deleted) => {
  console.log(articleId, 'artikel')
  console.log(added, 'added')
  console.log(deleted, 'delete')
  let promiseTag = [];
  added.forEach(id => {
    promiseTag.push(
      new Promise ((resolve, reject) => {
        Tag
          .findById(id)
          .then(findTag => {
            console.log(findTag)
            if(findTag){
              findTag.articles.push(articleId)
              findTag.save()
              resolve({'increase': findTag})
            } else {
              resolve({'increase': 'nothing'})
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    )
  })
  deleted.forEach(id => {
    promiseTag.push(
      new Promise ((resolve, reject) => {
        Tag
          .findById(id)
          .then(findTag => {
            if(findTag) {
              findTag.articles = findTag.articles
              .filter(article => article._id.toString() !== articleId.toString())
              if(!findTag.articles.length) {
                return Tag
                  .findByIdAndDelete(findTag._id)
                  .then(deleteTag => {
                    resolve({'delete': deleteTag})
                  })
              } else {
                findTag.save()
                resolve({'reduce': findTag})
              }
            } else {
              resolve({'reduce': 'nothing'})
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    )
  })
  return Promise.all(promiseTag)
}