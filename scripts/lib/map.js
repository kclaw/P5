define('map', ['gmap', 'model', 'knockout', 'wiki', 'container'], function (gmap, model, ko, wiki, container) {
    var Map = function Map() {
        var map;
        var gmarkers = [];
        var defaultZoomLevel = 12;

        /**
         * This function is called when map is going to use.
         */
        function initMap() {
            map = new gmap.Map(document.getElementById('map'), {
                center: {
                    lat: 22.451754,
                    lng: 114.164387
                },
                zoom: defaultZoomLevel
            });
            model.markers.forEach(function (marker) {
                console.log('create a  marker at lat:' + marker.latitude + ' : ' + marker.longitude);
                createMarker(marker);

            });
        }

        initMap();

        /**
         * This function filter markers shown on map
         * @param {String} search search data
         */
        function filterMarkers(search) {
            console.log('filterMarkers is called ');
            ko.utils.arrayFilter(gmarkers, function (gmarker) {
                console.log(gmarker.title);
                console.log(gmarker.title.toLowerCase().indexOf(search) >= 0);
                if (gmarker.title.toLowerCase().indexOf(search) >= 0)
                    putMarkerOnMap(gmarker, map);
                else
                    putMarkerOnMap(gmarker, null);
            });
        }

        /**
         * This function create marker on map
         * @param {Object} marker from model
         */
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

        /**
         * This function put marker on map
         * @param {Object} gmarker google.maps.Marker
         * @param {Object} map     google.maps.Map
         */
        function putMarkerOnMap(gmarker, map) {
            gmarker.setMap(map);
        }

        function zoomToMarker(marker) {
            console.log('Zoom to marker');
            var filtered = getGMarkerFromModel(marker);
            console.log('affected:' + filtered.length);
            if (filtered.length > 0) {
                map.setZoom(15);
                map.panTo(filtered[0].position);
            }
        }

        /**
         * This function add Listener to marker
         * @param {Object} marker google.maps.Marker
         */
        function addListenerToMarker(marker) {
            marker.addListener('click', (function (map, marker, wiki) {
                var infowindow = null;
                infowindow = new gmap.InfoWindow({
                    content: 'Loading...'
                });
                infowindow.addListener('closeclick', function () {
                    toggleMarkerBounce(marker, false);
                });
                var isOpened = false;
                return function () {
                    if (!isOpened) {
                        isOpened = true;
                        var info = wiki.searchWikiExtract(marker.title, function (data) {
                            infowindow.setContent(marker.title + "<br/><hr><br/>Relevant Wikipedia Content:<br/><br/>" + data);
                        });
                        infowindow.open(map, marker);
                        toggleMarkerBounce(marker, true);
                        var filtered = model.markers.filter(function (item) {
                            return item.name == marker.title;
                        });
                        if (filtered.length > 0)
                            container.getInstance('searchlist').viewModel.selectedItem(filtered);
                    } else {
                        isOpened = false;
                        infowindow.close();
                        toggleMarkerBounce(marker, false);
                    }
                };
            })(map, marker, wiki));
        }

        function removeAllMarkerBounce() {
            gmarkers.forEach(function (gmarker) {
                gmarker.setAnimation(null);
            });
        }

        function toggleMarkerBounce() {
            var argsLen = arguments.length;
            if (argsLen == 1) {
                var marker = arguments[0];
                if (marker.getAnimation() == null || typeof marker.getAnimation() == 'undefined') {
                    marker.setAnimation(gmap.Animation.BOUNCE);
                } else {
                    marker.setAnimation(null);
                }
            } else if (argsLen == 2) {
                var marker = arguments[0];
                var bool = arguments[1];
                if (bool) {
                    marker.setAnimation(gmap.Animation.BOUNCE);
                } else {
                    marker.setAnimation(null);
                }
            } else
                return;
        }

        function getGMarkerFromModel(marker) {
            var filtered = gmarkers.filter(function (item) {
                console.log(item.title);
                return item.title == marker.name;
            });
            return filtered;
        }

        return {
            zoomToMarker: zoomToMarker,
            filterMarkers: filterMarkers,
            toggleMarkerBounce: toggleMarkerBounce,
            removeAllMarkerBounce: removeAllMarkerBounce,
            getGMarkerFromModel: getGMarkerFromModel
        };
    }

    container.addComponentClass(Map);
});
