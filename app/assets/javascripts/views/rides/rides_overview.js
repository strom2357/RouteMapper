RouteMapper.Views.RidesOverview = Backbone.View.extend({
  tagName: 'form',  
  template: JST['rides/overview'],
  

  events: {
    
  },

  initialize: function(options) {
    this.listenTo(this.collection, "sync", this.render);
    rides = this.collection;
    date = new Date(options["date"]);
  },
  

  render: function() {
    totalMiles = 0;
    totalClimb = 0;
    setTimeout(function(){
      google.load('visualization', '1', {
        'callback':'', 'packages':['corechart', 'columnchart']
      })
    }, 2000)


    var renderedContent = this.template({
      
    });

    if (rides.length > 0) {this.setRides()};
    this.$el.html(renderedContent);
    this.initMap();
    rides.each(function(ride) {
        this.setGlobals(ride);
        this.populateMap(ride);
    }.bind(this))
    directionsDisplay.setMap(null);
    $('#totalClimb').html(Number(totalClimb).toFixed(2));
    $('#totalMiles').html(Number(totalMiles).toFixed(2));
    $('#overview_date').html("All rides since "+(date.toLocaleDateString()));

    return this;  
  },

  setRides: function() {
    recent_rides = [];
    rides.each(function(ride) {
      var rideDate = new Date(ride.get('date'));
      if (rideDate > date) {
        recent_rides.push(ride)
      }
    })

    rides.models = recent_rides;
  },

  setGlobals: function(ride) {
    chart = 0;
    stopsArr = [];
    lastStepsArr = [];
    stepsCount = [];
    markers = [];
    // waypointArr = [];
    // waypointsArr = [];
  },
  


    undoCalcRoute: function() {
      var pathToPlot = [];
      lastStepsArr.forEach(function(step) {
        step.path.forEach(function (pathGf) {
          pathToPlot.push(pathGf);
        })
      });

      var flightPath = new google.maps.Polyline({
        path: pathToPlot,
        geodesic: true,
        strokeColor: '#0000FF',
        strokeOpacity: 1.0,
        strokeWeight: 3
      });

      flightPath.setMap(map)
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
      map.setCenter(pathToPlot[0]);
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
  },

   populateMap: function(ride) {
    if (ride.get('directions')) {
      console.log(ride.get('title'))
      var dirs = JSON.parse(ride.get('directions'))
      
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
      totalMiles += ride.get('distance');
      totalClimb += ride.get('elevation');
       // come back to....
      // setTimeout(function() {this.updateElevation()}.bind(this), 3000);
    };
  },

  // elevationTimeout: function() {
  //   setTimeout(function() {this.updateElevation()}.bind(this), 3000)
  // },

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
});