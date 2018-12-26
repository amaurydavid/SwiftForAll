/**
 * Export functions you want to work with, see documentation for details:
 * https://github.com/zeplin/zeplin-extension-documentation
 */

var platformTools = require("./platformTools.js")
var swiftColors = require("./swiftColors.js")
var swiftTextStyles = require("./swiftTextStyles.js")

function layer(context, selectedLayer) {

}

function styleguideColors(context, colors) {

  if (!platformTools.shouldIncludeSwiftSnippets(context)) {
    return ;
  }

  const structName = context.getOption("swiftColorStructName");
  return {
    code: swiftColors.getColorsSwiftSnippet(structName, colors),
    language: "swift"
  };
}

function styleguideTextStyles(context, textStyles) {
  return exportStyleguideTextStyles(context, textStyles);
}

function exportStyleguideColors(context, colors) {

  if (!platformTools.shouldIncludeSwiftSnippets(context)) {
    return ;
  }

  const structName = context.getOption("swiftColorStructName");
  return {
    code: swiftColors.getColorsSwiftFileContent(structName, colors),
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
