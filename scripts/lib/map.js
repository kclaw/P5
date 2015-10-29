define('map', [
  'gmap',
  'model',
  'knockout',
  'container',
  'jquery',
  'knockout',
  'sidebar2'
], function (gmap, model, ko, container, $, ko, sidebar) {
  var map = function Map() {
    var logger = debug('map');
    var map;
    var gmarkers = [];
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
        createMarker(marker);
      });
      logger('function initMap is ended');
    }

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
      var infowindow  = container.getInstance('infowindow')(marker);
      marker.addListener('click', infowindow.listener);
      logger('function addListenerToMarker is ended');
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

      function getMap(){
        return map;
      }
    function clickOnMarker(marker){
        var gmarker = getGMarkerFromModel(marker);
        console.log(gmarker);
        if(gmarker)
           container.getInstance('infowindow')(gmarker[0]).toggle();
    }

    function addOverlay() {
      logger('function addOverlay is called');
      NEWLayer.prototype = new gmap.OverlayView();
      function NEWLayer() {
        this.div = null;
        this.startcenter = null;
        this.setMap(map);
      }

      NEWLayer.prototype.onAdd = function () {
        var self = this;
        self.startcenter = this.getProjection().fromLatLngToDivPixel(map.getCenter());
        var wrapper = document.createElement('div');
        var menu = document.createElement('menu');
        $(menu).addClass('menu');
        $(menu).append('i am menu');
        var div = document.createElement('div');
        $(div).addClass('searchbar sidebar right');
        $(div).attr('id', 'searchbar');
        $(div).append('<div class="searchlist" data-bind="component: \'searchlist\'"></div>');
        $(div).append('<div class="pager" data-bind="component: \'pager\'"></div>');
        $(div).append('<div class="wikirelevant"></div>');
        $(wrapper).append($(menu)).append($(div));
        self.div = $(wrapper)[0];
        var searchlist = container.getInstance('searchlist');
        ko.applyBindings(searchlist.viewModel, self.div);
        self.getPanes().overlayMouseTarget.appendChild(self.div);

        var isidebar = sidebar('menu',$('.menu')).sidebar('bar', $('.sidebar')).sidebar('icon', '<img src="data:image/png;base64,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" width="30" height="30">');
        map.addListener('center_changed', function () {
          self.align(isidebar);
        });
        $(window).resize(function () {
          var width = $(window).width();
          var height = $(window).height();
          $(isidebar.getSideBar()).offset({
            top: height * 0.1,
            left: width * 0.65
          });
          $(isidebar.getMenu()).trigger('searchlist_align');
        });
      };
      NEWLayer.prototype.draw = function () {
      };
      NEWLayer.prototype.align = function (isidebar) {
        logger('NEWLayer align function is called');
        var currentcenter = this.getProjection().fromLatLngToDivPixel(map.getCenter());
        var changex = currentcenter.x - this.startcenter.x;
        var changey = currentcenter.y - this.startcenter.y;
        logger('change of position trigger- changex:' + changex + ' ' + 'changey' + changey);
        // can create a function in sidebar to replace
        $(isidebar.getMenu()).css('transform', 'translate(' + changex + 'px,' + changey + 'px)');
        $(isidebar.getSideBar()).css('transform', 'translate(' + changex + 'px,' + changey + 'px)');

        logger('NEWLayer align function is ended');
      };
      NEWLayer.prototype.onRemove = function () {
        logger('NEWLayer onRemove function is called');
        if (this.div)
          this.getPanes().overlayMouseTarget.removeChild(this.div);
        logger('NEWLayer onRemove function is ended');
      };
      var instance = new NEWLayer();
      logger('function addOVerlay is ended');
    }
    function addControl(elem) {
      logger('function addControl is called');
      map.controls[gmap.ControlPosition.LEFT_TOP].push(elem);
      logger('function addControl is ended');
    }


    return {
      constructor: { name: 'Map' },
      zoomToMarker: zoomToMarker,
      filterMarkers: filterMarkers,
      toggleMarkerBounce: toggleMarkerBounce,
      removeAllMarkerBounce: removeAllMarkerBounce,
      getGMarkerFromModel: getGMarkerFromModel,
      addOverlay: addOverlay,
      clickOnMarker:clickOnMarker,
      map:getMap,initMap:initMap
    };
  };
  container.addComponentClass(map);
});
