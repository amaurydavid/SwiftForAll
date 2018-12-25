/**
 * Export functions you want to work with, see documentation for details:
 * https://github.com/zeplin/zeplin-extension-documentation
 */

var platformTools = require("./platformTools.js")

function layer(context, selectedLayer) {

}

function styleguideColors(context, colors) {

  const object = {
    "Project type": context.project.type,
    "Swift": platformTools.shouldIncludeSwiftSnippets(context),
    "XML": platformTools.shouldIncludeXMLSnippets(context)
  };

  return {
  code: JSON.stringify(object, null, 2),
  language: "json"
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
