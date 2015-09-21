define("searchlist", ['knockout', 'model', 'map', 'wiki'], function (ko, model, map, wiki) {
    /**
     * This component provides functions of getting matched markets and action to selected place name.
     * @param   {Object} map google.map.Map
     * @returns {Object} searchlist web component
     */
    var Component = function (map) {
        var self = this;
        self.viewModel = function (params) {};
        self.viewModel.query = ko.observable('');
        self.viewModel.query.subscribe(function (newValue) {
            map.filterMarkers(newValue);
            wiki.searchWiki(newValue);
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
            console.log(self.viewModel.selectedItem());
            console.log(self.map);
            map.zoomToMarker(self.viewModel.selectedItem()[0]);
        });
        self.template = '<select multiple="true" data-bind="options:searchlist.viewModel.markers,optionsText: function(item){return item.name;},selectedOptions:searchlist.viewModel.selectedItem"></select>';
    };

    window.searchlist = new Component(map);
    ko.components.register('searchlist', window.searchlist);
    ko.applyBindings();
});
