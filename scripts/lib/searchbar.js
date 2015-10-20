define('searchbar', [
  'knockout',
  'model',
  'container',
  'jquery'
], function (ko, model, container, $) {
  /**
     * This component provides functions of getting matched markets and action to selected place name.
     * @returns {Object} searchlist component
     */
  var SearchList = function SearchList() {
    var logger = debug('searchlist');
    var self = this;
    self.map = container.getInstance('map');
    self.pager = container.getInstance('pager');
    self.viewModel = function (params) {
      var self2 = this;
      this.query = ko.observable('');
      this.query.subscribe(function (newValue) {
        self.map.filterMarkers(newValue);
      });
      this.markers = ko.computed(function () {
        logger('function markers is called');
        var search = self2.query();
        var entries = ko.utils.arrayFilter(model.markers, function (marker) {
          console.log(marker.name);
          console.log(marker.name.toLowerCase().indexOf(search) >= 0);
          return marker.name.toLowerCase().indexOf(search.toLowerCase()) >= 0;
        });
        self.pager.viewModel.updateEntries(entries);
        console.log(self.pager.viewModel.showEntries());
        return self.pager.viewModel.showEntries();
      });
      this.selectedItem = ko.observable([model.markers[1]]);
      this.selectItem = ko.computed(function () {
        logger('function selectItem is called');
        var marker = self2.selectedItem();
        self.map.zoomToMarker(marker);
        self.map.removeAllMarkerBounce();
        self.map.toggleMarkerBounce(self.map.getGMarkerFromModel(marker) ? self.map.getGMarkerFromModel(marker)[0] : null);
      });
      this.selectAfterRender = function (option) {
        logger('function selectAfterRender is called');
        $(option).click(function () {
          $(this).parent().val($(this).val());
          $(this).parent().trigger('change');
        });
      };
      this.searchAfterRender = function (elem) {
        logger('function searchAfterRender is called');
        $(elem).click(function () {
          $(this).focus();
        });
      };
    };
    self.template = '<input type="search" data-bind="value:query,valueUpdate:\'keyup\',afterInputRender:searchAfterRender" autocomplete="on" placeholder="Search Place here" />';
    self.template += '<select size="5" data-bind="options:markers(),optionsText: \'name\',optionsValue: \'name\',selectedByName:selectedItem,optionsAfterRender:selectAfterRender,optionsCaption:\'--Move to one place--\'"></select>';
  };
  container.addComponentClass(SearchList);
});
