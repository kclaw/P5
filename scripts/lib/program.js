define('program', ['knockout', 'container', 'map', 'searchbar', 'pager'], function (ko, container) {
    var searchList = container.getInstance('searchlist');
    var pager = container.getInstance('pager');

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
    ko.components.register('pager', {viewModel:{instance:pager.viewModel },template:pager.template});
    ko.components.register('searchlist',
        {
            viewModel: {instance: searchList.viewModel},
            template: searchList.template
        });
    ko.applyBindings();
});
