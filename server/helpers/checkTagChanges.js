module.exports = (before, after) => {
  console.log('beforenya', before)
  console.log('afternya', after)
  let result = {
    deleted: [],
    added: []
  }
  for(let i = 0; i < before.length; i++) {
    if(!after.filter(after => after.toString() === before[i].toString()).length) {
      result.deleted.push(before[i]);
    }
  }
  for(let i = 0; i < after.length; i++) {
    if(!before.filter(before => before.toString() === after[i].toString()).length) {
      result.added.push(after[i]);
    }
  }
  console.log(result)
  return result;
}