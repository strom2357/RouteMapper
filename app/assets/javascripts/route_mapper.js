window.RouteMapper = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    new RouteMapper.Routers.Router({
  		$rootEl: $("#content")
  	});
    Backbone.history.start();
  }
};

