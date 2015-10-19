define('program', [
  'knockout',
  'container','jquery',
  'map',
  'searchbar',
  'pager'
], function (ko, container,$) {
  var map = container.getInstance('map');
  $('.searchbar').append('<div></div>');
  var searchList = container.getInstance('searchlist');
  var pager = container.getInstance('pager');
  ko.components.register('pager', {
    viewModel: { instance: pager.viewModel },
    template: pager.template
  });
 ko.components.register('searchlist', {
    viewModel: { instance: searchList.viewModel },
    template: searchList.template
  });
   map.addOverlay();
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
  ko.bindingHandlers.afterInputRender = {
    update: function(el, va, ab){
        va()(el);
    }
  }
});
