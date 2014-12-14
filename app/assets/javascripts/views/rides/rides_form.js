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
    setTimeout(function(){
      google.load('visualization', '1', {
        'callback':'', 'packages':['corechart', 'columnchart']
      })
    }, 2000)


    var renderedContent = this.template({
      
      ride: this.model
    });

    this.$el.html(renderedContent);
    this.setGlobals();
    this.initMap();
    return this;  
  },

  undo: function() {
    event.preventDefault();
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
    chart = 0;
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
      } else {
        directionsDisplay.set('directions', null);
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



    updateDistance: function() {
      distance = 0;
      lastStepsArr.forEach(function(step) {
        distance += step.distance.value
      })
      distance = Number(distance/1609.34).toFixed(2);


      this.$el.find('#distance').html(distance + " miles");
    },


  initMap: function () {
    // google.load("visualization", "1", {packages:["columnchart"]});
    // debugger
    directions = {};
    directionsDisplay = new google.maps.DirectionsRenderer({draggable: false, preserveViewport: true});
    directionsService = new google.maps.DirectionsService();
    myLatlng = new google.maps.LatLng(37.781, 237.588);

    mapOptions = {
      center: myLatlng,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(this.$el.find('#map-canvas')[0], mapOptions);
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(this.$el.find('#directions-panel')[0]);


    google.maps.event.addListener(map, 'click', function(event) {
      this.placeMarker(event.latLng);
      stopsArr.push(event.latLng);
      // lastStepsArr = [];
      this.calcRoute();
    }.bind(this));

    // You needed this if you want to drag routes
    google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
      this.updateElevation();
      this.updateDistance();
    }.bind(this));

    // google.maps.event.trigger(map, 'resize'); 
    // google.maps.event.trigger($('#map-canvas'), 'resize');
    // load old directions if they exist
    if (this.model.get('directions')) {
      var dirs = JSON.parse(this.model.get('directions'))
      

      // in serialization, latLngs get turned into objects with lat and lng,
      // but not of google's latLng class.  Need to convert.
      dirs.stopsArr.forEach(function (stop) {
        var stopLatLng = new google.maps.LatLng(stop.k, stop.B);
        stopsArr.push(stopLatLng);
      });

      lastStepsArr = dirs.lastStepsArr;
      lastStepsArr.forEach(function(stepsArr) {
        var efLatLngs = [];  
        var pathLatLngs = [];
        stepsArr.lat_lngs.forEach(function(latLng) {
          var efLatLng = new google.maps.LatLng(latLng.k, latLng.B);
          efLatLngs.push(efLatLng);
        });

        stepsArr.lat_lngs = efLatLngs;

        stepsArr.path.forEach(function(latLng) {
          var pathLatLng = new google.maps.LatLng(latLng.k, latLng.B);
          pathLatLngs.push(pathLatLng);
        });

        stepsArr.path = pathLatLngs;

        stepsArr.end_location = new google.maps.LatLng(stepsArr.end_location.k, stepsArr.end_location.B);
        stepsArr.end_point = new google.maps.LatLng(stepsArr.end_point.k, stepsArr.end_point.B);
        stepsArr.start_location = new google.maps.LatLng(stepsArr.start_location.k, stepsArr.start_location.B);
        stepsArr.start_point = new google.maps.LatLng(stepsArr.start_point.k, stepsArr.start_point.B);
      })
      
      stepsCount = dirs.stepsCount;
      this.undoCalcRoute();
      dirs.markerCoords.forEach(function(coords) {
        var pos = new google.maps.LatLng(coords.k, coords.B);
        var marker = new google.maps.Marker({
          position: pos,
          map: map,
        });
        markers.push(marker);
      })
      this.elevationTimeout();
      // setTimeout(function() {this.updateElevation()}.bind(this), 5000).bind(this);
    };




    // ----- ELEVATION GRAPH LOGIC ---------
  },
  elevationTimeout: function() {
    setTimeout(function() {this.updateElevation()}.bind(this), 3000)
  },

  updateElevation: function () {
    
    allEfs = [];
    lastStepsArr.forEach(function(step) { 
      allEfs.push(step.start_location);
      allEfs.push(step.end_location);
    })
    elevator = new google.maps.ElevationService();
    var pathRequest = {
      'path': allEfs,
      'samples': 512
    }
    elevator.getElevationAlongPath(pathRequest, this.toDo)
  },

  toDo: function(results) {
    totalClimb = 0;
    
    // create chart once...
    if (chart == 0) {
      chart = new google.visualization.LineChart(document.getElementById('elevation_chart'));
    }
    
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Sample');
    data.addColumn('number', 'Elevation');
    for (var i = 0; i < results.length; i++) {
      data.addRow(['', (results[i].elevation)*3.28084]);
    };

    for (var i = 1; i < results.length; i++) {
      if (results[i].elevation > results[i-1].elevation+1) {
        totalClimb += results[i].elevation-results[i-1].elevation
      }
    };
    
    totalClimb = Number(totalClimb*3.28084).toFixed(2);


    chart.draw(data, {
      width: 800,
      height: 100,
      legend: 'none',
      titleY: 'Elevation (m)'
    });
    
    $('#climb').html(totalClimb + " feet");
    
  },



  submit: function(event) {
    event.preventDefault(); 
    var attrs = this.$el.serializeJSON();
    
    var directions = {
      stopsArr:stopsArr,
      lastStepsArr:lastStepsArr,
      stepsCount:stepsCount,
      markerCoords:[] 
    };

    markers.forEach(function(marker) {
      directions.markerCoords.push(marker.position)
    });


    attrs["directions"] = JSON.stringify(directions);
    attrs["distance"] = distance;
    attrs["elevation"] = totalClimb;
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