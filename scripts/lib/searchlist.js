define("searchlist",['knockout','model','map'],function(ko,model,map){
    var Component = function(){
        var self = this;
        self.viewModel = function(params){},
        self.viewModel.query = ko.observable('');
        self.viewModel.markers = ko.computed(function(){
               var search = self.viewModel.query();
                return ko.utils.arrayFilter(model.markers,function(marker){
                    console.log(marker.name);
                    console.log(marker.name.toLowerCase().indexOf(search) >= 0);
                    return marker.name.toLowerCase().indexOf(search) >= 0;
                });
        });
        self.viewModel.selectedItem = ko.observable('');
        self.viewModel.selectItem = function(){
            console.log(self.viewModel.selectedItem());
            map.zoomToMarker(self.viewModel.selectedItem()[0]);
        };
        self.template1 = '<ul data-bind="foreach:searchlist.viewModel.markers"><li><strong data-bind="text: name"></strong></li></ul>';
        self.template = '<select multiple="multiple" height="5" data-bind="click:function(){searchlist.viewModel.selectItem($data);},options:searchlist.viewModel.markers,optionsText: function(item){return item.name;},selectedOptions:searchlist.viewModel.selectedItem"></select>';
 };
    window.searchlist = new Component();
    ko.components.register('searchlist',window.searchlist);
    ko.applyBindings();
});
