RouteMapper.Routers.Router = Backbone.Router.extend({
	initialize: function (options) {
		this.$rootEl = options.$rootEl;
	},

	routes: {
		"": "index",
		"rides/new": "new",
		"rides/:id": "show",
		"rides/edit/:id": "edit",
		"users": "users"
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

		this._swapView(formView);
	},
	
	edit: function(id) {
		var ride = RouteMapper.Collections.rides.getOrFetch(id);
		var formView = new RouteMapper.Views.RidesForm({
			model: ride,
			collection: RouteMapper.Collections.rides
		})
		this._swapView(formView);
	},


	show: function(id) {
		
		var ride = RouteMapper.Collections.rides.getOrFetch(id);
		var showView = new RouteMapper.Views.RidesShow({
			model: ride,
			collection: RouteMapper.Collections.rides
		})

		this._swapView(showView);
	},

	users: function() {
		var users = RouteMapper.Collections.users.fetch();
		var usersView = new RouteMapper.Views.UsersIndex({
			collection: RouteMapper.Collections.users
		})

		this._swapView(usersView);
	},

	_swapView: function(view) {
		this._currentView && this._currentView.remove();
		this._currentView = view;
		this.$rootEl.html(view.render().$el);
	}
});
