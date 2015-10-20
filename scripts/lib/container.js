define('container', [], function Container() {
  /**
   *This component contains other components. Its main purpose
   is to instantiate contained classes once required. It prevents
   from undefined object in AMD.It is helpful to bridge between viewModel of
   components
   * @returns {Object} container component
   */
  var Container = function () {
    // contains class
    var componentClasses = [];
    //contains instances of classes
    var instances = [];
    /**This function return an instance of class
     * @param   {String}   className className of a class in array of componentClasses
     * @returns {Object} instance of class
     */
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
        // if there is function declaration of viewModel in class, initiate it also.
        if (newcomp.viewModel)
          newcomp.viewModel = new newcomp.viewModel();
        instances.push(newcomp);
        return newcomp;
      }
      return null;
    }
    /**
     * This function add class to array of componetClasses
     * @param {Function} classOfComponent function declaration of a class
     */
    function addComponentClass(classOfComponent) {
      componentClasses.push(classOfComponent);
    }
    return {
      getInstance: getInstance,
      addComponentClass: addComponentClass
    };
  };
  return new Container();
});
