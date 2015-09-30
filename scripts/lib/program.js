define('program', ['knockout', 'container', 'map', 'searchbar'], function (ko, container) {
    var searchList = container.getInstance('searchlist');

    var Program = function () {
        var query = searchList.viewModel.query;
        var selectedItem = searchList.viewModel.selectedItem;

        function markers() {
            return searchList.viewModel.markers();
        }

        return {
            query: query,
            markers: markers,
            selectedItem: selectedItem
        };
    }
    window.program = new Program();

    ko.components.register('searchlist', searchList);
    ko.applyBindings(searchList.viewModel);
});
