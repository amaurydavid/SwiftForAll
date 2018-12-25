function getColorsSwiftFileContent(structName,colors) {
  //Loop on every color
  var colorsCode = "";
  for (var color of colors){
    colorsCode += "\n\t" + getColorSwiftCode(color);
  }

  //Wrap colors code in an extension
  return `extension UIColor {
    struct ${structName} {
      ${colorsCode}
    }
  }`
}

module.exports = { getColorsSwiftFileContent };

var camelCase = require('camel-case')

function getColorSwiftCode(color) {
  return `static let ${camelCase(color.name)} = UIColor(red: ${color.r}/255.0, green: ${color.g}/255.0, blue: ${color.b}/255.0, alpha: ${color.a})`
}
