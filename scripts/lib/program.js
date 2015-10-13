define('program', [
  'knockout',
  'container',
  'map',
  'searchbar',
  'pager'
], function (ko, container) {
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
  ko.applyBindings();
});
