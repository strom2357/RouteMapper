RouteMapper.Views.RidesForm = Backbone.View.extend({
  tagName: 'form',  
  template: JST['rides/form'],
  

  events: {
    "click button": "submit"
  },
  initialize: function() {
   this.listenTo(this.collection, "sync", this.render)
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
    stepsCount = [];
    waypointArr = [];
    waypointsArr = [];
    //on "undo", look at stepsCount[-1] and remove that many steps from
    // last steps arr, then, remove that number from stepCount.  Re-call calcRoute.
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
            response.routes[0].legs[0].steps.forEach(function(step) {
              lastStepsArr.push(step)
            })
            stepsCount.push(response.routes[0].legs[0].steps.length);
            response.routes[0].legs[0].steps = lastStepsArr;
            response.routes[0].legs[0].start_location = lastStepsArr[0].start_location;
            response.routes[0].legs[0].via_waypoint = waypointArr;
            response.routes[0].legs[0].via_waypoints = waypointsArr;
            response.lc.origin = lastStepsArr[0].start_location;
            directionsDisplay.setDirections(response);
          }
        });
      }
      

      
      // var flightPath = new google.maps.Polyline({
      //   path: lastStepsArr,
      //   geodesic: true,
      //   strokeColor: '#0000FF',
      //   strokeOpacity: 1.0,
      //   strokeWeight: 3
      // });

      

      // flightPath.setMap(map);
    }

    function updateRouteArr() {
      debugger
      directions = JSON.stringify(directionsDisplay.getDirections());
    }

    google.maps.event.addListener(map, 'click', function(event) {
      
      placeMarker(event.latLng);
      stopsArr.push(event.latLng);
      // lastStepsArr = [];
      calcRoute(event.latLng);

    }.bind(this));

    google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
      lastStepsArr = directionsDisplay.directions.routes[0].legs[0].steps;
      waypointArr = directionsDisplay.directions.routes[0].legs[0].via_waypoint;
      waypointsArr = directionsDisplay.directions.routes[0].legs[0].via_waypoints;
      updateRouteArr();
      
    });

    // google.maps.event.trigger(map, 'resize'); 
    google.maps.event.trigger($('#map-canvas'), 'resize');
     if (this.model.get('directions')) {
      var dirs = JSON.parse(this.model.get('directions'))
      directionsDisplay.setDirections(dirs)
      debugger
    };
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