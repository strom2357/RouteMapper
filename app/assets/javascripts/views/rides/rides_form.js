RouteMapper.Views.RidesForm = Backbone.View.extend({
  tagName: 'form',  
  template: JST['rides/form'],
  

  events: {
    "click button": "submit"
  },
  initialize: function() {
   this.listenTo(this.collection, "sync initMap", this.render)
  },

  render: function() {
    var renderedContent = this.template({
      
      ride: this.model
    });

    this.$el.html(renderedContent);
    this.initMap();
    return this;  
  },

  
  initMap: function () {
    // when everything works, start pulling this out of init
    
    // sketchy global variable
    directions = {};
    var directionsDisplay = new google.maps.DirectionsRenderer({draggable: true});
    var directionsService = new google.maps.DirectionsService();
    myLatlng = new google.maps.LatLng(37.781, 237.588);

    mapOptions = {
      center: myLatlng,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(this.$el.find('#map-canvas')[0], mapOptions);
    directionsDisplay.setMap(map);
    // directionsDisplay.setPanel(this.$el.find('#directions-panel')[0]);

    if (this.model.get('directions')) {
      debugger
      var dirs = JSON.parse(this.model.get('directions'))
      directionsDisplay.setDirections(dirs)
    };

    // // for reference:
    // marker = new google.maps.Marker({
    //   position: myLatlng,
    //   map: map,
    //   title: 'App Academy'
    // });
    function placeMarker(location){
      var marker = new google.maps.Marker({
        position: location,
        map: map,
        draggable: true
      });
    }
 
    stopsArr = [];
    lastStepsArr = [];
    function calcRoute(location) {
      var stopNum = stopsArr.length;
      if (stopNum > 1) { 
        var start = stopsArr[stopNum-2];
        var end = stopsArr[stopNum-1];
        var request = {
          origin:start,
          destination:end,

          travelMode: google.maps.TravelMode.BICYCLING
        };


        directionsService.route(request, function(response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            debugger
            response.routes[0].legs[0].steps.forEach(function(step) {
              lastStepsArr.push(step)
            })
            response.routes[0].legs[0].steps = lastStepsArr;
            directionsDisplay.setDirections(response);
          }
        });
      }
      
          var flightPlanCoordinates = [
        new google.maps.LatLng(37.772323, -122.214897),
        new google.maps.LatLng(21.291982, -157.821856),
        new google.maps.LatLng(-18.142599, 178.431),
        new google.maps.LatLng(-27.46758, 153.027892)
      ];

      
      var flightPath = new google.maps.Polyline({
        path: lastStepsArr,
        geodesic: true,
        strokeColor: '#0000FF',
        strokeOpacity: 1.0,
        strokeWeight: 3
      });

      

      flightPath.setMap(map);
    }

    function updateRouteArr() {
      directions = JSON.stringify(directionsDisplay.getDirections());
    }

    google.maps.event.addListener(map, 'click', function(event) {
      
      placeMarker(event.latLng);
      stopsArr.push(event.latLng);
      // lastStepsArr = [];
      calcRoute(event.latLng);

    }.bind(this));

    // google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
    //   updateRouteArr();
    // });

    google.maps.event.trigger(map, 'resize'); 
    google.maps.event.trigger($('#map-canvas'), 'resize');
  },

  

  submit: function(event) {
    event.preventDefault(); 
    var attrs = this.$el.serializeJSON();
    attrs["directions"] = directions;
    debugger
    function success() {
      Backbone.history.navigate("", { trigger: true } )
    }

    this.model.set(attrs);
    debugger
    if (this.model.isNew()) {
      this.collection.create(attrs, {
        success: success
      })
    } else {
      this.model.save(attrs, {
        success: success
      })
    }
  }
});