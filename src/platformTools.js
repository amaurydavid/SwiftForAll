module.exports = {
  shouldIncludeSwiftSnippets: function(context) {
    return (context.project.type != "ios" || context.getOption("alwaysShowSwift"))
  },

  shouldIncludeXMLSnippets: function(context) {
    return (context.project.type != "android" || context.getOption("alwaysShowXML"))
  }
};
