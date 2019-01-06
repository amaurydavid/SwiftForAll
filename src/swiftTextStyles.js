// Imports

var utils = require('./utils.js')
var swiftColors = require('./swiftColors.js')

// Public functions

function getTextStylesSwiftFileContent(context, textStyles) {
  return `import UIKit

  ${getTextStylesSwiftSnippet(context,textStyles)}

  extension String {
    func styled(as style: TextStyle) -> NSAttributedString {
      return NSAttributedString(string: self,
                                attributes: style.attributes)
    }
  }`
}

function getTextStylesSwiftSnippet(context, textStyles) {
  var code = getEnumCode(textStyles) + "\n\n";
  code += "extension TextStyle {\n";
  code += utils.tab(1) + getAttributesCode(context, textStyles);
  code += "\n}";
  return code
}

module.exports = { getTextStylesSwiftFileContent, getTextStylesSwiftSnippet };

// Private functions
var camelCase = require('camel-case')

function getEnumCode(textStyles) {
  var code = "enum TextStyle {\n";

  for(var textStyle of textStyles) {
    code += utils.tab(1) + "case " + camelCase(textStyle.name) + "\n";
  }

  code += "}";
  return code;
}

function getAttributesCode(context, textStyles) {
  var code = "var attributes: [NSAttributedString.Key: Any] {\n";
  code += utils.tab(2) + "switch self {\n";
  for(var textStyle of textStyles) {
    code += utils.tab(2) + "case ." + camelCase(textStyle.name) + ":\n";
    if (shouldUseParagraphStyle(textStyle)) {
      code += getParagraphStyleCreationCode(textStyle) + "\n";
    }

    code += utils.tab(3) + "return [.font: " + getFontCode(context, textStyle);
    if (shouldUseParagraphStyle(textStyle)) {
      code += ",\n" + utils.tab(4) + ".paragraphStyle: paragraphStyle";
    }
    if (typeof textStyle.color !== 'undefined') {
      code += ",\n" + utils.tab(4) + ".foregroundColor: " + getColorCode(context, textStyle.color);
    }
    if (typeof textStyle.letterSpacing !== 'undefined' && textStyle.letterSpacing != 0) {
      code += ",\n" + utils.tab(4) + ".kern: " + textStyle.letterSpacing;
    }

    code += "]\n\n";
  }
  code += utils.tab(2) + "}\n";
  code += utils.tab(1) + "}";
  return code;
}

function getFontCode(context, textStyle) {
  const fontFormat = context.getOption("fontFormat")
  if (fontFormat == "system") {
    return `UIFont(name: "${textStyle.fontFace}", size: ${textStyle.fontSize})`
  } else if (fontFormat == "swiftgen") {
    return `FontFamily.${textStyle.fontFamily}.${textStyle.weightText}.font(size: ${textStyle.fontSize})`;
  }
}

function shouldUseParagraphStyle(textStyle) {
  return (typeof textStyle.textAlign !== 'undefined')
  || (typeof textStyle.lineHeight !== 'undefined');
}

function getParagraphStyleCreationCode(textStyle) {
  var code = utils.tab(3) + "let paragraphStyle = NSMutableParagraphStyle()\n";
  //Handle the textAlign value
  if (typeof textStyle.textAlign !== 'undefined') {
    var swiftValue = textStyle.textAlign;
    if (swiftValue == "justify") {
      swiftValue = "justified";
    }
    code += utils.tab(3) + "paragraphStyle.alignment = ." + swiftValue + "\n";
  }

  //Handle the lineHeight value
  if (typeof textStyle.lineHeight !== 'undefined') {
    code += utils.tab(3) + "paragraphStyle.minimumLineHeight = " + textStyle.lineHeight;
  }

  return code;
}

function getColorCode(context, color) {
  const existingColor = context.project.findColorEqual(color)
  if (typeof existingColor !== 'undefined') {
    return swiftColors.getExistingColorSwiftCode(context, existingColor)
  } else {
    return swiftColors.getColorSwiftCode(context, color)
  }
}


