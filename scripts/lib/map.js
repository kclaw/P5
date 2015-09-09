define('map',['gmap','model'],function(gmap,model){
    var map;
    var markers = [];
    var defaultZoomLevel = 12;
    function initMap() {
          map = new gmap.Map(document.getElementById('map'), {
            center: {lat: 22.451754, lng: 114.164387},
            zoom: defaultZoomLevel
          });
          model.markers.forEach(function(marker){
              console.log('create a  marker at lat:'+marker.latitude+':'+marker.longitude);
              createMarker(marker);

        });
    };

    initMap();

    function createMarker(marker){
        var newmarker = new gmap.Marker({
                position : {lat:marker.latitude,lng:marker.longitude},
                map:map,
                title:marker.name
            });
        markers.push(newmarker);
    };

    function zoomToMarker(marker){
        console.log('Zoom to marker');
        var filtered = markers.filter(function(item){
            console.log(item.title);
            return item.title == marker.name;
        });
        console.log('affected:'+filtered.length);
        if(filtered.length > 0){
            map.setZoom(15);
            map.panTo(filtered[0].position);
        }
    };

    return {
        zoomToMarker : zoomToMarker
    }
});
