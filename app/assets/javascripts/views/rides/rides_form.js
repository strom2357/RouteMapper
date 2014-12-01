RouteMapper.Views.RidesForm = Backbone.View.extend({
  tagName: 'form',  
  template: JST['rides/form'],
  

  events: {
    "click .submit": "submit",
    "click .undo" : "undo"
  },
  initialize: function() {
   this.listenTo(this.collection, "sync", this.render)
  },

  render: function() {
    var renderedContent = this.template({
      
      ride: this.model
    });

    this.$el.html(renderedContent);
    this.setGlobals();
    this.initMap();
    return this;  
  },

  undo: function() {
    stopsArr.pop();
    stepNum = stepsCount.pop()
    for (var i = 0; i < stepNum; i++) {
      lastStepsArr.pop();
    }
    var marker = markers.pop();
    marker.setMap(null);
    this.undoCalcRoute();
  },

  setGlobals: function() {
    stopsArr = [];
    lastStepsArr = [];
    stepsCount = [];
    markers = [];
    // waypointArr = [];
    // waypointsArr = [];
  },
  
    placeMarker: function(location){
      var marker = new google.maps.Marker({
        position: location,
        map: map,
      });
      markers.push(marker);
    },

    undoCalcRoute: function() {
      var stopNum = stopsArr.length;
      if (stopNum > 1) {
        var start = stopsArr[stopNum-2];
        var end = stopsArr[stopNum-1];
        var request = {
          origin:start,
          destination:end,

          travelMode: google.maps.TravelMode.BICYCLING
        }

        directionsService.route(request, function(response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            response.routes[0].legs[0].steps = lastStepsArr;
            response.routes[0].legs[0].start_location = lastStepsArr[0].start_location;
            response.lc.origin = lastStepsArr[0].start_location;
            directionsDisplay.setDirections(response);
          }
        });
      }
    },

    calcRoute: function() {
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
            // response.routes[0].legs[0].via_waypoint = waypointArr;
            // response.routes[0].legs[0].via_waypoints = waypointsArr;
            response.lc.origin = lastStepsArr[0].start_location;
            directionsDisplay.setDirections(response);
            // var distance = directionsDisplay.getDirections().routes[0].legs[0].distance['text'];
            // this.$el.find('#distance').html(distance);
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
    },


  initMap: function () {
    // when everything works, start pulling this out of init
    
    // sketchy global variable
    directions = {};
    directionsDisplay = new google.maps.DirectionsRenderer({draggable: false});
    directionsService = new google.maps.DirectionsService();
    myLatlng = new google.maps.LatLng(37.781, 237.588);

    mapOptions = {
      center: myLatlng,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(this.$el.find('#map-canvas')[0], mapOptions);
    directionsDisplay.setMap(map);
    // directionsDisplay.setPanel(this.$el.find('#directions-panel')[0]);

  
   
    // function updateDistance() {
    //   distance = directionsDisplay.getDirections().routes[0].legs[0].distance['text'];
    //   this.$el.find('#distance').html(distance);
    // }
//-- OKAAAIII
    // this.$el.find('#distance').html("HI");

    function updateRouteArr() {
      directions = JSON.stringify(directionsDisplay.getDirections());
    }

    google.maps.event.addListener(map, 'click', function(event) {
      this.placeMarker(event.latLng);
      stopsArr.push(event.latLng);
      // lastStepsArr = [];
      this.calcRoute();

    }.bind(this));

    // You needed this if you want to drag routes
    // google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
      // lastStepsArr = directionsDisplay.directions.routes[0].legs[0].steps;
      // waypointArr = directionsDisplay.directions.routes[0].legs[0].via_waypoint;
      // waypointsArr = directionsDisplay.directions.routes[0].legs[0].via_waypoints;
      // updateRouteArr();
      // updateElevation();
      // updateDistance().bind(this);
    // }.bind(this));

    // google.maps.event.trigger(map, 'resize'); 
    google.maps.event.trigger($('#map-canvas'), 'resize');
    //  if (this.model.get('directions')) {
    //   var dirs = JSON.parse(this.model.get('directions'))
    //   directionsDisplay.setDirections(dirs)
    //   debugger
    // };

    // ----- ELEVATION GRAPH LOGIC ---------
    function updateElevation () {
      allEfs = [];
      lastStepsArr.forEach(function(step) { step.path.forEach(function(ef) {allEfs.push(ef)})})
      elevator = new google.maps.ElevationService();
      var pathRequest = {
        'path': allEfs,
        'samples': 512
      }
      elevator.getElevationAlongPath(pathRequest, toDo)
    }

    function toDo(result) {
      // debugger 
    }
  },

  

  submit: function(event) {
    event.preventDefault(); 
    var attrs = this.$el.serializeJSON();
    attrs["directions"] = directions;

    function success() {
      Backbone.history.navigate("", { trigger: true } )
    }

    this.model.set(attrs);
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