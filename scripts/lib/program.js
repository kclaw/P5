define('program', [
  'knockout',
  'container','jquery',
  'map',
  'searchbar',
  'pager'
], function (ko, container, $) {
    var logger = debug('program');
      var map = container.getInstance('map');
  var searchList = container.getInstance('searchlist');
  var pager = container.getInstance('pager');
  logger('registering components in knockout - pager');
  ko.components.register('pager', {
    viewModel: { instance: pager.viewModel },
    template: pager.template
  });
  logger('registering components in knockout - searchlist');
  ko.components.register('searchlist', {
    viewModel: { instance: searchList.viewModel },
    template: searchList.template
  });
  logger('function addOverlay of map is about to call');
  map.addOverlay();

  logger('bindingHandler of knockout is about to create - selectedByName');
  ko.bindingHandlers.selectedByName = {
    init: function (element, valueAccessor, allBindings){
        $(element).change(function(){
            var emps = ko.unwrap(allBindings.get('options'));
            var newSelectedValue = $(element).find("option:selected").val();
            var va = valueAccessor();
            if (!!newSelectedValue) {
                va(ko.utils.arrayFirst(emps, function(item){return item.name == newSelectedValue}));
            }else va(null);
        });
    },
    update: function (element, valueAccessor){
        var selectedItem = ko.unwrap(valueAccessor());
        $(element).val(selectedItem ? selectedItem.name : '');
    }
  }
  logger('bindingHandler of knockout is about to create - afterInputRender');
  ko.bindingHandlers.afterInputRender = {
    update: function(el, va, ab){
        va()(el);
    }
  }
  logger('end of module');
});
