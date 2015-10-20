define('map', [
  'gmap',
  'model',
  'knockout',
  'wiki',
  'container',
  'jquery',
  'knockout'
], function (gmap, model, ko, wiki, container, $, ko) {
  var map = function Map() {
    var logger = debug('map');
    var map;
    var gmarkers = [];
    var infowindows = [];
    var defaultZoomLevel = 12;
    /**
         * This function is called when map is going to use.
         */
    function initMap() {
        logger('function initMap is called');
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
        logger('function initMap is ended');
    }

    $(document).ready(function(){
        initMap();
    });

    /**
         * This function filter markers shown on map
         * @param {String} search search data
         */
    function filterMarkers(search) {
      logger('function filterMarkers is called');
      ko.utils.arrayFilter(gmarkers, function (gmarker) {
        console.log(gmarker.title);
        console.log(gmarker.title.toLowerCase().indexOf(search) >= 0);
        if (gmarker.title.toLowerCase().indexOf(search.toLowerCase()) >= 0)
          putMarkerOnMap(gmarker, map);
        else
          putMarkerOnMap(gmarker, null);
      });
      logger('function filterMarkers is ended');
    }
    /**
         * This function create marker on map
         * @param {Object} marker from model
         */
    function createMarker(marker) {
        logger('function createMarker is called');
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
        logger('function createMarker is ended');
    }
    /**
         * This function put marker on map
         * @param {Object} gmarker google.maps.Marker
         * @param {Object} map     google.maps.Map
         */
    function putMarkerOnMap(gmarker, map) {
        logger('function putMarkerOnMap is called');
      gmarker.setMap(map);
        logger('function putMarkerOnMap is ended');
    }
    /**
     * This function pan and zoom to marker
     * @param {Object} marker google.maps.marker
     */
    function zoomToMarker(marker) {
      logger('function zoomToMarker is called');
      var filtered = getGMarkerFromModel(marker);
      if (filtered) {
        map.setZoom(15);
        map.panTo(filtered[0].position);
        gmap.event.trigger(map, 'center_changed');
      }
        logger('function zoomToMarker is ended');
    }
    /**
         * This function add Listener to marker
         * @param {Object} marker google.maps.Marker
         */
    function addListenerToMarker(marker) {
        logger('function addListenerToMarker is called');
      marker.addListener('click', function (map, marker, wiki) {
        var infowindow = null;
        infowindow = new gmap.InfoWindow({ content: 'Loading...' , zIndex: 5000});
        infowindows.push(infowindow);
        infowindow.addListener('closeclick', function () {
          toggleMarkerBounce(marker, false);
        });
        var isOpened = false;
        return function () {
          if (!isOpened) {
            isOpened = true;
            var info = wiki.searchWikiExtract(marker.title, function (data) {
              infowindow.setContent('<div class="infowindow">'+marker.title + '<br/><hr><br/>Relevant Wikipedia Content:<br/><br/>' + data + '</div>');
            });
            closeAllInfoWindows();
            infowindow.open(map, marker);
            toggleMarkerBounce(marker, true);
            var filtered = model.markers.filter(function (item) {
              return item.name == marker.title;
            });
            if (filtered)
              container.getInstance('searchlist').viewModel.selectedItem(filtered);
          } else {
            isOpened = false;
            infowindow.close();
            toggleMarkerBounce(marker, false);
          }
        };
      }(map, marker, wiki));
        logger('function addListenerToMarker is ended');
    }

    /**
     * This function closes all opening infowindows
     */
    function closeAllInfoWindows(){
        logger('function closeAllInfoWindows is called');
        infowindows.forEach(function(infowindow){
            infowindow.close();
        });
        logger('function closeAllInfoWindows is ended');
    }
    /**
     * This function remove all animation from google.maps.Marker
     */
    function removeAllMarkerBounce() {
      logger('function removeAllMarkerBounce is called');
      gmarkers.forEach(function (gmarker) {
        gmarker.setAnimation(null);
      });
      logger('function removeAllMarkerBounce is ended');
    }
    /**
     * This function toggle animation of bounce in marker
     * @param {Object} google.maps.Marker
     * @param {boolean} [set true/false value to turn animation of marker on or off]
     */
    function toggleMarkerBounce() {
        logger('function toggleMarkerBounce is called');
      var argsLen = arguments.length;
      if (argsLen == 1) {
        var marker = arguments[0];
        if (!marker) {
          console.error('marker is nothing');
          return;
        }
        if (marker.getAnimation() == null) {
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
        logger('function toggleMarkerBounce is ended');
    }
    /**
     * This function returns google.maps.Marker which is created by reference from marker in model.js
     * @param   {Object}   marker from model.js
     * @returns {Object} gmarker from google.maps.Marker
     */
    function getGMarkerFromModel(marker) {
        logger('function getGMarkerFromModel is called');
      if (marker) {
        var filtered = gmarkers.filter(function (item) {
          return item.title == marker.name;
        });
        logger('function getGMarkerFromModel returns');
        return filtered && filtered.length >= 1 ? filtered : null;
      }
      return null;
        logger('function getGMarkerFromModel is ended');
    }


    function addOverlay() {
        logger('function addOverlay is called');
        NEWLayer.prototype = new  gmap.OverlayView();
        function NEWLayer(){
            this.div = null;
            this.startcenter = null;
            this.setMap(map);
        }
        NEWLayer.prototype.onAdd = function(){
            var self = this;
            self.startcenter = this.getProjection().fromLatLngToDivPixel(map.getCenter());
            var div = document.createElement('div');
            $(div).addClass('searchbar');
                $(div).attr('id','searchbar');
            $(div).append('<div class="searchlist" data-bind="component: \'searchlist\'"></div>');
            $(div).append('<div class="pager" data-bind="component: \'pager\'"></div>');
            $(div).append('<div class="wikirelevant"><div></div></div>');

            self.div = div;
            var searchlist = container.getInstance('searchlist');
            ko.applyBindings(searchlist.viewModel,self.div);
            self.getPanes().overlayMouseTarget.appendChild(self.div);

            map.addListener('center_changed', function(){
                self.align();
            });
            $(window).resize(function(){
                var newwidth = $(window).width() * 0.65;
                var newheight = $(window).height() * 0.1;
                $('.searchbar').offset({top:newheight,left:newwidth});
            });
        }
        NEWLayer.prototype.draw = function(){

        }
        NEWLayer.prototype.align = function(){
            logger('NEWLayer align function is called');
                var currentcenter = this.getProjection().fromLatLngToDivPixel(map.getCenter());
                var changex = (currentcenter.x - this.startcenter.x);
                var changey = (currentcenter.y - this.startcenter.y);
                logger('change of position trigger- changex:'+ changex + ' '+'changey' + changey);
                $('.searchbar').css('transform', 'translate('+ changex +'px,'+ changey +'px)');

           logger('NEWLayer align function is ended');
        }
        NEWLayer.prototype.onRemove = function(){
            logger('NEWLayer onRemove function is called');
            if (this.div)
                this.getPanes().overlayMouseTarget.removeChild(this.div);
            logger('NEWLayer onRemove function is ended');
        }
        var instance = new NEWLayer();
        logger('function addOVerlay is ended');
    }

    function addControl(elem){
        logger('function addControl is called');
        map.controls[gmap.ControlPosition.LEFT_TOP].push(elem);
        logger('function addControl is ended');
    }

    return {
      constructor: {name:'Map'},
      zoomToMarker: zoomToMarker,
      filterMarkers: filterMarkers,
      toggleMarkerBounce: toggleMarkerBounce,
      removeAllMarkerBounce: removeAllMarkerBounce,
      getGMarkerFromModel: getGMarkerFromModel,
      addOverlay:addOverlay
    };
  };
  container.addComponentClass(map);
});
