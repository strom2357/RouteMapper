RouteMapper.Routers.Router = Backbone.Router.extend({
	initialize: function (options) {
		this.$rootEl = options.$rootEl;
	},

	routes: {
		"": "index",
		"rides/new": "new"
	},

	index: function() {
		RouteMapper.Collections.rides.fetch();
		
		var indexView = new RouteMapper.Views.RidesIndex({
			collection: RouteMapper.Collections.rides
		});

		this._swapView(indexView);
	},

	new: function() {
		var ride = new RouteMapper.Models.Ride();
		var formView = new RouteMapper.Views.RidesForm({
			model: ride,
			collection: RouteMapper.Collections.rides
		})

		this._swapView(formView)
	},

	_swapView: function(view) {
		this._currentView && this._currentView.remove();
		this._currentView = view;
		this.$rootEl.html(view.render().$el);
	}
});
