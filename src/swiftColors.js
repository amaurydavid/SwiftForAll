//Imports

var utils = require('./utils.js')
var camelCase = require('camel-case')

// Public functions

function getColorsSwiftSnippet(structName,colors) {
  //Loop on every color
  var colorsCode = "";
  for (var color of colors){
    colorsCode += utils.tab(2) + getColorDeclarationSwiftCode(color) + "\n";
  }

  //Wrap colors code in an extension
  var code = "extension UIColor {\n";
  code += utils.tab(1) + "struct " + structName + " {\n";
  code += colorsCode;
  code += utils.tab(1) + "}\n";
  code += "}";
  return code;
}

function getColorsSwiftFileContent(structName,colors) {
  //Add import to the snippet
  var code = "import UIKit\n\n";
  code += getColorsSwiftSnippet(structName, colors);
  return code
}

function getColorSwiftCode(color) {
  return `UIColor(red: ${color.r}/255.0, green: ${color.g}/255.0, blue: ${color.b}/255.0, alpha: ${color.a})`
}

module.exports = { getColorsSwiftSnippet, getColorsSwiftFileContent, getColorSwiftCode };

// Private functions

function getColorDeclarationSwiftCode(color) {
  return `static let ${camelCase(color.name)} = ${getColorSwiftCode(color)}`;
}


