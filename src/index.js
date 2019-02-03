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

function styleguideColors(context, colors) {

  var code = "// MARK: - Project Color palette\n\n";
  code += swiftColors.getColorsSwiftSnippet(context, colors, false);

  return {
    code: code,
    language: "swift"
  };
}

function styleguideTextStyles(context, textStyles) {
  var code = "// MARK: - Project Texts styles\n\n";
  code += swiftTextStyles.getTextStylesSwiftSnippet(context,textStyles, false)

  return {
    code: code,
    language: "swift"
  };
}

function exportStyleguideColors(context, colors) {
  const structName = swiftColors.getColorStructName(context)
  return {
    code: swiftColors.getColorsSwiftFileContent(context, colors),
    language: "swift",
    filename: "UIColor+" + structName + ".swift"
  };
}

function exportStyleguideTextStyles(context, textStyles) {
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
    styleguideColors,
    styleguideTextStyles,
    exportStyleguideColors,
    exportStyleguideTextStyles,
    comment
};
