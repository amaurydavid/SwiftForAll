function tab(count) {
  var result = "";
  for(var i = 0; i < count; i++) {
    result += "\t";
  }
  return result;
}

function capitalize(s)
{
  return s && s[0].toUpperCase() + s.slice(1);
}

module.exports = { tab, capitalize };
