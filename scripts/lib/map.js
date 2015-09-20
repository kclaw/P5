define('map', ['gmap', 'model', 'knockout'], function(gmap, model, ko) {
    var map;
    var gmarkers = [];
    var defaultZoomLevel = 12;

    function initMap() {
        map = new gmap.Map(document.getElementById('map'), {
            center: {
                lat: 22.451754,
                lng: 114.164387
            },
            zoom: defaultZoomLevel
        });
        model.markers.forEach(function(marker) {
            console.log('create a  marker at lat:' + marker.latitude + ' : ' + marker.longitude);
            createMarker(marker);

        });
    };

    initMap();

    function filterMarkers(search) {
        console.log('filterMarkers is called ');
        ko.utils.arrayFilter(gmarkers, function(gmarker) {
            console.log(gmarker.title);
            console.log(gmarker.title.toLowerCase().indexOf(search) >= 0);
            if (gmarker.title.toLowerCase().indexOf(search) >= 0)
                putMarkerOnMap(gmarker, map);
            else
                putMarkerOnMap(gmarker, null);
        });
    };


    function createMarker(marker) {
        var gmarker = new gmap.Marker({
            position: {
                lat: marker.latitude,
                lng: marker.longitude
            },
            map: map,
            title: marker.name
        });
        addListenerToMarker(gmarker);
        gmarkers.push(gmarker);
    }

    function putMarkerOnMap(gmarker, map) {
        gmarker.setMap(map);
    }

    function zoomToMarker(marker) {
        console.log('Zoom to marker');
        var filtered = gmarkers.filter(function(item) {
            console.log(item.title);
            return item.title == marker.name;
        });
        console.log('affected:' + filtered.length);
        if (filtered.length > 0) {
            map.setZoom(15);
            map.panTo(filtered[0].position);
        }
    }

    function addListenerToMarker(marker){
        marker.addListener('click', function(){
                if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
      } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
      }
        });
    }

    return {
        zoomToMarker: zoomToMarker,
        filterMarkers: filterMarkers
    };
});
