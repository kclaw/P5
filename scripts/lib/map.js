define('map',['gmap','model','knockout'],function(gmap,model,ko){
    var map;
    var gmarkers = [];
    var defaultZoomLevel = 12;
    var viewModel = {query : ko.observable('')};

    function initMap() {
          map = new gmap.Map(document.getElementById('map'), {
            center: {lat: 22.451754, lng: 114.164387},
            zoom: defaultZoomLevel
          });
          model.markers.forEach(function(marker){
              console.log('create a  marker at lat:'+marker.latitude+' : '+marker.longitude);
              createMarker(marker);

        });
    };

    initMap();

    filterMarkers = ko.computed(function(){
         var search = viewModel.query();
                return ko.utils.arrayFilter(model.markers,function(marker){
                    console.log(marker.name);
                    console.log(marker.name.toLowerCase().indexOf(search) >= 0);
                    return marker.name.toLowerCase().indexOf(search) >= 0;
                });
    });

    function createMarker(marker){
        var gmarker = new gmap.Marker({
                position : {lat:marker.latitude,lng:marker.longitude},
                map:map,
                title:marker.name
            });
        gmarkers.push(gmarker);
    };

    function zoomToMarker(marker){
        console.log('Zoom to marker');
        var filtered = gmarkers.filter(function(item){
            console.log(item.title);
            return item.title == marker.name;
        });
        console.log('affected:'+filtered.length);
        if(filtered.length > 0){
            map.setZoom(15);
            map.panTo(filtered[0].position);
        }
    };

    this.map.viewModel = viewModel;

    return {
        zoomToMarker : zoomToMarker
    };
});
