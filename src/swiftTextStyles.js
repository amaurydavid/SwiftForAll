// Imports

var utils = require('./utils.js')
var swiftColors = require('./swiftColors.js')

// Public functions

function getTextStylesSwiftFileContent(context, textStyles) {
  var code = getSwiftFontImportCode(context) + "\n\n";
  code += "//swiftlint:disable file_length\n";
  code += "//swiftlint:disable identifier_name\n\n";
  code += getTextStylesSwiftSnippet(context,textStyles, true) + "\n\n";
  code += getSwiftConvenienceStringExt();
  code += "\n\n//swiftlint:enable identifier_name\n";
  code += "//swiftlint:enable file_length\n";
  return code
}

function getTextStylesSwiftSnippet(context, textStyles, forExport) {
  var code = getEnumCode(textStyles) + "\n\n";
  code += "extension TextStyle {\n";
  code += utils.tab(1) + getAllAttributesCode(context, textStyles, forExport) + "\n\n";
  code += "\n}";
  return code
}

function getAttributesCode(context, textStyle, forStyleguide, forExport, indent) {
  var code = "";

  const usesParagraphStyle = shouldUseParagraphStyle(textStyle);
  if (usesParagraphStyle) {
    code += getParagraphStyleCreationCode(textStyle, indent) + "\n";
  }

  if (forStyleguide) {
    code += utils.tab(indent) + "return ";
  } else {
    code += "let attributes = ";
  }

  code += "[.font: " + getFontCode(context, textStyle, forExport);

  indent = indent + 1;

  if (usesParagraphStyle) {
    code += ",\n" + utils.tab(indent) + ".paragraphStyle: paragraphStyle";
  }
  if (typeof textStyle.color !== 'undefined') {
    code += ",\n" + utils.tab(indent) + ".foregroundColor: " + getColorCode(context, textStyle.color, forExport);
  }
  if (typeof textStyle.letterSpacing !== 'undefined' && textStyle.letterSpacing != 0) {
    code += ",\n" + utils.tab(indent) + ".kern: " + textStyle.letterSpacing;
  }

  code += "]";
  return code;
}

module.exports = { getTextStylesSwiftFileContent, getTextStylesSwiftSnippet, getAttributesCode };

// Private functions
var camelCase = require('camel-case')

function getSwiftConvenienceStringExt() {
  return `extension String {
  func styled(as style: TextStyle) -> NSAttributedString {
    return NSAttributedString(string: self,
                              attributes: style.attributes)
  }
}`;
}

function getSwiftFontImportCode() {
  const usesSwiftGen = context.getOption("fontFormat") == "swiftgen";

  var code = `#if os(OSX)
import AppKit.NSFont
`;

  if (!usesSwiftGen) {
    code += "internal typealias Font = NSFont\n";
  }

  code += `#elseif os(iOS) || os(tvOS) || os(watchOS)
import UIKit.UIFont
`;

  if (!usesSwiftGen) {
    code += "internal typealias Font = UIFont\n";
  }

  code += "#endif\n";
  return code;
}

function getFontSwiftType(context, forExport) {
  if (forExport) {
    return "Font";
  }

  const frameworkOption = context.getOption("snippetFramework");

  //Forced snippets frameworks
  if (frameworkOption == "forceAppKit") {
    return "NSFont";
  } else if (frameworkOption == "forceUIKit") {
    return "UIFont";
  }

  //Default snippet framework
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

function getAllAttributesCode(context, textStyles, forExport) {
  var code = "var attributes: [NSAttributedString.Key: Any] {\n";
  code += utils.tab(2) + "switch self {\n";
  for(var textStyle of textStyles) {
    code += utils.tab(2) + "case ." + camelCase(textStyle.name) + ":\n";
    code += getAttributesCode(context, textStyle, true, forExport, 3) + "\n\n";
  }
  code += utils.tab(2) + "}\n";
  code += utils.tab(1) + "}";
  return code;
}

function getFontCode(context, textStyle, forExport) {

  const fontType = getFontSwiftType(context, forExport);

  if (textStyle.fontFamily.startsWith("SFPro") ||
      textStyle.fontFamily.startsWith("SFCompact")) {
    const fontWeightCode = "." + textStyle.weightText.toLowerCase();
    return fontType + ".systemFont(ofSize: " + textStyle.fontSize + ", weight: " + fontWeightCode + ")";
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

function getParagraphStyleCreationCode(textStyle, indent) {
  var code = utils.tab(indent) + "let paragraphStyle = NSMutableParagraphStyle()\n";
  //Handle the textAlign value
  if (typeof textStyle.textAlign !== 'undefined') {
    var swiftValue = textStyle.textAlign;
    if (swiftValue == "justify") {
      swiftValue = "justified";
    }
    code += utils.tab(indent) + "paragraphStyle.alignment = ." + swiftValue + "\n";
  }

  //Handle the lineHeight value
  if (typeof textStyle.lineHeight !== 'undefined') {
    code += utils.tab(indent) + "paragraphStyle.minimumLineHeight = " + textStyle.lineHeight;
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


