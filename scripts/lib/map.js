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
    var map;
    var gmarkers = [];
    var infowindows = [];
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
        if (gmarker.title.toLowerCase().indexOf(search.toLowerCase()) >= 0)
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
    /**
     * This function pan and zoom to marker
     * @param {Object} marker google.maps.marker
     */
    function zoomToMarker(marker) {
      console.log('Zoom to marker');
      var filtered = getGMarkerFromModel(marker);
      if (filtered) {
        map.setZoom(15);
        map.panTo(filtered[0].position);
        gmap.event.trigger(map, 'center_changed');
      }
    }
    /**
         * This function add Listener to marker
         * @param {Object} marker google.maps.Marker
         */
    function addListenerToMarker(marker) {
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
    }

    /**
     * This function closes all opening infowindows
     */
    function closeAllInfoWindows(){
        infowindows.forEach(function(infowindow){
            infowindow.close();
        });
    }
    /**
     * This function remove all animation from google.maps.Marker
     */
    function removeAllMarkerBounce() {
      gmarkers.forEach(function (gmarker) {
        gmarker.setAnimation(null);
      });
    }
    /**
     * This function toggle animation of bounce in marker
     * @param {Object} google.maps.Marker
     * @param {boolean} [set true/false value to turn animation of marker on or off]
     */
    function toggleMarkerBounce() {
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
    }
    /**
     * This function returns google.maps.Marker which is created by reference from marker in model.js
     * @param   {Object}   marker from model.js
     * @returns {Object} gmarker from google.maps.Marker
     */
    function getGMarkerFromModel(marker) {
        console.log('getGMarkerFrommModel');
        console.log(marker);
      if (marker) {
          console.log(marker);
        var filtered = gmarkers.filter(function (item) {
          return item.title == marker.name;
        });
          console.log(filtered);
        return filtered && filtered.length >= 1 ? filtered : null;
      }
      return null;
    }


    function addOverlay() {
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
            $(div).append('<div class="searchlist" data-bind="component:\'searchlist\'"></div>');
            $(div).append('<div class="pager" data-bind="component: \'pager\'"></div>');
            $(div).append('<div class="wikirelevant"></div>');

            self.div = div;

            self.getPanes().floatPane.appendChild(self.div);

            ko.applyBindings(null,$('.searchbar')[0]);

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

        //alert(window.getComputedStyle($('.searchbar')[0],null).getPropertyValue('height'));
            var t0 = performance.now();
            //if(offset.top!=250 && offset.left !=250)
            //$('.searchbar').offset({top:250,left:250});
            //$('.searchbar').css('transform','translate(150px,150px)');

                var currentcenter = this.getProjection().fromLatLngToDivPixel(map.getCenter());
                var changex = (currentcenter.x - this.startcenter.x);
                var changey = (currentcenter.y - this.startcenter.y);
                console.log('changex:'+ changex +'changey: ' + changey);
                $('.searchbar').css('transform', 'translate('+ changex +'px,'+ changey +'px)');

            var t1 = performance.now();
            console.log('align cause '+ (t1-t0));
        }
        NEWLayer.prototype.onRemove = function(){
            alert('remove');
        }
        var instance = new NEWLayer();
    }

    function addControl(elem){
        map.controls[gmap.ControlPosition.LEFT_TOP].push(elem);
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
