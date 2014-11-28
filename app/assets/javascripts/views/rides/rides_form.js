RouteMapper.Views.RidesForm = Backbone.View.extend({
  tagName: 'form',  
  template: JST['rides/form'],
  

  events: {
    "click button": "submit"
  },
  // initialize: function() {
  //  this.listenTo(this.collection, "sync", this.render)
  // },

  render: function() {
    var renderedContent = this.template({
      //will need for edit
      ride: this.model
    });

    this.$el.html(renderedContent);
    this.initMap();
    return this;  
  },

  
  initMap: function () {
    
    // when everything works, start pulling this out of init
    
    // sketchy global variable
    routeArr =[];
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
    directionsDisplay.setPanel(this.$el.find('#directions-panel')[0]);
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
 
    function calcRoute(location) {
      var start = 'san francisco, ca';
      var end = location;
      var request = {
          origin:start,
          destination:end,
          travelMode: google.maps.TravelMode.BICYCLING
      };
      directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
        }
      });
    }

    function updateRouteArr() {
      debugger
      routeArr = directionsDisplay.getDirections().routes[0].overview_path
    }

    google.maps.event.addListener(map, 'click', function(event) {
      placeMarker(event.latLng);
      calcRoute(event.latLng);
    }.bind(this));

    google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
      updateRouteArr();
    });

    google.maps.event.trigger(map, 'resize'); 
    google.maps.event.trigger($('#map-canvas'), 'resize');
  },

  

  submit: function(event) {
    event.preventDefault(); 
    var attrs = this.$el.serializeJSON();

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