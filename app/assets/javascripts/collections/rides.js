RouteMapper.Collections.Rides = Backbone.Collection.extend({
	url: '/api/rides',
  	model: RouteMapper.Models.Ride

  // getOrFetch

});

RouteMapper.Collections.rides = new RouteMapper.Collections.Rides();