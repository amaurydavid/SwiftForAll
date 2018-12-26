function tab(count) {
  var result = "";
  for(var i = 0; i < count; i++) {
    result += "\t";
  }
  return result;
}

module.exports = { tab };
