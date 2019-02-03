//Imports
var swiftTextStyles = require("./swiftTextStyles.js")

//Public
function getLayerSwiftCode(context, layer) {
  if (layer.type == "text") {
    return getTextLayerSwiftCode(context, layer);
  }
}

module.exports = { getLayerSwiftCode }

//Private
function getTextLayerSwiftCode(context, layer) {
  const attributes = swiftTextStyles.getAttributesCode(context, layer.textStyles[0].textStyle, false, false, 0);
  var code = attributes + "\n";
  code += 'let attrString = NSAttributedString(string:"' + layer.content + '", attributes: attributes)'
  return code;
}
