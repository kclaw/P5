define('container', [], function Container() {
  var Container = function () {
    var componentClasses = [];
    var instances = [];
    function getInstance(className) {
      var index = null;
      for (var i = 0, len = componentClasses.length; i < len; i++) {
        if (componentClasses[i].name.toLowerCase() === className.toLowerCase()) {
          index = i;
          break;
        }
      }
      if (null != index) {
        if (instances.length > 0)
          for (var o = 0; o < instances.length; o++) {
            if (instances[o].constructor.name.toLowerCase() === className.toLowerCase())
              return instances[o];
          }
        var newcomp = new componentClasses[index]();
        if (newcomp.viewModel)
          newcomp.viewModel = new newcomp.viewModel();
        instances.push(newcomp);
        return newcomp;
      }
      return null;
    }
    function addComponentClass(classOfComponent) {
      componentClasses.push(classOfComponent);
    }
    return {
      getInstance: getInstance,
      addComponentClass: addComponentClass,
      componentClasses: componentClasses,
      instances: instances
    };
  };
  return new Container();
});
