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

  const colorFormat = context.getOption("colorFormat");
  if (colorFormat == "rgb") {
    return code;
  }

  //Add the UIColor hex init
  const alphaFirst = context.getOption("colorFormat") == "hex_argb"
  code += "\n\n" + getSwiftHexColorExtension(alphaFirst);

  return code
}

function getExistingColorSwiftCode(context, color) {
  return `UIColor.${getColorStructName(context)}.${camelCase(color.name)}`;
}

function getColorSwiftCode(context, color) {
  const formatOption = context.getOption("colorFormat");
  if (formatOption == "rgb") {
    return `UIColor(red: ${color.r}/255.0, green: ${color.g}/255.0, blue: ${color.b}/255.0, alpha: ${color.a})`;
  }

  const hexColor = color.toHex();
  if (formatOption == "hex_rgba") {
    const parameterName = getSwiftHexInitParameterName(false);
    return `UIColor(${parameterName}:0x${hexColor.r}${hexColor.g}${hexColor.b}${hexColor.a})`;
  } else if (formatOption == "hex_argb") {
    const parameterName = getSwiftHexInitParameterName(true);
    return `UIColor(${parameterName}:0x${hexColor.a}${hexColor.r}${hexColor.g}${hexColor.b})`;
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

function getSwiftHexInitParameterName(alphaFirst) {
  return alphaFirst ? "argbValue" : "rgbaValue";
}

function getSwiftHexColorExtension(alphaFirst) {
  const parameterName = getSwiftHexInitParameterName(alphaFirst);
  const redShifintgValue = alphaFirst ? 16 : 24;
  const greenShiftingValue = alphaFirst ? 8 : 16;
  const blueShiftingValue = alphaFirst ? 0 : 8;
  const alphaShiftingValue = alphaFirst ? 24 : 0;

  return `
extension Color {
  convenience init(${parameterName}: UInt32) {
    let red   = CGFloat((${parameterName} >> ${redShifintgValue}) & 0xff) / 255.0
    let green = CGFloat((${parameterName} >> ${greenShiftingValue}) & 0xff) / 255.0
    let blue  = CGFloat((${parameterName} >> ${blueShiftingValue}) & 0xff) / 255.0
    let alpha = CGFloat((${parameterName} >> ${alphaShiftingValue}) & 0xff) / 255.0

    self.init(red: red, green: green, blue: blue, alpha: alpha)
  }
}`
}
