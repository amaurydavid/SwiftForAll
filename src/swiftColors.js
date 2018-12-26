
function getColorsSwiftSnippet(structName,colors) {
  //Loop on every color
  var colorsCode = "";
  for (var color of colors){
    colorsCode += "\n\t" + getColorDeclarationSwiftCode(color);
  }

  //Wrap colors code in an extension
  return `extension UIColor {
    struct ${structName} {
      ${colorsCode}
    }
  }`;
}

function getColorsSwiftFileContent(structName,colors) {
  //Add import to the snippet
  return `import UIKit

  ${getColorsSwiftSnippet(structName, colors)}`;
}

function getColorSwiftCode(color) {
  return `UIColor(red: ${color.r}/255.0, green: ${color.g}/255.0, blue: ${color.b}/255.0, alpha: ${color.a})`
}

module.exports = { getColorsSwiftSnippet, getColorsSwiftFileContent, getColorSwiftCode };

var camelCase = require('camel-case')

function getColorDeclarationSwiftCode(color) {
  return `static let ${camelCase(color.name)} = ${getColorSwiftCode(color)}`;
}


