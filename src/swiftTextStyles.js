function getTextStylesSwiftFileContent(context, textStyles) {
  return `import UIKit

  ${getEnumCode(textStyles)}

  extension TextStyle {
    typealias Attributes = [NSAttributedString.Key:Any]

    ${getAttributesCode(context, textStyles)}

  }

  extension String {
    func styled(as style: TextStyle) -> NSAttributedString {
      return NSAttributedString(string: self,
                                attributes: style.attributes)
    }
  }`
}

module.exports = { getTextStylesSwiftFileContent };

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
  var code = `var attributes: Attributes {
    switch self {`;

    for(var textStyle of textStyles) {
      code += `case .${camelCase(textStyle.name)}:
      ${getParagraphStyleCreationCode(textStyle)}
      return [.font: ${getFontCode(textStyle)},
              .paragraphStyle: paragraphStyle`
      if (typeof textStyle.color !== 'undefined') {
        code += `,
              .foregroundColor: ${getColorCode(context, textStyle.color)}`;
      }
      if (typeof textStyle.letterSpacing !== 'undefined') {
        code += `,
              .kern: ${textStyle.letterSpacing}`;
      }

      code += "]\n";
    }
  code += "\n}\n}";
  return code;
}

function getFontCode(textStyle) {
  return `UIFont(name: "${textStyle.fontFace}", size: ${textStyle.fontSize})`
}

function getParagraphStyleCreationCode(textStyle) {
  return `let paragraphStyle = NSMutableParagraphStyle()
  paragraphStyle.alignment = .${textStyle.textAlign}`
}


var swiftColors = require('./swiftColors.js')

function getColorCode(context, color) {
  const existingColor = context.project.findColorEqual(color)
  if (typeof existingColor !== 'undefined') {
    const structName = context.getOption("swiftColorStructName");
    return `UIColor.${structName}.${camelCase(existingColor.name)}`
  } else {
    return swiftColors.getColorSwiftCode(color)
  }
}


