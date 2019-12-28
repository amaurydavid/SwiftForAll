function tab(count) {
  var result = "";
  for(var i = 0; i < count; i++) {
    result += "\t";
  }
  return result;
}

function capitalize(s)
{
  return s && s[0].toUpperCase() + s.slice(1);
}

// The following functions are inspired from https://github.com/zeplin/stylesheet-extensions/blob/master/packages/zeplin-extension-style-kit/utils.js
function getLinkedResources(container, type, resourceKey) {
  let resources = container[resourceKey];
  let itContainer = type === "project" ? container.linkedStyleguide : container.parent;
  while (itContainer) {
    resources = [...resources, ...itContainer[resourceKey]];
    itContainer = itContainer.parent;
  }
  return resources;
}

function getResources(context, resourceKey) {
  const { container, type } = getResourceContainer(context);
  return getLinkedResources(container, type, resourceKey);
}

function getResourceContainer(context) {
  if (context.styleguide) {
    return {
    container: context.styleguide,
    type: "styleguide"
    };
  }

  return {
  container: context.project,
  type: "project"
  };
}

module.exports = {
  tab,
  capitalize,
  getResources
};
