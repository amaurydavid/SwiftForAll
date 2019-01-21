// Imports

var utils = require('./utils.js')
var swiftColors = require('./swiftColors.js')

// Public functions

function getTextStylesSwiftFileContent(context, textStyles) {
  const usesSystemFontFormat = context.getOption("fontFormat") == "system";

  var code = "";
  if (usesSystemFontFormat) {
    code += getSwiftFontImportCode() + "\n\n";
  }
  code += getTextStylesSwiftSnippet(context,textStyles, true)
  code += getSwiftConvenienceStringExt()
  return code
}

function getTextStylesSwiftSnippet(context, textStyles, forExport) {
  var code = getEnumCode(textStyles) + "\n\n";
  code += "extension TextStyle {\n";
  code += utils.tab(1) + getAttributesCode(context, textStyles, forExport);
  code += "\n}";
  return code
}

module.exports = { getTextStylesSwiftFileContent, getTextStylesSwiftSnippet };

// Private functions
var camelCase = require('camel-case')

function getSwiftConvenienceStringExt() {
  return
`extension String {
  func styled(as style: TextStyle) -> NSAttributedString {
    return NSAttributedString(string: self,
                              attributes: style.attributes)
  }
}`;
}

function getSwiftFontImportCode() {
  return `#if os(OSX)
  import AppKit.NSFont
  internal typealias Font = NSFont
#elseif os(iOS) || os(tvOS) || os(watchOS)
  import UIKit.UIFont
  internal typealias Font = UIFont
#endif
`;
}

function getFontSwiftType(context, forExport) {
  if (forExport) {
    return "Font";
  }
  if (context.project.type == "osx") {
    return "NSFont";
  }
  return "UIFont";
}

function getEnumCode(textStyles) {
  var code = "enum TextStyle {\n";

  for(var textStyle of textStyles) {
    code += utils.tab(1) + "case " + camelCase(textStyle.name) + "\n";
  }

  code += "}";
  return code;
}

function getAttributesCode(context, textStyles, forExport) {
  var code = "var attributes: [NSAttributedString.Key: Any] {\n";
  code += utils.tab(2) + "switch self {\n";
  for(var textStyle of textStyles) {
    code += utils.tab(2) + "case ." + camelCase(textStyle.name) + ":\n";
    if (shouldUseParagraphStyle(textStyle)) {
      code += getParagraphStyleCreationCode(textStyle) + "\n";
    }

    code += utils.tab(3) + "return [.font: " + getFontCode(context, textStyle, forExport);
    if (shouldUseParagraphStyle(textStyle)) {
      code += ",\n" + utils.tab(4) + ".paragraphStyle: paragraphStyle";
    }
    if (typeof textStyle.color !== 'undefined') {
      code += ",\n" + utils.tab(4) + ".foregroundColor: " + getColorCode(context, textStyle.color, forExport);
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

function getFontCode(context, textStyle, forExport) {

  const fontType = getFontSwiftType(context, forExport);

  if (textStyle.fontFamily.startsWith("SFPro") ||
      textStyle.fontFamily.startsWith("SFCompact")) {
    const fontWeightCode = ".init(rawValue: " + textStyle.fontWeight + ")";
    return "${fontType}.systemFont(ofSize:" + textStyle.fontSize + ", weight: " + fontWeightCode + ")";
  }

  const fontFormat = context.getOption("fontFormat");
  if (fontFormat == "system") {
    return `${fontType}(name: "${textStyle.fontFace}", size: ${textStyle.fontSize}) as Any`
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

function getColorCode(context, color, forExport) {
  const existingColor = context.project.findColorEqual(color)
  if (typeof existingColor !== 'undefined') {
    return swiftColors.getExistingColorSwiftCode(context, existingColor, forExport)
  } else {
    return swiftColors.getColorSwiftCode(context, color, forExport)
  }
}


