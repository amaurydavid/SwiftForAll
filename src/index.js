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

function textStyles(context) {
  var code = "// MARK: - Project Texts styles \n\n";
  
  var textStylesProject = context.project.textStyles
  var textStylesAll = textStylesProject.concat(context.project.linkedStyleguide.textStyles)

  code += swiftTextStyles.getTextStylesSwiftSnippet(context, textStylesAll, false)

  return {
    code: code,
    language: "swift"
  };
}

function exportTextStyles(context, textStyles) {
  var textStylesProject = context.project.textStyles
  var textStylesAll = textStylesProject.concat(context.project.linkedStyleguide.textStyles)

  return {
    code: swiftTextStyles.getTextStylesSwiftFileContent(context,textStylesAll),
    language: "swift",
    filename: "TextStyles.swift"
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

function exportStyleguideColors(context, colors) {
  const structName = swiftColors.getColorStructName(context)
  return {
    code: swiftColors.getColorsSwiftFileContent(context, colors),
    language: "swift",
    filename: "UIColor+" + structName + ".swift"
  };
}

function comment(context, text) {

}

export default {
    layer,
    textStyles,
    exportTextStyles,    
    styleguideColors,
    exportStyleguideColors,
    comment
};
