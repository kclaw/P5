define('searchlist', ['knockout','model', 'container'], function (ko, model, container) {
    /**
     * This component provides functions of getting matched markets and action to selected place name.
     * @returns {Object} searchlist component
     */
    var SearchList = function () {
        var self = this;
        self.viewModel = function (params) {};
        self.viewModel.query = ko.observable('');
        self.viewModel.query.subscribe(function (newValue) {
            container.map.filterMarkers(newValue);
        });
        self.viewModel.markers = ko.computed(function () {
            var search = self.viewModel.query();
            return ko.utils.arrayFilter(model.markers, function (marker) {
                console.log(marker.name);
                console.log(marker.name.toLowerCase().indexOf(search) >= 0);
                return marker.name.toLowerCase().indexOf(search) >= 0;
            });
        });
        self.viewModel.selectedItem = ko.observable([model.markers[0]]);
        self.viewModel.selectItem = ko.computed(function () {
            container.map.zoomToMarker(marker);
            container.map.removeAllMarkerBounce();
            container.map.toggleMarkerBounce(map.getGMarkerFromModel(marker)[0]);
        });
        self.template = '<select size="5" data-bind="options:searchlist.viewModel.markers,optionsText: function(item){return item.name;},selectedOptions:program.selectedItem"></select>';
    };

    container.searchlist = SearchList;
   // window.searchlist = new Component(map);
});
