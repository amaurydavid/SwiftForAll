/**
 * Export functions you want to work with, see documentation for details:
 * https://github.com/zeplin/zeplin-extension-documentation
 */

var swiftColors = require("./swiftColors.js")
var swiftTextStyles = require("./swiftTextStyles.js")
var swiftLayers = require("./swiftLayers.js")

function layer(context, selectedLayer) {
  return {
    code: swiftLayers.getLayerSwiftCode(context, selectedLayer),
  language: "swift"
  };
}

function colors(context) {
  var code = "// MARK: - Color palette\n\n";
  code += swiftColors.getColorsSwiftSnippet(context, false);

  return {
    code: code,
    language: "swift"
  };
}

function textStyles(context) {
  var code = "// MARK: - Texts styles\n\n";
  code += swiftTextStyles.getTextStylesSwiftSnippet(context,textStyles, false)

  return {
    code: code,
    language: "swift"
  };
}

function exportColors(context) {
  const structName = swiftColors.getColorStructName(context)
  return {
    code: swiftColors.getColorsSwiftFileContent(context),
    language: "swift",
    filename: "UIColor+" + structName + ".swift"
  };
}

function exportTextStyles(context) {
  return {
    code: swiftTextStyles.getTextStylesSwiftFileContent(context,textStyles),
    language: "swift",
    filename: "TextStyles.swift"
  };
}

function comment(context, text) {

}

export default {
    layer,
    colors,
    textStyles,
    exportColors,
    exportTextStyles,
    comment
};
