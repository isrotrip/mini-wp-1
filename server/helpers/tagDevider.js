const Tag = require('../models/tag');

module.exports = (tags) => {
  let makeTagUnique = [];
  let objectTag = {};
  tags
    .split(',')
    .forEach(tag => {
      if(tag.length > 0) {
        objectTag[tag] = 0
      }
    });
  makeTagUnique = Object.keys(objectTag);

  let promiseTags = [];
  makeTagUnique.forEach(tag => {
    promiseTags.push(new Promise ((resolve, reject) => {
      return Tag
        .findOne({
          name: tag
        })
        .then(findTag => {
          if(!findTag) {
            return Tag
              .create({
                name: tag 
              })
              .then(createTag => {
                resolve(createTag);
              })
          } else {
            resolve (findTag);
          }
        })
        .catch(error => {
          reject(error);
        })
    }))
  })

  return promiseTags;
}