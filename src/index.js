/**
 * Export functions you want to work with, see documentation for details:
 * https://github.com/zeplin/zeplin-extension-documentation
 */

var platformTools = require("./platformTools.js")
var swiftColors = require("./swiftColors.js")

function layer(context, selectedLayer) {

}

function styleguideColors(context, colors) {

  if (!platformTools.shouldIncludeSwiftSnippets(context)) {
    return ;
  }

  const structName = context.getOption("swiftColorStructName");
  return {
    code: swiftColors.getColorsSwiftFileContent(structName, colors),
    language: "swift"
  };
}

function styleguideTextStyles(context, textStyles) {

}

function exportStyleguideColors(context, colors) {

}

function exportStyleguideTextStyles(context, textStyles) {

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
