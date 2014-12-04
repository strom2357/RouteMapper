RouteMapper.Collections.Rides = Backbone.Collection.extend({
	url: '/api/rides',

  comparator: function(ride) {
    return (ride.get("date")).getTime();
  },

  model: RouteMapper.Models.Ride,

  getOrFetch: function (id) {
  	// is that right????
  	var ride = this.get(id);
  	var rides = this;

  	if(!ride) {
  		ride = new RouteMapper.Models.Ride({id: id})
  		ride.fetch({
  			success: function() {
  				rides.add(ride);
  			},
  		});
  	} else {
  		ride.fetch();
  	}

  	return ride;
  }

});

RouteMapper.Collections.rides = new RouteMapper.Collections.Rides();