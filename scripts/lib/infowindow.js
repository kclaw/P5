define('infowindow',['gmap','container','wiki','model'],function(gmap, container, wiki, model){
    var InfoWindow = function InfoWindow(){
        var logger = debug('infowindow');
        var self = this;
        var info = null;
        var marker_ginfowindow_map = [];
        var map = container.getInstance('map');

        function isMarkerExists(marker){
            logger('function isMarkerExists is called');
            var filtered = marker_ginfowindow_map.filter(function(item){
                return item.marker === marker;
            });
            if(filtered && filtered.length > 0)
                return filtered[0];
            return false;
        }

        function put(marker, ginfowindow){
            logger('function put is called');
            if(!isMarkerExists(marker)){
                marker_ginfowindow_map.push({
                    marker: marker,
                    infowindow: ginfowindow
                });
            }
            return null;
        }

        function get(marker){
            logger('function get is called');
            if(isMarkerExists(marker))
                return isMarkerExists(marker);
            return null;
        }

        function createInfoWindow(){
            logger('function createInfoWindow is called and return');
            return new gmap.InfoWindow({
              content: 'Loading...',
              zIndex: 5000
            });
        }

        function closeAllInfoWindow(){
            marker_ginfowindow_map.forEach(function(item){
                item.infowindow.close();
            });
        }

        return function InfoWindow(pmarker){
            var isOpened = false;
            var marker = pmarker;
            var ginfowindow = null;

            function init(pmarker){
                logger('function init is called');
                if(pmarker && get(pmarker)!==null){
                    ginfowindow = get(pmarker).infowindow;
                }else{
                    ginfowindow = createInfoWindow();
                    addListener(ginfowindow);
                    put(pmarker, ginfowindow);
                }
                getWikiExtract();
                logger('function init is end');
            }
            function getWikiExtract(){
                logger('function getWikiExtract is called');
                wiki.searchWikiExtract(marker.title, function (data) {
                  ginfowindow.setContent('<div class="infowindow">' + marker.title + '<br/><hr><br/>Relevant Wikipedia Content:<br/><br/>' + data + '</div>');
                });
            }

            function addListener(pinfowindow){
                logger('function addListener~ is called');
                pinfowindow.addListener('closeclick', function () {
                  map.toggleMarkerBounce(marker, false);
                  container.getInstance('searchlist').viewModel.selectedItem(null);
                });
                logger('function addListener~ is end');
            }

            function open(){
                logger('function open is called');
                isOpened = true;
                console.log(map.map());
                console.log(marker);
                console.log(ginfowindow);
                ginfowindow.open(map.map() , marker);
                logger('function open is end');
            }

            function close(){
                logger('function close is called');
                isOpened = false;
                setTimeout(function () { ginfowindow.close(); }, 50);
            }

            function toggle(){
                logger('function toggle is called');
                listener();
                logger('function toggle is called');
            }
            function listener(){
                logger('function listener is called');
                if (!isOpened) {
                closeAllInfoWindow();
                open();
                map.removeAllMarkerBounce();
                map.toggleMarkerBounce(marker, true);
                var filtered = model.markers.filter(function (item) {
                  return item.name === marker.title;
                });
                if (filtered && filtered.length > 0)
            container.getInstance('searchlist').viewModel.selectedItem(filtered[0]);
              } else {
                close();
                  container.getInstance('searchlist').viewModel.selectedItem(null);
                  map.toggleMarkerBounce(marker, false);

              }
            }

            init(pmarker);

            return {
                open:open,
                close:close,
                listener:listener,
                toggle: toggle
            };
        };
    };
    container.addComponentClass(InfoWindow);
});
