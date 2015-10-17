define('program', [
  'knockout',
  'container','jquery',
  'map',
  'searchbar',
  'pager'
], function (ko, container,$) {
  var map = container.getInstance('map');
  map.addOverlay();
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

  ko.applyBindings(null,$('.searchlist')[0]);
  $('#map').trigger('SearchBarReady');
});
