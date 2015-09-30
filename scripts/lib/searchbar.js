define('searchbar', ['knockout', 'model', 'container'], function (ko, model, container) {
    /**
     * This component provides functions of getting matched markets and action to selected place name.
     * @returns {Object} searchlist component
     */
    var SearchList = function SearchList() {
        var self = this;
        self.map = container.getInstance('map');
        self.viewModel = function (params) {};
        self.viewModel.query = ko.observable('');
        self.viewModel.query.subscribe(function (newValue) {
            self.map.filterMarkers(newValue);
        });
        self.viewModel.markers = ko.computed(function () {
            var search = self.viewModel.query();
            return ko.utils.arrayFilter(model.markers, function (marker) {
                console.log(marker.name);
                console.log(marker.name.toLowerCase().indexOf(search) >= 0);
                return marker.name.toLowerCase().indexOf(search) >= 0;
            });
        });
        self.viewModel.selectedItem = ko.observable([model.markers[1]]);
        self.viewModel.selectItem = ko.computed(function () {
            var marker = self.viewModel.selectedItem()[0];
            self.map.zoomToMarker(marker);
            self.map.removeAllMarkerBounce();
            self.map.toggleMarkerBounce(self.map.getGMarkerFromModel(marker)[0]);
        });
        self.template = '<select size="5" data-bind="options:program.markers(),optionsText: function(item){return item.name;},selectedOptions:program.selectedItem"></select>';
    };

    container.addComponentClass(SearchList);

});
