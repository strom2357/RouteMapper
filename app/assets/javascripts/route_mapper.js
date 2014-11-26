window.RouteMapper = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    alert('Hello from Backbone!');
    new RouteMapper.Routers.Router({
  		$rootEl: $("#content")
  	});
    Backbone.history.start();
  }
};

