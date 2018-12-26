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
  return `${getEnumCode(textStyles)}

  extension TextStyle {
    ${getAttributesCode(context, textStyles)}
  }`
}

module.exports = { getTextStylesSwiftFileContent, getTextStylesSwiftSnippet };

// Private functions
var camelCase = require('camel-case')

function getEnumCode(textStyles) {
  var code = "enum TextStyle {";

  for(var textStyle of textStyles) {
    code += "\ncase " + camelCase(textStyle.name);
  }

  code += "\n}";
  return code;
}

function getAttributesCode(context, textStyles) {
  var code = "var attributes: [NSAttributedString.Key: Any] {\n";
  code += "switch self {\n";
  for(var textStyle of textStyles) {
    code += "case ." + camelCase(textStyle.name) + ":\n";
    if (shouldUseParagraphStyle(textStyle)) {
      code += getParagraphStyleCreationCode(textStyle) + "\n";
    }

    code += "return [.font: " + getFontCode(textStyle);
    if (shouldUseParagraphStyle(textStyle)) {
      code += ",\n.paragraphStyle: paragraphStyle";
    }
    if (typeof textStyle.color !== 'undefined') {
      code += ",\n.foregroundColor: " + getColorCode(context, textStyle.color);
    }
    if (typeof textStyle.letterSpacing !== 'undefined' && textStyle.letterSpacing != 0) {
      code += ",`\n.kern: " + textStyle.letterSpacing;
    }

    code += "]\n";
  }
  code += "\n}\n}";
  return code;
}

function getFontCode(textStyle) {
  return `UIFont(name: "${textStyle.fontFace}", size: ${textStyle.fontSize})`
}

function shouldUseParagraphStyle(textStyle) {
  return (typeof textStyle.textAlign !== 'undefined')
  || (typeof textStyle.lineHeight !== 'undefined');
}

function getParagraphStyleCreationCode(textStyle) {
  var code = "let paragraphStyle = NSMutableParagraphStyle()\n";
  //Handle the textAlign value
  if (typeof textStyle.textAlign !== 'undefined') {
    var swiftValue = textStyle.textAlign;
    if (swiftValue == "justify") {
      swiftValue = "justified";
    }
    code += "paragraphStyle.alignment = ." + swiftValue + "\n";
  }

  //Handle the lineHeight value
  if (typeof textStyle.lineHeight !== 'undefined') {
    code += "paragraphStyle.minimumLineHeight = " + textStyle.lineHeight;
  }

  return code;
}


var swiftColors = require('./swiftColors.js')

function getColorCode(context, color) {
  const existingColor = context.project.findColorEqual(color)
  if (typeof existingColor !== 'undefined') {
    const structName = context.getOption("colorStructName");
    return `UIColor.${structName}.${camelCase(existingColor.name)}`
  } else {
    return swiftColors.getColorSwiftCode(color)
  }
}


