//Imports

var utils = require("./utils.js")
var camelCase = require('camel-case')

// Public functions

function getColorsSwiftSnippet(context, colors) {
  //Loop on every color
  var colorsCode = "";
  for (var color of colors){
    colorsCode += utils.tab(2) + getColorDeclarationSwiftCode(context, color) + "\n";
  }

  //Wrap colors code in an extension
  var code = "extension UIColor {\n";
  code += utils.tab(1) + "struct " + getColorStructName(context) + " {\n";
  code += colorsCode;
  code += utils.tab(1) + "}\n";
  code += "}";

  return code;
}

function getColorsSwiftFileContent(context, colors) {
  //Add import to the snippet
  var code = "import UIKit\n\n";
  code += getColorsSwiftSnippet(context, colors);

  //Add the UIColor hex init if needed
  if (context.getOption("colorPreferHex") == true) {
    code += "\n\n" + getSwiftHexColorExtension();
  }

  return code
}

function getExistingColorSwiftCode(context, color) {
  return `UIColor.${getColorStructName(context)}.${camelCase(color.name)}`;
}

function getColorSwiftCode(context, color) {
  if (context.getOption("colorPreferHex") == true) {
    const hexColor = color.toHex();
    return `UIColor(rgbaValue:0x${hexColor.r}${hexColor.g}${hexColor.b}${hexColor.a})`;
  } else {
    return `UIColor(red: ${color.r}/255.0, green: ${color.g}/255.0, blue: ${color.b}/255.0, alpha: ${color.a})`;
  }
}

function getColorStructName(context) {
  var structName = context.getOption("colorStructName");
  if (structName == "") {
    structName = utils.capitalize(camelCase(context.project.name));
  }
  return structName;
}

module.exports = { getColorsSwiftSnippet,
  getColorsSwiftFileContent,
  getColorSwiftCode,
  getExistingColorSwiftCode,
  getColorStructName
};

// Private functions

function getColorDeclarationSwiftCode(context, color) {
  return `static let ${camelCase(color.name)} = ${getColorSwiftCode(context, color)}`;
}

function getSwiftHexColorExtension() {
  return `
extension Color {
  convenience init(rgbaValue: UInt32) {
    let red   = CGFloat((rgbaValue >> 24) & 0xff) / 255.0
    let green = CGFloat((rgbaValue >> 16) & 0xff) / 255.0
    let blue  = CGFloat((rgbaValue >>  8) & 0xff) / 255.0
    let alpha = CGFloat((rgbaValue      ) & 0xff) / 255.0

    self.init(red: red, green: green, blue: blue, alpha: alpha)
  }
}`
}
