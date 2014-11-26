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
    myLatlng = new google.maps.LatLng(37.781, 237.588);

    mapOptions = {
      center: myLatlng,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(this.$el.find('#map-canvas')[0], mapOptions);


    marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      title: 'App Academy'
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